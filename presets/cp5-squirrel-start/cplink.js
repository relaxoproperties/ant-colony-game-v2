/* ===== CP LINKS (Chris 12:04 / 12:13 / 12:18 / 12:21 PM ET), outside the LOCKED opening. IDENTICAL in the CP5 and CP6 link sites;
   the only per-site file is cplink-preset.js (window.CPLINK_PRESET = {name, prefix, save}).
   1. adds ?start=downstairs (the existing TEST-ONLY skip of the locked opening; opening bytes untouched) unless a start flag is already there
   2. its OWN save: every 'antColony.bv.*' localStorage key is remapped to CPLINK_PRESET.prefix (the stacked checkpoint save is never read or written)
   3. writes the preset save on every load, so the link always opens at its moment. ?resume=1 keeps this link's last save instead.
   4. once restored downstairs, frames the queen on her bed (the brain timer over her head is on screen). */
/* 5. Chris Round 3 (12:41 PM ET): NO sound effects for now. Central mute: every Web Audio context the game makes (the only SFX path: bv1 ching /
   coins / brain collect; the squirrel clip, the idea game and the bank build have no audio of their own) gets its destination swapped for a
   gain-0 node, so nothing is heard. Video elements (the locked opening film, skipped by start=downstairs) are untouched. */
(function(){try{['AudioContext','webkitAudioContext'].forEach(n=>{const A=window[n];if(!A||A.__cplinkMuted)return;
 const M=function(...a){const c=new A(...a);try{const g=c.createGain();g.gain.value=0;g.connect(c.destination);Object.defineProperty(c,'destination',{value:g,configurable:true});c.__muted=g}catch(e){}return c};
 M.prototype=A.prototype;M.__cplinkMuted=true;window[n]=M});window.CPLINK_MUTED=true}catch(e){console.warn('[cplink] mute skipped',e)}})();
(function(){try{const C=window.CPLINK_PRESET;if(!C||!C.prefix||!C.save)return;const q=new URLSearchParams(location.search);
 if(!q.get('start')){q.set('start','downstairs');const u=location.pathname+'?'+q.toString()+location.hash;try{history.replaceState(null,'',u)}catch(e){location.replace(u);return}}
 const PFX='antColony.bv.',NEW=C.prefix,S=Storage.prototype,map=k=>(typeof k==='string'&&k.indexOf(PFX)===0)?NEW+k.slice(PFX.length):k;
 const g=S.getItem,s=S.setItem,r=S.removeItem;S.getItem=function(k){return g.call(this,map(k))};S.setItem=function(k,v){return s.call(this,map(k),v)};S.removeItem=function(k){return r.call(this,map(k))};
 window.CPLINK={name:C.name,key:NEW+'save.v1'};
 if(q.get('resume')!=='1'){const P=JSON.parse(JSON.stringify(C.save));P.savedAt=Date.now();s.call(localStorage,NEW+'save.v1',JSON.stringify(P));r.call(localStorage,NEW+'nurseryHatchXp')}
 let n=0;const look=()=>{n++;try{if(window.BV&&BV.started&&window.portB&&portB.debug&&portB.debug.PB.restored&&window.openingDemo&&openingDemo.setView&&typeof state==='string'&&state==='underground'){const Q=BV.debug.queen();openingDemo.setView({spp:2.4,lookX:Q.x,lookY:Q.y-40});window.CPLINK.framed=true;return}}catch(e){}if(n<400)setTimeout(look,50)};setTimeout(look,50);
}catch(e){console.warn('[cplink] preset skipped',e)}})();
