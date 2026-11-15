# building-v1 — CHANGES (BV1, Fri Nov 13 2026, ET)

Base: /workspace/bird-chamber (copied). Protected folders untouched. Nothing published.
Design doc read: BUILDING-VERSION-DESIGN-2026-11-13.md (latest md5 1fcb0d26 (Chris 2:49 PM correction)).
Code: index.html = bird-chamber + Step 1 fixes + one new inline `<script id="bv1">` (IIFE, only `window.BV` is exported).
Source parts live in wip/src/bv1-*.js; wip/assemble.py rebuilds the inline script.

## Step 1 (see STATUS-CHECKPOINT-BV1-STEP1.md)
- Queen fly-in restored to cf2783d5 (basement JPEG no longer blocks the opening gate).
- Up/down floor arrows: no flicker; disabled during floor changes; no wrong-floor double taps.

## Building version
- Fixed unlock order, all FREE, no costs shown: Royal → Kitchen → Water → Nursery → Playground → Kids School → Scout classroom → **Training Camp** → Farm (Farm only after a scout's first small seed: `onSeedFoundUnlockFarm`).
  A second unlock that arrives while one card is still unbuilt waits in a queue (e.g. Farm seed found before Camp is built).
- Queen is the only controllable ant; the player ONLY builds. Tap her = build tray (one card).
- **Room scripts run AUTOMATICALLY on build (no player tap)** — fixed 1:23 PM ET (was only partly automatic and could be lost if she was busy). Each queen room is queued when built (`AUTO` queue, `stepAuto()`) and starts as soon as she is free:
  - Royal (Chris 12:23 PM ET): she walks (her locked queen walk) to the **leaf-bed** piece (placement.json leaf-bed, spot 530,1100 template px) and settles there in her established idle → when settled, the Kitchen unlocks.
  - Kitchen: walk in, eat (FOOD meter fills), return to her den (the bed) → Water unlocks.
  - Water: walk in, drink (WATER meter fills), return → Nursery unlocks.
  - Nursery: stands over the basket → two eggs → hatch → Playground unlocks.
  - Optional tap-to-repeat: tapping a built Royal/Kitchen/Water/Nursery room sends her again (never needed for progress).
- Rooms are placed on the LOCKED v13 hexes; the grid (and green free cells) show ONLY while placing. 1080x1680 template floor centre (540,1075.5) sits on the cell centre, 1:1 px.
- Nursery: baskets start empty; queen stands over the front basket, it shows two eggs; both eggs hatch (staggered 1 s, shells fade in the basket) into two kids (hatch-timeline.json, egg overlays). FLAGGED: one basket (two eggs) per cycle (`EGG_BASKETS=['front']`).
- Kids: kid50 frames = 0.5 × Albert = 65 px on a 791 hex (FINAL), crawl ~3 frames per 12 fps tick, draw-time NP5 defringe, no shadow. Kids grow to Albert (130 px, OT12 idle / LOCKED-WALKS crawl) after Kids School.
- Playground A: cut pieces from furniture/playground-A (md5-verified), live kid play loops from kid-play/*-timing.json (12 fps), drawn LIVE from layers + kid frames (no mp4s). Seesaw: shadow, frame-back, plank, kids, frame-front; merry-go-round hub/front rail redrawn over the kid when `behind_hub`. One kid per piece (seesaw needs two), extras idle on clear floor.
  - KNOWN ACCEPTED: small bare spot at the seesaw fulcrum when it tips (bare-spots.json); left unfilled.
- Kids School: kid-school-combined pieces (md5-verified), flat mats first, standing pieces y-sorted with the kids (kids STAND at the 65 px seat/stool spots). Teacher spot (730.5,1007.5) is recorded; no teacher ant in v1 (open point).
- Scout classroom: graduates auto-explore with the EXISTING NP5 pattern (unchanged logic, stacking = group members → SCOUT_LADDER). Scouts stop at small random seeds (placeholder seed dot, no small-seed art exists) — never the big bird-feeder seeds. A found seed fills the SEEDS meter.
- **Training Camp A (NEW, Chris 1:05 PM ET "Yes, put the gym in as is")**: pieces from furniture/training-camp-A (MD5SUMS ca76292e, placement.json 8ea0d621), copied + md5-verified, as is. Shadows first; chin-up: frame-back, ant, frame-front; barbell: frame-back, moving-barbell (RESTING on its hooks, no lift art), frame-front; mirror; balance beam. Ants stand at the README stand points (chin-up stand spot, lifter spot in front of the rack, mirror, beam middle, then clear floor) in their established OT12 idle; no exercise loops yet.
  - Unlocks after the Scout classroom's first graduation (before Farm). The every-other-generation guess is REMOVED. Grown ants follow the next built job room until all builds are complete, then the player picks from the colony question-mark menu. Camp graduates stay standing in the camp: soldier patrol/march is NOT in v1 (no art) (FLAGGED).
- Farm B: farm/placement.json draw rule; 4 big quadrant tap zones (one per bed); when all four are tapped the farmer ant works them in tap order; existing bed states only (dirt → plowed → seeded → sprout → weeds → grown → harvest, no watered state); planting spends one inventory seed. Farmer = the grown ant cycle 1 keeps home (FLAGGED).
- Water room: ~~PLACEHOLDER flat basin~~ → replaced in BV3 by the water-np5-cut furniture (see BV3).

## Timers — ONE settings table at the top of the bv1 script
```
ROOM_STALL_S = {kitchen:300, water:420, nursery:600, kidSchool:1800, scoutClass:3600,
                trainingCamp:3600,   // now USED: Training Camp is in v1 (Chris 1:05 PM)
                playground:600}      // Chris 12:42 PM: 10 min, not flagged anymore
NURSERY_TEND_EVERY_S = 120           // tend-the-eggs bubble during the Nursery stall
CHAMBER_BUB = {EVERY_S:120}          // queen brain bubble
IDEA_NEED = 10
COIN = {PER_TAP:5, FLY_MS:750, STAGGER_MS:175}
CYCLE1 = {HATCH_WAIT_S:4, PLAY_S:12, SCHOOL_S:10, TRAIN_S:8, GROW_S:1.2}   // FLAGGED: short first-cycle waits (cycle 1 is gated by builds)
```
History: ROOM_STALL_S was 20 (12:33) → flat 120 (12:36) → per-room table (12:37) → playground 600 + kidSchool 1800 confirmed (12:42) → trainingCamp used (1:05).

## Debug / URL flags (QC / Tester)
- `?fast=1` shortens EVERY timer (÷60, minimum 3 s): all ROOM_STALL_S, NURSERY_TEND_EVERY_S, brain bubble; meters drain 10× faster.
- `?brainfast=1` brain bubble every 6 s only.
- `?debug=1` room ids + farm zone outlines. `?seed=N` fixes the small-seed layout. `window.BV.debug` = read-only state + tap helpers used by the tests.

## Repeat cycles + seed money
- After the first full build cycle (first generation graduated) the queen lays again whenever the Nursery is free (max 3 generations alive).
  Route from cycle 2: Nursery → Playground → Kids School → job. **Guess b ANSWERED:** Chris 2:49 PM: kids SKIP Kitchen and Water. Adults may still be assigned Kitchen from the job menu.
- Each room stalls on its ROOM_STALL_S; then a bubble pops; while waiting, ants LOOP their established idles / play loops (never frozen). Tap → next room.
- From cycle 2 each stall bubble tap = 5 seed money: 5 coins fly ONE AT A TIME (175 ms stagger, NP4 np4coin, 750 ms) to the top-right seed-money counter (np4 #seedHud style). Cycle 1 gives no money.
- **NEW sound**: synthesized WebAudio "ching" (short bell partials 2093/3136/4186/5274 Hz, 0.32 s), one per coin as it lands. No sound file existed. Audio unlocks on the first tap (iPhone).

## Brain points
- 2 min of queen idle → brain bubble over her; tap = +1 brain point. Opening the build menu, placing, building, or sending her to a room resets the timer.
- At 10 points the NP5 3-brain idea mini game opens (arrow-game.js/css + assets, md5-verified); result = clearly marked PLACEHOLDER box, no effect; points reset to 0.

## Meters (brain menu, next to the seed-money counter; NP5 .bm3-meter bar style)
```
METERS = {food:{cap:100,start:70,drainPerMin:1.0,fillPerCycle:35,floor:20},
          water:{cap:100,start:70,drainPerMin:1.2,fillPerCycle:40,floor:20},
          seeds:{cap:20,start:0,drainPerMin:0,fillPerCycle:1,floor:0}}   // ALL FLAGGED defaults
```
- Drain never goes below `floor`; low food/water NEVER blocks, slows or penalizes anything (no fail states). The queen Kitchen / Water scripts fill them; grown ants assigned to Kitchen also refill FOOD when their loop completes. Kids do not visit Kitchen or Water.
- Icons FLAGGED (reused art, no dedicated icons): Ideas = NP5 iBrain; FOOD = kitchen floor-jar-of-nuts piece; WATER = garden-v2 droplet icon; SEEDS = garden-v2 seed-packet icon.

## Tests (index after the 1:23 PM fix)
- Real-tap chain (queen tap → tray card → hex tap; NO room taps), `?fast=1`: WebKit 390x844 and desktop Chromium 1280x800, Royal → Kitchen → Water → Nursery → Playground → Kids School → Scout → Training Camp all pass, 0 page errors. Log shows `auto script royal/kitchen/water/nursery` and `queen settled on the royal bed` before the Kitchen unlock.
- Fly-in (WebKit phone) and up/down arrow repro (WebKit phone) rerun on this index: fly-in path identical, nav never hidden, arrows disabled during floor changes, 0 errors.
- Backup of the previous build: backups/index-f152322f.html, backups/CHANGES-f152322f.md.

## Assets
All copied (never repainted), md5-verified against source manifests: see ASSET-COPY-MD5.txt (Training Camp A: 15 files, kid-school-combined pieces: 34 files added today).


## BV2 update (Chris 2:48 / 2:49 PM ET, November 13)
Backed up 5900e3c0 to backups/index-5900e3c0.html and backups/CHANGES-5900e3c0.md before editing. Read GM QC-REPORT.md and the design doc (1fcb0d26, newer than the initially supplied 6a1d159d; includes the kid-route correction).

### Routing and job menu
- Dropped the every-other-generation-to-Camp guess completely. Kids follow Nursery → Playground → Kids School in every cycle (no Kitchen/Water stop). After growing, they wait for the next job room built (Scout, Camp, Farm). A just-built job room is kept for the next waiting grown generation if none is ready yet.
- Once all nine build options are built, waiting grown generations get a phone-sized **?** bubble over the colony/queen. It is placed above her hit target so a tap opens the menu, not the build tray. No ? before all builds are done.
- Picture menu is driven by ONE `JOB_MENU` array (`roomKey`, `label`, `icon`), filtered by built rooms. Picks: Training Camp, Scout classroom, Kitchen, Nursery, Kids School, Playground. Each sends the whole waiting generation there, then runs its existing idle/room stall (Camp/Scout graduate as before; other jobs offer another pick after the room bubble). Grown ants at Playground idle near equipment, never use the half-sized kid riding art.
- Icons: **job-icons-v1 PREVIEW, NOT FINAL**, copied from /workspace/ant-colony/menu/job-icons-v1/ (all 12 copies, 256 and 64 px, verified against source and MD5SUMS; logged in ASSET-COPY-MD5.txt). JOB_MENU uses the 256 px versions for phone DPR sharpness. No placeholders remain in this menu. Swap one path per entry when Chris approves new icons.
- The menu cannot normally open with fewer rooms built because its ? trigger requires all builds. The built-room filter remains for future rooms. No bypass of that rule was added just to get a partial-menu shot.

### GM QC fixes
- Camp soldiers: 14 distinct stand spots, minimum settled foot spacing about 103 px. Overflow ants are hidden after reaching camp and counted by a `+N` badge; no repeated 24px offsets/pile-ups. Soldier patrol remains unbuilt (no march art).
- Brain bubble is hidden during placement (it can reappear after placement ends).
- Meters moved to the **left corner**, 126px wide at 390px phone width (x=8, y=44), with seed money above them. Clear of the top centre and right floor nav.
- Farm: four fast taps are queued even before the farmer is assigned or has arrived. His arrival starts the pending round. A working round cannot start twice.
- Removed stale gym-not-in-v1 comment. Replaced the old builder-opening README.txt with build-specific instructions.

### Remaining assumptions / unfinished work
- One basket (two eggs) per cycle, cycle-1 reserved farmer, generous meter defaults, first-cycle short waits: retained and flagged above.
- Farm job recipients stand as courtyard helpers; the designated farmer alone works tapped beds (FLAGGED, no helper work art).
- Nursery job recipients stand in its existing room spots and loop their established idle, with the Nursery room timer (they do not lay new eggs; queen alone does that).
- No soldier patrol/march, exercise loops, or Kids School teacher yet. (BV3: Water now has its real water-np5-cut furniture.) Small scout seed remains the existing placeholder dot.

## BV3 update (Chris 3:29 PM + 3:38 PM ET, November 13) — final index.html md5 2b2feaceba79e215f91bd0c8ca33d9c9 (103,796 B)
Backup of the previous build: `backups/index-22c4d3bf.html` + `backups/CHANGES-22c4d3bf.md`.

1. **Bird video stall fallback (tester I7).** The opening no longer waits only for `ended`. It proceeds to the landing
   (the same cf2783d5 queen fly-in, no new art) when any of these happen, and the end handler runs ONCE (`videoDone` guard):
   - `ended` (normal path);
   - `currentTime` has not advanced for 3 s while the video has data (`readyState >= 2`) → `stall`;
   - `error`, `stalled` or `abort` events (when not already ended);
   - `video.play()` rejected → `play-rejected`;
   - **FLAGGED (my value):** no video data at all for 8 s after load → `nodata`.
   When it proceeds by a fallback, the video is paused, so its frozen frame fades out the same way the last frame does after `ended`.
   `openingDemo.videoWhy` reports which path fired. The old "touch resumes a rejected play()" behaviour was replaced by "proceed".
2. **Water build card** now shows a crop of the water-np5-cut with-ants closeup preview (`assets/cards/water-card-np5-cut-with-ants.jpg`), per
   Chris's 3:38 PM addition. (A first crop of the NP5 v2 in-game picture, `assets/cards/water-card-crop-np5-v2.jpg`, was made earlier in this batch; it is kept on disk and logged, but it is no longer used.)
   Thumbnails with their own card picture use `background-size:cover`.
3. **Desktop framing after the drop (tester I4).** The descend now ends on a camera that fits the spiral hex and the whole queen
   (`downEnd()`): if they fit at the normal zoom it is the old camera (so **phone 390x844 is unchanged**, spp 4.286); otherwise it zooms out
   just enough (desktop 1280x800: spp 2.697) and centres between the queen's top and the hex bottom. Measured at 1280x800: hex y 188–757, queen y 42–265 (was −283…69).
   Note: the twisted spiral tower itself runs up to the surface and is never fully on screen at play zoom (also not on phone); the hole/base and the hex are.
4. **Water room furniture (Chris thumbs-up 3:38 PM).** The dashed-blue placeholder is gone. `/workspace/ant-colony/furniture/water-np5-cut/` was checked
   against its MD5SUMS (MD5SUMS md5 1789fcbc…, all 14 files OK) and copied byte-identical to `assets/furniture/water-np5-cut/` (md5s in ASSET-COPY-MD5.txt).
   Placement exactly as placement.json (md5 f0223f54…), 1:1 template px, tank size as cut (250x203):
   - draw order: 3 contact shadows first (under everything) → barrel-left (375,704) → barrel-right (722,705) → tank glass-front (446,569) → water fill crop over the glass → surface strip;
     the pieces sort with the ants by the foot line y 773, so an ant at the drink spots (y 850/975) is drawn in front.
   - water level follows the WATER meter in 12 steps: step = round(water/cap × 12), y_level = round(730 − step/12 × 98);
     fill rows (y_level−632…98) drawn at (480, y_level), strip at (480, max(y_level−2, 632)), nothing at 730. Start 70 → step 8 (y 665); meter floor 20 → step 2 (y 714).
   - the queen drinks at spot1 (470,850). Spots 2–4 (672,850), (395,975), (748,975) are the Water room's ant spots; any ant sent there stands in the locked idle loop.
     **FLAGGED:** no ant is routed to Water today (kids skip Water since 2:52 PM, and Water is not in JOB_MENU), so only the queen is seen drinking.
   - The cut's own README/placement.json say "PREVIEW ONLY: not for building-v1"; used here because of Chris's 3:38 PM thumbs-up relayed in the BV3 steering. Generated/procedural-art flags from that README still apply.
5. Brain bubble also hidden while the build tray is open, not only while placing (rest of tester I5).
- No Nursery changes (lanterns, changing table and mushrooms stay).
- Tests on the final bytes: `wip/bv/bv2.cjs` 31/31 on WebKit phone, Chromium phone, Chromium desktop; `wip/bv/vid.cjs` (forced pause/stall, blocked mp4, play() rejected, normal) 8/8 WebKit + Chromium;
  `wip/bv/frame.cjs` 4/4; `wip/bv/water.cjs` 6/6 on WebKit phone, Chromium phone, Chromium desktop. Shots in `shots/bv3/`.
- Still needs a real iPhone: the real video ending in WebKit (headless WebKit always stalls at 0.17 s, which now takes the stall fallback after ~3 s).

## BV3.1 fix (Game Manager, 5:45 PM ET, November 13) — final index.html md5 e52f21de8ce4e2db8e284acade2d8249 (105,077 B)
Backup of the previous build: `backups/index-2b2feace.html` + `backups/CHANGES-2b2feace.md`.

- **'?' ghost tap (tester REPORT-BV3 FAIL).** Before, the same tap could open the job menu and pick a job. The canvas opened the menu on pointerup, and the browser's
  synthesized click for that same touch (or a slightly moved desktop press) then landed on the new job button under the finger.
  Now the menu has one capture-phase guard on `#bvJobs` (replacing the per-button click listeners):
  - a job button (and the X) acts only on a click that follows a **fresh pointerdown that began on that same button after the menu opened**;
  - that pointerdown must come at least **JOB_ARM_MS = 350 ms** after the menu opened;
  - every other click is swallowed (`preventDefault` + `stopPropagation`; logged as `job menu: ignored click`). That covers the trailing synthesized click,
    a press that started off the button, a press inside the arm delay, and scripted `.click()`;
  - keyboard Enter/Space on a focused button still works after the arm delay.
- **N1 camp soldiers / +N badge.** `CAMP_SPOTS` moved so that every soldier's feet sit in the camp hex's upper part (y ≤ 1225 template px; the hex is y 733–1418).
  Before, the bottom row stood at y 1380–1395 on the edge of the hex below. Still 14 distinct spots, min spacing 102.6 px (unchanged), and the 4 README stand points are unchanged.
  The +N badge moved from y 1440 (past the hex's bottom edge) to y 1300 inside the camp hex.
  The Nursery's own tall back pieces (lanterns, changing table) still reach up into the camp hex from below. That is Nursery art; it was left as is.
- **N2 Kitchen jar shelf vs Water tank: NOT changed (not a simple fix).** The draw order is already correct: the tank's foot is in front of the shelf, so the tank is drawn over the shelf's
  end. Nothing is clipped wrongly. The overlap comes from the furniture footprints. The Kitchen's front shelf sits at template y ≈ 1250 (175 px in front of the Kitchen floor centre), so when Water is built
  on the hex directly below, the shelf lands at the same world height as the Water tank's back rim (tank y 570, 505 px behind the Water floor centre). Fixing it would need moving or clipping
  the Kitchen art or the locked Water placement, which the brief rules out.
- No other game changes.
- Test harness changes (not game): `bv2.cjs` camp-crowd picks now use a real tap 450 ms after the menu opens instead of a scripted `.click()` (the guard now ignores scripted clicks, as intended).
  All suites take `OUTDIR` for shots. New `wip/bv/ghost.cjs` (ghost-tap repro + guard checks; `OLD=<file>` runs it against an older build as a control).

## BUILD A (Nov 14 2026, 7:34–8:45 AM ET) = BV3.2 after-arrival + egg cycle + D11, opening LOCKED to ca74ab55
- **Opening (game start → arrival downstairs) = ca74ab55, byte-for-byte**, except: (1) `assets/landing-path.json` inlined byte-identical as a string fed through the
  same promise chain (offline/file://); (2) D11 `goUp` handler: `upWarm()` draws map-hd + wide once before `begin('ascending')`. Diff: `wip/buildA/OPENING-DIFF.diff`.
  All earlier BV3.2 opening polish (tolerant loader, warmFrame, stalled log-only, landing clock, arrow rework, ?debug additions) was DROPPED per the 8:23 lock.
- **D11 cause**: map-hd (56 MP) isn't drawn while she's downstairs; a phone drops the decoded copy; the first ascending frame pays the decode (> 1.4 s) and the fade ends on its first frame.
  Down is unaffected (the chamber is drawn every frame). Other floor setters checked: walk-in fallback `begin('entered')` (surface, locked), `openingDemo.jump` (test hook only); BV never sets a floor.
- Queen: established NP5 front idle (queen_idle_front_strip_v1.png md5 551e7661) whenever not walking (BV drawQueen, after arrival only); plain cut at every walk end.
- Build: NP5 BUILD button (`.btn.go`), NP5 dust cloud + dustAt for BUILD_SECONDS=5, room fades in under it, then her script (Royal/Kitchen/Water).
- FINAL HUD: seed pop top-right (NP5 #seedHud spot) ~2.5 s then opacity 0; crowned food/water flash box under it (#gv2Hud spot), Ideas row only while collecting; top-left empty;
  crowned brain button (iBrain + CSS-layered crown md5 46a84515) under the floor arrows opens her menu; menu header = NP5 smBrain seed money + meters. Nothing visible before arrival.
- Kitchen/Water: 5 leaves (fi_leaf md5 deb4240c) / 5 droplets fly from the counter/tank to the flash box, ching + meter step per landing (COIN flight code).
- Egg cycle per EGG-CYCLE-SPEC + BRAIN_BED_ONLY (brain timer only on her bed; tap = +1 brain, 2–3 coins, rested). Lay / shared tend / 🍳 spoil bubbles, per-basket clocks, hatch XP in localStorage, auto care.
  A tend tap counts immediately (spoil clock stops for tapped baskets) even if she walks over later. Nearest bubble wins a tap.
- No nursery auto-lay, CYCLE1.HATCH_WAIT_S unused (kept in CYCLE1), EGG_BASKETS untouched.
- Item 8 visible timers → Builder 2 (port-b drawTag); BUILD A exposes basket timeLeft / brainLeft in `window.bv.getState()`. Hooks: HOOKS.md.
- file://: getImageData defringe skipped on file: (canvas always tainted there).

## CP2 merge (09:40 ET)
- port-b.js (cp2/module, md5 fb63847a…) copied to root; assets/portb/ copied, md5 -c OK.
- index.html: outside-opening block `<script>window.PORTB_CHUNKS='cp2'</script><script src="port-b.js">` placed just before `<script id="bv1">`.
- bv1 IIFE last line (MERGE.md H1): `window.__portbEval=…;window.portB&&portB.init(window.__portbEval);`
- lockcheck strips any `OUTSIDE-OPENING … ` comment block; opening still byte-identical to ca74ab55.

## CP3 merge (09:58 ET)
- cp3/cp3.js (Underground Creator) + cp3/assets (MD5SUMS -c OK), wired per cp3/HOOKS.md: hook line after the CP2 hook (CP3 wraps CP2).
- Script tags moved: port-b.js + PORTB_CHUNKS='cp2' and cp3/cp3.js now sit after <script id="bv1"> at the end of <body> (wip/tail.html, re-added by assemble.py). Both modules pick up their evaluator on load.
- Pre-bv1 region: ca74ab55 bytes + only the exact 3-tag OFFLINE LOADER block (it must run before the opening's fetch('assets/landing-path.json')). lockcheck is strict: it removes only that exact block and fails on anything else.
- port-b cp3/cp4 chunks stay OFF (hard-off in port-b); farm = CP3 garden loops (UC anchor 92,181); port-b farmRound swap is cp3-gated, so off.
- JOB_MENU: Playground removed (bv1-a.js).
- Glue (inline, in the tail block): port-b's room-centre stall tag is skipped for job stages CP3 owns, so each training ant has one tag (no doubled countdown). CP2 kid-route tags unchanged.

## CP4 + EXTRAS (10:40 ET)
- cp4/cp4.js (b9c88dbe) tag in the end-of-body block (wip/tail.html); hook 2 inside bv1 after the CP3 hook (after D11). port-b on('cp4') stays OFF.
- EXTRAS: port-b.js = port-b/extras/port-b.js (0e413d12); PORTB_CHUNKS='cp2,extras'.
- Glue (tail block): soldiers cp4 has taken get a.cp4=true (CP3 lets go, no camp lap walk overriding the walk to the hole); after a save load, soldiers marked cp4Sol='up' with no patrol entry are handed back to cp4 so they patrol again.
- bv1-c.js: during a group's 'move', grown ants that already arrived pace beside their spot until the group is in (no idle ants).

## CP1 playtest notes 1-9 (11:24 ET) on CP4+extras 9d4c6c94
- #1 #3 #4 (GC, bv1-h.js NOTES1-CAM, global indirect eval, wraps cameraBounds/begin/drawRevealingFloor only after BV.started; opening bytes unchanged).
- #2 #6 (b2 n2/n6.diff), #5 (b2 n5.diff, merged with b4 #7: nursery added to the dig->script list), #8 (b2 port-b.js 72308ca0).
- #7 #9 (b4 notes-7/notes-9.diff).

## CP5 + CP6 (11:32 ET) on CP1-notes 8ae98122
- Tags in the end-of-body block: cp5/cp5-data.js, cp5/cp5.js, cp6/cp6.js. Hooks __cp5Eval then __cp6Eval inside bv1 after the CP4 hook.
- Squirrel at 9 brains (no timer), 10th brain = bank idea, bank card only after the idea, only hex (1,-1), no auto-start (Builder 4).

## Round 2 (Chris GO 11:57 ET) on CP6 b1f3a754 — merged gc, b2, b4
- R2-1 (gc): UP moves on the first frame after the tap. Capture pointerdown on the arrow fires it on press; UP clock uses max(now, performance.now()); D11 synchronous pre-draw skipped while the surface pictures are warm (falls back if cold). All outside the opening bytes.
- R2-3 (gc): brain menu (button/queen tap) no longer resets the 2:00 timer; it keeps counting while the menu is open; reset only when she leaves the throne.
- R2-2 (b2): leaves/droplets silent (coins still ching).  R2-4 (b2): brain flashes once per new building unlock (queued behind open cards).  R2-5 (b2): room timers centred on the room (port-b.js b24f6a83).
- R2-6 (b4): NP5 scout fog trail: cp4/cp4.js c26cb3d3 (surfFeather + fog under the feathered close-up), bv1 stepScout grabs a seed only after its tile is fully revealed.

## Round 3 step 1: r3-cp1 (Chris 12:41 / 1:00 ET) on r2 812c585a
- R3-1: upstairs view kept warm from its first paint (2x2 warm draw every 0.3 s in every state after the landing) + one-time staged preload after arrival (decode wide + B4 walk/idle frames, CP4 feathered close-up via cp4.prewarm, offscreen draws). Draw-only. Every UP press moves on frame 1, fade unchanged (D11 21/21).
- R3-2: SFX_ON=false in bv1 (one switch; ching() returns early, no AudioContext created). Opening video stays muted as before; no other sounds exist.
- R3-3: meter / tray crown = brain-button crown file + crop (middle third, object-fit).
- R3-4: Kitchen 5:00 / Water 7:00 job stalls show the port-b room-centre countdown (one per room, soonest); CP3 per-ant tag skipped for those two (cp3.js 1 line, CP3 glue).
- R3-9: floating DOM effects tagged with their floor; one per-frame visibility check hides them on the other floor (cp4 coins + cp6 +$ tagged 'up'). Logic/timers/payouts untouched.
- R3-6 (b2 r3-6.diff af4162d0): small heart on the tend-eggs bubble.
- Lay-eggs bubble (Chris 1:10): shows the established soother thumbnail job-icons/256/job-pacifier.png (2db59444, the Nursery job icon) as-is, instead of the basket-with-eggs picture.

## Round 3 step 2: r3-cp2 on r3-cp1 17a0dff9
- b2 r3-5-10.diff 52b2a718 (hooray jump on Kids School / classroom / camp graduation; graduates become Albert size) + assets/old-game/hoo-plain.png ea593d7d; b2 r3-7.diff e920a000 (port-b.js -> 59d6510e, Albert walk strips).
