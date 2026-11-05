import http from 'node:http';
import {stat} from 'node:fs/promises';
import {createReadStream} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('./dist',import.meta.url));
const types={'.html':'text/html; charset=utf-8','.txt':'text/plain; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.gif':'image/gif','.woff2':'font/woff2','.mp4':'video/mp4','.webm':'video/webm'};

// Resolve concrete pages, including /plans and /plans/, without an SPA fallback.
export async function resolveRequestPath(requestUrl,rootDirectory=root){
  let rel;
  try{rel=decodeURIComponent(new URL(requestUrl,'http://localhost').pathname);}catch{return {status:400};}
  if(/[\\\u0000-\u001f]/.test(rel)||rel.split('/').includes('..'))return {status:403};
  const base=path.resolve(rootDirectory);
  let file=path.resolve(base,'.'+rel);
  if(file!==base&&!file.startsWith(base+path.sep))return {status:403};
  try{
    let info=await stat(file);
    if(info.isDirectory()){file=path.join(file,'index.html');info=await stat(file);}
    if(info.isFile())return {status:200,file,info};
  }catch{}
  const notFound=path.join(base,'404.html');
  try{const info=await stat(notFound);if(info.isFile())return {status:404,file:notFound,info};}catch{}
  return {status:404};
}

export function byteRange(header,size){
  const match=/^bytes=(\d*)-(\d*)$/.exec(header);
  if(!match||(!match[1]&&!match[2])||size<=0)return null;
  const start=match[1]?Number(match[1]):Math.max(0,size-Number(match[2]));
  const end=match[1]&&match[2]?Math.min(Number(match[2]),size-1):size-1;
  if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start<0||start>end||start>=size)return null;
  return {start,end};
}

export function createPreviewServer(rootDirectory=root){
  return http.createServer(async(req,res)=>{
    if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{'Allow':'GET, HEAD'});res.end('Method not allowed');return;}
    const result=await resolveRequestPath(req.url,rootDirectory);
    if(!result.file){res.writeHead(result.status);res.end(req.method==='HEAD'?undefined:({400:'Bad request',403:'Forbidden',404:'Not found'}[result.status]));return;}
    const {file,info}=result;
    const headers={'Content-Type':types[path.extname(file).toLowerCase()]||'application/octet-stream','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin','Accept-Ranges':'bytes'};
    let start=0,end=info.size-1,status=result.status;
    if(req.headers.range&&status===200){
      const range=byteRange(req.headers.range,info.size);
      if(!range){res.writeHead(416,{'Content-Range':`bytes */${info.size}`});res.end();return;}
      ({start,end}=range);status=206;headers['Content-Range']=`bytes ${start}-${end}/${info.size}`;
    }
    headers['Content-Length']=Math.max(0,end-start+1);res.writeHead(status,headers);
    if(req.method==='HEAD'||!info.size){res.end();return;}
    createReadStream(file,{start,end}).on('error',()=>res.destroy()).pipe(res);
  });
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const port=Number(process.env.PORT||4183);
  createPreviewServer().listen(port,'127.0.0.1',()=>console.log(`Local: http://127.0.0.1:${port}`));
}
