import * as ui from './ui.mjs';
import {createProductPages} from './product.mjs';
import {createServicePages} from './services.mjs';
import {createHelpPages} from './help.mjs';

export function renderCorePages({head,footer,end,config,replacements}) {
  const ctx={...ui,config,annualPrice:replacements.annualPrice,billingCopy:replacements.billingCopy};
  const pages=[...createProductPages(ctx),...createServicePages(ctx),...createHelpPages(ctx)];
  pages.push({slug:'404',title:'Page not found',description:'Find your way back to Orb plans, professional care and help.',body:ui.hero({eyebrow:'Page not found',title:'Let’s find your<br>next step.',copy:'This address does not lead to an Orb page. Explore the homepage, or find the information you need in Help.',actions:ui.link('Back to Orb','/','button-white')+ui.link('Explore help','/help/','core-button-outline'),theme:'document'})});
  const assetRoot = html => html.replace(/\b(src|href|poster)="((?:assets\/|(?:styles|carousel|features|lower|motion|voice|core-pages|media|media-layout|testimonials)\.css|(?:config|app|voice|core-pages|media|media-config)\.js|favicon\.svg)[^"]*)"/g,(_,attr,path)=>`${attr}="/${path}"`);
  const homeAnchors = html => html.replace(/(<a\b[^>]*\bhref=")#(?!main\b)([^"]+)"/g,(_,before,id)=>before+(id==='top'?'/':`/#${id}`)+'"');
  return pages.map(page=>{
    let opening=head.replace(/<title>.*?<\/title>/,`<title>${ui.escape(page.title)} | Orb by Cureocity</title>`)
      .replace(/<meta name="description" content="[^"]*">/,`<meta name="description" content="${ui.escape(page.description)}">`)
      .replace('<body id="top">',`<body id="top" class="core-page core-page-${page.slug}">`)
      .replace('<script type="module" src="voice.js"></script>','')
      .replace('</head>','<link rel="stylesheet" href="/core-pages.css"><script src="/core-pages.js" defer></script></head>');
    const currentPath=config.informationPages[page.slug]?.path;
    const markCurrent=html=>currentPath?html.replaceAll(`href="${currentPath}"`,`href="${currentPath}" aria-current="page"`):html;
    return {...page,html:assetRoot(markCurrent(homeAnchors(opening))+page.body+'</main>'+markCurrent(homeAnchors(footer))+end)};
  });
}
