import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,rm} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {Writable} from 'node:stream';
import {once} from 'node:events';
import {resolveRequestPath,byteRange,createPreviewServer} from '../server.mjs';

// Exercise the HTTP handler and real file streams without binding a test port.
async function request(server,url,{method='GET',headers={}}={}){
  const chunks=[];
  const response=new Writable({write(chunk,encoding,done){chunks.push(Buffer.from(chunk));done();}});
  response.writeHead=(status,values={})=>{response.status=status;response.headers=values;return response;};
  const complete=once(response,'finish');
  server.emit('request',{url,method,headers},response);
  await complete;
  return {status:response.status,headers:response.headers,body:Buffer.concat(chunks).toString('utf8')};
}

const fixture=await mkdtemp(path.join(os.tmpdir(),'orb-page-routing-'));
try{
  await mkdir(path.join(fixture,'plans'));
  await writeFile(path.join(fixture,'index.html'),'<h1>Home fixture</h1>');
  await writeFile(path.join(fixture,'plans','index.html'),'<h1>Plans fixture</h1>');
  await writeFile(path.join(fixture,'404.html'),'<h1>Missing page fixture</h1>');
  await writeFile(path.join(fixture,'sample.mp4'),'0123456789');
  for(const url of ['/plans','/plans/','/plans/?from=home','/plans/index.html']){
    const result=await resolveRequestPath(url,fixture);
    assert.equal(result.status,200,`${url} should resolve directly`);
    assert.equal(result.file,path.join(fixture,'plans','index.html'));
  }
  assert.equal((await resolveRequestPath('/',fixture)).file,path.join(fixture,'index.html'));
  const missing=await resolveRequestPath('/no-such-page/',fixture);
  assert.equal(missing.status,404,'Unknown routes must not become successful homepage responses');
  assert.equal(missing.file,path.join(fixture,'404.html'));
  assert.equal((await resolveRequestPath('/sample.mp4',fixture)).info.size,10,'Media stays directly addressable');
  for(const url of ['/%2e%2e%2fsecret','/plans/%2e%2e%2f%2e%2e%2fsecret','/%00','/plans%5c..%5csecret']){
    const result=await resolveRequestPath(url,fixture);
    assert.equal(result.status,403,`Reject unsafe path ${url}`);
    assert.equal(result.file,undefined,'A rejected path must not resolve a filesystem file');
  }
  assert.equal((await resolveRequestPath('/bad%encoding',fixture)).status,400);
  const server=createPreviewServer(fixture);
  const direct=await request(server,'/plans');
  assert.equal(direct.status,200);assert.match(direct.body,/Plans fixture/);
  const missingResponse=await request(server,'/not-found');
  assert.equal(missingResponse.status,404);assert.match(missingResponse.body,/Missing page fixture/);
  const partial=await request(server,'/sample.mp4',{headers:{range:'bytes=2-5'}});
  assert.equal(partial.status,206);assert.equal(partial.body,'2345');
  assert.equal(partial.headers['Content-Range'],'bytes 2-5/10');assert.equal(partial.headers['Content-Length'],4);
  const head=await request(server,'/sample.mp4',{method:'HEAD'});
  assert.equal(head.status,200);assert.equal(head.body,'');assert.equal(head.headers['Content-Length'],10);
  const invalid=await request(server,'/sample.mp4',{headers:{range:'bytes=99-'}});
  assert.equal(invalid.status,416);assert.equal(invalid.headers['Content-Range'],'bytes */10');
  assert.equal((await request(server,'/plans',{method:'POST'})).status,405);
  assert.deepEqual(byteRange('bytes=0-4',10),{start:0,end:4});
  assert.deepEqual(byteRange('bytes=5-',10),{start:5,end:9});
  assert.deepEqual(byteRange('bytes=-4',10),{start:6,end:9});
  assert.deepEqual(byteRange('bytes=0-99',10),{start:0,end:9});
  for(const header of ['bytes=10-','bytes=9-1','bytes=-0','bytes=-','bytes=0-1,3-4','bytes=x-y'])assert.equal(byteRange(header,10),null,`Reject invalid range ${header}`);
  assert.equal(byteRange('bytes=0-',0),null);
}finally{await rm(fixture,{recursive:true,force:true});}
console.log('Passed: direct clean routes, trailing slashes, query strings, explicit 404s, traversal rejection, HTTP statuses, HEAD and media byte ranges. Browser routing and hosted status checks remain separate.');
