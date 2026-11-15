/* ===== R40 CP6 LINK (adapted from cp6link/site/cplink.js), outside the LOCKED opening.
   1. adds ?start=downstairs (TEST-ONLY skip of the locked opening; opening bytes untouched) unless a start flag is already there
   2. its OWN save: every 'antColony.bv.*' localStorage key is remapped to CPLINK_PRESET.prefix
   3. writes the preset save on every load, so the link always opens at its moment. ?resume=1 keeps this link's last save instead.
   4. once restored, goes ABOVE GROUND and frames the acorn (right after the drop). The 2-minute counter toward the 10th brain is armed (9 brains, BR.t=0) and runs once the queen is idle on her bed downstairs.
   5. Central Web Audio mute (no SFX). If window.CP5_ACORN_HEX is missing (CP5 not stacked), stub it from the preset / firstDone.acornHex / NP5 (2,-2). */
(function(){try{['AudioContext','webkitAudioContext'].forEach(n=>{const A=window[n];if(!A||A.__cplinkMuted)return;
 const M=function(...a){const c=new A(...a);try{const g=c.createGain();g.gain.value=0;g.connect(c.destination);Object.defineProperty(c,'destination',{value:g,configurable:true});c.__muted=g}catch(e){}return c};
 M.prototype=A.prototype;M.__cplinkMuted=true;window[n]=M});window.CPLINK_MUTED=true}catch(e){console.warn('[cplink] mute skipped',e)}})();
(function(){try{const C=window.CPLINK_PRESET;if(!C||!C.prefix||!C.save)return;const q=new URLSearchParams(location.search);
 if(!q.get('start')){q.set('start','downstairs');const u=location.pathname+'?'+q.toString()+location.hash;try{history.replaceState(null,'',u)}catch(e){location.replace(u);return}}
 const PFX='antColony.bv.',NEW=C.prefix,S=Storage.prototype,map=k=>(typeof k==='string'&&k.indexOf(PFX)===0)?NEW+k.slice(PFX.length):k;
 const g=S.getItem,s=S.setItem,r=S.removeItem;S.getItem=function(k){return g.call(this,map(k))};S.setItem=function(k,v){return s.call(this,map(k),v)};S.removeItem=function(k){return r.call(this,map(k))};
 window.CPLINK={name:C.name,key:NEW+'save.v1'};
 if(q.get('resume')!=='1'){const P=JSON.parse(JSON.stringify(C.save));P.savedAt=Date.now();s.call(localStorage,NEW+'save.v1',JSON.stringify(P));r.call(localStorage,NEW+'nurseryHatchXp')}
 if(!window.CP5_ACORN_HEX){const a=(C.save.firstDone&&C.save.firstDone.acornHex)||[2,-2];window.CP5_ACORN_HEX=a.slice?a.slice():[2,-2]}
 let n=0;const look=()=>{n++;try{if(window.BV&&BV.started&&window.portB&&portB.debug&&portB.debug.PB.restored&&window.openingDemo&&openingDemo.setView&&typeof begin==='function'){
   const hex=window.CP5_ACORN_HEX||[2,-2];let c=null;
   try{if(window.cp6&&cp6.debug&&cp6.debug.hexCenter)c=cp6.debug.hexCenter(hex[0],hex[1])}catch(e){}
   if(!c&&typeof HEX==='object'){const HR=HEX.w/2,HT=HEX.w*Math.sqrt(3)/4;c={cx:HEX.cx+1.5*HR*hex[0],cy:HEX.cy+2*HT*(hex[1]+hex[0]/2)}}
   if(c){if(typeof state==='string'&&state!=='entered')begin('entered');openingDemo.setView({spp:1.8,lookX:c.cx,lookY:c.cy});window.CPLINK.framed=true;return}
  }}catch(e){}if(n<400)setTimeout(look,50)};setTimeout(look,50);
}catch(e){console.warn('[cplink] preset skipped',e)}})();
