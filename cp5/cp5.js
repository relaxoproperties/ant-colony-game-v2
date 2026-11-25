// ===================== CP5 (checkpoint 5, SQUIRREL) — v54 =====================
// Port of v1 cp5/cp5.js (Builder 4, Nov 14 2026) onto the BASE LAYER.
// What changed vs v1 (and why — the base layer is NOT bv1):
//  * No eval hook: v1 wired in via window.__cp5Eval + a `step` swap inside the
//    bv1 IIFE. The base layer has no such hook, so this file is self-contained:
//    it reads brains through window.BASE_TIMERS, the placing state through
//    window.BASE_ITEMS.placing, and runs its own requestAnimationFrame tick
//    (window.cp5.tick, also callable by the harness). Nothing in base-layer.js
//    is patched except BRAIN_CAP (8 -> 9) and the ?checkpoint=5 shortcut.
//  * Draw: wraps window.BASE_QUEEN.drawUp (called by index.html's drawSurface
//    while state === 'entered', inside the world transform) instead of
//    swapping BV.drawUp. The squirrel + acorn therefore draw exactly where
//    the scout/soldier draw, in world coords.
//  * No save system: the base layer has no save, so v1's firstDone persistence
//    (squirrelDone / acornHex) has no equivalent. Once-only is per SESSION:
//    after the scene plays, SQ.state stays 'done' and it will not replay
//    until the page reloads. A reload replays it if brains are still >= 9
//    (with ?checkpoint=5 that means one brain-bubble tap away again).
//  * No idea game, no bank: BANK.built stays false; drawBank is gone. The
//    ground acorn is the Seed Money Bank's plain acorn (cp6/assets/bank/
//    acorn_bank_canvas_1024.png), drawn at BANK.S = 157.385 world, centred
//    on the drop point — acorn -> bank is 1:1 in checkpoint 6.
//  * No sound, no <video>, no skip button (v1 had none — do not add one).
//  * Everything else is v1 verbatim: trigger at 9 brains, preload at 8,
//    the 1:1 take1 path (v64: 240 frames @ 24 fps, 10 s, one entry per
//    video frame, acorn set down video 145-165 and settled by 215, exit
//    left — the v61 loop/sprint/pause/spring rebuild is deleted), the
//    1.2 s glide to the FIXED plate-box framing (v61: the video's framing
//    is the framing — the take1 video has a FIXED camera, no baked arc,
//    so the game camera holds one framing for the whole scene — the old
//    FAR/NEAR/END arc is deleted), and STAYING above ground afterwards
//    (player presses down).
// Classic script, one global: window.cp5. No ES modules, no CDN.
(function(){'use strict';
// ==== THE squirrel trigger (Chris 12:13 PM ET: the 9th brain). Change this ONE number to move it. ====
const SQUIRREL_AT_BRAINS=9;
// NP5 dfc7b054 index.html line 1325-1326 (item 23), ported verbatim: 2+ hexes from the mound, diagonally up-right first, first FREE one wins.
const SQ_HEXES=[[2,-2],[3,-3],[2,-3],[3,-2],[1,-2],[4,-3],[3,-4],[4,-4]];
// v61: FIXED camera on the plate box — the take1 video has a FIXED
// camera (no push-in, no zoom, no pan — the squirrel stays the same size
// the whole time), so the game must NOT add its own arc or the zooms
// compound (double zoom). The old v57 FAR_K/NEAR_K/END_K arc is DELETED:
// the camera glides once to the plate-box framing (DATA.plate, fit x0.94
// x FIX_K) and HOLDS it for the whole scene, so what Chris sees on his
// phone is the video's own framing (side view, entry from the right,
// stand at the mound, acorn on the bank spot, exit left).
// FIX_K 1.1 fits the widest stand frame inside the view (the median stand
// squirrel reads ~69% of screen width — the video is a close side shot,
// fitting wins over matching the fraction, so no tail is ever clipped).
const CINE={FIX_K:1.1,ZOOM_S:1.2};
const C5={ready:false,errs:{},log:[],cine:null,restore:null,done:false};
const URLQ=new URLSearchParams(location.search);
const _src=(document.currentScript&&document.currentScript.src)||'';
const BASE=window.CP5_BASE||((_src.replace(/[^/]+$/,'')||'cp5/')+'assets/squirrel-v3/');
const DATA=window.CP5_DATA||null;
// Chris 1:33 PM ET: the ground acorn = the Seed Money Bank's own PLAIN acorn (existing art: squirrel-transparent/v2/acorn-end/acorn_bank_canvas_1024.png,
// "byte copy of the plain acorn cut-out, drawn like the Seed Bank picture"; outside the door / window / $ it is pixel-identical to
// bank_house_cutout_dollar.png, same 1024 canvas). Drawn with the bank's exact transform (BANK.x-.52S, BANK.y-.52S, S, S), so acorn -> bank is 1:1.
const PLAIN_SRC=window.CP5_PLAIN_ACORN||((_src?_src.replace(/cp5\/[^/]*$/,''):'')+'cp6/assets/bank/acorn_bank_canvas_1024.png');
function plog(t){C5.log.push(t);if(C5.log.length>400)C5.log.shift()}
function guard(name,fn,fb){return function(){try{return fn.apply(this,arguments)}catch(e){const k=name+':'+(e&&e.message);if(!C5.errs[k]){C5.errs[k]=1;console.warn('[cp5] '+name+' failed (kept running): '+(e&&e.stack||e))}if(fb)return fb.apply(this,arguments)}}}
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),ease=t=>t*t*(3-2*t);
const pad3=n=>String(n).padStart(3,'0');

// NP5 item 23 + Chris 11:20: the squirrel comes at 9 brains collected (BR.brains). No timer. ?force=squirrel / squirrelNow() still start at once.
const SQ={AT:20*60-20,state:'wait',t0:0,hex:null,off:{x:0,y:0},loaded:0,want:0,failed:0,IM:[],BM:[],BM_REST:null,BM_PLAIN:null,REST:null,preload:false};
const BANK={built:false,acorn:false,hex:null,x:0,y:0,S:157.385,t:0,ready:0,EVERY_S:120,PER_ANT:5,builtT:0};
const S2S=720/390;   // v3 camera s is on a 390x844 screen; bv1 spp is on the 720x1280 design

function imOk(im){return !!(im&&(im.ok||((im.naturalWidth||im.width)>0))&&!im.bad)}
function loadIm(src){const im=new Image();im.decoding='async';im.onload=()=>{im.ok=1;SQ.loaded++};im.onerror=()=>{im.bad=1;SQ.failed=(SQ.failed||0)+1;console.warn('[cp5] image failed: '+src)};im.src=src;SQ.want++;return im}
function sqLoad(){if(SQ.preload||!DATA)return;SQ.preload=true;
 // v65: ?v=65 on the frame + REST urls (phone cache-bust — the 240
 // 1:1 take1 frames are now 0.5x images, same filenames, same art, same
 // rects; the full-size v64 frames must never be served from cache).
 for(let i=0;i<DATA.n;i++)SQ.IM[i]=loadIm(BASE+'sq_'+pad3(i)+'.webp?v=65');
 SQ.REST=loadIm(BASE+'acorn_runtime.png?v=65');SQ.PLAIN=loadIm(PLAIN_SRC)}// v57: pre-DECODE the frames before the scene starts. The "skipping a beat"
// on Chris's phone is a decode hitch, not missing art: the squirrel IS one
// continuous 10 s take (240 frames @ 24 fps), but each frame's FIRST
// drawImage decodes its alpha WebP lazily — on phone-class hardware that
// decode lands mid-scene and the wall-clock path index has already moved
// on, so a beat visibly jumps. Warming decodes every frame once (into an
// ImageBitmap, or an offscreen canvas where bitmaps are unavailable) during
// the preload window (8 brains -> 9th brain, ~10 s of bubble time) and the
// 1.2 s zoom glide, so by play time every draw is a cheap blit. Frame
// count, order, timing and art are unchanged — no slideshow, no fewer
// frames. 8 per tick keeps the warm itself jank-free.
function warmOne(im,set){try{
  if(typeof createImageBitmap==='function'){createImageBitmap(im).then(set).catch(function(){set(im)});return}
  if(typeof document!=='undefined'&&document.createElement){var c=document.createElement('canvas');c.width=im.naturalWidth||im.width||1;c.height=im.naturalHeight||im.height||1;var g=c.getContext&&c.getContext('2d');if(g){g.drawImage(im,0,0);set(c);return}}
  set(im);
 }catch(e){set(im)}}
function warmFrames(){if(!DATA||!SQ.preload)return;var n=0;
 for(let i=0;i<SQ.IM.length&&n<8;i++){if(SQ.BM[i]||!imOk(SQ.IM[i]))continue;n++;(function(idx){warmOne(SQ.IM[idx],function(b){SQ.BM[idx]=b})})(i)}
 if(imOk(SQ.REST)&&!SQ.BM_REST)warmOne(SQ.REST,function(b){SQ.BM_REST=b});
 if(imOk(SQ.PLAIN)&&!SQ.BM_PLAIN)warmOne(SQ.PLAIN,function(b){SQ.BM_PLAIN=b})}

// Surface axial hexes (NP5 hexCenter), in WORLD / map px. HEX is the opening's mound hex.
// VERIFIED v54: base-layer HEX is {cx:2812, cy:4999.5, w:136.8566720971564} —
// byte-identical to v1's, so this formula ports verbatim.
function hexCenter(q,r){const HR=HEX.w/2,HT=HEX.w*Math.sqrt(3)/4;return {cx:HEX.cx+1.5*HR*q,cy:HEX.cy+2*HT*(r+q/2)}}

// NP5 sqHexFree: hex distance >= 2 from the mound, and no building already on that surface hex. In bv1 the basement rooms live on their own
// 23-cell chamber grid (not on surface hexes, unlike NP5's same-grid ROOMS), so the only surface building that can take a hex is the bank.
// v54: there is no bank yet (checkpoint 6), so BANK.built is always false and the distance rule is the whole test.
function sqHexFree(q,r){if(Math.abs(q)+Math.abs(r)+Math.abs(q+r)<4)return false;return !(BANK.built&&BANK.hex&&BANK.hex[0]===q&&BANK.hex[1]===r)}
function pickAcornHex(){return (SQ_HEXES.find(([q,r])=>sqHexFree(q,r))||SQ_HEXES[0]).slice()}
function setHex(h){SQ.hex=h.slice();window.CP5_ACORN_HEX=h.slice();const c=hexCenter(h[0],h[1]),A=DATA.acorn;SQ.off={x:c.cx-A.c[0],y:c.cy-A.c[1]};
 const p=acornWorld();BANK.hex=h.slice();BANK.x=p.x;BANK.y=p.y;return p}
// ---- v64 (Chris Nov 24, "You're gonna need to create a new video"):
// the squirrel scene plays the NEW take1 video STRAIGHT THROUGH, frame
// for frame — 240 frames @ 24 fps, 10 s, one entry per video frame at
// 1/24 s, dx=dy=0. The v61 rebuild is DELETED: no run-cycle loop, no
// sprinted run-in, no held pause mid-screen, no launch spring, no
// run-frames exit. Each frame is placed at its VIDEO position in the
// plate (cp5-data.js, build_v64.py), so the video's own framing — a
// FIXED camera, side view, constant size — IS the motion: the run-in
// bounds in from the right and stops at the mound, the stand rears up
// and looks at the acorn, the set-down plays at full length (video
// 145-165), the exit is the video's own big bound out to the left
// (gone by 215). restFrame 215: the first fully acorn-only frame, where
// the pasted bank acorn takes over with no jump — the frame's acorn and
// the PLAIN are the same canvas at the same centre and scale.
// The acorn rest sprite (acorn_runtime.png) is drawn from frame 215 on,
// centred on the hex: its final position = the bank position.
function buildPath(){const T=[],fr=1/DATA.fps;
 for(let i=0;i<DATA.n;i++)T.push({k:i,dx:0,dy:0,d:fr});
 let c=0;SQ.cum=T.map(e=>(c+=e.d));SQ.path=T;SQ.restAt=DATA.restFrame;
 plog('path: 1:1 '+T.length+' frames, '+c.toFixed(2)+' s, rest at '+SQ.restAt);return T}
// r45: index = first entry whose cumulative end time is past the clock (entries have their own durations)
function pathIdx(now){const t=(now-SQ.t0)/1000;if(t<0)return -1;const C=SQ.cum;if(!C||!SQ.path)return Math.floor(t*DATA.fps);let lo=0,hi=C.length;while(lo<hi){const m=(lo+hi)>>1;if(C[m]<=t)lo=m+1;else hi=m}return lo}
function acornWorld(){const A=DATA.acorn,o=SQ.off;return {x:A.c[0]+o.x,y:A.c[1]+o.y}}

function beginPlay(now){if(!DATA||SQ.loaded<SQ.want*.7)return false;
 const p=setHex(pickAcornHex());BANK.acorn=false;
 // NP5 moves the approved layer as one piece onto the drop hex (np3 item 23); the clip clock starts once the far shot is reached (stepCine)
 SQ.state='pre';SQ.t0=0;plog('squirrel pre hex='+SQ.hex+' acorn='+p.x.toFixed(1)+','+p.y.toFixed(1));
 cineStart(now);return true}

function stepSquirrel(now,dt){if(SQ.state==='done'&&!C5.cine)return;
 if(SQ.state==='wait'){const go=TRIGGER();if(go||brains()>=SQUIRREL_AT_BRAINS-1)sqLoad();
  if(SQ.preload)warmFrames(); // v57: decode ahead while waiting for the trigger
  if(go&&SQ.preload&&SQ.loaded>=SQ.want*.7){
   const st=typeof state==='string'?state:'';if(IDEA_BLOCK())return;
   if(!(st==='underground'||st==='entered'||st==='menu'||st==='ascending'||st==='descending'))return;
   beginPlay(now)}}
 if(SQ.state==='play'){if(!SQ.path)buildPath();const i=pathIdx(now);if(i>=SQ.restAt)BANK.acorn=true;
  if(i>=SQ.path.length){SQ.state='done';BANK.acorn=true;markSquirrelDone();plog('acorn landed')}}}

// ==== SQUIRREL TRIGGER: comes when the player has collected SQUIRREL_AT_BRAINS brains (BR.brains). No timer. ====
// Override: window.CP5_TRIGGER=function(){return <true when the squirrel should come>}; or cp5.debug.squirrelNow() / ?force=squirrel.
// v54: brains come from the base layer's read-only handle (window.BASE_TIMERS.brain.brains); there is no save, so
// "already played" is a per-session flag (C5.done) — a reload replays it if brains are still >= 9.
function brains(){try{return (window.BASE_TIMERS&&BASE_TIMERS.brain&&BASE_TIMERS.brain.brains)|0}catch(e){return 0}}
function TRIGGER(T){try{if(typeof window.CP5_TRIGGER==='function')return !!window.CP5_TRIGGER(T)}catch(e){}
 if(SQ.state!=='wait')return false;
 if(C5.force||URLQ.get('force')==='squirrel')return true;
 if(C5.done)return false;
 return brains()>=SQUIRREL_AT_BRAINS}
function markSquirrelDone(){C5.done=true;C5.force=false}

// v54: the base layer has no idea game (BR.game does not exist). The only
// block is placing/carrying an item (BASE_ITEMS.placing).
function IDEA_BLOCK(){try{if(window.BASE_ITEMS&&BASE_ITEMS.placing)return true}catch(e){}return false}

// ---- NP4 note 19 cinematic, CP5-link version: freeze input, go up to the ground floor, glide to a VERY far wide shot of the whole
// squirrel + acorn scene, play the clip there, then settle on the acorn and STAY above ground (Chris 12:04: the player presses down). ----
function cineEl(){let el=document.getElementById('cineBlock');if(el)return el;
 el=document.createElement('div');el.id='cineBlock';el.style.cssText='position:absolute;inset:0;z-index:9999;display:none;background:transparent;pointer-events:none';
 // r49 (Chris 8:37 PM ET: 'couldn't zoom in when the video was playing'): the block layer lets touches through to the canvas, so the normal
 // pinch-zoom / one-finger pan work during the scene; button CLICKS (down arrow, menu...) are still swallowed while the scene runs.
 if(window.addEventListener)window.addEventListener('click',e=>{if(C5.cine&&e.target!==canvas){e.stopPropagation();if(e.cancelable)e.preventDefault()}},true);
 if(typeof game!=='undefined'&&game&&game.appendChild)game.appendChild(el);
 ['pointerdown','pointerup','pointermove','click','touchstart','touchend','touchmove','wheel'].forEach(k=>el.addEventListener(k,e=>{e.stopPropagation();if(e.cancelable)e.preventDefault()},{passive:false}));
 return el}
function sceneBox(){const o=SQ.off,A=DATA.acorn;let x0=A.tl[0],y0=A.tl[1],x1=A.tl[0]+A.wh[0],y1=A.tl[1]+A.wh[1];
 DATA.frames.forEach(f=>{if(!f)return;x0=Math.min(x0,f[0]);y0=Math.min(y0,f[1]);x1=Math.max(x1,f[0]+f[2]);y1=Math.max(y1,f[1]+f[3])});return {x0:x0+o.x,x1:x1+o.x,y0:y0+o.y,y1:y1+o.y}}
function fitS(b,k){const lo=typeof MIN_SPP==='number'?MIN_SPP:.1,hi=typeof MAX_SPP==='number'?MAX_SPP:8;return clamp(Math.min(720/(b.x1-b.x0),1280/(b.y1-b.y0))*0.94*k,lo,hi)}
// v57: the SURFACE mound hole (same formula as the base layer's
// SCOUT_HOLE_UP, which lives inside its IIFE and is not a global) — the
// settle framing's left anchor. Falls back to the mound hex centre.
function moundHole(){try{if(typeof MAP_RECT!=='undefined'&&typeof START_SPP!=='undefined'&&typeof FAR!=='undefined'&&typeof Q!=='undefined'&&typeof D!=='undefined')return {x:MAP_RECT.x+(FAR.ox+D.x*FAR.s)/START_SPP,y:MAP_RECT.y+(FAR.oy+(D.bottom-28)*FAR.s)/START_SPP};}catch(e){}return {x:HEX.cx,y:HEX.cy}}
// v57: the squirrel's current world position (centre of the frame being
// drawn) — the camera tracks this during play.
function sqPos(now){if(!SQ.path)return null;var i=pathIdx(now);if(i<0)i=0;if(i>=SQ.path.length)i=SQ.path.length-1;var e=SQ.path[i],f=DATA.frames[e.k];if(!f)return null;var o=SQ.off;return {x:f[0]+o.x+e.dx+f[2]/2,y:f[1]+o.y+e.dy+f[3]/2}}
// v61: the FIXED framing — the plate box (DATA.plate, canonical world
// coords) shifted by SQ.off, fit x0.94 x FIX_K. This is the whole scene's
// framing for the entire squirrel scene: the video's baked arc does the
// zooming, so the game camera does not move.
function fixedShot(){const o=SQ.off,P=DATA.plate;const b={x0:P.x+o.x,y0:P.y+o.y,x1:P.x+P.w+o.x,y1:P.y+P.h+o.y};return {x:(b.x0+b.x1)/2,y:(b.y0+b.y1)/2,s:fitS(b,CINE.FIX_K)}}
function cineStart(now){if(C5.cine)return;C5.restore=null;C5.fixed=null;
 C5.cine={t0:now,phase:'up',g:null};cineEl().style.display='block';plog('cine:start');
 try{if(typeof state!=='undefined'&&(state==='underground'||state==='menu')){if(typeof begin==='function')begin('ascending')}}catch(e){}}
function setCam(x,y,s){lookX=x;lookY=y;spp=s;if(typeof cameraBounds==='function')cameraBounds();if(typeof positionTarget==='function')positionTarget();C5.camSet={x:lookX,y:lookY,s:spp}}
// r49: once the player pinches/pans (camera no longer where the scene put it), the scene stops driving the camera for the rest of the scene
function userCam(C){const k=C5.camSet;if(!C.user&&k&&(Math.abs(lookX-k.x)>.5||Math.abs(lookY-k.y)>.5||Math.abs(spp-k.s)>1e-4)){C.user=true;plog('cine: player camera')}return C.user}
function glideStep(G,now){const u=ease(clamp((now-G.t0)/1000/G.dur));if(C5.cine&&C5.cine.user)return u>=1;setCam(G.a.x+(G.b.x-G.a.x)*u,G.a.y+(G.b.y-G.a.y)*u,G.a.s+(G.b.s-G.a.s)*u);return u>=1}
function stepCine(now){const C=C5.cine;if(!C)return;const st=typeof state==='string'?state:'';userCam(C);
 if(C.phase==='up'){if(st!=='entered')return;C5.fixed=fixedShot();
  C.g={t0:now,dur:CINE.ZOOM_S,a:{x:lookX,y:lookY,s:spp},b:C5.fixed};C.phase='zoom';plog('cine:fixed spp '+C5.fixed.s.toFixed(3))}
 if(C.phase==='zoom'){warmFrames(); // v57: keep decoding during the glide
  if(glideStep(C.g,now)){C.phase='play';SQ.state='play';SQ.t0=now;SQ.path=null;buildPath();plog('squirrel play')}return}
 if(C.phase==='play'){if(!C.user)setCam(C5.fixed.x,C5.fixed.y,C5.fixed.s); // v61: HOLD the fixed framing — the video's framing is the framing; no tracking, no second zoom. The player can still pinch/pan out (userCam stops the drive, as before).
  if(SQ.state==='done')C.phase='settle';return} // v61: no settle glide — the fixed framing already IS the final view (acorn centred, mound hole in frame). The next tick ends the cine.
 if(C.phase==='settle')cineEnd()}
function cineEnd(){const C=C5.cine;if(!C)return;C5.cine=null;cineEl().style.display='none';
 plog('cine:end, stays above ground ('+state+')')}   // no begin('descending'): the player presses the down arrow

// ---- draw (world transform; called from the BASE_QUEEN.drawUp wrapper, after the existing up pass) ----
function drawAcorn(){if(!DATA||!imOk(SQ.REST)||BANK.built||SQ.state==='pre')return;if(SQ.state==='play'){if(!SQ.path||pathIdx(performance.now())<SQ.restAt)return}
 if(imOk(SQ.PLAIN)){const S=BANK.S;ctx.drawImage(SQ.BM_PLAIN||SQ.PLAIN,BANK.x-.52*S,BANK.y-.52*S,S,S);return}
 const A=DATA.acorn,o=SQ.off;ctx.drawImage(SQ.BM_REST||SQ.REST,A.tl[0]+o.x,A.tl[1]+o.y,A.wh[0],A.wh[1])}
function drawSquirrel(now){if(!DATA||(SQ.state!=='play'&&SQ.state!=='done'))return;
 if(SQ.state==='play'){if(!SQ.path)buildPath();const i=Math.max(0,pathIdx(now));drawAcorn();if(i>=SQ.path.length)return;
  for(let j=i;j>=Math.max(0,i-6);j--){const e=SQ.path[j],im=SQ.BM[e.k]||SQ.IM[e.k],f=DATA.frames[e.k];if(imOk(im)&&f){const o=SQ.off;const sy=e.sy||1;ctx.drawImage(im,f[0]+o.x+e.dx,f[1]+o.y+e.dy+f[3]*(1-sy),f[2],f[3]*sy);SQ.drawn={i,k:e.k,x:f[0]+o.x+e.dx,y:f[1]+o.y+e.dy,w:f[2],h:f[3]};return}}return}
 drawAcorn()}
function drawUpCP5(now,orig){if(orig)orig(now);drawSquirrel(now)}

// ---- tick (own rAF loop; the base layer has no step hook to borrow) ----
function cp5Tick(now){now=now||performance.now();stepSquirrel(now,0);stepCine(now)}
function loop(now){cp5Tick(now);if(typeof requestAnimationFrame==='function')requestAnimationFrame(loop)}

// ---- init ----
function init(){if(C5.ready)return;if(!DATA){plog('missing CP5_DATA (load cp5-data.js first)');return}
 // Wrap BASE_QUEEN.drawUp so the squirrel/acorn draw in the surface pass
 // (index.html drawSurface, state 'entered', world transform already applied).
 try{if(window.BASE_QUEEN&&typeof BASE_QUEEN.drawUp==='function'&&!BASE_QUEEN.__cp5Wrapped){const u0=BASE_QUEEN.drawUp;BASE_QUEEN.drawUp=guard('drawUp',function(now){drawUpCP5(now,u0)},u0);BASE_QUEEN.__cp5Wrapped=true}}catch(e){plog('drawUp wrap failed '+(e&&e.message))}
 sqLoad();C5.ready=true;plog('cp5 ready (v65 1:1 take1 art, 0.5x frames — Safari memory fix, '+SQ.want+' images)');
 if(typeof requestAnimationFrame==='function')requestAnimationFrame(loop)}

// ---- test helpers (QC / harness). squirrelNow = NP5 openingDemo.squirrelNow ----
function squirrelNow(){sqLoad();C5.force=true;plog('squirrelNow');return SQ.state}

window.cp5={init:guard('init',init),tick:guard('tick',cp5Tick),get ready(){return C5.ready},bank:BANK,sq:SQ,SQUIRREL_AT_BRAINS,SQ_HEXES,pickAcornHex,get acornHex(){return SQ.hex&&SQ.hex.slice()},
 debug:{C5,SQ,BANK,DATA,CINE,buildPath,hexCenter,sqHexFree,pickAcornHex,sceneBox,acornWorld,squirrelNow,sqLoad,beginPlay,moundHole,sqPos,warmFrames,fixedShot,
  get log(){return C5.log},get errs(){return Object.keys(C5.errs)},
  state:()=>({sq:SQ.state,cine:!!C5.cine,phase:C5.cine&&C5.cine.phase,fixed:C5.fixed||null,warmed:SQ.BM.filter(Boolean).length,shared:window.CP5_ACORN_HEX||null,acorn:!!BANK.acorn,built:!!BANK.built,loaded:SQ.loaded,want:SQ.want,hex:SQ.hex,x:BANK.x,y:BANK.y,brains:brains()}),
  goUpstairs(){try{if(typeof begin==='function'&&state!=='entered')begin('entered');const h=SQ.hex||pickAcornHex(),c=hexCenter(h[0],h[1]);if(window.openingDemo&&openingDemo.setView)openingDemo.setView({spp:Math.min(MAX_SPP||4,2.4),lookX:c.cx,lookY:c.cy})}catch(e){}}}};
init();
})();
