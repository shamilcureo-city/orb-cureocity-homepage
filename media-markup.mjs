const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const placements={
  heroVideo:['hero','hero-media','cover'],
  voiceVideo:['voice','mid-voice-photo','contain'],
  dietVideo:['nutrition','free-media','contain'],
  fitnessVideo:['fitness','free-media','contain'],
  connectedVideo:['connected','connect-backdrop','cover'],
  dailyPlanVideo:['dailyPlan','connect-backdrop','cover'],
  professionalVideo:['professionalSupport','connect-backdrop','cover'],
  blueprintFitnessVideo:['blueprintFitness','blueprint-video','contain'],
  blueprintDoctorVideo:['blueprintDoctor','blueprint-video','contain'],
  blueprintDietVideo:['dailyPlan','blueprint-video','contain']
};
export function renderAmbientMedia(media){
  return Object.fromEntries(Object.entries(placements).map(([token,[key,className,fit]])=>{
    const item=media.ambient[key];
    if(!item||!/^\d+$/.test(item.id)||!item.poster||!(item.width>0)||!(item.height>0))throw Error(`Invalid video configuration: ${key}`);
    return [token,`<div class="${className} orb-vimeo" data-orb-vimeo="${key}" data-vimeo-mode="ambient" data-video-fit="${fit}" style="--video-ratio:${item.width}/${item.height}" role="img" aria-label="${escape(item.title)}"><img class="orb-video-poster" src="${escape(item.poster)}" alt="" width="${item.width}" height="${item.height}" ${key==='hero'?'fetchpriority="high"':'loading="lazy"'} decoding="async"><div class="orb-vimeo-frame" aria-hidden="true"></div></div>`];
  }));
}
