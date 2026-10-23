import {readFile,writeFile} from 'node:fs/promises';
const parts=await Promise.all(['head','main','lower','foot'].map(p=>readFile(new URL(`parts/${p}.html`,import.meta.url),'utf8')));
await writeFile(new URL('dist/index.html',import.meta.url),parts.join('\n'));
console.log('Built dist/index.html');
