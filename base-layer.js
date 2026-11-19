// ===================== BASE LAYER (Nov 15 2026) + CHECKPOINT 2 PLACEMENT (Nov 15 2026, REDESIGNED) =====================
// Checkpoint 1 (LOCKED): the opening (unchanged) + the pocket downstairs + the queen's
// idle + a build menu that is always on, 2/3 as tall, with just the four first
// build items (leaf bed, egg basket, fridge, water cooler) and a bulldozer to
// remove a placed item. No brain menu, no crown, no ants menu, no seed money,
// no water/food meters. The menu opens by itself when she gets downstairs.
// Checkpoint 2 (placement, REDESIGNED Nov 15 18:02 — replaces the 6-hexagon flow):
// ONLY the one entrance hexagon (the VISUAL one below the hole, centre world
// (2812,5039), w 136.86 — NOT the grid's (0,0) at (2812,4999.5)). Tap BUILD and
// the item appears as a white ghost; drag/tap so the box TOUCHES the entrance
// hex to place it (it may hang over the edge; white = can place, red = not
// touching the hex at all or overlapping another item). Tap a placed item and
// a bubble appears: arrows to MOVE it inside the hex, bulldozer to ERASE it
// (asks "are you sure?" first).
// CHECKPOINT 2 TIMERS (Nov 15, v1 values, reused not invented): every item has
// a timer. Bed = the brain timer: v1's counter above her head in the royal
// chamber counts down 120s while she rests on the bed (NP5 drawTag, "02:00");
// at 0:00 the brain bubble appears, tap = +1 brain, 2-3 coins tracked,
// no HUD, no idea minigame. The counter IS the brain-giver. CHECKPOINT 2 STOPS
// at 8 brains (squirrel at 9 and idea game at 10 are later checkpoints).
// Fridge = kitchen room timer 5:00, cooler = water room timer 7:00: a countdown
// over the item; at 00:00 a leaf/drop bubble appears, tap = she eats/drinks (3s)
// and the timer restarts. Basket = the egg cycle: lay (2s) -> tends at +2/+4/+6
// min -> hatch at +8 min (basket empties; the kid ants need v1's whole kid
// system and are NOT ported). Unlock chain (v1): only the bed is buildable at
// first; the fridge unlocks after she settles on the bed, the cooler after she
// eats at the fridge, the basket after she drinks at the cooler. The basket is
// last (no playground in checkpoint 2). Checkpoint 2 stops at 8 brains.
// CHECKPOINT 3 (Nov 16, v29): the park + kids school, layered on checkpoint 2.
// The eggs now hatch into BABY ANTS (kids, v1's GENS/newKid/walkAnt + kid
// sprites). A new PARK tab (slide picture) appears once the first babies
// hatch. It offers the four park items (slide free, swing set / teeter totter /
// spinning circle $10 first copy) and, once the ants complete their FIRST PASS
// on the slide (one full 10.25s slide loop), the DESK (first free, next $10).
// Kids ride the placed park pieces on v1's play loops, then stand at the desk
// for school (10s, v1 CYCLE1.SCHOOL_S) and grow to adult size (1.2s).
// ?checkpoint=2 skips the opening for testing: straight underground, menu open.
// ?checkpoint=3 does the same for checkpoint 3 testing.
// CHECKPOINT 4 (Nov 17): skill training / trade school, layered on checkpoint 3.
// The trade school tab (hammer) opens when the first kid grows up at the desk.
// Globe (miner, FREE) -> easel (scout, one free at random, the other $10) ->
// dumbbell (soldier, FREE; treadmill + bench press $10). The miner mines the
// rock fog one hexagon at a time (frontier rule); cleared hexagons become
// buildable. ?checkpoint=4 skips to trade school with a grown-up ant at a desk,
// so checkpoint 4 can be tested WITHOUT playing through checkpoints 1-3.
(function () {
  'use strict';
  var URLQ = new URLSearchParams(location.search);

  // ---- the four first build items (Chris's CORRECTED sizes, Nov 15) ----
  // Bed 27.34 and basket 9.69 world = their visible widths in his game
  // (royal-chamber placement.json). Fridge 18.0 and cooler 19.5 world: the ant
  // is a 6 ft human, the fridge is 5 ft tall, the cooler is 4.5 ft tall
  // (visible heights 20.63 and 18.57 world). Queen size NEVER changes.
  // Default spots are inside the entrance hex (fallbacks only; the player places them).
  var ITEMS = [
    { id: 'leafbed',    name: 'Leaf bed',    src: 'assets/items/leaf-bed.png',    cx: 2790, floorY: 5050, w: 27.34 },
    { id: 'eggbasket',  name: 'Egg basket',  src: 'assets/items/egg-basket.png',  cx: 2835, floorY: 5045, w: 9.69, thumb: 'background-size:78% auto;' },
    { id: 'fridge',     name: 'Fridge',      src: 'assets/items/fridge.png?v=27', cx: 2770, floorY: 5060, w: 18.0, thumb: 'background-position:center 13px;' },
    { id: 'watercooler',name: 'Water cooler',src: 'assets/items/water-cooler.png',cx: 2855, floorY: 5055, w: 19.5, thumb: 'background-position:center 19px;' }
  ];
  // ---- CHECKPOINT 3: the park items (Chris, Nov 16) ----
  // The park tab's four items. Sizes are v1's playground-A /
  // kid-school-combined template px x the world scale (0.173 world/px, the
  // same scale as the queen items): slide 124px -> 21.5, swing 150px -> 26.0,
  // teeter 200px -> 34.6, spinning circle 160px -> 27.7, desk 72px -> 12.5.
  // `first` = the FIRST copy's price (Chris): the slide and the desk are FREE
  // first; the swing set, teeter totter and spinning circle are $10 first.
  // After the first copy the per-type price escalates by $10 (nextPrice).
  // Default spots are inside the entrance hexagon (fallbacks only; the
  // player places them). The park items and the desk are placed in the SAME
  // entrance hexagon as the queen items (checkpoint 2's locked "only one
  // hexagon" design) — v1's playground is a separate hex room, but checkpoint
  // 2 redesigned placement to the single entrance hexagon, and Chris's
  // checkpoint 3 words describe items on a tab, not a new area.
  var PARK_ITEMS = [
    { id: 'slide',         name: 'Slide',          src: 'assets/items/slide.png',           cx: 2812, floorY: 5080, w: 21.5, first: 0 },
    { id: 'swingset',      name: 'Swing set',      src: 'assets/items/swing-set.png',       cx: 2770, floorY: 5075, w: 26.0, first: 10 },
    { id: 'teetertotter',  name: 'Teeter totter',  src: 'assets/items/teeter-totter.png',   cx: 2860, floorY: 5075, w: 34.6, first: 10 },
    { id: 'spinningcircle',name: 'Spinning circle',src: 'assets/items/spinning-circle.png', cx: 2812, floorY: 5100, w: 27.7, first: 10 }
  ];
  // ---- CHECKPOINT 3: the school tab (Chris, Nov 16, v32) ----
  // The desk does NOT live on the park tab. It has its OWN school tab, which
  // appears only after the first slide pass (like the park tab appears only
  // after the first hatch). The school tab's picture is the desk.
  var SCHOOL_ITEMS = [
    { id: 'desk',          name: 'Desk',           src: 'assets/items/desk.png',            cx: 2790, floorY: 5090, w: 12.5, first: 0 }
  ];
  // ---- CHECKPOINT 4: the trade school items (Chris, Nov 17) ----
  // Trade order: MINER -> SCOUT -> SOLDIER. The globe (miner) is FREE
  // first; the microscope (miner) is $10, shown but not buildable yet (the
  // player starts with $0 seed money). The easels (scout): ONE is free,
  // picked at random below; the other is $10. The dumbbell curls (soldier)
  // are FREE; the treadmill and the bench press are $10. Widths follow the
  // training loop's own scale (v1 SC 0.45296 x KW world/px x the frame
  // width), so the static item matches the furniture in its training loop
  // and there is no size jump when training starts. v48 (Chris, Nov 18):
  // the two easels have DIFFERENT pictures now — each shows its own board
  // (a dark chalkboard with chalk marks, a map with landmasses). Before,
  // both used the same counting-board easel, so neither showed a chalkboard
  // or a map. The easel itself is unchanged; only the board is different.
  var TRADE_ITEMS = [
    { id: 'globe',      name: 'Globe',              src: 'assets/items/globe.png?v=44',                                                 cx: 2812, floorY: 5085, w: 13,   first: 0,  trade: 'miner' },
    { id: 'microscope', name: 'Microscope',         src: 'assets/items/microscope.png?v=44',                                            cx: 2770, floorY: 5085, w: 14,   first: 10, trade: 'miner' },
    { id: 'easelchalk', name: 'Easel (chalkboard)', src: 'assets/items/easel-chalkboard.png?v=49', cx: 2812, floorY: 5085, w: 15, first: 10, trade: 'scout' },
    { id: 'easelmap',   name: 'Easel (map)',        src: 'assets/items/easel-map.png?v=50', cx: 2860, floorY: 5085, w: 15, first: 10, trade: 'scout' },
    { id: 'dumbbell',   name: 'Dumbbell curls',     src: 'assets/gym/dumbbell_curls/chris_ant_dumbbell_curls_empty_equipment.png?v=44',     cx: 2812, floorY: 5085, w: 23.5, first: 0,  trade: 'soldier' },
    { id: 'treadmill',  name: 'Treadmill',          src: 'assets/gym/treadmill_run/chris_ant_treadmill_run_empty_equipment.png?v=44',       cx: 2770, floorY: 5085, w: 34.5, first: 10, trade: 'soldier' },
    { id: 'benchpress', name: 'Bench press',        src: 'assets/gym/bench_press/chris_ant_bench_press_empty_equipment.png?v=44',          cx: 2860, floorY: 5085, w: 36.8, first: 10, trade: 'soldier' }
  ];
  // CHECKPOINT 4: ONE easel is FREE — picked at random (Chris doesn't care
  // which); the other is $10. Both start at $10 above; the free one is set here.
  var FREE_EASEL = Math.random() < 0.5 ? 'easelchalk' : 'easelmap';
  TRADE_ITEMS.forEach(function (it) { if (it.id === FREE_EASEL) it.first = 0; });
  var ALL_ITEMS = ITEMS.concat(PARK_ITEMS, SCHOOL_ITEMS, TRADE_ITEMS);
  var IMGS = {};
  ALL_ITEMS.forEach(function (it) {
    var im = new Image();
    im.src = it.src;
    IMGS[it.id] = im;
    it.h = it.w * 0.8; // replaced on load with the true aspect
    im.onload = function () { if (im.naturalHeight) it.h = it.w * im.naturalHeight / im.naturalWidth; };
  });
  function itemById(id) { var found = null; ALL_ITEMS.forEach(function (x) { if (x.id === id) found = x; }); return found; } // CHECKPOINT 3: park + desk live in ALL_ITEMS too (queen-only search broke their prices and place())
  function placedByUid(uid) { for (var i = 0; i < placed.length; i++) if (placed[i].uid === uid) return placed[i]; return null; } // v39: find a placed item by uid (the ksDesk loop draws at its desk's position)
  function itemH(it) { var im = IMGS[it.id]; return (im && im.naturalWidth) ? it.w * im.naturalHeight / im.naturalWidth : it.w * 0.8; }

  // ---- CHECKPOINT 2: the unlock rule (Chris, Nov 15, basket gated Nov 16) ----
  // The bed is the first gate. At the start the menu shows ONLY the bed; the
  // fridge, water cooler, and egg basket are HIDDEN, not "Locked". Once she
  // settles on the bed, the fridge and the water cooler appear and are
  // buildable in EITHER order — there is no forced sequence between them.
  // The egg basket is gated behind BOTH of them: it only appears once the
  // fridge AND the water cooler are BUILT (cloud cleared, on the floor).
  // Erasing the bed closes the gate again (all three hide until the bed is
  // rebuilt); erasing the fridge or the cooler hides the basket again until
  // both are rebuilt — but an already-built basket stays placed, only the
  // menu availability is gated. Moving an item changes nothing.
  // An item is either visible and buildable, or hidden. No "Locked" cards.
  var bedGate = false; // opens when she settles on the bed
  // CHECKPOINT 3 gates (Chris, Nov 16): the park tab and its four items only
  // appear once the first babies HATCH (v1: the first hatch unlocks the
  // playground). The desk stays hidden until the ants complete their FIRST
  // PASS on the slide (one full slide loop), then it appears. Hidden items
  // are never shown as "Locked" — they simply are not there yet.
  var parkUnlocked = false; // opens when the first babies hatch
  var firstSlidePass = false; // set when a kid completes one full slide loop
  var tradeUnlocked = false; // CHECKPOINT 4: opens when the first kid grows up at the desk
  function isVisible(id) {
    if (id === 'leafbed') return true;
    if (id === 'eggbasket') return bedGate && isBuilt('fridge') && isBuilt('watercooler');
    if (id === 'desk') return parkUnlocked && firstSlidePass;
    if (id === 'slide' || id === 'swingset' || id === 'teetertotter' || id === 'spinningcircle') return parkUnlocked;
    // CHECKPOINT 4: the globe (and the $10 microscope beside it) are offered
    // once trade school unlocks; the easels once the miner is BUILT; the gym
    // items once a scout easel is BUILT. Hidden until offered, never "Locked".
    if (id === 'globe' || id === 'microscope') return tradeUnlocked;
    if (id === 'easelchalk' || id === 'easelmap') return tradeUnlocked && isBuilt('globe');
    if (id === 'dumbbell' || id === 'treadmill' || id === 'benchpress') return tradeUnlocked && (isBuilt('easelchalk') || isBuilt('easelmap'));
    return bedGate;
  }
  function openPark() {
    if (parkUnlocked) return;
    parkUnlocked = true;
    renderMenu();
  }
  function openBedGate() {
    if (bedGate) return;
    bedGate = true;
    renderMenu();
  }
  function closeBedGate() {
    if (!bedGate) return;
    bedGate = false;
    renderMenu();
  }

  // ---- placed items (drawn in world space by drawUnderground) ----
  var placed = []; // {uid, id, cx, floorY, w, h, building, t0, cost}
  var nextUid = 1; // each placed copy gets its own id, so multiples of one type never get mixed up
  function placedCount(id) { var n = 0; for (var i = 0; i < placed.length; i++) if (placed[i].id === id) n++; return n; }
  // A type counts as BUILT once a copy of it is on the floor and its build
  // cloud has cleared (building === false). A copy she is still walking to
  // or digging does not count yet — the basket only unlocks once the fridge
  // and the cooler are both actually built.
  function isBuilt(id) { for (var i = 0; i < placed.length; i++) if (placed[i].id === id && !placed[i].building) return true; return false; }
  // Seed-money price of the NEXT copy of a type (Chris, Nov 15 + Nov 16):
  // the FIRST copy costs `first` (0 = FREE for the queen items, the slide
  // and the desk; 10 for the swing set, teeter totter and spinning circle),
  // then each next copy costs 10 more than the last, counted PER TYPE
  // (slide 0/10/20..., swing 10/20/30..., desk 0/10/20...). The player
  // starts with ZERO seed money (Chris, Nov 16), so a priced copy is
  // unaffordable until he explains how seed money is earned. No earning
  // method or wallet exists yet.
  function firstPrice(id) { var it = itemById(id); return (it && it.first) ? it.first : 0; }
  function nextPrice(id) { return firstPrice(id) + placedCount(id) * 10; }
  // Seed-money balance: the player starts with ZERO (Chris, Nov 16).
  // No earning method or wallet exists yet — he will explain how seed
  // money is earned at a future checkpoint, when it matters. canAfford()
  // is the gate for the BUILD button colour: GREEN when the balance covers
  // the price (a FREE copy is always affordable), RED only when the price
  // is above the balance, and a red button cannot be tapped to build.
  function seedBalance() { return 0; } // starting balance: zero seed money
  function canAfford(price) { return price <= seedBalance(); }
  function rectOf(cx, floorY, w, h) { return { x0: cx - w / 2, x1: cx + w / 2, y0: floorY - h, y1: floorY }; }
  function rectsOverlap(a, b) { return a.x0 < b.x1 && a.x1 > b.x0 && a.y0 < b.y1 && a.y1 > b.y0; }
  function overlapsPlaced(cx, floorY, w, h) {
    var r = rectOf(cx, floorY, w, h);
    return placed.some(function (p) {
      var im = IMGS[p.id];
      var ph = (im && im.naturalWidth) ? p.w * im.naturalHeight / im.naturalWidth : p.w * 0.8;
      return rectsOverlap(r, rectOf(p.cx, p.floorY, p.w, ph));
    });
  }
  function placedItemAt(wx, wy) {
    for (var i = placed.length - 1; i >= 0; i--) {
      var p = placed[i], im = IMGS[p.id];
      if (!im || !im.naturalWidth) continue;
      var h = p.w * im.naturalHeight / im.naturalWidth;
      if (wx >= p.cx - p.w / 2 && wx <= p.cx + p.w / 2 && wy >= p.floorY - h && wy <= p.floorY) return p;
    }
    return null;
  }
  function removeItem(uid) {
    for (var i = placed.length - 1; i >= 0; i--) {
      if (placed[i].uid === uid) { var p = placed.splice(i, 1)[0]; renderMenu(); onItemRemoved(p); return true; }
    }
    return false;
  }

  // ---- CHECKPOINT 2: the queen controller (ported from v1, index.html ~469-510) ----
  // v1's QN system, in world coords (v1's queenTo took chamber-image px and
  // converted with toW; placed positions here are already world coords).
  // She walks with her locked walk art; every other moment she uses the
  // established front idle strip. She only takes over AFTER she has arrived
  // underground AND the player places an item (queenFree). Before that,
  // checkpoint 1's arrival (pinned at APPEAR, landing frame + breathe) is untouched.
  var QN = { mode: 'idle', path: [], until: 0, cb: null, wf: 0, flip: false, home: null, busy: false, settled: false };
  var QSPD = 36; // world units per second (v1)
  var QT = 0, qLastNow = 0; // queen clock (v1's T), advanced in the draw step
  var EAT_WAIT_S = 3, DRINK_WAIT_S = 3, LAY_WAIT_S = 2, BED_WAIT_S = 2; // v1 EGG_CYCLE values
  var queenFree = false;
  var runningScriptId = null;
  var pendingScripts = []; // {id, cx, floorY} — an item placed while she is busy waits its turn
  function queenTo(wx, wy, cb) { QN.mode = 'walk'; QN.path = [{ x: wx, y: wy }]; QN.cb = cb || null; }
  function queenWait(s, cb) { QN.mode = 'act'; QN.until = QT + s; QN.cb = cb || null; }
  function queenHome(cb) {
    if (QN.home) queenTo(QN.home.x, QN.home.y, function () { QN.mode = 'idle'; cb && cb(); });
    else { QN.mode = 'idle'; cb && cb(); }
  }
  function stepQueen(dt) {
    if (QN.mode === 'walk') {
      var left = QSPD * dt;
      while (left > 0 && QN.path.length) {
        var p = QN.path[0], dx = p.x - queen.x, dy = p.y - queen.y, d = Math.hypot(dx, dy);
        if (Math.abs(dx) > 1e-3) QN.flip = dx > 0;
        var s = Math.min(left, d);
        queen.x += dx / (d || 1) * s; queen.y += dy / (d || 1) * s; left -= s;
        QN.wf += s / (QUEEN_UNDER_W * 0.06);
        if (s >= d - 1e-6) QN.path.shift();
      }
      if (!QN.path.length) { QN.mode = 'idle'; var cb = QN.cb; QN.cb = null; cb && cb(); }
    } else if (QN.mode === 'act' && QT >= QN.until) {
      QN.mode = 'idle'; var cb2 = QN.cb; QN.cb = null; cb2 && cb2();
    }
  }
  // v1 Q3: the established front idle strip (11 cells 400x420, order 0..10,0,0,0
  // at 7 fps, anchor 200,395 = feet), drawn at her current size.
  var Q3 = { cellW: 400, cellH: 420, ax: 200, ay: 395, fps: 7, order: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 0, 0, 0] };
  var Q3_BODY_MATCH = (104 / 200) / (145 / 400);
  var QIDLE = new Image(); var qidleOk = false;
  QIDLE.onload = function () { qidleOk = true; };
  QIDLE.src = 'assets/queen/queen_idle_front_strip_v1.png';
  function drawQueenFront(x, y, w, alpha, now) {
    if (!qidleOk) { sprite(art.landing, 125, 12, x, y, w, alpha); return; }
    var f = Q3.order[Math.floor(now / 1000 * Q3.fps) % Q3.order.length], s = w * Q3_BODY_MATCH / Q3.cellW;
    ctx.save(); ctx.globalAlpha *= alpha;
    ctx.drawImage(QIDLE, f * Q3.cellW, 0, Q3.cellW, Q3.cellH, x - Q3.ax * s, y - Q3.ay * s, Q3.cellW * s, Q3.cellH * s);
    ctx.restore();
  }
  function drawQueen(now) {
    if (QN.dig && QN.mode !== 'walk') { sprite(art.dig, Math.floor((QT - QN.dig.t0) * 8) % 6, 6, queen.x, queen.y, QUEEN_UNDER_W); return; }
    if (QN.mode === 'walk') sprite(art.walk, Math.floor(QN.wf) % 16, 16, queen.x, queen.y, QUEEN_UNDER_W, 1, QN.flip);
    else drawQueenFront(queen.x, queen.y, QUEEN_UNDER_W, 1, now);
  }
  // Advance the game clock and step all the game logic (queen, timers,
  // eggs, kids, trades) WITHOUT drawing. queenFrame (underground) and the
  // upstairs step (v49) both use this — the game keeps running while Chris
  // is upstairs, so the scout keeps scouting and the miner keeps digging.
  // Called at most once per unique `now` (qLastNow): a second call with the
  // same `now` gets dt = 0 and steps nothing, so calling it from both the
  // underground draw and the upstairs draw in one frame is safe.
  function stepFrame(now) {
    var dt = qLastNow ? Math.min(0.1, (now - qLastNow) / 1000) : 0;
    qLastNow = now;
    QT += dt;
    stepQueen(dt);
    // Brain timer (v1): runs only while she rests idle and settled on the bed.
    // Pauses while placing; resets when she leaves the bed (brainReset calls).
    var brainIdle = QN.mode === 'idle' && !QN.busy && mode !== 'carrying' &&
      (typeof state === 'undefined' || state === 'underground' || state === 'menu') && atHome();
    if (mode !== 'carrying' && brainIdle && !BR.ready && BR.brains < BRAIN_CAP) {
      BR.t += dt;
      if (BR.t >= BRAIN_EVERY) BR.ready = true;
    }
    stepRoomTimers();
    stepEggs();
    stepKids(dt); // CHECKPOINT 3: the kids walk, ride, go to school, grow
  }
  // Called from drawUnderground (index.html) once per frame while she is free.
  function queenFrame(now) {
    stepFrame(now);
    drawQueen(now);
    drawBrainBubble(now);
    drawRoomTimerBubbles(now);
    drawBasketBubbles(now);
    drawPlaygroundStageTimer(now); // v40 fix 2: the slide ride's timer ABOVE the slide
    drawSchoolStageTimer(now); // v40 fix 4: the desk timer ABOVE the desk (grow when it finishes)
    drawTradeTrainTimer(now); // CHECKPOINT 4: the 8s training countdown ABOVE the trade item being trained at
    drawMinerDigTimer(now); // v47 fix 1: the discovery countdown ABOVE the digging miner (Chris, Nov 18)
    if (QN.mode === 'walk') positionTarget();
  }
  window.BASE_QUEEN = {
    get free() { return queenFree; },
    draw: queenFrame,
    step: stepFrame, // v49: advance the clock + step the logic without drawing (upstairs — the game keeps running while Chris is up there)
    drawUp: drawUpScout, // v49: draw the scout(s) on the surface while they are out (upstairs)
  };

  // ---- CHECKPOINT 2: the brain timer (v1 CHAMBER_BUB / BRAIN_BED_ONLY) ----
  // v1: a 2-minute timer that runs ONLY while she rests idle and settled on her
  // Royal grass bed. When it completes, a brain bubble appears above her head;
  // tap = +1 brain, 2-3 coins (counted in BR.coins; checkpoint 2 has no money
  // HUD and no idea minigame). The timer pauses while placing and resets
  // whenever she leaves the bed (any build activity distracts her, v1 brainReset).
  var BRAIN_EVERY = 120; // v1 CHAMBER_BUB.EVERY_S
  var BRAIN_COINS = [2, 3]; // v1
  var BRAIN_CAP = 8; // CHECKPOINT 2 ends at 8 brains (v1's squirrel comes at 9, idea game at 10 — later checkpoints)
  var BR = { t: 0, ready: false, brains: 0, coins: 0 };
  function brainReset() { BR.t = 0; }
  function queenHeadW() { return { x: queen.x, y: queen.y - QUEEN_UNDER_W * 0.58 }; } // v1
  function atHome() {
    if (!QN.home) return false;
    return Math.hypot(queen.x - QN.home.x, queen.y - QN.home.y) < 2; // v1 (<2 world units)
  }
  function bubbleR() {
    var pxw = spp * view.s;
    return Math.max(19, Math.min(30, HEX.w * pxw * 0.13)) / pxw; // v1
  }
  var IBRAIN = new Image(); IBRAIN.src = 'assets/menu-ant/iBrain.webp';
  function brainBubble() {
    if (!BR.ready || mode === 'carrying' || (typeof state !== 'undefined' && state === 'menu')) return null;
    var h = queenHeadW(), r = bubbleR();
    return { kind: 'brain', x: h.x, y: h.y - r - 4 / (spp * view.s), r: r }; // v1, hidden while placing
  }
  // v1's brain counter (port-b TIMERS_SRC, NP5 drawTag, unchanged from dfc7b054):
  // the counter on top of the queen in the royal chamber IS the brain-giver.
  // It counts down the 120s brain timer above her head; at 0:00 the brain
  // bubble appears and tapping it gives +1 brain and 2-3 coins, and the
  // counter restarts. mmss is zero-padded ("02:00"); the tag is drawn in
  // screen space (constant size whatever the zoom), white with a dark outline,
  // baseline bottom, at queen.y - QUEEN_UNDER_W*0.62. Same condition as v1:
  // only while she rests idle and settled on the bed, not ready, not busy.
  // v1 draws it in underground AND menu states, with no placing check (the
  // timer itself pauses while placing). The meters exist now (food/water at
  // the top), but there is no drain, so the starve-red flash does not apply
  // (always white).
  function brainMmss(sec) {
    sec = Math.max(0, Math.ceil(sec - 1e-6));
    return String(Math.floor(sec / 60)).padStart(2, '0') + ':' + String(sec % 60).padStart(2, '0');
  }
  function drawTag(x, y, txt, mid, col) {
    var m = ctx.getTransform(), X = m.a * x + m.c * y + m.e, Y = m.b * x + m.d * y + m.f, d = view.d || 1;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.font = '700 ' + (11 * d) + "px 'BM3 Sans','DejaVu Sans',sans-serif";
    ctx.textAlign = 'center'; ctx.textBaseline = mid ? 'middle' : 'bottom';
    ctx.lineJoin = 'round'; ctx.lineWidth = 3 * d; ctx.strokeStyle = 'rgba(0,0,0,.72)';
    ctx.strokeText(txt, X, Y); ctx.fillStyle = col || '#fff'; ctx.fillText(txt, X, Y);
    ctx.restore();
  }
  function drawBrainBubble(now) {
    var b = brainBubble();
    if (b) {
      var k = 1 + .06 * Math.sin(now / 200), Rr = b.r * k, lw = 3 / (spp * view.s); // v1 pulse
      ctx.save();
      ctx.beginPath(); ctx.arc(b.x, b.y, Rr, 0, 7);
      ctx.fillStyle = 'rgba(255,255,255,.92)'; ctx.fill();
      ctx.lineWidth = lw; ctx.strokeStyle = '#f3cf82'; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(b.x - Rr * .28, b.y + Rr * .9);
      ctx.lineTo(b.x, b.y + Rr * 1.32); ctx.lineTo(b.x + Rr * .28, b.y + Rr * .9);
      ctx.closePath(); ctx.fillStyle = 'rgba(255,255,255,.92)'; ctx.fill();
      if (IBRAIN.complete && IBRAIN.naturalWidth) {
        var q = Rr * 1.5;
        ctx.drawImage(IBRAIN, b.x - q / 2, b.y - q / 2, q, q);
      }
      ctx.restore();
      return;
    }
    // v1 brain counter (see above): counts down BRAIN_EVERY-BR.t above her head.
    // Checkpoint 2 stops at 8 brains: no counter once she has 8.
    if (BR.brains < BRAIN_CAP && !BR.ready && atHome() && QN.mode === 'idle' && !QN.busy) {
      drawTag(queen.x, queen.y - QUEEN_UNDER_W * 0.62, brainMmss(BRAIN_EVERY - BR.t), 0, 0);
    }
  }
  // v1 floatTxt2 (DOM): a floating "+1" at screen coords, then it fades away.
  function worldToScreen(x, y) {
    var c = worldToCanvas(x, y);
    var panY = (typeof pan !== 'undefined' ? pan : 0);
    return { x: view.x + c.x * view.s, y: view.y + (c.y - panY) * view.s };
  }
  function floatTxt(t, wx, wy) {
    var game = document.querySelector('#game');
    if (!game) return;
    var s = worldToScreen(wx, wy);
    var d = document.createElement('div');
    d.textContent = t;
    d.style.cssText = "position:absolute;left:" + s.x + "px;top:" + s.y + "px;transform:translate(-50%,-50%);z-index:9460;pointer-events:none;color:#ffe38a;font:800 20px/1 'BM3 Sans','DejaVu Sans',sans-serif;text-shadow:0 2px 3px #000,0 0 6px #000a;transition:opacity .6s,margin-top .6s";
    game.appendChild(d);
    requestAnimationFrame(function () { d.style.opacity = '0'; d.style.marginTop = '-28px'; });
    setTimeout(function () { if (d.parentNode) d.parentNode.removeChild(d); }, 700);
  }
  function tapBrainBubble(b) {
    BR.ready = false; BR.t = 0; BR.brains = Math.min(BRAIN_CAP, BR.brains + 1); // checkpoint 2 stops at 8 brains
    var n = BRAIN_COINS[0] + Math.floor(Math.random() * (BRAIN_COINS[1] - BRAIN_COINS[0] + 1));
    BR.coins += n;
    floatTxt('+1', b.x, b.y);
    // (coins counted in BR.coins; no money HUD in checkpoint 2, no idea minigame)
  }

  // ---- CHECKPOINT 2: the fridge / water room timers (v1 R3-5 / ROOM_STALL_S) ----
  // v1: the kitchen counts down 5:00 and the water room 7:00 (ROOM_STALL_S).
  // The countdown is drawn over the item; at 00:00 it stops and a leaf (fridge)
  // / water-drop (cooler) bubble pops over the item. Tap = she walks over and
  // eats / drinks (3s, the existing reaction) and the timer restarts. The 3s
  // eat/drink itself has no visible countdown in v1 — the room timer is the
  // visible countdown. The timer starts only after the item is built (the
  // cloud is gone), never while the cloud is still going. The meters exist
  // now (food/water at the top), but there is no drain, so the timer never
  // starves.
  var ROOM_STALL_S = { fridge: 300, watercooler: 420 }; // v1 kitchen 300, water 420
  var roomTimers = {}; // id -> {start, ready} in queen-clock (QT) seconds
  var ILEAF = new Image(); ILEAF.src = 'assets/icons/fi_leaf.webp';
  var IDROP = new Image(); IDROP.src = 'assets/icons/icon_water_droplet.png';
  function startRoomTimer(id) {
    if (!ROOM_STALL_S[id]) return;
    roomTimers[id] = { start: QT, ready: false };
  }
  function clearRoomTimer(id) { delete roomTimers[id]; }
  function roomTimerLeft(id) {
    var rt = roomTimers[id];
    if (!rt) return null;
    return Math.max(0, rt.start + ROOM_STALL_S[id] - QT);
  }
  function stepRoomTimers() {
    for (var id in roomTimers) {
      var rt = roomTimers[id];
      if (!rt.ready && roomTimerLeft(id) <= 0) rt.ready = true; // 00:00: bubble appears
    }
  }
  function roomTimerBubble(id) {
    var rt = roomTimers[id];
    if (!rt || !rt.ready || mode === 'carrying') return null;
    var p = null;
    for (var i = 0; i < placed.length; i++) if (placed[i].id === id) { p = placed[i]; break; }
    if (!p) return null;
    var r = bubbleR();
    var im = IMGS[p.id];
    var h = (im && im.naturalWidth) ? p.w * im.naturalHeight / im.naturalWidth : p.w * 0.8;
    return { kind: id === 'fridge' ? 'eat' : 'drink', id: id, x: p.cx, y: p.floorY - h - r * 2.2, r: r };
  }
  function drawRoomTimerBubbles(now) {
    var ids = ['fridge', 'watercooler'];
    for (var i = 0; i < ids.length; i++) {
      var id = ids[i];
      var p = null;
      for (var j = 0; j < placed.length; j++) if (placed[j].id === id) { p = placed[j]; break; }
      if (!p) continue;
      var im = IMGS[p.id];
      var h = (im && im.naturalWidth) ? p.w * im.naturalHeight / im.naturalWidth : p.w * 0.8;
      var left = roomTimerLeft(id);
      // Countdown over the item while the timer runs: v1's drawTag (NP5),
      // zero-padded mmss, white with a dark outline — same as the brain counter.
      if (left !== null && left > 0) {
        drawTag(p.cx, p.floorY - h - 8, brainMmss(left), 1, 0);
      }
      // Leaf / drop bubble at 00:00 (v1's eat/drink bubble, same bubble style).
      var b = roomTimerBubble(id);
      if (b) {
        var k = 1 + .06 * Math.sin(now / 200), Rr = b.r * k, lw = 3 / (spp * view.s);
        var ic = (b.kind === 'eat') ? ILEAF : IDROP;
        ctx.save();
        ctx.beginPath(); ctx.arc(b.x, b.y, Rr, 0, 7);
        ctx.fillStyle = 'rgba(255,255,255,.92)'; ctx.fill();
        ctx.lineWidth = lw; ctx.strokeStyle = '#f3cf82'; ctx.stroke();
        ctx.beginPath(); ctx.moveTo(b.x - Rr * .28, b.y + Rr * .9);
        ctx.lineTo(b.x, b.y + Rr * 1.32); ctx.lineTo(b.x + Rr * .28, b.y + Rr * .9);
        ctx.closePath(); ctx.fillStyle = 'rgba(255,255,255,.92)'; ctx.fill();
        if (ic.complete && ic.naturalWidth) {
          var q = Rr * 1.36, a = ic.naturalWidth / ic.naturalHeight || 1;
          var w = a >= 1 ? q : q * a, hh = a >= 1 ? q / a : q;
          ctx.drawImage(ic, b.x - w / 2, b.y - hh / 2, w, hh);
        }
        ctx.restore();
      }
    }
  }
  // ---- v40 fix 2: the SLIDE timer goes ABOVE THE SLIDE (Chris, Nov 16) ----
  // v39 drew the playground stage timer (12s) at the entrance hexagon centre.
  // Chris: "The timer for the slide must be above the slide." So the timer is
  // drawn above the park piece the kid is RIDING — the slide, swing set,
  // teeter totter or spinning circle — at that piece's position, in v1's
  // drawTag style (zero-padded mmss, white 11px bold, dark outline), the
  // same "above the item" offset as the fridge/cooler room timers (piece
  // top - 8). It is the kid's 12s ride countdown (arrT + PLAY_S - QT): the
  // first ride AND a later ride (a waiting kid taking a freed piece) both
  // show it. v42 (Chris): the timer does NOT disappear at 00:00 — the ant
  // stays ON the piece after the timer runs out (he only leaves it once a
  // desk is built and he goes to school), so the timer stays visible above
  // the piece, clamped at 00:00 (brainMmss clamps at 0), for the whole time
  // he occupies it — while riding, after the timer runs out, and while the
  // desk is offered-but-not-built. It vanishes only when he leaves the piece.
  // If two kids ride two pieces, each piece shows its own timer above it.
  // NOT at the hexagon centre, NOT on the slide or the kid — ABOVE the piece.
  function drawPlaygroundStageTimer(now) {
    for (var i = 0; i < ANTS.length; i++) {
      var a = ANTS[i];
      if (a.state !== 'ride' || !a.slot || !a.slot.p || a.arrT == null) continue;
      var left = a.arrT + CYCLE1.PLAY_S - QT;
      // v42: no `left <= 0` skip — the timer stays visible (00:00) while the
      // ant is still riding / occupying the piece after the timer runs out.
      var p = a.slot.p, it = itemById(a.slot.piece);
      var h = it ? itemH(it) : p.w * 0.8;
      drawTag(p.cx, p.floorY - h - 8, brainMmss(left), 1, 0);
    }
  }
  // ---- v40 fix 4: the DESK timer goes ABOVE THE DESK (Chris, Nov 16) ----
  // "Then the timer for the desk should be above the desk. And when that
  // timer is complete, that is when the ant grows up." The school stage
  // timer (10s, v1 CYCLE1.SCHOOL_S) is drawn above each desk a kid is
  // STUDYING at, in v1's drawTag style (zero-padded mmss, white 11px bold,
  // dark outline), above the top of the ksDesk drawing (desk floorY -
  // KSDESK_W - 8). One timer per occupied desk; two kids at two desks each
  // see their own timer above their desk. When the timer hits 00:00 the
  // existing stall-end rule runs startGrow — the kid grows up (1.2s, v1
  // CYCLE1.GROW_S) — so the grow IS triggered by the desk timer completing.
  function drawSchoolStageTimer(now) {
    for (var i = 0; i < GENS.length; i++) {
      var g = GENS[i];
      if (g.stage !== 'kidschool' || g.phase !== 'stall' || g.until <= QT) continue;
      for (var j = 0; j < g.kids.length; j++) {
        var a = g.kids[j];
        if (!a.toSchool || a.schoolDesk == null || a.state !== 'idle') continue;
        var d = placedByUid(a.schoolDesk);
        if (!d) continue;
        drawTag(d.cx, d.floorY - KSDESK_W - 8, brainMmss(g.until - QT), 1, 0);
      }
    }
  }
  function tapRoomTimerBubble(b) {
    // v1 R3-5: tap = queue; when she is free she walks there and eats/drinks, timer restarts.
    var id = b.id;
    var p = null;
    for (var j = 0; j < placed.length; j++) if (placed[j].id === id) { p = placed[j]; break; }
    if (!p) return;
    startRoomTimer(id); // restart the countdown now (v1 restarts it when she goes)
    if (QN.busy) {
      for (var i = 0; i < pendingScripts.length; i++) {
        if (pendingScripts[i].id === id) { pendingScripts[i].uid = p.uid; pendingScripts[i].cx = p.cx; pendingScripts[i].floorY = p.floorY; return; }
      }
      pendingScripts.push({ uid: p.uid, id: id, cx: p.cx, floorY: p.floorY });
      return;
    }
    runItemScript(id, p.cx, p.floorY, p.uid);
  }

  // ---- CHECKPOINT 2: the egg cycle (v1 EGG_CYCLE, doLay/doTend/doRemove, stepEggs) ----
  // v1 values: lay 2s, tends at +2/+4/+6 min, hatch at +8 min, spoil window 120s.
  // The basket is the ONE placed egg basket (not v1's 4 nursery baskets).
  // Lay: she walks to the basket, waits 2s, two eggs appear, the cycle starts.
  // Tend: at each tend time a bubble (egg cutout + heart) appears over the basket;
  // tap = she walks over, tends 2s, the next tend is due (or the hatch is set).
  // Spoil: a tend untapped for 120s spoils the basket; tap the fried-egg bubble
  // and she removes the spoiled eggs (2s) and the basket is empty again.
  // Hatch: at +8 min (all tends done) the eggs hatch and the basket empties.
  // The hatch spawns 2 kid ants in v1 (GENS/newKid/walkAnt + kid sprites) —
  // checkpoint 3 ports that whole kid system (see "the kids" above).
  var EGG_CYCLE = {
    TEND_AT_S: [120, 240, 360],
    TEND_COUNT: 3,
    HATCH_AT_S: 480,
    SPOIL_WINDOW_S: 120,
    LAY_WAIT_S: 2, TEND_LOOK_S: 2, SPOIL_REMOVE_S: 2
  };
  var IEGG = new Image(); IEGG.src = 'assets/items/egg-cutout.png';
  var IPAC = new Image(); IPAC.src = 'assets/job-icons/256/job-pacifier.png?v=41'; // v41: v1 lay bubble icon (job-pacifier, md5 2db59444 — already in the base layer, same file as v1)
  var IBASKET_EMPTY = new Image(); IBASKET_EMPTY.src = 'assets/items/egg-basket-empty.png';
  // ---- CHECKPOINT 3, v34: v1's egg-cracking hatch (index.html, hatch-timeline.json, 12 fps) ----
  // Ported as-is from v1, not invented. The eggs CRACK and the little ants
  // climb OUT of them. Timeline frames (12 fps, 127 frames = 10.6 s):
  // 0-5 two eggs; 6-27 the egg wobbles and cracks (crack_stage 0-5);
  // 28+ the shells open and the kid climbs out of the bowl (idle frames,
  // rim-clipped while in the bowl); at frame 60 the real kid ant spawns at
  // LAND and walks to a nursery spot; the shells fade to frame 126; the
  // basket empties when the left egg passes frame 126 (11.5 s after h0).
  // The left egg runs 1 s behind the right (STAGGER_S). All coordinates are
  // v1 nursery room px, relative to the basket's top-left; the basket art
  // is 113x133, so the world scale is the placed basket's width / 113.
  var HATCH = {
    FRONT_TL: [647, 1012], LAND: [830, 1165], STAGGER_S: 1.0, BASKET_GAP_S: 1.5,
    LOFF: { x: -18.97, y: 1.76 }, PIV: { x: 72.1, y: 61 }, CAP_PIV: { x: 71.3, y: 43.5 }, NEST_Y: 62.5,
    BASKET_W: 113
  };
  var HATCH_TL; // undefined = still loading, false = failed to load, object = the timeline JSON
  if (typeof fetch === 'function') {
    fetch('assets/kid/hatch-timeline.json').then(function (r) { return r.json(); }).then(function (d) { HATCH_TL = d; }).catch(function () { HATCH_TL = false; });
  } else { HATCH_TL = false; }
  var HATCHIMG = {};
  function hatchImg(name) {
    var src = 'assets/kid/egg-overlays/' + name;
    if (!HATCHIMG[src]) { var im = new Image(); im.src = src; HATCHIMG[src] = im; }
    return HATCHIMG[src];
  }
  var IBASKET2 = new Image(); IBASKET2.src = 'assets/items/basket-two-eggs.png'; // v1 BASKET2 (two-eggs basket, 113x133)
  var leftEggCut = null;
  function getLeftEgg() { // v1: the approved left egg's own pixels (soft clip of the two-eggs basket)
    if (leftEggCut) return leftEggCut;
    if (!IBASKET2.complete || !IBASKET2.naturalWidth) return null;
    try {
      var c = document.createElement('canvas'); c.width = 113; c.height = 133;
      var g = c.getContext('2d');
      if (!g) return null;
      g.save(); g.beginPath(); g.ellipse(70.8 + HATCH.LOFF.x + 0.5, 48.9 + HATCH.LOFF.y + 0.5, 9.9, 12.7, 4 * Math.PI / 180, 0, 7); g.clip(); g.drawImage(IBASKET2, 0, 0); g.restore();
      leftEggCut = c; return c;
    } catch (err) { return null; } // a canvas failure must never break the draw — the left egg just stays uncut
  }
  function rimClipLocal(off) { // v1 rimClip: keeps only the part of the kid above the basket rim (in the bowl)
    ctx.beginPath(); ctx.moveTo(-80 + off.x, -300);
    for (var x = -80; x <= 200; x += 2) { var t = clamp((x - 58) / 45, -1, 1), ry = 40 + 32 * Math.sqrt(1 - t * t); ctx.lineTo(x + off.x, Math.min(ry, HATCH.NEST_Y) + off.y); }
    ctx.lineTo(200 + off.x, -300); ctx.closePath(); ctx.clip();
  }
  var basketJob = null; // 'tend' | 'remove' | 'lay' while she is doing a basket job
  var basketQueue = []; // kinds waiting while she is busy
  function basketPlaced() {
    for (var i = 0; i < placed.length; i++) if (placed[i].id === 'eggbasket') return placed[i];
    return null;
  }
  function layEggs() {
    var p = basketPlaced();
    if (!p) return;
    p.egg = {
      state: 'two', laidAt: QT, tendsDone: 0, tapped: false,
      tendDueAt: QT + EGG_CYCLE.TEND_AT_S[0], tendAppearedAt: null, spoilAt: null, hatchAt: null
    };
  }
  // v1 first-play fast hatch (index.html armFirstPlayHatch, FIRST_PLAY_HATCH_S=15 — Chris, Nov 16: 15 s, was 30 s):
  // the FIRST basket lay hatches in 15 s with no tends and no spoil, so the
  // player sees a hatch fast the first time. Only ever runs once per session.
  var firstPlayHatch = false;
  var FIRST_PLAY_HATCH_S = 15;
  function armFirstPlayHatch() {
    if (firstPlayHatch) return;
    var p = basketPlaced();
    if (!p || !p.egg) return; // no eggs laid (basket erased mid-walk) — flag stays for the next lay
    firstPlayHatch = true;
    var e = p.egg;
    e.tendsDone = EGG_CYCLE.TEND_COUNT;
    e.tendDueAt = null; e.tendAppearedAt = null; e.spoilAt = null; e.tapped = false;
    e.hatchAt = QT + FIRST_PLAY_HATCH_S;
  }
  function markTend(p) {
    var e = p.egg;
    if (!e) return;
    e.tendsDone++;
    e.tendAppearedAt = null; e.spoilAt = null; e.tapped = false;
    if (e.tendsDone < EGG_CYCLE.TEND_COUNT) e.tendDueAt = e.laidAt + EGG_CYCLE.TEND_AT_S[e.tendsDone];
    else { e.tendDueAt = null; e.hatchAt = Math.max(e.laidAt + EGG_CYCLE.HATCH_AT_S, QT); }
  }
  function basketTimer(p) {
    var e = p.egg;
    if (!e || e.state !== 'two') return null;
    if (e.tendAppearedAt != null) return e.tapped ? null : e.spoilAt - QT;
    if (e.tendsDone < EGG_CYCLE.TEND_COUNT) return e.tendDueAt - QT;
    return e.hatchAt - QT;
  }
  function stepEggs() {
    var p = basketPlaced();
    if (!p || !p.egg) return;
    var e = p.egg;
    if (e.state === 'hatch') { stepHatch(p); return; }
    if (e.state !== 'two') return;
    if (e.tendsDone < EGG_CYCLE.TEND_COUNT) {
      if (e.tendAppearedAt == null && QT >= e.tendDueAt) { e.tendAppearedAt = QT; e.spoilAt = QT + EGG_CYCLE.SPOIL_WINDOW_S; }
      else if (e.tendAppearedAt != null && !e.tapped && QT >= e.spoilAt) {
        e.state = 'spoiled'; e.tendAppearedAt = null; e.spoilAt = null; e.hatchAt = null;
      }
    } else if (QT >= e.hatchAt && !QN.busy) {
      // v34: the eggs crack and the kids climb out (v1 hatch timeline).
      // If the timeline hasn't loaded yet, wait (retry next tick); if it
      // failed to load, fall back to the instant hatch so the game never stalls.
      if (HATCH_TL === undefined) return;
      if (HATCH_TL === false) { hatchKids(p); return; }
      startHatch(p);
    }
  }
  // ---- v34: the egg-cracking hatch (v1 hatchGen / stepBaskets / onBasketHatched) ----
  function startHatch(p) {
    // v1 hatchGen: the basket enters the 'hatch' state and the cracking
    // timeline runs (12 fps). The gen is made now; its kids join it as
    // they spawn at frame 60. The basket empties at 11.5 s (finishHatch).
    var e = p.egg;
    e.state = 'hatch'; e.h0 = QT; e.spawned = [false, false];
    genN++;
    e.gen = { id: genN, stage: 'nursery', phase: 'idle', kids: [], until: 0, growEnd: 0, bx: p.cx, by: p.floorY };
    GENS.push(e.gen);
  }
  function hatchScale(p) {
    return p.w / HATCH.BASKET_W; // world per v1 room px
  }
  function hatchBasketTop(p) {
    var im = IMGS['eggbasket'];
    var h = im ? p.w * im.naturalHeight / im.naturalWidth : p.w;
    return { bx: p.cx - p.w / 2, by: p.floorY - h, s: hatchScale(p) };
  }
  function stepHatch(p) {
    var e = p.egg;
    var fR = Math.floor((QT - e.h0) * 12);
    var fL = Math.floor((QT - e.h0 - HATCH.STAGGER_S) * 12);
    // v1 stepBaskets: at frame 60 the real kid spawns at LAND and walks to a nursery spot.
    if (fR >= 60 && !e.spawned[0]) { e.spawned[0] = true; spawnHatchKid(p, e.gen, 0); }
    if (fL >= 60 && !e.spawned[1]) { e.spawned[1] = true; spawnHatchKid(p, e.gen, 1); }
    // v1: both eggs hatched (left frame past 126) -> the basket empties.
    if (fL > 126) finishHatch(p);
  }
  function spawnHatchKid(p, g, i) {
    var o = i ? HATCH.LOFF : { x: 0, y: 0 };
    var t = hatchBasketTop(p);
    var lx = t.bx + (HATCH.LAND[0] - HATCH.FRONT_TL[0] + o.x) * t.s;
    var ly = t.by + (HATCH.LAND[1] - HATCH.FRONT_TL[1] + o.y) * t.s;
    var a = newKid(g, lx, ly);
    walkAnt(a, { x: p.cx + (i === 0 ? -16 : 16), y: p.floorY + 6 }); // kids hang around the Nursery
  }
  function finishHatch(p) {
    // v1 onBasketHatched: the basket empties; the first hatch unlocks the
    // playground (the park tab). If park pieces are already built, the new
    // kids go straight to the playground (v1 afterHatch/goNext).
    var g = p.egg.gen;
    p.egg = null;
    if (!parkUnlocked) openPark();
    // v45: only send the gen to the playground if it is STILL in the
    // nursery. The kids are created (and sent to play) in hatchKids, but
    // this runs later, when the cracking timeline finishes — by then a
    // quick kid may already have ridden and been sent to school
    // (goToSchool via tryAssignSchool), so the gen may already be in
    // kidschool. Yanking it back to playground here would strand that
    // kid's desk assignment (he keeps schoolDesk while the gen is back in
    // the playground) and leave the gen stuck in the playground stall
    // with no free desk. hatchKids already sends a fresh gen to play.
    if (g && parkPiecesBuilt() && g.stage === 'nursery') goToPlayground(g);
  }
  // ---- v34: drawing the cracking hatch (v1 drawBasket / drawEgg) ----
  // Everything is drawn in v1's room-px space, translated to the placed
  // basket's top-left and scaled by the basket's width / 113. The emerging
  // kid is drawn at the base layer's kid size (KW), so it matches the real
  // kid ant that takes over at frame 60 — no size jump at the handoff.
  function drawHatchBasket(p) {
    var e = p.egg;
    var TL = HATCH_TL && HATCH_TL.timeline;
    if (!TL) return;
    var t = hatchBasketTop(p);
    var fR = Math.floor((QT - e.h0) * 12);
    var fL = Math.floor((QT - e.h0 - HATCH.STAGGER_S) * 12);
    ctx.save();
    ctx.translate(t.bx, t.by);
    ctx.scale(t.s, t.s);
    // v1 drawBasket: the basket base while the eggs are still whole. After
    // the left egg starts cracking there is no base in v1 (the room art
    // carries the wicker) — here the basket is a placed item, so the empty
    // basket stays underneath so the wicker never vanishes mid-hatch.
    if (fR < 6) {
      if (IBASKET2.complete && IBASKET2.naturalWidth) ctx.drawImage(IBASKET2, 0, 0);
    } else if (fL < 6) {
      var tk = hatchImg('basket-front-spot_right-egg-taken-out_WORKING-LAYER.png');
      if (tk && tk.complete && tk.naturalWidth) ctx.drawImage(tk, 0, 0);
    } else {
      if (IBASKET_EMPTY.complete && IBASKET_EMPTY.naturalWidth) ctx.drawImage(IBASKET_EMPTY, 0, 0);
    }
    drawHatchEgg(fR, false, t.s);
    drawHatchEgg(fL, true, t.s);
    ctx.restore();
  }
  function drawHatchEgg(f, isLeft, s) {
    if (f < 6 || f > 126) return;
    var TL = HATCH_TL && HATCH_TL.timeline;
    if (!TL) return;
    var e = TL[f];
    var o = isLeft ? HATCH.LOFF : { x: 0, y: 0 };
    if (f < 28 && e.egg) { // the egg wobbles and cracks
      var st = e.egg.crack_stage;
      ctx.save();
      ctx.translate(HATCH.PIV.x + o.x, HATCH.PIV.y + o.y);
      ctx.rotate(-e.egg.angle * Math.PI / 180);
      ctx.translate(-(HATCH.PIV.x + o.x), -(HATCH.PIV.y + o.y));
      if (!isLeft) {
        var im = hatchImg(st ? 'egg-right-cracked-stage-' + st + '.png' : 'egg-right-cutout_from-approved-two-eggs.png');
        if (im && im.complete && im.naturalWidth) ctx.drawImage(im, 0, 0);
      } else {
        var c = getLeftEgg();
        if (c) ctx.drawImage(c, 0, 0);
        if (st) {
          var cl = hatchImg('crack-lines-stage-' + st + '.png');
          if (cl && cl.complete && cl.naturalWidth) ctx.drawImage(cl, o.x, o.y);
        }
      }
      ctx.restore();
      return;
    }
    var sh = e.shells, k = (e.kid && f < 60) ? e.kid : null, inBowl = !!(k && k.in_bowl);
    var drawKidLocal = function () { // the kid climbing out of the egg, at the base layer's kid size
      if (!k) return;
      var im = kidImg('idle_' + pad2n(k.src_frame) + '.png');
      if (!im || !im.complete || !im.naturalWidth) return;
      var ks = KW / s;
      var an = kidAnchorFor('idle_' + pad2n(k.src_frame) + '.png');
      var fx = k.feet[0] - HATCH.FRONT_TL[0] + o.x, fy = k.feet[1] - HATCH.FRONT_TL[1] + o.y;
      ctx.save();
      if (inBowl) rimClipLocal(o);
      ctx.drawImage(im, fx - an[0] * ks, fy - an[1] * ks, im.naturalWidth * ks, im.naturalHeight * ks);
      ctx.restore();
    };
    var drawShells = function () { // the cracked shells, fading in the basket
      if (!sh || sh.alpha <= 0) return;
      ctx.save();
      ctx.globalAlpha *= sh.alpha;
      var sb = hatchImg('shell-bottom-cup-open.png');
      if (sb && sb.complete && sb.naturalWidth) ctx.drawImage(sb, o.x, o.y);
      ctx.translate(sh.cap[0], sh.cap[1]);
      ctx.translate(HATCH.CAP_PIV.x + o.x, HATCH.CAP_PIV.y + o.y);
      ctx.rotate(-sh.cap[2] * Math.PI / 180);
      ctx.translate(-(HATCH.CAP_PIV.x + o.x), -(HATCH.CAP_PIV.y + o.y));
      var cap = hatchImg('shell-top-cap.png');
      if (cap && cap.complete && cap.naturalWidth) ctx.drawImage(cap, o.x, o.y);
      ctx.restore();
    };
    if (inBowl) { drawKidLocal(); drawShells(); } else { drawShells(); drawKidLocal(); }
  }
  function runBasketJob(kind) {
    var p = basketPlaced();
    if (!p) return;
    if (kind === 'lay') {
      // v41: re-lay (v1 doLay interact path, index.html:623) — no gate, no
      // cost. The basket must be empty and the queen free; a busy queen
      // queues it like any other basket job. armFirstPlayHatch is a no-op
      // after the first lay, so a re-lay runs the normal cycle.
      if (p.egg) return;
      if (QN.busy) { if (basketQueue.indexOf(kind) < 0) basketQueue.push(kind); return; }
      basketJob = kind;
      runningScriptId = p.uid;
      var spot = itemSpot('eggbasket', p.cx, p.floorY);
      QN.busy = true;
      queenTo(spot.x, spot.y, function () {
        queenWait(LAY_WAIT_S, function () {
          layEggs();
          basketJob = null; runningScriptId = null;
          queenHome(function () { QN.busy = false; armFirstPlayHatch(); runBasketPending(); });
        });
      });
      return;
    }
    if (!p.egg) return;
    if (QN.busy) { if (basketQueue.indexOf(kind) < 0) basketQueue.push(kind); return; }
    basketJob = kind;
    runningScriptId = p.uid; // the basket she is working on (for multiples)
    var spot = itemSpot('eggbasket', p.cx, p.floorY);
    QN.busy = true;
    queenTo(spot.x, spot.y, function () {
      if (kind === 'tend') {
        queenWait(EGG_CYCLE.TEND_LOOK_S, function () {
          var pp = basketPlaced();
          if (pp && pp.egg && pp.egg.state === 'two' && pp.egg.tendAppearedAt != null) {
            markTend(pp);
            floatTxt('\u2665', pp.cx, pp.floorY - 10); // v1 doTend heart
          }
          basketJob = null; runningScriptId = null;
          queenHome(function () { QN.busy = false; runBasketPending(); });
        });
      } else { // remove
        queenWait(EGG_CYCLE.SPOIL_REMOVE_S, function () {
          var pp = basketPlaced();
          if (pp && pp.egg && pp.egg.state === 'spoiled') pp.egg = null;
          basketJob = null; runningScriptId = null;
          queenHome(function () { QN.busy = false; runBasketPending(); });
        });
      }
    });
  }
  function runBasketPending() {
    if (QN.busy) return;
    var kind = basketQueue.shift();
    if (kind) runBasketJob(kind);
    else runPending();
  }
  function basketBubbles() {
    var p = basketPlaced();
    if (!p || mode === 'carrying') return [];
    var r = bubbleR();
    var im = IMGS[p.id];
    var h = (im && im.naturalWidth) ? p.w * im.naturalHeight / im.naturalWidth : p.w * 0.8;
    var bx = p.cx, by = p.floorY - h - r;
    var out = [];
    if (!p.egg) {
      // v41: the basket is EMPTY — v1 lay bubble (pacifier), the re-lay
      // trigger (v1 index.html:851). A spoiled basket still has p.egg, so it
      // shows the spoil bubble below, never this one.
      out.push({ kind: 'lay', x: bx, y: by, r: r });
      return out;
    }
    var e = p.egg;
    if (e.state === 'two' && e.tendAppearedAt != null && !e.tapped) {
      out.push({ kind: 'tend', x: bx, y: by, r: r });
    }
    if (e.state === 'spoiled') {
      out.push({ kind: 'spoil', x: bx, y: by, r: r });
    }
    return out;
  }
  function drawBasketBubbles(now) {
    var list = basketBubbles();
    for (var i = 0; i < list.length; i++) {
      var b = list[i];
      var k = 1 + .06 * Math.sin(now / 200), Rr = b.r * k, lw = 3 / (spp * view.s);
      ctx.save();
      ctx.beginPath(); ctx.arc(b.x, b.y, Rr, 0, 7);
      ctx.fillStyle = 'rgba(255,255,255,.92)'; ctx.fill();
      ctx.lineWidth = lw; ctx.strokeStyle = '#f3cf82'; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(b.x - Rr * .28, b.y + Rr * .9);
      ctx.lineTo(b.x, b.y + Rr * 1.32); ctx.lineTo(b.x + Rr * .28, b.y + Rr * .9);
      ctx.closePath(); ctx.fillStyle = 'rgba(255,255,255,.92)'; ctx.fill();
      if (b.kind === 'tend') {
        // v1 tend bubble: the egg cutout clipped in the circle + a small heart.
        if (IEGG.complete && IEGG.naturalWidth) {
          ctx.save();
          ctx.beginPath(); ctx.arc(b.x, b.y, Rr * .86, 0, 7); ctx.clip();
          var q = Rr * 3.2;
          ctx.drawImage(IEGG, b.x - q * .63, b.y - q * .37, q, q * 133 / 113);
          ctx.restore();
        }
        ctx.save();
        ctx.font = '800 ' + (Rr * .434).toFixed(3) + "px 'BM3 Sans','DejaVu Sans',sans-serif"; // tend-bubble heart, 30% smaller (70% of v25 size)
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.shadowColor = '#000'; ctx.shadowOffsetY = 2; ctx.shadowBlur = 3;
        ctx.fillStyle = '#ffe38a';
        ctx.fillText('\u2665', b.x + Rr * .30, b.y - Rr * .26);
        ctx.restore();
      } else if (b.kind === 'spoil') {
        // v1 spoil bubble: fried-egg glyph.
        ctx.font = '900 ' + (Rr * 1.25).toFixed(3) + "px 'Apple Color Emoji','Noto Color Emoji','Segoe UI Emoji',sans-serif";
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillStyle = '#000';
        ctx.fillText('\uD83C\uDF73', b.x, b.y + Rr * .08);
      } else if (b.kind === 'lay') {
        // v41: v1 lay bubble — the pacifier (job-pacifier.png), drawn at
        // Rr*1.36 like v1 index.html:869.
        if (IPAC.complete && IPAC.naturalWidth) {
          var q = Rr * 1.36;
          ctx.drawImage(IPAC, b.x - q / 2, b.y - q / 2, q, q);
        }
      }
      ctx.restore();
    }
    // Countdown over the basket (v1 basketTimer, seconds left): v1's drawTag
    // (NP5), zero-padded mmss, white with a dark outline — same as the brain counter.
    var p = basketPlaced();
    if (p && p.egg && p.egg.state === 'two') {
      var left = basketTimer(p);
      if (left !== null && left > 0) {
        var im2 = IMGS[p.id];
        var h2 = (im2 && im2.naturalWidth) ? p.w * im2.naturalHeight / im2.naturalWidth : p.w * 0.8;
        drawTag(p.cx, p.floorY - h2 - 8, brainMmss(left), 1, 0);
      }
    }
  }
  function tapBasketBubble(b) {
    var p = basketPlaced();
    if (!p) return;
    if (b.kind === 'lay') { runBasketJob('lay'); return; } // v41: re-lay from the empty basket's pacifier bubble
    if (!p.egg) return;
    if (b.kind === 'tend') {
      p.egg.tapped = true; // v1: the tap counts as the tend in time (spoil clock stops)
      runBasketJob('tend');
    } else if (b.kind === 'spoil') {
      runBasketJob('remove');
    }
  }

  // ---- CHECKPOINT 3: the kids (v1 GENS/newKid/walkAnt + kid sprites) ----
  // v1's generation system, ported to world coords. v1's kid positions are
  // chamber-image px; the base layer is world coords, so speeds and offsets
  // are x KW (HEX.w/791 world per chamber px). Two kids hatch per basket.
  // They idle near the nursery, ride the placed park pieces on v1's play
  // loops, stand at the desk for school, then grow to adults. Cycle 1
  // (Chris's checkpoint 3): nursery -> playground -> kidschool -> grow.
  // CYCLE1 waits (v1): PLAY_S 12 (playground stage), SCHOOL_S 10 (school
  // stage), GROW_S 1.2 (grow). The desk unlock is NOT the 12s stage end —
  // Chris: it unlocks when the ants complete their FIRST PASS on the slide
  // (one full 10.25s slide loop, 123 frames @ 12 fps).
  var KW = HEX.w / 791;
  var KID_SCALE = 0.5; // v1: kid = 0.5 x Albert
  var KID_SPEED = 2.5437173536208046 * 12 * KW; // v1 KID_SPEED (chamber px/s) -> world/s
  var AD_SPEED = KID_SPEED / KID_SCALE; // v1: grown ants
  var KSTEP = 8.364, K_SIDE_AD = 0.2027512636394711; // v1 STEP + K_SIDE_AD
  var IDLE_PLAY = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 0, 0, 0], IDLE_FPS = 7; // v1 OT12 idle
  var CYCLE1 = { PLAY_S: 12, SCHOOL_S: 10, GROW_S: 1.2 }; // v1
  var GENS = [], ANTS = [], genN = 0, antN = 0;
  // v1 play timing (kid-play/*-timing.json, 12 fps). One full loop = one
  // pass/ride. The slide loop is 10.25s — the "first pass" that unlocks the
  // desk. The JSONs are fetched for the per-frame rider animation; the loop
  // lengths below are v1's numbers, so the mechanic works even before a
  // JSON finishes loading. `tl` is v1's PG piece top-left (room template px).
  var PLAY_LOOP = {
    slide: { key: 'slide', json: 'assets/kid-play/slide/kid-slide-timing.json', frames: 123, fps: 12, tl: [268, 898] },
    swingset: { key: 'swing', json: 'assets/kid-play/swing/kid-swing-timing.json', frames: 24, fps: 12, tl: [465, 742] },
    spinningcircle: { key: 'merry', json: 'assets/kid-play/merry-go-round/kid-merry-go-round-timing.json', frames: 54, fps: 12, tl: [575, 980] },
    teetertotter: { key: 'seesaw', json: 'assets/kid-play/seesaw/kid-seesaw-timing.json', frames: 48, fps: 12, tl: [325, 1119] }
  };
  var PLAY_JSON = {};
  Object.keys(PLAY_LOOP).forEach(function (id) {
    var cfg = PLAY_LOOP[id];
    if (typeof fetch === 'function') {
      fetch(cfg.json).then(function (r) { return r.json(); }).then(function (d) { PLAY_JSON[cfg.key] = d; }).catch(function () { PLAY_JSON[cfg.key] = null; });
    }
  });
  // ---- v39 fix 2: the desk ANIMATION (v1 ksDesk, port-b.js:34) ----
  // 24 frames, 8 fps, a kid sitting at a small WOODEN desk (the kid and
  // the desk are drawn TOGETHER in every frame — the desk is baked into the
  // loop). The static blue-topped desk + pink stool is the EMPTY station;
  // the moment a kid sits at a desk for school, the static desk is hidden
  // and this loop plays instead (v1 standingKS, port-b.js:122-127). The
  // frames are copied UNCHANGED from v1 (assets/portb/np5loops/desk/) —
  // no stool, no blue top, no pink. The MENU desk image stays the blue
  // desk (Chris likes it); only the in-world desk during school changes.
  var KSDESK_N = 24, KSDESK_FPS = 8, KSDESK_AX = 50, KSDESK_AY = 94; // v1 ksDesk: 24 frames, 8 fps, anchor (50,94) in a 100x100 frame
  var KSDESK = [];
  for (var kdi = 0; kdi < KSDESK_N; kdi++) {
    var kdim = new Image();
    kdim.src = 'assets/kid/desk-study/chris_ant_study_desk_v3_roompx_' + String(kdi).padStart(2, '0') + '.png?v=39';
    KSDESK.push(kdim);
  }
  function ksDeskFrame(a) {
    // the loop frame for a kid studying at a desk, counted from when he arrived (arrT), 8 fps, looping
    var idx = Math.floor((QT - (a.arrT != null ? a.arrT : QT)) * KSDESK_FPS) % KSDESK_N;
    if (idx < 0) idx += KSDESK_N;
    return KSDESK[idx];
  }
  function deskOccupied(uid) {
    // a kid is SITTING at this desk studying (arrived, idle, toSchool) —
    // the static blue desk is hidden while he studies (the ksDesk loop is
    // drawn instead). While he walks there, or once he grows/leaves, the
    // desk shows again.
    for (var i = 0; i < ANTS.length; i++) {
      var a = ANTS[i];
      if (a.toSchool && a.schoolDesk === uid && a.state === 'idle') return true;
    }
    return false;
  }
  // v40 fix 3: the ant in the desk animation must be the SAME SIZE as the
  // ant before he sits (Chris: "The animation of the ant at the desk is
  // smaller relative to the ant before he uses the desk"). Measured Nov 16:
  // kid sprite idle frame 74x92, visible height 68 px (rows 11-79), drawn at
  // KW (HEX.w/791) -> 11.77 world. ksDesk frame 100x100: kid head top row
  // 23, feet (anchor) row 94 -> kid height 71 px. v39 drew the frame at the
  // desk width (12.5), so the kid read 12.5/16.57 = 0.75x — ~25% too small.
  // The frame scale is (68*KW)/71 world/px, so the frame width is
  // 100*(68*KW)/71 = 16.57 world and the kid in it is 71*16.57/100 = 11.77
  // world — exactly the sprite kid's height. The desk in the frame gets
  // bigger too (it is baked in) — correct; the kid matching is what matters.
  // The anchor (50,94) still lands at the desk's foot (d.cx, d.floorY), so
  // the kid stays grounded at the desk.
  var KSDESK_W = 100 * KW * 68 / 71;
  function drawKsDesk(a) {
    // v1 ksDesk: the kid + wooden desk, one loop frame, anchored at the
    // desk's foot (the kid's feet). The frame is 100x100; it is drawn at
    // KSDESK_W (v40 fix 3) so the kid in it is the same size as the kid
    // sprite before he sat down — NOT at the desk item's width (v39, which
    // made him ~25% too small).
    var d = placedByUid(a.schoolDesk);
    if (!d) return;
    var im = ksDeskFrame(a);
    if (!im || !im.complete || !im.naturalWidth) return;
    var w = KSDESK_W, h = w * im.naturalHeight / im.naturalWidth;
    var ax = KSDESK_AX / im.naturalWidth, ay = KSDESK_AY / im.naturalHeight;
    ctx.drawImage(im, d.cx - ax * w, d.floorY - ay * h, w, h);
  }
  // Ride-spot offsets (world) from a placed piece's top-left, from v1's
  // first timeline frame feet minus the piece tl (PG). The kid walks TO this
  // spot; the play loop then moves the rider each frame.
  var RIDE_OFF = {
    slide: [[2.11, 16.83]],
    swingset: [[16.85, 13.00]],
    spinningcircle: [[13.84, 9.46]],
    teetertotter: [[3.69, 10.69], [30.92, 3.01]]
  };
  function rideSpot(p, id, k) {
    var off = (RIDE_OFF[id] || [[0, 0]])[k || 0];
    var it = itemById(id);
    var h = it ? itemH(it) : p.w * 0.8;
    return { x: p.cx - p.w / 2 + off[0], y: p.floorY - h + off[1] };
  }
  var KIDIMG = {};
  function kidImg(name) {
    var src = (name.indexOf('wdo') === 0 || name.indexOf('wu') === 0)
      ? 'assets/kid-play/kid-frames-extra/kid50/' + name
      : 'assets/kid/kid-frames/kid50/' + name;
    if (!KIDIMG[src]) { var im = new Image(); im.src = src; KIDIMG[src] = im; }
    return KIDIMG[src];
  }
  function kidAnchorFor(name) {
    if (name.indexOf('idle') === 0) return [34, 78]; // v1 kid-frames.json
    if (name.indexOf('side') === 0) return [36, 46]; // v1 kid-frames.json
    return [30, 78]; // wdo / wu, v1 kid-frames-extra.json
  }
  function kidSrcName(s) { // v1 srcName: 'wu-plain frame N' -> 'wu_NN.png'
    var m = /^(wu|wdo)-plain frame (\d+)/.exec(s || '');
    if (m) return m[1] + '_' + String(+m[2]).padStart(2, '0') + '.png';
    return s;
  }
  function pad2n(n) { return String(n).padStart(2, '0'); }
  function drawKidSprite(name, x, y, flip, m) {
    var im = kidImg(name);
    if (!im || !im.complete || !im.naturalWidth) return;
    var sc = KW * (m / KID_SCALE); // kid (m 0.5) -> natural x KW; grown (m 1) -> 2x
    var an = kidAnchorFor(name);
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));
    if (flip) ctx.scale(-1, 1);
    ctx.drawImage(im, -an[0] * sc, -an[1] * sc, im.naturalWidth * sc, im.naturalHeight * sc);
    ctx.restore();
  }
  function newKid(g, x, y) { // v1 newKid
    // v30 fix 4 (Chris): one kid per park item — rode = has used a park item
    // (only a kid who rode moves on to school); schooled = finished school
    // and grew; toSchool/schoolDesk = assigned to a desk this trip;
    // wanderAt = when this idle kid next wanders near where he was born.
    var a = { id: 'k' + (++antN), gen: g, x: x, y: y, state: 'idle', path: [], cb: null, wf: 0, flip: false, m: KID_SCALE, ph: Math.random() * 3, slot: null, arrT: null, growT0: null, hidden: false, rode: false, schooled: false, toSchool: false, schoolDesk: null, wanderAt: 0 };
    ANTS.push(a); g.kids.push(a); return a;
  }
  function walkAnt(a, p, cb) { a.state = 'walk'; a.path = [{ x: p.x, y: p.y }]; a.cb = cb || null; } // v1 walkAnt
  function stepAnt(a, dt) { // v1 stepAnt (world coords)
    if (a.state !== 'walk') return;
    // CHECKPOINT 4: a miner walks at MINER_SPEED (a.spd) to his hex — 3x
    // slower than a scout. Every other ant uses the v1 speed below.
    var sp = (a.spd != null) ? a.spd : (a.m <= KID_SCALE ? KID_SPEED : AD_SPEED * a.m);
    var left = sp * dt;
    while (left > 0 && a.path.length) {
      var p = a.path[0], dx = p.x - a.x, dy = p.y - a.y, d = Math.hypot(dx, dy);
      if (Math.abs(dx) > 0.3) a.flip = dx < 0;
      var s = Math.min(left, d);
      a.x += dx / (d || 1) * s; a.y += dy / (d || 1) * s; left -= s;
      a.wf += s / (KSTEP * K_SIDE_AD * a.m * KW);
      if (s >= d - 1e-6) a.path.shift();
    }
    if (!a.path.length) {
      a.state = a.slot ? 'ride' : 'idle'; a.arrT = QT; // v30 fix 4: the moment he starts riding he has had his turn on that item (rode=true) — a kid walking to a slot that gets erased never rode, so he can take another slot
      if (a.slot) { a.rode = true; } // v39: rode = has had his turn on a park item (gates school). The item itself is NOT used up — it FREES when he gets off, and a waiting kid takes it (Chris's capacity rule). The v32 "used forever" rule is gone.
      // v39: no `used` on the desk either — a desk FREES when its kid
      // leaves it for the next thing, never on grow (v43 drawer rule: the
      // grown ant stays at the desk, so a waiting kid takes a freed desk
      // only when its ant leaves, or a NEW desk is built). (v32 marked it
      // used forever.)
      var cb = a.cb; a.cb = null; cb && cb();
    }
  }
  function drawKid(a) {
    if (a.state === 'gone' || a.hidden) return;
    if (a.state === 'ride') { drawRider(a); return; }
    // CHECKPOINT 4: a training ant is the training loop (ant + equipment,
    // like the ksDesk loop), not the idle sprite — and a digging miner is
    // the dig strip. Both replace the ant's own sprite while they run.
    if (a.state === 'train') { drawTrainAnt(a); return; }
    if (a.state === 'dig') { drawMinerDig(a); return; }
    // v39 fix 2: a kid STUDYING at a desk is the ksDesk loop (v1) — the kid
    // at a small wooden desk, baked together — not the idle kid sprite and
    // not the blue desk. The static blue desk is hidden while he studies
    // (see BASE_ITEMS.draw / deskOccupied).
    if (a.state === 'idle' && a.toSchool && a.schoolDesk != null) { drawKsDesk(a); return; }
    if (a.state === 'grow') { // v1: smooth scale-up on the locked idle
      var k = clamp((QT - a.growT0) / CYCLE1.GROW_S, 0, 1);
      var m = KID_SCALE + (1 - KID_SCALE) * ease(k);
      drawKidSprite('idle_' + pad2n(IDLE_PLAY[Math.floor((QT + a.ph) * IDLE_FPS) % IDLE_PLAY.length]) + '.png', a.x, a.y, false, m);
      return;
    }
    if (a.state === 'walk') {
      drawKidSprite('side_' + pad2n(Math.floor(a.wf) % 16) + '.png', a.x, a.y, a.flip, a.m);
      return;
    }
    drawKidSprite('idle_' + pad2n(IDLE_PLAY[Math.floor((QT + a.ph) * IDLE_FPS) % IDLE_PLAY.length]) + '.png', a.x, a.y, false, a.m);
  }
  function drawRider(a) {
    // v1 drawRider: the rider's position + sprite come from the play loop's
    // current frame (feet + src), relative to the placed piece. The piece
    // image itself is static in checkpoint 3 (v1's moving swing/plank/top
    // are not ported yet); the rider animates. The slide is static in v1
    // too (only the kid moves), so the slide ride is complete.
    var s = a.slot;
    if (!s) return;
    var cfg = PLAY_LOOP[s.piece];
    var p = s.p;
    var it = itemById(s.piece);
    var h = it ? itemH(it) : p.w * 0.8;
    var tlx = p.cx - p.w / 2, tly = p.floorY - h;
    var J = PLAY_JSON[cfg.key];
    var feet = null, src = null, flip = false;
    if (J && J.timeline) {
      var idx = Math.floor((QT - a.arrT) * cfg.fps) % cfg.frames;
      var fr = J.timeline[idx];
      if (fr && fr.kid && fr.kid[s.k]) { feet = fr.kid[s.k].feet; src = fr.kid[s.k].src; flip = !!fr.kid[s.k].flip; }
    }
    if (!feet) {
      var spot = rideSpot(p, s.piece, s.k);
      drawKidSprite('idle_' + pad2n(IDLE_PLAY[Math.floor((QT + a.ph) * IDLE_FPS) % IDLE_PLAY.length]) + '.png', spot.x, spot.y, false, a.m);
      return;
    }
    var wx = tlx + (feet[0] - cfg.tl[0]) * KW;
    var wy = tly + (feet[1] - cfg.tl[1]) * KW;
    drawKidSprite(kidSrcName(src || 'idle_00.png'), wx, wy, flip, a.m);
  }
  // ---- playground slots (the placed park pieces are the slots) ----
  function parkSlots() {
    // v1 makeSlots order is swing, slide, merry, seesaw — checkpoint 3 puts
    // the slide FIRST so the first kid rides the slide (the desk unlock
    // depends on the slide pass) and the free gateway item is used first.
    // v39 (Chris's capacity rule): a piece is a slot whenever it is BUILT —
    // NOT only when never-used. It is OCCUPIED while a kid is walking to it
    // or riding it (slotTaken) and FREED the moment he gets off; a waiting
    // kid takes a freed piece. The v32 "used forever" rule is gone.
    var order = ['slide', 'swingset', 'spinningcircle', 'teetertotter'];
    var slots = [];
    order.forEach(function (id) {
      placed.forEach(function (p) {
        if (p.id === id && !p.building) {
          // v30 fix 4 (Chris): ONE kid per park item. v1's seesaw has TWO
          // seats (makeSlots pushes k:0 and k:1), but Chris's rule overrides
          // it — the teeter totter gets ONE slot, like every other piece.
          slots.push({ piece: id, k: 0, p: p });
        }
      });
    });
    return slots;
  }
  function slotTaken(pUid, k) {
    for (var i = 0; i < ANTS.length; i++) {
      var a = ANTS[i];
      if (a.slot && a.slot.p.uid === pUid && a.slot.k === k && a.state !== 'gone') return true;
    }
    return false;
  }
  function playSpots(n, bx, by) { // v1 playSpots: ride slots first, extras idle on the floor
    var slots = parkSlots();
    var out = [], used = {};
    for (var i = 0; i < n; i++) {
      var s = null;
      for (var j = 0; j < slots.length; j++) {
        var key = slots[j].p.uid + ':' + slots[j].k;
        if (used[key] || slotTaken(slots[j].p.uid, slots[j].k)) continue;
        s = slots[j]; used[key] = true; break;
      }
      if (s) {
        var spot = rideSpot(s.p, s.piece, s.k);
        out.push({ x: spot.x, y: spot.y, slot: s });
      } else {
        // v30 fix 4 (Chris): a kid with no free slot does NOT queue on a
        // busy piece — he stays IDLE near where he was born (the basket /
        // nursery), bx/by = the gen's birth spot. He waits there for a slot.
        var ibx = (bx != null) ? bx : ENTRANCE.x, iby = (by != null) ? by : ENTRANCE.y;
        out.push({ x: ibx + (i - 0.5) * 14, y: iby + 6, slot: null });
      }
    }
    return out;
  }
  function parkPiecesBuilt() {
    for (var i = 0; i < placed.length; i++) {
      var id = placed[i].id;
      if ((id === 'slide' || id === 'swingset' || id === 'teetertotter' || id === 'spinningcircle') && !placed[i].building) return true;
    }
    return false;
  }
  function deskPlaced() {
    for (var i = 0; i < placed.length; i++) if (placed[i].id === 'desk' && !placed[i].building) return placed[i];
    return null;
  }
  function deskSpots() {
    // v30 fix 4 (Chris): ONE kid per desk. v1 kidschool flanks ONE desk
    // with TWO kids, but Chris's rule overrides it — each desk takes one
    // kid, standing at the desk's front centre.
    // v39 (Chris's capacity rule): a desk is a spot whenever it is BUILT
    // and no kid is currently at school on it (assigned, walking there, or
    // studying). The v32 "used forever" rule is gone.
    // v43 (Chris's DRAWER rule, Nov 17): an item is a drawer — an ant in
    // it occupies it whether the timer is done, starting, or in the middle.
    // The desk frees ONLY when its ant physically leaves it for the next
    // thing. A grown-up ant STAYS at the desk (there is no next thing in
    // checkpoint 3 — Chris will explain it in a future checkpoint), so the
    // desk stays occupied by him; a second ant needs a second desk. The
    // busy check is therefore the ant's schoolDesk association (set when he
    // is assigned, kept while he studies, grows, and stands there grown),
    // NOT toSchool — toSchool is cleared when he grows (so the ksDesk loop
    // stops and the blue desk shows again), which is drawing only, not
    // occupancy. Do NOT free the desk when he grows up.
    var out = [];
    for (var i = 0; i < placed.length; i++) {
      var p = placed[i];
      if (p.id !== 'desk' || p.building) continue;
      var busy = false;
      for (var j = 0; j < ANTS.length; j++) {
        if (ANTS[j].schoolDesk === p.uid && ANTS[j].state !== 'gone') { busy = true; break; }
      }
      if (!busy) out.push({ x: p.cx, y: p.floorY, desk: p });
    }
    return out;
  }
  function releaseStage(g) { // v1 releaseStage (playground part)
    if (g.stage === 'playground') {
      g.kids.forEach(function (a) { if (a.slot) a.slot = null; if (a.state === 'ride') a.state = 'idle'; });
    }
  }
  function goToPlayground(g) { // v1 goTo (playground)
    releaseStage(g);
    g.stage = 'playground'; g.phase = 'move';
    var spots = playSpots(g.kids.length, g.bx, g.by); // v30 fix 4: idle extras go near the birth spot
    g.kids.forEach(function (a, i) {
      a.slot = spots[i].slot || null;
      walkAnt(a, { x: spots[i].x, y: spots[i].y });
    });
  }
  function goToSchool(g) { // v1 goTo (kidschool)
    // v30 fix 4 (Chris): ONE kid per desk, and only kids who RODE a park
    // item move on to school. A kid who never rode stays idle near where he
    // was born — he gets a desk slot later, when a desk frees (tryAssignSchool).
    // A kid who already grew never goes again.
    // v39: only the kids GOING to school leave their park pieces. A kid who
    // just took a freed piece (has not ridden yet) KEEPS his slot — he stays
    // at the park while his sibling goes to school. (v1's releaseStage freed
    // EVERY slot, but v1 moved the whole gen together; Chris's per-kid flow
    // lets a waiting kid take the freed piece the moment its rider leaves.)
    var spots = deskSpots();
    if (!spots.length) return; // no desk to go to — the gen stays where it is
    var schoolKids0 = g.kids.filter(function (a) { return a.rode && a.m <= KID_SCALE && !a.schooled; });
    if (!schoolKids0.length) return; // nobody has ridden yet — the gen stays where it is
    schoolKids0.forEach(function (a) { if (a.slot) a.slot = null; if (a.state === 'ride') a.state = 'idle'; });
    g.stage = 'kidschool'; g.phase = 'move';
    // v43 (drawer rule): only reset the school assignment for kids who
    // have NOT grown yet. A grown-up ant KEEPS his schoolDesk — he is
    // still standing at his desk (occupying it), and clearing it here
    // would wrongly free that desk for another kid. Schooled kids never
    // go to school again, so skipping them changes nothing for this trip.
    g.kids.forEach(function (a) { if (!a.schooled) { a.toSchool = false; a.schoolDesk = null; } });
    var schoolKids = g.kids.filter(function (a) { return a.rode && a.m <= KID_SCALE && !a.schooled; });
    schoolKids.forEach(function (a, i) {
      if (i < spots.length) {
        a.toSchool = true; a.schoolDesk = spots[i].desk.uid;
        walkAnt(a, { x: spots[i].x, y: spots[i].y });
      } else {
        // no free desk for this kid — he waits near where he was born
        walkAnt(a, { x: g.bx + (g.kids.indexOf(a) - 0.5) * 14, y: g.by + 6 });
      }
    });
    // Kids who never rode stay where they are (idle near the birth area).
  }
  function startGrow(g) { // v1 startGrow
    g.phase = 'grow'; g.growEnd = QT + CYCLE1.GROW_S;
    // v30 fix 4: only the kids who WENT to school grow — a kid who waited
    // near the birth area (never rode, or no free desk) stays a kid until
    // his own school trip.
    g.kids.forEach(function (a) { if (a.toSchool && a.m <= KID_SCALE && !a.schooled) { a.state = 'grow'; a.growT0 = QT; } });
  }
  function tryAssignIdleKids(g) {
    // v39 (Chris's capacity rule): an idle kid takes a park slot whenever
    // one is FREE — a piece a rider just got off is FREED, not used up, so
    // the waiting kid takes it the moment it frees, even while a sibling is
    // at school (the gen may be in 'kidschool' stage). He does NOT wait for
    // a NEW item. Only kids who have NOT yet ridden take a slot — a kid who
    // already rode has had his turn and moves on to school instead. One kid
    // per slot, per piece. (parkSlots lists every BUILT piece; slotTaken is
    // the occupancy check — a piece is free when no kid is walking to it or
    // riding it.)
    if (!g) return;
    var slots = parkSlots();
    for (var i = 0; i < g.kids.length; i++) {
      var a = g.kids[i];
      if (a.state !== 'idle' || a.slot || a.rode || a.m > KID_SCALE || a.schooled) continue;
      for (var j = 0; j < slots.length; j++) {
        if (slotTaken(slots[j].p.uid, slots[j].k)) continue;
        var spot = rideSpot(slots[j].p, slots[j].piece, slots[j].k);
        a.slot = slots[j];
        walkAnt(a, { x: spot.x, y: spot.y });
        break;
      }
    }
  }
  function deskFree() {
    // A built desk no kid is currently at (schoolDesk) — a slot for a
    // leftover kid's school trip. (v39: deskSpots already filters out desks
    // a kid is at school on, so the first spot is a free desk. v43: a desk
    // does NOT free when its kid grows — the grown ant stays at it, so a
    // waiting kid takes a freed desk only when its ant leaves for the next
    // thing, or a NEW desk is built.)
    var spots = deskSpots();
    return spots.length ? spots[0].desk : null;
  }
  function tryAssignSchool(g) {
    // v30 fix 4 (Chris): a kid who RODE but never got a desk (too few desks)
    // gets his school trip when a desk FREES (its ant left for the next
    // thing) or a new desk is built. Never interrupts an active playground
    // stage (move/stall). (v39: deskFree returns a built desk no kid is at
    // school on — a freed desk counts, not only a newly built one. v43: a
    // desk does NOT free when its kid grows — the grown ant stays at it.)
    if (!g || g.stage === 'kidschool' || g.phase === 'move' || g.phase === 'stall') return;
    var left = g.kids.some(function (a) { return a.rode && a.m <= KID_SCALE && !a.schooled; });
    if (!left) return;
    if (!deskFree()) return;
    goToSchool(g);
  }
  function wanderIdleKids(g) {
    // v30 fix 4 (Chris): the idle baby ant "can walk around a bit" near
    // where he was born. An idle kid who has not ridden yet, in the nursery
    // or playground stage and not in the middle of a move, takes a short
    // wander near the birth spot every few seconds.
    if (!g || g.phase === 'move' || g.phase === 'grow' || g.phase === 'done') return;
    if (g.stage !== 'nursery' && g.stage !== 'playground') return;
    var bx = (g.bx != null) ? g.bx : ENTRANCE.x, by = (g.by != null) ? g.by : ENTRANCE.y;
    for (var i = 0; i < g.kids.length; i++) {
      var a = g.kids[i];
      if (a.state !== 'idle' || a.slot || a.rode || a.m > KID_SCALE || a.schooled || a.toSchool) continue;
      if (QT < a.wanderAt) continue;
      a.wanderAt = QT + 4 + Math.random() * 4;
      walkAnt(a, { x: bx + (Math.random() * 2 - 1) * 18, y: by + 6 + (Math.random() * 2 - 1) * 6 });
    }
  }
  function checkSlidePass(g) {
    // Chris: the desk unlocks when the ants complete their FIRST PASS on the
    // slide — one full slide loop (v1: 123 frames @ 12 fps = 10.25s), counted
    // from the moment the kid arrives on the slide (arrT).
    // v30 fix 2: this runs on EVERY stepKids tick for every playground-stage
    // gen, whatever the gen's phase — it used to run only inside the 12 s
    // 'stall' phase, so if the stall ended (or the gen was in another phase)
    // before the loop finished, the desk never unlocked.
    // v32 fix 2: the desk lives on its OWN school tab (not the park tab).
    // The school tab opens the moment the first slide pass completes, and
    // the menu switches to it so he SEES the desk appear (it was easy to
    // miss while another tab was showing). No switch while he is placing an
    // item (mode 'carrying'), so a placement is never interrupted.
    if (firstSlidePass) return;
    for (var i = 0; i < g.kids.length; i++) {
      var a = g.kids[i];
      if (a.state === 'ride' && a.slot && a.slot.piece === 'slide' && a.arrT != null) {
        if (QT - a.arrT >= PLAY_LOOP.slide.frames / PLAY_LOOP.slide.fps) {
          firstSlidePass = true;
          schoolUnlocked = true;
          if (mode !== 'carrying') activeTab = 'school'; // show the school tab (with the desk) the moment it unlocks
          renderMenu(); // the school tab appears, with the desk on it
          break;
        }
      }
    }
  }
  function stepKids(dt) {
    for (var i = 0; i < ANTS.length; i++) stepAnt(ANTS[i], dt);
    for (var j = 0; j < GENS.length; j++) {
      var g = GENS[j];
      if (g.stage === 'playground') checkSlidePass(g); // v30 fix 2: every tick, any phase — the desk unlocks the moment a kid finishes one full slide loop, not only inside the stall
      if (g.stage === 'playground' && g.phase === 'wait') {
        // v42 (Chris's occupancy rule): a rider does NOT get off just
        // because 12s elapsed. He stays ON his piece — it stays OCCUPIED —
        // until he actually leaves it for school (goToSchool, once a desk
        // is built). The timer running out does NOT free the piece, and the
        // school unlock does not move him off it. A waiting kid takes a
        // piece only when its rider physically leaves it. A leftover kid
        // who rode gets his school trip when a desk frees (tryAssignSchool).
        tryAssignIdleKids(g);
        tryAssignSchool(g);
      }
      wanderIdleKids(g); // v30 fix 4: idle kids wander a bit near the birth spot
      if (g.phase === 'move') {
        var arrived = g.kids.every(function (a) { return a.state !== 'walk'; });
        if (arrived) {
          g.phase = 'stall';
          g.until = QT + (g.stage === 'playground' ? CYCLE1.PLAY_S : g.stage === 'kidschool' ? CYCLE1.SCHOOL_S : 0);
        }
      } else if (g.phase === 'stall') {
        if (QT >= g.until) {
          if (g.stage === 'playground') {
            if (deskPlaced()) {
              goToSchool(g);
              // v45: goToSchool returns early (no free desk spot, or nobody
              // rode yet) WITHOUT moving the gen — do not leave it stuck in
              // 'stall' with until in the past, or tryAssignSchool (which
              // returns early for 'stall') can never retry when a desk
              // frees. Park it in 'wait' like the no-desk case below.
              if (g.stage === 'playground' && g.phase === 'stall') { g.phase = 'wait'; tryAssignIdleKids(g); }
            }
            else {
              // v42 (Chris's occupancy rule): the riders do NOT get off
              // when the stage ends. The timer running out does NOT free a
              // piece — a rider stays ON it (still occupying it) until he
              // physically leaves it for school, which only happens once a
              // desk is built (goToSchool). The slide stays occupied through
              // the whole window: while riding, after the timer runs out,
              // and while the desk is offered-but-not-built. A waiting kid
              // stays at the basket (tryAssignIdleKids finds no free slot).
              g.phase = 'wait'; // school next, once the desk is built
              tryAssignIdleKids(g);
            }
          } else if (g.stage === 'kidschool') {
            startGrow(g);
          }
        }
      } else if (g.phase === 'grow') {
        if (QT >= g.growEnd) {
          // v30 fix 4: only the kids who went to school grow. If some kids
          // still have not been to school (they never rode, or there was no
          // free desk), the gen is not done — they wait near the birth area
          // for a desk slot (tryAssignSchool) or a park slot.
          g.kids.forEach(function (a) {
            // v43 (Chris's DRAWER rule, Nov 17): when he grows up he STAYS
            // at the desk — he only gets out of the drawer when the player
            // builds the next thing he is going to, and there is no next
            // thing in checkpoint 3. So schoolDesk is KEPT (the desk stays
            // occupied by him; deskSpots treats it as busy). toSchool is
            // cleared so the ksDesk loop stops and the blue desk shows
            // again — that is drawing only, not occupancy. Do NOT clear
            // schoolDesk here and do NOT free the desk when he grows up.
            if (a.state === 'grow') { a.m = 1; a.state = 'idle'; a.schooled = true; a.toSchool = false; }
          });
          // CHECKPOINT 4 (Chris, Nov 17): the FIRST kid growing up opens
          // trade school — the trade tab appears (with the globe offered),
          // and the menu switches to it so he SEES it, like the school tab
          // on the first slide pass. No switch while he is placing an item.
          if (!tradeUnlocked) {
            tradeUnlocked = true;
            if (mode !== 'carrying') activeTab = 'trade';
            renderMenu();
          }
          var left = g.kids.some(function (a) { return a.m <= KID_SCALE && !a.schooled; });
          if (left) { g.stage = 'playground'; g.phase = 'wait'; }
          else g.phase = 'done'; // grown ants idle (no job rooms in checkpoint 3)
        }
      }
      // v39: per-kid capacity flow, every tick, any stage — a rider who has
      // ridden a full play stage (12s) gets off, and a waiting kid takes a
      // freed piece the moment it frees, even while a sibling is at school
      // (the gen may be in 'kidschool' stage). An ant moves on when there
      // is room for it in the next room. This is what makes the freed slide
      // get taken the moment its rider leaves for school, instead of waiting
      // for a NEW item to be built.
      stepKidFlow(g);
    }
    stepTrade(dt); // CHECKPOINT 4: training stalls end, miners dig, scouts come and go, soldiers patrol; idle grown ants take a free trade station
  }
  function stepKidFlow(g) {
    // v42 (Chris's occupancy rule): per-kid, every tick, any stage. A rider
    // stays ON his piece until goToSchool moves him to school — the 12s ride
    // ending does NOT get him off, and the piece is NOT freed on timer
    // expiry. The piece frees ONLY when its rider physically leaves it for
    // school (goToSchool) or the piece is erased/moved (releaseKidsFor). A
    // waiting kid takes a freed piece the moment its rider leaves, even
    // while a sibling is at school (the gen may be in 'kidschool' stage).
    // An ant moves on when there is room for it in the next room.
    tryAssignIdleKids(g);
    tryAssignSchool(g);
  }
  function hatchKids(p) {
    // v1 stepBaskets/onBasketHatched: 2 kids per basket, spawned at the
    // basket, then they walk to nursery idle spots. The FIRST hatch unlocks
    // the playground (the park tab). If park pieces are already built, the
    // new kids go straight to the playground (v1 afterHatch/goNext).
    p.egg = null; // the basket empties (v1: both eggs hatched -> empty)
    genN++;
    // v30 fix 4: the gen remembers its BIRTH SPOT (the basket it hatched
    // from) — an idle kid stays near it, never queues on a busy park item.
    var g = { id: genN, stage: 'nursery', phase: 'idle', kids: [], until: 0, growEnd: 0, bx: p.cx, by: p.floorY };
    GENS.push(g);
    var bx = p.cx, by = p.floorY;
    for (var i = 0; i < 2; i++) newKid(g, bx + (i === 0 ? -6 : 6), by + 2);
    if (!parkUnlocked) openPark();
    if (parkPiecesBuilt()) {
      goToPlayground(g);
    } else {
      g.kids.forEach(function (a, i) {
        walkAnt(a, { x: bx + (i === 0 ? -16 : 16), y: by + 6 });
      });
    }
  }
  function releaseKidsFor(p) {
    // A park piece / desk was erased or picked up to move: free any kid
    // riding it or walking to it. Erasing the desk cancels the school stage
    // (the gen waits for the desk to be built again).
    for (var i = 0; i < ANTS.length; i++) {
      var a = ANTS[i];
      if (a.slot && a.slot.p.uid === p.uid) {
        a.slot = null;
        if (a.state === 'ride' || a.state === 'walk') { a.path = []; a.state = 'idle'; }
      }
    }
    if (p.id === 'desk') {
      // v43 (drawer rule): schoolDesk now persists after grow (the grown
      // ant stays at his desk), so erasing/moving a desk must clear it for
      // ANY ant at that desk — including a grown-up ant standing at it —
      // or the (rebuilt/moved) desk would stay wrongly occupied by an ant
      // who is no longer there. A grown ant just stays idle where he is
      // (nowhere to go in checkpoint 3); a kid is walked back by the gen
      // loop below.
      for (var m = 0; m < ANTS.length; m++) {
        if (ANTS[m].schoolDesk === p.uid) { ANTS[m].schoolDesk = null; ANTS[m].toSchool = false; }
      }
      for (var j = 0; j < GENS.length; j++) {
        var g = GENS[j];
        if (g.stage === 'kidschool' && (g.phase === 'move' || g.phase === 'stall')) {
          g.stage = 'playground'; g.phase = 'wait';
          g.kids.forEach(function (a) {
            a.toSchool = false; a.schoolDesk = null; // no longer going to school
            if (a.state === 'walk') { a.path = []; a.state = 'idle'; }
            // a kid who was at the desk waits near where he was born
            if (a.rode && a.m <= KID_SCALE && !a.schooled) walkAnt(a, { x: g.bx + (g.kids.indexOf(a) - 0.5) * 14, y: g.by + 6 });
          });
        }
      }
    }
    // v39: a freed kid who never rode can take a FREED slot (a piece a rider just got off) — not only a newly built item.
    for (var k = 0; k < GENS.length; k++) tryAssignIdleKids(GENS[k]);
  }

  // ---- CHECKPOINT 4: skill training / trade school (Chris, Nov 17) ----
  // After a kid grows up at the desk he goes to trade school. Trade order:
  // MINER -> SCOUT -> SOLDIER — get at least to the soldier. The ants move
  // automatically (born -> park -> school -> trade school -> work); the
  // player builds the rooms and the ants move on their own. Bottlenecks
  // (more ants than items) are the fun. The DRAWER rule applies to every
  // trade item: while an ant is training at it, no other ant can use it;
  // it frees ONLY when he physically leaves it. A grown-up ant stays at
  // his desk until the next thing is built — when the globe is built he
  // leaves the desk for it (the desk frees for the next kid).
  var TRAIN_S = 8; // v1 CYCLE1.TRAIN_S — the training stall at every trade item
  var MINER_SPEED = (40 * 69 * 0.175 / 26.1) / 3; // v1's live scoutSpeed (SCOUT_WALK) / 3 = ~6.17 world/s — slow, 3x slower than a scout
  // v46 (Chris, Nov 17): the miner discovers a hexagon the way the scout
  // discovers a tile — GRADUALLY revealing the fog — but 10x SLOWER. The
  // fixed 10 s dig + instant clear is GONE. He digs at the edge (plain-work
  // animation + rocks flying) for the whole discovery, and the fog clears
  // progressively from his dig point across the hexagon until it is fully
  // discovered. Only then does it become buildable and does he pick the
  // next frontier hexagon. The discovery must be PRETTY SLOW to look cool.
  // The 10x rate, derived from v1 (simulated, Nov 17): the scout clears one
  // surface tile (311.67 x 526.53) in ~235.2 s — greedy nearest-fog walk at
  // SCOUT_WALK 18.5 world/s, clear radius SCOUT_R ~55, 4251 world units of
  // walking. 10x slower = 2352 s per hexagon (39.2 min). A hexagon is
  // 13.5x smaller than a tile, so this is deliberately very slow — the fog
  // visibly recedes over minutes while he digs, and the base grows over
  // hours. (If Chris wants it faster, this one number is the dial.)
  var MINE_DISCOVER_S = 2352; // seconds to fully discover ONE hexagon (10x the scout's ~235 s per tile)
  var FIRST_MINE_S = 120; // v48 (Chris, Nov 18): the FIRST hexagon the miner discovers takes only 2 minutes — so Chris can see a hexagon finish in one test session. Every hexagon after that takes the full MINE_DISCOVER_S.
  var minedCount = 0; // v48: how many hexagons the miner has fully cleared (0 = the next dig is the first one, 120 s)
  // v49 (Chris, Nov 18): the miner WALKS through the hexagon, carving a
  // path like the scout — the fog clears WHERE HE GOES (v1's nearestFog +
  // clearFogIn, ported from a surface tile to a hexagon). MINE_CLEAR_R is
  // the rock-fog clear radius around him as he walks (world units, like
  // v1's SCOUT_R ~55 — smaller, because a hexagon is 13.5x smaller than a
  // tile). MINE_PATH_PER_HEX is the expected path length (world units) he
  // walks to clear one hexagon — measured by simulation (greedy nearest-fog
  // walk, clear radius 20: 528-637 world depending on entry edge, mean ~580).
  // His dig speed is PATH/duration, so a hexagon takes ~its duration
  // (120 s first, 2352 s after). MINE_FOG_CLEAR is v1's FOG_CLEAR (a
  // fog-mask cell counts as fogged while above it).
  var MINE_CLEAR_R = 20;
  var MINE_FOG_CLEAR = 24;
  var MINE_PATH_PER_HEX = 580;
  var SCOUT_OUT_S = 20; // a scouting trip out of the hole lasts 20 s before he comes back in
  var GUARD_ARC = [165, 140, 115, 90, 65, 40, 15]; // v1 cp4 GUARD.ARC (degrees, around the hole)
  var GUARD_RX = 30, GUARD_RY = 16; // v1 cp4 GUARD.RX/RY (world units)
  var LOOP_S = 0.45296 * KW; // v1 SC (130/287): the training loops are drawn at this scale for a grown ant, as in v1
  var TRADE_ORDER = ['miner', 'scout', 'soldier'];
  // ---- the training loops (v1, copied unchanged — never rewritten) ----
  // ksGlobe / ksChalk / ksMap: port-b.js NP5 loops (anchor = the scene's
  // floor contact). Gym: cp3's loops (treadmill 16f @ 16 fps, curls and
  // bench 24f @ 8 fps), with their empty_equipment.png as the static item.
  function loadLoopFrames(loop) {
    var frames = [];
    for (var f = 0; f < loop.n; f++) {
      var im = new Image();
      im.src = loop.dir + String(f).padStart(2, '0') + '.png?v=49';
      frames.push(im);
    }
    loop.frames = frames;
    return loop;
  }
  var KS_GLOBE = loadLoopFrames({ dir: 'assets/portb/np5loops/globe/chris_ant_globe_', n: 32, fps: 8, ax: 318, ay: 334 });
  // v49 (Chris, Nov 18): the chalk and map training loops are the NEW
  // no-step composites (assets/items/ks-chalk-nostep, ks-map-nostep) — the
  // ant from v1's loops, composited onto the new square-chalkboard /
  // world-map easel, standing on the GROUND. v1's chalk loop had the ant on
  // a step (kept in assets/portb/np5loops/chalk, untouched); the map loop
  // was already step-free but had no map visible. Same frame counts, sizes
  // and anchors, so the training (8 s, desk-swap) is unchanged.
  var KS_CHALK = loadLoopFrames({ dir: 'assets/items/ks-chalk-nostep/chris_ant_chalkboard_', n: 32, fps: 8, ax: 150, ay: 413 });
  var KS_MAP = loadLoopFrames({ dir: 'assets/items/ks-map-nostep/chris_ant_point_map_', n: 24, fps: 8, ax: 150, ay: 343 });
  var KS_GYM = {
    treadmill: loadLoopFrames({ dir: 'assets/gym/treadmill_run/chris_ant_treadmill_run_', n: 16, fps: 16, ax: 220, ay: 394 }),
    curls: loadLoopFrames({ dir: 'assets/gym/dumbbell_curls/chris_ant_dumbbell_curls_', n: 24, fps: 8, ax: 150, ay: 334 }),
    bench: loadLoopFrames({ dir: 'assets/gym/bench_press/chris_ant_bench_press_', n: 24, fps: 8, ax: 230, ay: 308 })
  };
  // ---- the microscope training visual (created for checkpoint 4) ----
  // The microscope picture itself is generated (assets/items/microscope.png
  // — a microscope on a little counter desk). The training visual is a
  // second generated picture (an ant looking through the microscope); it is
  // ONE frame, not a loop — the microscope is not buildable in checkpoint 4,
  // so no ant ever trains at it yet, and a full multi-frame loop was not
  // warranted. It is drawn with a gentle idle bob while training, at the
  // grown ant's size (the ant in the frame is 1133 px tall; the grown ant
  // is 136*KW ≈ 23.5 world). Anchor = the desk's foot (0.72, 1.0 of the frame).
  var IMIC_TRAIN = new Image(); IMIC_TRAIN.src = 'assets/items/microscope-train.png?v=44';
  var MIC_TRAIN_S = 23.5 / 1133;
  function trainLoopFor(itemId) {
    if (itemId === 'globe') return KS_GLOBE;
    if (itemId === 'easelchalk') return KS_CHALK;
    if (itemId === 'easelmap') return KS_MAP;
    if (itemId === 'dumbbell') return KS_GYM.curls;
    if (itemId === 'treadmill') return KS_GYM.treadmill;
    if (itemId === 'benchpress') return KS_GYM.bench;
    return null; // microscope: the single-frame visual above, not a loop
  }
  function drawTrainLoop(loop, d, t0) {
    var idx = Math.floor((QT - t0) * loop.fps) % loop.n;
    if (idx < 0) idx += loop.n;
    var im = loop.frames[idx];
    if (!im || !im.complete || !im.naturalWidth) return false;
    var s = LOOP_S, w = im.naturalWidth * s, h = im.naturalHeight * s;
    ctx.drawImage(im, d.cx - loop.ax * s, d.floorY - loop.ay * s, w, h);
    return true;
  }
  function drawMicroscopeTrain(d) {
    if (!IMIC_TRAIN.complete || !IMIC_TRAIN.naturalWidth) return false;
    var s = MIC_TRAIN_S, w = IMIC_TRAIN.naturalWidth * s, h = IMIC_TRAIN.naturalHeight * s;
    var bob = Math.sin(QT * 7) * 0.3; // gentle idle bob while he looks through the scope
    ctx.drawImage(IMIC_TRAIN, d.cx - 0.72 * w, d.floorY - 1.0 * h + bob, w, h);
    return true;
  }
  function drawTrainAnt(a) {
    // v1 desk-swap pattern: while he trains, the static item is hidden and
    // the loop (ant + equipment together) plays at the item's spot instead.
    var tr = a.train;
    if (!tr) return;
    var p = placedByUid(tr.uid);
    if (!p) return;
    if (tr.itemId === 'microscope') {
      if (!drawMicroscopeTrain(p)) drawKidSprite('idle_' + pad2n(IDLE_PLAY[Math.floor((QT + a.ph) * IDLE_FPS) % IDLE_PLAY.length]) + '.png', a.x, a.y, false, a.m);
      return;
    }
    var loop = trainLoopFor(tr.itemId);
    if (loop) {
      if (!drawTrainLoop(loop, p, tr.t0)) drawKidSprite('idle_' + pad2n(IDLE_PLAY[Math.floor((QT + a.ph) * IDLE_FPS) % IDLE_PLAY.length]) + '.png', a.x, a.y, false, a.m);
    }
  }
  function tradeItemTraining(uid) {
    // a trade item with an ant TRAINING at it (the loop is drawn instead of
    // the static item). Walking there does not hide it yet — only training does.
    for (var i = 0; i < ANTS.length; i++) {
      var a = ANTS[i];
      if (a.state === 'train' && a.train && a.train.uid === uid) return true;
    }
    return false;
  }
  function drawTradeTrainTimer(now) {
    // v1 cp3: a timer tag over a training ant while his room timer runs.
    // The 8s training countdown above the trade item, in v1's drawTag style
    // (zero-padded mmss, white 11px bold, dark outline) — same as the desk timer.
    for (var i = 0; i < ANTS.length; i++) {
      var a = ANTS[i];
      if (a.state !== 'train' || !a.train) continue;
      var p = placedByUid(a.train.uid);
      if (!p) continue;
      var it = itemById(a.train.itemId);
      var h = it ? itemH(it) : p.w * 0.8;
      drawTag(p.cx, p.floorY - h - 8, brainMmss(a.train.until - QT), 1, 0);
    }
  }
  function drawMinerDigTimer(now) {
    // v47 fix 1 (Chris, Nov 18): "You're missing the timer on top of the
    // ant that is digging." The discovery countdown (the dig's duration —
    // 120 s for the first hexagon, MINE_DISCOVER_S = 2352 s after that,
    // v48) is drawn ABOVE the digging miner, in v1's drawTag
    // style (zero-padded mmss, white 11px bold, dark outline) — the same
    // "above the ant" offset as the other stage timers (top - 8). His feet
    // are at a.y and his head is 41*PW_S above it (the grown-ant height the
    // plain-work strip is drawn at, same formula as drawMinerDig), so the
    // timer sits at a.y - 41*PW_S - 8. It counts down from the full
    // discovery time and stays visible (brainMmss clamps at 00:00) for the
    // whole time he digs that hexagon; it vanishes when he finishes it
    // (finishDig clears a.mine) and reappears over the next one.
    for (var i = 0; i < ANTS.length; i++) {
      var a = ANTS[i];
      if (a.state !== 'dig' || !a.mine || a.mine.digT0 == null) continue;
      var dur = (a.mine.dur != null) ? a.mine.dur : MINE_DISCOVER_S; // v48: the first hexagon is 120 s, later ones 2352 s
      // v49: the timer is the FOG FRACTION — it hits 00:00 exactly when the
      // hexagon finishes (the miner clears the fog by walking, so the time
      // left is the fog left, not a fixed clock). Falls back to the clock
      // when the fog mask is empty (fogTotal 0 — no fog to clear).
      var left;
      if (a.mine.fogTotal > 0) left = dur * Math.max(0, (a.mine.fogLeft != null ? a.mine.fogLeft : a.mine.fogTotal)) / a.mine.fogTotal;
      else left = dur - (QT - a.mine.digT0);
      var PW_S = (2 * 68 * KW) / 41; // grown-ant scale, same as drawMinerDig
      drawTag(a.x, a.y - 41 * PW_S - 8, brainMmss(left), 1, 0);
    }
  }
  // ---- the trade assignment (drawer rule, capacity rule) ----
  // A grown-up ant (schooled, adult size, no job yet) takes the earliest
  // trade in order (miner -> scout -> soldier) that has NO worker yet and a
  // built, free station; if every trade already has a worker, he takes any
  // free station (a second miner, a second scout...). A station is a BUILT
  // trade item no ant is training at or walking to — the drawer rule, per
  // item. If nothing is free he waits where he is (at the desk).
  function tradeStations(trade) {
    var out = [];
    for (var i = 0; i < placed.length; i++) {
      var p = placed[i], it = itemById(p.id);
      if (it && it.trade === trade && !p.building) out.push(p);
    }
    return out;
  }
  function tradeItemBusy(uid) {
    for (var i = 0; i < ANTS.length; i++) {
      var a = ANTS[i];
      if (a.tradeItem === uid && a.state !== 'gone') return true;
    }
    return false;
  }
  function tradeFreeStation(trade) {
    var sts = tradeStations(trade);
    for (var i = 0; i < sts.length; i++) if (!tradeItemBusy(sts[i].uid)) return sts[i];
    return null;
  }
  function tradeHasWorker(trade) {
    for (var i = 0; i < ANTS.length; i++) {
      var a = ANTS[i];
      if (a.job === trade && a.state !== 'gone') return true;
    }
    return false;
  }
  // v47 (Chris, Nov 18): how many ants already work a trade. A second
  // worker for a trade needs a SECOND station (more miners = more globes).
  function tradeWorkerCount(trade) {
    var n = 0;
    for (var i = 0; i < ANTS.length; i++) { var a = ANTS[i]; if (a.job === trade && a.state !== 'gone') n++; }
    return n;
  }
  function goToTrade(a, p, trade) {
    // Leaving the desk frees it: the drawer rule — he physically leaves the
    // desk for the next thing (the trade item), so the next kid can use it.
    a.schoolDesk = null; a.toSchool = false;
    a.job = trade; a.tradeItem = p.uid;
    walkAnt(a, { x: p.cx, y: p.floorY }, function () { startTrain(a, p, trade); });
  }
  function tryAssignTrade(a) {
    if (!a || a.job || a.state !== 'idle' || a.m <= KID_SCALE || !a.schooled) return false;
    for (var t = 0; t < TRADE_ORDER.length; t++) {
      var trade = TRADE_ORDER[t];
      if (tradeHasWorker(trade)) continue;
      var st = tradeFreeStation(trade);
      if (st) { goToTrade(a, st, trade); return true; }
    }
    // v47 (Chris, Nov 18): the fallback only sends a SECOND worker to a
    // trade when there is a SECOND station for it. Without this guard it
    // sent a second ant to the SAME globe once the first miner finished
    // training and left it (the globe looked free — finishTrain clears
    // tradeItem — so the station was free but the trade already had its
    // miner): three miners from one globe, and the ?checkpoint=4 shortcut
    // (three ants, one per trade) broke. One station = one worker.
    for (var u = 0; u < TRADE_ORDER.length; u++) {
      var tradeU = TRADE_ORDER[u];
      if (tradeWorkerCount(tradeU) >= tradeStations(tradeU).length) continue;
      var st2 = tradeFreeStation(tradeU);
      if (st2) { goToTrade(a, st2, tradeU); return true; }
    }
    return false;
  }
  function tryAssignTrades() {
    for (var i = 0; i < ANTS.length; i++) tryAssignTrade(ANTS[i]);
  }
  function startTrain(a, p, trade) {
    a.state = 'train'; a.arrT = QT;
    a.train = { uid: p.uid, itemId: p.id, trade: trade, t0: QT, until: QT + TRAIN_S };
  }
  function finishTrain(a) {
    var tr = a.train;
    a.train = null; a.tradeItem = null; // the drawer frees: he physically leaves the item
    a.state = 'idle'; a.arrT = QT;
    if (!tr) return;
    if (tr.trade === 'miner') startMining(a);
    else if (tr.trade === 'scout') startScouting(a);
    else if (tr.trade === 'soldier') startGuarding(a);
  }
  // ---- the miner's job (Chris, Nov 17) ----
  // After training he mines the brown rock fog ONE hexagon at a time, SLOW.
  // He picks a hexagon AT RANDOM among the frontier — the fogged cells
  // touching the exposed area — walks to its EDGE, digs (120 s for the
  // first hexagon, MINE_DISCOVER_S = 2352 s after that — v48), and the
  // hexagon is discovered progressively until it is fully discovered, then
  // it joins the exposed area (BASE_FOG.clearHex) and he picks the next
  // one. When no frontier hexagon is left (all 23 cleared) he idles.
  // v45 (Chris): he digs from the EDGE, never the centre. He stops the
  // moment he TOUCHES the edge — the point where the straight line from the
  // hexagon's centre to where he is coming from crosses the boundary — and
  // the digging animation begins there. (The old code walked him to the
  // hexagon's centre.)
  // v46 (Chris): the discovery is 10x SLOWER than the scout's tile
  // discovery (MINE_DISCOVER_S = 2352 s per hexagon after the first) —
  // the digging animation + rocks flying play the WHOLE time, and the fog
  // is revealed gradually, not all at once. v48: the FIRST hexagon takes
  // only 120 s (FIRST_MINE_S), so Chris can see one finish in a test session.
  // v49 (Chris, Nov 18): he WALKS through the hexagon, carving a path like
  // the scout — he targets the nearest fogged spot inside the hexagon,
  // walks to it, and the rock fog clears in a radius around him as he moves
  // (v1's nearestFog + clearFogIn, ported from a surface tile to a hexagon).
  // The fog clears WHERE HE GOES, so the cleared area is a path he carves
  // — not a circle growing from a fixed point (v46-v48). His walk speed is
  // set at dig start (PATH/duration) so the hexagon takes ~its duration.
  function hexEdgePoint(cx, cy, w, fromX, fromY) {
    // Point on the hexagon's boundary closest to (fromX, fromY): the
    // intersection of the ray from the centre toward (fromX, fromY) with
    // the hexagon's edge. The six edge normals are the same ones hexDist
    // uses (30, 90, 150, 210, 270, 330 deg); the ray exits through the
    // edge whose normal has the largest dot product with the ray, at
    // distance apothem / cos(angle-to-that-normal) from the centre.
    var dx = fromX - cx, dy = fromY - cy;
    var L = Math.sqrt(dx * dx + dy * dy);
    if (L < 1e-6) return { x: cx + w / 2, y: cy }; // degenerate: standing on the centre already
    var ux = dx / L, uy = dy / L;
    var a = w * Math.sqrt(3) / 4; // apothem (see hexDist)
    var s3 = Math.sqrt(3) / 2;
    var ns = [[s3, 0.5], [0, 1], [-s3, 0.5], [-s3, -0.5], [0, -1], [s3, -0.5]];
    var m = -Infinity, i, d;
    for (i = 0; i < 6; i++) { d = ux * ns[i][0] + uy * ns[i][1]; if (d > m) m = d; }
    var t = a / m; // distance from the centre to the boundary along the ray
    return { x: cx + ux * t, y: cy + uy * t };
  }
  // v49: the fog inside one hexagon, counted and targeted (v1's nearestFog
  // + FOG_CLEAR, ported from a surface tile to a hexagon). A fog-mask cell
  // counts as fogged while it is WELL INSIDE the hexagon (past the soft
  // feather at the edge — the feather is cosmetic, not fog to clear) and its
  // mask value is above MINE_FOG_CLEAR. The mask is only ever lowered, so
  // these counts only ever fall.
  function countFogInHex(cell) {
    var R = HEXW / 2 + FOG_FEATHER, f2 = FOG_FEATHER / 2;
    var i0 = Math.max(0, Math.floor((cell.x - R) / FOG_FC)), i1 = Math.min(FOG_FW - 1, Math.ceil((cell.x + R) / FOG_FC));
    var j0 = Math.max(0, Math.floor((cell.y - R) / FOG_FC)), j1 = Math.min(FOG_FH - 1, Math.ceil((cell.y + R) / FOG_FC));
    var n = 0, i, j, k, px, py;
    for (j = j0; j <= j1; j++) {
      for (i = i0; i <= i1; i++) {
        px = i * FOG_FC + FOG_FC / 2; py = j * FOG_FC + FOG_FC / 2;
        if (hexDist(px, py, cell.x, cell.y, HEXW) >= -f2) continue;
        k = j * FOG_FW + i;
        if (fogMask[k] > MINE_FOG_CLEAR) n++;
      }
    }
    return n;
  }
  function nearestFogHex(cell, x, y) {
    // The nearest still-fogged fog-mask cell centre inside hexagon cell
    // (v1's nearestFog). Returns null when the hexagon's interior is fully
    // revealed — that is the dig's completion, not a timer.
    var R = HEXW / 2 + FOG_FEATHER, f2 = FOG_FEATHER / 2;
    var i0 = Math.max(0, Math.floor((cell.x - R) / FOG_FC)), i1 = Math.min(FOG_FW - 1, Math.ceil((cell.x + R) / FOG_FC));
    var j0 = Math.max(0, Math.floor((cell.y - R) / FOG_FC)), j1 = Math.min(FOG_FH - 1, Math.ceil((cell.y + R) / FOG_FC));
    var best = null, bd = Infinity, i, j, k, px, py, dd;
    for (j = j0; j <= j1; j++) {
      for (i = i0; i <= i1; i++) {
        px = i * FOG_FC + FOG_FC / 2; py = j * FOG_FC + FOG_FC / 2;
        if (hexDist(px, py, cell.x, cell.y, HEXW) >= -f2) continue;
        k = j * FOG_FW + i;
        if (fogMask[k] <= MINE_FOG_CLEAR) continue;
        dd = (px - x) * (px - x) + (py - y) * (py - y);
        if (dd < bd) { bd = dd; best = { x: px, y: py }; }
      }
    }
    return best;
  }
  function startMining(a) {
    var cell = pickFrontierCell();
    if (!cell) { a.state = 'idle'; return; }
    var edge = hexEdgePoint(cell.x, cell.y, HEXW, a.x, a.y);
    a.mine = { cell: cell, phase: 'walk', edge: edge };
    a.spd = MINER_SPEED;
    walkAnt(a, edge, function () {
      a.spd = null;
      a.state = 'dig'; a.mine.phase = 'dig'; a.mine.digT0 = QT;
      a.mine.dur = (minedCount === 0) ? FIRST_MINE_S : MINE_DISCOVER_S; // v48: the first hexagon takes 120 s, later ones 2352 s (fixed at dig start, so the timer and the walk use one duration)
      // v49: his dig-walk speed is set so the hexagon takes ~its duration
      // (PATH/duration), and the fog to clear is counted now (for the timer).
      a.mine.spd = MINE_PATH_PER_HEX / a.mine.dur;
      a.mine.fogTotal = countFogInHex(cell);
      a.mine.fogLeft = a.mine.fogTotal;
      a.mine.target = null;
      a.mine.lastSync = QT;
    });
  }
  function finishDig(a) {
    var cell = a.mine.cell;
    clearedCells[cell.k] = true;
    minedCount++; // v48: this hexagon is done — the next dig is a later one (2352 s)
    if (window.BASE_FOG) BASE_FOG.clearHex(cell.x, cell.y, HEXW);
    a.mine = null; a.state = 'idle';
    startMining(a); // the next frontier hexagon (or idle if none is left)
  }
  function drawMinerDig(a) {
    // v46: the miner digs with ALBERT's digging animation — v1's adult-ant
    // "work" strip (assets/plain-work.webp: 6 frames @ 8 fps, 64x61/frame).
    // Side profile facing left, hands moving, dirt dots kicked up behind
    // him to the left. NO hard hat, NO crown — bare-headed (Chris, Nov 17:
    // the hard hat in his screenshot is a separate overlay strip,
    // hatM-work.webp — the digging itself has no hat). The v45 side strip
    // (queen-dig-side.webp, the queen WITH A CROWN) is no longer the
    // miner's dig; the front strip (queen-dig.webp, art.dig) stays the
    // QUEEN's dig (room builds).
    // SIZE (Chris: "you know what size to make it"): the miner is a GROWN
    // ant (Albert size). Measured (PIL, alpha>=32): the ant's visible
    // height is 41 px at most (rows 0..40; the head bobs 0..8 as he digs),
    // feet at row 40. A grown ant is drawn 23.53 world tall (kid visible
    // 68 px x 2 x KW), so the strip is drawn at PW_S = 23.53/41 world per
    // frame px — the digging ant is exactly Albert size, not kid size.
    // The digging animation plays the WHOLE discovery, with the dirt dots
    // baked into the strip flying behind him the whole time (v46: the slow
    // progressive reveal — the animation never stops until the hexagon is
    // fully discovered). v48: no dustAt cloud (Chris — it looked like a
    // little tornado); the strip's own dirt dots are the whole effect.
    // The discovery is 120 s for the first hexagon, 2352 s after that (v48).
    var strip = art.plainWork;
    if (!strip || !strip.complete || !strip.naturalWidth) {
      drawKidSprite('idle_' + pad2n(IDLE_PLAY[Math.floor((QT + a.ph) * IDLE_FPS) % IDLE_PLAY.length]) + '.png', a.x, a.y, false, a.m);
      return;
    }
    var t0 = (a.mine && a.mine.digT0 != null) ? a.mine.digT0 : QT;
    var f = Math.floor((QT - t0) * 8) % 6;
    if (f < 0) f += 6;
    var PW_VIS_H = 41; // max visible ant height in the strip, px (rows 0..40, alpha>=32)
    var PW_S = (2 * 68 * KW) / PW_VIS_H; // grown-ant height (23.53 world) / 41 px
    var W = 64 * PW_S, H = 61 * PW_S;
    // Face the hexagon he is digging. v47 fix 2 (Chris, Nov 18): he was
    // digging BACKWARDS — the flip was inverted. The plain-work strip
    // faces RIGHT by default (verified by looking at the frames: the ant's
    // head, eye and antennae are on the RIGHT, the abdomen on the LEFT,
    // the baked-in dirt dots behind him to the LEFT). So when the hexagon
    // is to his right he needs NO flip, and when it is to his left he is
    // flipped. The old code did the opposite (flipped when the hex was
    // right), so he faced AWAY from the hexagon in both directions.
    // (v48: the dustAt puffs that used to sit behind him are gone — the
    // strip's own baked-in dirt dots are the whole effect now.)
    // v49: he faces the fogged spot he is digging toward (his target), so he
    // digs INTO the fog as he walks — not just the hexagon's centre. (The
    // v47 fix still holds: plain-work faces RIGHT by default, so no flip
    // when the target is right, flip when it is left.)
    var m = a.mine;
    var faceRight;
    if (m && m.target && Math.abs(m.target.x - a.x) > 1) faceRight = m.target.x > a.x;
    else faceRight = !!(m && m.cell && m.cell.x > a.x);
    ctx.save();
    ctx.translate(a.x, a.y);
    ctx.scale(faceRight ? 1 : -1, 1);
    // Feet (frame row 40, bottom edge row 41) land on a.y; frame centred on a.x.
    ctx.drawImage(strip, f * 64, 0, 64, 61, -W / 2, -PW_VIS_H * PW_S, W, H);
    ctx.restore();
    // v48 (Chris, Nov 18): NO dust cloud on the digging miner — the v1
    // dustAt puffs here looked like "a little tornado cloud" and he
    // doesn't want it. The dirt kicked up behind him is the dirt dots
    // BAKED INTO the plain-work strip itself (he likes those), so the
    // strip alone is the whole effect. dustAt itself stays (the build
    // cloud still uses it) — only the miner's call is gone.
  }
  // ---- the scout's job (Chris, Nov 17) ----
  // After training he goes OUT INTO THE WORLD: he walks up through the
  // spiral hole, scouts (out of sight for SCOUT_OUT_S), comes back in, and
  // goes out again. No threat, no seed mechanic in checkpoint 4.
  // v49 (Chris, Nov 18): while he is out he is VISIBLE upstairs, wandering
  // the surface around the mound hole doing his job — so Chris can SEE him
  // when he goes up. (Before v49 he was hidden everywhere while out, so
  // upstairs there was no scout to find.) The surface hole is the mound at
  // the entrance hexagon's grid centre (HEX.cx, HEX.cy) — the surface is
  // directly above the basement. There is no surface-fog system in the base
  // layer yet, so he walks/explores; he does not clear surface fog (v1's
  // surface fog + seeds are a later checkpoint's system — NOT invented here).
  var SURFACE_HOLE = { x: HEX.cx, y: HEX.cy }; // the mound hole, upstairs (world coords)
  var SCOUT_UP_SPEED = 40 * 69 * 0.175 / 26.1; // v1's scout walk speed on the surface (~18.5 world/s)
  function pickScoutUpTarget(a) {
    // a random spot near the mound hole to wander to (v1's scout wanders
    // the surface). Close enough to the hole that Chris can always find him.
    var ang = Math.random() * Math.PI * 2, r = 30 + Math.random() * 110;
    a.scoutUp.tx = SURFACE_HOLE.x + Math.cos(ang) * r;
    a.scoutUp.ty = SURFACE_HOLE.y + Math.sin(ang) * r * 0.7; // slightly squashed vertically (the mound reads wider than tall on screen)
  }
  function drawUpScout(now) {
    // v49: draw every scout who is OUT, on the surface (drawSurface calls
    // this inside applyWorld, so these are world coords). Grown-ant size,
    // walking sprite while he wanders the mound. The basement draw skips
    // him (he is hidden downstairs while out) — this is the only place he
    // is drawn while out.
    for (var i = 0; i < ANTS.length; i++) {
      var a = ANTS[i];
      if (a.job !== 'scout' || a.state !== 'out' || !a.scoutUp) continue;
      var su = a.scoutUp;
      drawKidSprite('side_' + pad2n(Math.floor(su.wf) % 16) + '.png', su.x, su.y, su.flip, 1); // grown ant (m = 1)
    }
  }
  function startScouting(a) {
    walkAnt(a, { x: BC.HOLE_W.x, y: BC.HOLE_W.y }, function () {
      a.state = 'out'; a.hidden = true; a.scoutBackAt = QT + SCOUT_OUT_S;
      // v49: he is OUT on the surface now — give him a surface position at
      // the mound hole so he can be drawn (and wander) upstairs.
      a.scoutUp = { x: SURFACE_HOLE.x, y: SURFACE_HOLE.y, tx: null, ty: null, flip: false, wf: 0 };
      pickScoutUpTarget(a);
    });
  }
  function returnScout(a) {
    a.hidden = false; a.scoutBackAt = null; a.scoutUp = null; // v49: he is back downstairs — no surface position any more
    walkAnt(a, { x: ENTRANCE.x + 10, y: ENTRANCE.y + 6 }, function () {
      a.state = 'idle'; a.arrT = QT;
      a.scoutNextOut = QT + 5; // a short pause at home, then out again
    });
  }
  // ---- the soldier's job (Chris, Nov 17) ----
  // After training he GUARDS: he patrols the mound on v1 cp4's GUARD arc
  // around the hole (RX 30, RY 16, angles 165..15, back and forth). NO
  // THREAT in checkpoint 4 — he patrols only; the attacks come in a future
  // checkpoint.
  function guardPoint(k) {
    var th = GUARD_ARC[k] * Math.PI / 180;
    return { x: BC.HOLE_W.x + GUARD_RX * Math.cos(th), y: BC.HOLE_W.y - GUARD_RY * Math.sin(th) };
  }
  function startGuarding(a) {
    a.guardIdx = 0; a.guardDir = 1;
    patrolNext(a);
  }
  function patrolNext(a) {
    walkAnt(a, guardPoint(a.guardIdx), function () {
      a.guardIdx += a.guardDir;
      if (a.guardIdx >= GUARD_ARC.length - 1) a.guardDir = -1;
      else if (a.guardIdx <= 0) a.guardDir = 1;
      patrolNext(a);
    });
  }
  // ---- the trade driver (runs every tick from stepKids) ----
  function stepTrade(dt) {
    for (var i = 0; i < ANTS.length; i++) {
      var a = ANTS[i];
      if (a.state === 'train' && a.train && QT >= a.train.until) finishTrain(a);
      else if (a.state === 'dig' && a.mine && a.mine.phase === 'dig') {
        // v49 (Chris): the miner WALKS through the hexagon, carving a path
        // like the scout (v1's search loop: target the nearest fogged spot,
        // walk to it, clear the fog in a radius around himself as he moves).
        // The fog clears WHERE HE GOES — the cleared area is a path he
        // carves, not a circle growing from a fixed point (v46-v48). When
        // no fogged cell is left inside the hexagon, finishDig runs (it
        // joins the exposed area, buildable). The durations stay (120 s
        // first, 2352 s after — v48); his walk speed is set at dig start so
        // the hexagon takes ~its duration.
        var m = a.mine, cell = m.cell;
        if (!m.target) {
          var n = nearestFogHex(cell, a.x, a.y);
          if (!n) { finishDig(a); }
          else m.target = n;
        }
        if (a.state === 'dig' && m.target) {
          // walk toward the nearest fogged spot at the miner's dig speed
          var dx = m.target.x - a.x, dy = m.target.y - a.y, d = Math.hypot(dx, dy);
          var step = Math.min((m.spd || MINER_SPEED) * dt, d);
          if (d > 1e-6) {
            a.x += dx / d * step; a.y += dy / d * step;
            if (Math.abs(dx) > 0.3) a.flip = dx < 0;
            a.wf += step / (KSTEP * K_SIDE_AD * a.m * KW);
          }
          // the rock fog clears in a radius around him as he moves (v1
          // clearFogIn, clamped to the hexagon — never outside it). The
          // mask edit is cheap; the full fog-canvas redraw is not, so it is
          // synced every 0.5 s, not every tick.
          clearFogHexPartialMask(cell.x, cell.y, HEXW, a.x, a.y, MINE_CLEAR_R);
          if (QT - (m.lastSync || 0) >= 0.5) { m.lastSync = QT; fogMaskToCanvas(); }
          if (step >= d - 1e-6) m.target = null; // reached the fogged spot; pick the next one
          m.fogLeft = countFogInHex(cell); // for the timer (fog fraction)
        }
        // safety net (fog mask empty/broken, v48 behaviour): if there was
        // no fog to clear at dig start, finish on the clock instead.
        if (a.state === 'dig' && a.mine && (a.mine.fogTotal || 0) <= 0 && (QT - a.mine.digT0) >= ((a.mine.dur != null) ? a.mine.dur : MINE_DISCOVER_S)) finishDig(a);
      }
      else if (a.job === 'scout' && a.state === 'out' && a.hidden && a.scoutBackAt != null && QT >= a.scoutBackAt) returnScout(a);
      else if (a.job === 'scout' && a.state === 'out' && a.hidden && a.scoutUp) {
        // v49 (Chris, Nov 18): while he is out, he wanders the surface
        // around the mound hole doing his job — so Chris can SEE him
        // upstairs. (The return branch above runs first when his 20 s are
        // up; this branch runs on every other tick while he is out.)
        var su = a.scoutUp;
        if (su.tx == null) pickScoutUpTarget(a);
        var sdx = su.tx - su.x, sdy = su.ty - su.y, sd = Math.hypot(sdx, sdy);
        var sstep = Math.min(SCOUT_UP_SPEED * dt, sd);
        if (sd > 1e-6) {
          su.x += sdx / sd * sstep; su.y += sdy / sd * sstep;
          if (Math.abs(sdx) > 0.3) su.flip = sdx < 0;
          su.wf += sstep / (KSTEP * K_SIDE_AD * 1 * KW); // grown ant (m = 1)
        }
        if (sstep >= sd - 1e-6) pickScoutUpTarget(a); // reached the spot; wander to a new one
      }
      else if (a.job === 'scout' && a.state === 'idle' && a.scoutNextOut != null && QT >= a.scoutNextOut) { a.scoutNextOut = null; startScouting(a); }
    }
    tryAssignTrades();
  }
  function releaseTradeFor(p) {
    // A trade item was erased or picked up to move: an ant walking to train
    // there, or training there, loses the spot — his job is cancelled (he
    // never trained) and he idles, so tryAssignTrade can send him elsewhere.
    // An ant who already finished training keeps his job: his work does not
    // need the item any more (the miner's hex, the scout's hole, the
    // soldier's arc are all independent of it).
    for (var i = 0; i < ANTS.length; i++) {
      var a = ANTS[i];
      if (a.tradeItem === p.uid || (a.train && a.train.uid === p.uid)) {
        a.tradeItem = null; a.train = null; a.job = null;
        if (a.state === 'train' || a.state === 'walk') { a.path = []; a.state = 'idle'; }
      }
    }
  }

  // ---- CHECKPOINT 2: the four item reactions (v1 queenScript, at placed positions) ----
  // The 4 items ARE the 4 rooms without walls (bed = royal, fridge = kitchen,
  // cooler = water, basket = nursery). Each reaction uses its PLACED position
  // in the entrance hexagon, not a fixed room spot. The bed gate opens when
  // she settles on the bed (openBedGate); the other reactions unlock nothing —
  // after the bed, the three are buildable in any order. The reactions run only
  // after the item is built (the cloud is gone); the build sequence calls
  // them. While she eats, leaves fly from the fridge to the FOOD meter; while
  // she drinks, droplets fly from the cooler to the WATER meter (v1 flyIcons).
  // v1's doLay needs the whole egg/generation system, so the basket is walk ->
  // wait (the lay wait) -> return home; no eggs appear yet.
  function itemSpot(id, cx, floorY) {
    // Bed: ON the bed (v1 royal: feet ~17.5% up from the bed's foot).
    // Others: just in front of the item.
    if (id === 'leafbed') {
      var it = itemById(id);
      var h = it ? itemH(it) : 0;
      return { x: cx, y: floorY - h * 0.175 };
    }
    return { x: cx, y: floorY + 6 };
  }
  // ---- CHECKPOINT 2: flying eat/drink icons (v1 flyIcons, index.html ~973-978) ----
  // v1: 5 leaves fly from the fridge/counter to the FOOD meter while she eats
  // (3s), 5 droplets fly from the cooler/tank to the WATER meter while she
  // drinks (3s). Same icons, same count (5), same stagger (175ms) and flight
  // (750ms) as v1, same keyframes (up-arc then to the target). The target is
  // the meter row's icon at the top of the screen — the leaves fly UP TO THE
  // RIGHT into the food meter, the droplets into the water meter — and each
  // landing steps that meter up (v1: the meter steps up as each lands). Runs
  // on every eat/drink — the first one and every later one from the
  // room-timer bubble — because it lives in runItemScript, the one entry
  // point for both. (v1's scr is worldToScreen here; the old code called a
  // global scr that does not exist in this build, so nothing flew.)
  var FLY = { food: { n: 5, ic: 'assets/icons/fi_leaf.webp' }, water: { n: 5, ic: 'assets/icons/icon_water_droplet.png' } };
  var FLY_MS = 750, FLY_STAGGER_MS = 175; // v1 COIN.FLY_MS / COIN.STAGGER_MS
  // v1's food/water meters (index.html METERS/MV): cap 100, start 70, a full
  // eat/drink cycle fills 35 (food) / 40 (water), split across the 5 icons.
  // No drain in checkpoint 2 (v1's drainPerMin not ported).
  var METERS = { food: { cap: 100, start: 70, fillPerCycle: 35 }, water: { cap: 100, start: 70, fillPerCycle: 40 } };
  var MV = { food: METERS.food.start, water: METERS.water.start };
  function flyIcons(kind, srcX, srcY) {
    var cfg = FLY[kind];
    if (!cfg) return;
    var gameEl = document.querySelector('#game');
    if (!gameEl) return;
    var step = METERS[kind].fillPerCycle / cfg.n;
    flashMeters(); // the meters show while the icons fly to them
    for (var i = 0; i < cfg.n; i++) {
      (function (k) {
        setTimeout(function () {
          // v1: the source and the meter target are read at flight time.
          var s = worldToScreen(srcX, srcY);
          var tx = s.x, ty = s.y;
          var row = metersEl ? metersEl.querySelector('[data-m="' + kind + '"] i') : null;
          if (row) {
            var gr = gameEl.getBoundingClientRect(), hr = row.getBoundingClientRect();
            tx = hr.left - gr.left + hr.width / 2;
            ty = hr.top - gr.top + hr.height / 2;
          }
          var c = document.createElement('img');
          c.className = 'bvFly'; c.alt = ''; c.src = cfg.ic;
          c.style.left = s.x + 'px'; c.style.top = s.y + 'px';
          gameEl.appendChild(c);
          var done = function () {
            if (c.parentNode) c.parentNode.removeChild(c);
            MV[kind] = Math.min(METERS[kind].cap, MV[kind] + step); // v1: the meter steps up as each lands
            hudMeters();
            flashMeters();
          };
          if (c.animate) {
            var a = c.animate([
              { transform: 'translate(0,0) scale(.6)', opacity: 1 },
              { transform: 'translate(0,-26px) scale(1.15)', opacity: 1, offset: .22 },
              { transform: 'translate(' + (tx - s.x) + 'px,' + (ty - s.y) + 'px) scale(.8)', opacity: .95 }
            ], { duration: FLY_MS, easing: 'ease-in' });
            a.onfinish = done;
          } else setTimeout(done, FLY_MS);
        }, k * FLY_STAGGER_MS);
      })(i);
    }
  }
  function runItemScript(id, cx, floorY, uid) {
    var spot = itemSpot(id, cx, floorY);
    runningScriptId = (uid != null ? uid : id);
    if (id === 'leafbed') {
      // v1 queenScript royal: walks to the leaf bed by herself and settles.
      QN.busy = true;
      queenTo(spot.x, spot.y, function () {
        QN.home = { x: spot.x, y: spot.y }; QN.settled = true;
        if (uid != null) QN.homeUid = uid; // the bed she settled on (for multiples: erasing another bed keeps her home)
        queenWait(BED_WAIT_S, function () { QN.busy = false; runningScriptId = null; openBedGate(); runPending(); });
      });
    } else if (id === 'fridge') {
      // v1 queenScript kitchen: walks to the fridge and eats, then returns home.
      QN.busy = true;
      queenTo(spot.x, spot.y, function () {
        flyIcons('food', cx, floorY - itemH(itemById('fridge')) / 2); // v1: leaves fly from the fridge to her while she eats
        queenWait(EAT_WAIT_S, function () { queenHome(function () { QN.busy = false; runningScriptId = null; runPending(); }); });
      });
    } else if (id === 'watercooler') {
      // v1 queenScript water: walks to the cooler and drinks, then returns home.
      QN.busy = true;
      queenTo(spot.x, spot.y, function () {
        flyIcons('water', cx, floorY - itemH(itemById('watercooler')) / 2); // v1: droplets fly from the cooler to her while she drinks
        queenWait(DRINK_WAIT_S, function () { queenHome(function () { QN.busy = false; runningScriptId = null; runPending(); }); });
      });
    } else if (id === 'eggbasket') {
      // v1 queenScript nursery (doLay) minus the egg system: walks to the
      // basket, waits the lay wait, the two eggs appear and the cycle starts,
      // then returns home. No eggs appear yet in the old build — now they do.
      QN.busy = true;
      queenTo(spot.x, spot.y, function () {
        queenWait(LAY_WAIT_S, function () {
          layEggs();
          queenHome(function () { QN.busy = false; runningScriptId = null; armFirstPlayHatch(); runPending(); });
        });
      });
    } else if (id === 'slide' || id === 'swingset' || id === 'teetertotter' || id === 'spinningcircle') {
      // CHECKPOINT 3 (v1): the queen has no reaction to the playground — the
      // KIDS go there. The queen walks to the spot (the build sequence), then
      // returns home; a generation waiting near the nursery is sent to play.
      QN.busy = true;
      queenTo(spot.x, spot.y, function () {
        queenWait(0.5, function () {
          queenHome(function () { QN.busy = false; runningScriptId = null; runPending(); });
        });
        for (var i = 0; i < GENS.length; i++) {
          var g = GENS[i];
          if (g.stage === 'nursery' && (g.phase === 'idle' || g.phase === 'wait')) goToPlayground(g);
          // v30 fix 4: a NEW park item means a free slot — an idle kid who
          // was waiting near the birth area takes it.
          if (g.stage === 'playground') tryAssignIdleKids(g);
        }
      });
    } else if (id === 'desk') {
      // CHECKPOINT 3 (v1): the queen has no reaction to the school — the
      // KIDS go there. The queen walks to the spot, then returns home; a
      // generation waiting for school (playground done) is sent to the desk.
      QN.busy = true;
      queenTo(spot.x, spot.y, function () {
        queenWait(0.5, function () {
          queenHome(function () { QN.busy = false; runningScriptId = null; runPending(); });
        });
        for (var i = 0; i < GENS.length; i++) {
          var g = GENS[i];
          if (g.stage === 'playground' && g.phase === 'wait') goToSchool(g);
        }
      });
    } else if (id === 'globe' || id === 'microscope' || id === 'easelchalk' || id === 'easelmap' || id === 'dumbbell' || id === 'treadmill' || id === 'benchpress') {
      // CHECKPOINT 4 (v1): the queen has no reaction to trade school — the
      // GROWN ANTS go there. She walks to the spot, then returns home; a
      // grown ant waiting at a desk is sent to the new trade item.
      QN.busy = true;
      queenTo(spot.x, spot.y, function () {
        queenWait(0.5, function () {
          queenHome(function () { QN.busy = false; runningScriptId = null; runPending(); });
        });
        tryAssignTrades();
      });
    }
  }
  function runPending() {
    if (QN.busy) return;
    // A build waiting for the queen goes first, then a queued reaction.
    if (activeBuild) return; // activeBuild implies busy; a stale one must not stall the queue
    var b = buildQueue.shift();
    if (b) { beginBuild(b); return; }
    var next = pendingScripts.shift();
    if (next) runItemScript(next.id, next.cx, next.floorY, next.uid);
  }
  // ---- CHECKPOINT 2: the build sequence (v1 index.html build() / stepAuto / drawBuildCloud) ----
  // v1: the player picks a spot; the queen WALKS to the spot first; ONLY when
  // she arrives does the cloud begin (she digs, the cloud covers the spot for
  // BUILD_SECONDS); when the cloud clears the item is revealed underneath; the
  // timer starts only after the item is built; then she does the item's
  // reaction. The item is added to placed[] at pick time with t0 = DIG_PEND
  // (not dug yet — no cloud, invisible, v1 build() / notes1 #5); t0 is set to
  // the queen clock when she arrives and starts digging.
  var BUILD_SECONDS = 5; // v1
  var BUILD_FX = { REVEAL_S: 1.7, GROW_S: 0.45, COLS: ['188,152,105', '201,172,126', '155,120,76'] }; // v1
  var DIG_PEND = 1e9; // v1: room not dug yet (no cloud, invisible)
  var buildQueue = []; // {uid, id, cx, floorY} waiting for the queen
  var activeBuild = null; // {uid, id, cx, floorY} while she walks / the cloud runs
  function buildCover(tt) { // v1 buildCover: cover grows in, then fades as the room reveals
    var out = ease(clamp((tt - (BUILD_SECONDS - BUILD_FX.REVEAL_S)) / BUILD_FX.REVEAL_S));
    return { cover: ease(clamp(tt / BUILD_FX.GROW_S)) * (1 - out), room: out };
  }
  function startBuild(uid, id, cx, floorY) {
    if (QN.busy || activeBuild) { buildQueue.push({ uid: uid, id: id, cx: cx, floorY: floorY }); return; }
    beginBuild({ uid: uid, id: id, cx: cx, floorY: floorY });
  }
  function beginBuild(job) {
    activeBuild = job;
    QN.busy = true;
    var spot = itemSpot(job.id, job.cx, job.floorY);
    queenTo(spot.x, spot.y, function () {
      // She arrived: the cloud begins NOW (v1: r.t0 = T when she digs).
      var p = null;
      for (var i = 0; i < placed.length; i++) if (placed[i].uid === job.uid) { p = placed[i]; break; }
      if (!p) { activeBuild = null; QN.busy = false; runPending(); return; } // erased while she walked
      p.t0 = QT;
      QN.dig = { t0: QT }; // v1: she digs at the spot, under the dust puff
      queenWait(BUILD_SECONDS, function () {
        // The cloud cleared: the item is built. Guard the erase-during-cloud case.
        var pp = null;
        for (var j = 0; j < placed.length; j++) if (placed[j].uid === job.uid) { pp = placed[j]; break; }
        QN.dig = null;
        activeBuild = null;
        if (!pp) { QN.busy = false; runPending(); return; }
        pp.building = false;
        // The basket unlocks when BOTH the fridge and the cooler are built:
        // re-render the menu so it appears the moment the second one is revealed.
        // v48 (Chris, Nov 18): the same for the trade chain — the easels
        // must appear the MOMENT the globe is built, and the gym items the
        // moment an easel is built, so the player can build the next trade
        // right away (not when the ant finishes training or goes off to work).
        if (job.id === 'fridge' || job.id === 'watercooler' || job.id === 'globe' || job.id === 'easelchalk' || job.id === 'easelmap') renderMenu();
        // The timer starts ONLY after the item is built (cloud gone), never
        // while the cloud is still going.
        if (job.id === 'fridge' || job.id === 'watercooler') startRoomTimer(job.id);
        runItemScript(job.id, job.cx, job.floorY, job.uid); // her reaction, then the unlock chain
      });
    });
  }
  function cancelBuild(uid) {
    for (var i = buildQueue.length - 1; i >= 0; i--) if (buildQueue[i].uid === uid) buildQueue.splice(i, 1);
    if (activeBuild && activeBuild.uid === uid) {
      activeBuild = null;
      QN.dig = null;
      QN.mode = 'idle'; QN.path = []; QN.cb = null; QN.busy = false;
      runPending();
    }
  }
  function onItemRemoved(p) {
    var id = p.id;
    cancelBuild(p.uid); // a build in progress for THIS copy stops with it, not the other copies
    // A copy of this type still on the floor keeps the type alive: pending
    // reactions re-point to it; only when the LAST copy goes do they drop.
    var remaining = null;
    for (var i = 0; i < placed.length; i++) if (placed[i].id === id) { remaining = placed[i]; break; }
    for (var i = pendingScripts.length - 1; i >= 0; i--) {
      if (pendingScripts[i].id !== id) continue;
      if (remaining) { pendingScripts[i].uid = remaining.uid; pendingScripts[i].cx = remaining.cx; pendingScripts[i].floorY = remaining.floorY; }
      else pendingScripts.splice(i, 1);
    }
    for (var j = basketQueue.length - 1; j >= 0; j--) basketQueue.splice(j, 1);
    if ((id === 'fridge' || id === 'watercooler') && !remaining) clearRoomTimer(id);
    if (id === 'eggbasket' && !remaining) basketJob = null;
    if (id === 'slide' || id === 'swingset' || id === 'teetertotter' || id === 'spinningcircle' || id === 'desk') releaseKidsFor(p); // CHECKPOINT 3: free any kid riding it / at school there
    if (id === 'globe' || id === 'microscope' || id === 'easelchalk' || id === 'easelmap' || id === 'dumbbell' || id === 'treadmill' || id === 'benchpress') releaseTradeFor(p); // CHECKPOINT 4: free any ant walking to train / training there
    brainReset(); // v1: any build activity distracts the queen
    if (id === 'leafbed') {
      // Her home is the bed she settled on; erasing a different bed leaves it.
      if (QN.homeUid === p.uid) { QN.home = null; QN.settled = false; QN.homeUid = null; }
      if (!remaining) closeBedGate(); // the bed is the gate: the last bed going hides the three again
    }
    if (runningScriptId === p.uid) {
      // She was mid-reaction to the copy that no longer exists: stop, stand still.
      runningScriptId = null;
      basketJob = null;
      QN.mode = 'idle'; QN.path = []; QN.cb = null; QN.busy = false;
      runPending();
    }
  }

  // ---- CHECKPOINT 2: the ONE entrance hexagon (visual, below the hole) ----
  // The hexagon Chris sees and confirmed, from the game's own grid overlay:
  // chamber centre (3599,1452), w 791 px = world centre (2812,5039), w 136.86.
  // This is NOT the placement grid's (0,0) at HEX (2812,4999.5) — the visual
  // entrance hex sits ~40 world units lower, near SPIRAL_W. Only this one hex
  // is the play area; the full hexagon pattern is NOT built.
  var HEXW = HEX.w;
  var ENTRANCE = { x: 2812, y: 5039 };
  // ---- v37: the brown fog as a SEPARATE clearable layer (Chris, Nov 16) ----
  // The underground is built in LAYERS. The dirt layer is
  // underground-map-hd.jpg (uniform light dirt, no fog). The brown fog sits
  // on top as its own layer. The live fog-map (underground-fog-map.jpg) is
  // that dirt WITH the fog baked in — it is used ONLY to initialise the fog
  // layer's shape, never drawn as the background, and never edited. The fog
  // layer is a low-res mask + canvas (the fog is soft/dark, so low res is
  // fine and the upscale blur softens the edge). The entrance hexagon is
  // cleared from it at game start; the miner will clear other hexagons one
  // at a time later (checkpoint 4). Never paste a dirt patch over the fog.
  // The mask is the source of truth (0 = clear dirt, 255 = fog); the canvas
  // is only the display of the mask. No full-res offscreen canvas: the fog
  // layer is 1/8 scale (704x1250, ~3.5 MB), never 5625x10000 (~225 MB).
  // ---- v38: the fog looks like ROCK, not solid brown (Chris, Nov 16) ----
  // v37's fog was one flat RGB [87,61,34] for every cell — it read as solid
  // brown, not fog. Chris wants rock. The rock is generated PROCEDURALLY in
  // code as a single continuous noise field over the fog layer — never tiled
  // from a small image (the old rock images failed because he could see the
  // pattern when zoomed out) and never copied/pasted from an image file (he
  // forbade pasting image parts). A single continuous field has no tile
  // seams and no repetition, so there is nothing to spot at any zoom. It is
  // generated ONCE at init (not per frame), at fog resolution (704x1250),
  // and the mask stays the source of truth (0 = clear dirt, 255 = fog).
  // The noise is deterministic (fixed seed) so the rock is the same every
  // load. The hash is non-periodic: it mixes the absolute integer grid
  // coordinates, never wraps them, so the field cannot repeat.
  var FOG_FC = 8;
  var FOG_FW = Math.ceil(WORLD.w / FOG_FC), FOG_FH = Math.ceil(WORLD.h / FOG_FC);
  var FOG_RED = 120; // fog-map pixels with red below this are fog (fog ~87, clear ~153)
  var FOG_FEATHER = 20; // world units of soft edge when a hexagon is cleared
  var fogMask = new Uint8Array(FOG_FW * FOG_FH); // 0 = clear, 255 = fog
  var fogC = null, fogX = null, fogImg = null, fogReady = false, fogInitFailed = false;
  // Signed distance from a point to a hexagon edge (negative inside,
  // positive outside, 0 on the edge). Convex-polygon SDF: the max over the
  // six edge normals of (dot(p - centre, n) - apothem).
  function hexDist(px, py, cx, cy, w) {
    var dx = px - cx, dy = py - cy, a = w * Math.sqrt(3) / 4, s3 = Math.sqrt(3) / 2;
    var d0 = dx * s3 + dy * 0.5 - a, d1 = dy - a, d2 = -dx * s3 + dy * 0.5 - a;
    var d3 = -dx * s3 - dy * 0.5 - a, d4 = -dy - a, d5 = dx * s3 - dy * 0.5 - a;
    return Math.max(d0, d1, d2, d3, d4, d5);
  }
  // Threshold fog-map pixels into the fog mask: dark = fog (255), light =
  // clear pocket (0). data is an ImageData.data RGBA array, already at fog
  // resolution (FOG_FW x FOG_FH). Returns the number of fog cells.
  function fogThreshold(data) {
    var n = 0, i, cell;
    for (i = 0; i < data.length; i += 4) {
      cell = i / 4;
      if (cell >= fogMask.length) break;
      if (data[i] < FOG_RED) { fogMask[cell] = 255; n++; } else { fogMask[cell] = 0; }
    }
    return n;
  }
  // Erase one hexagon from the fog mask with a SOFT feathered edge (no hard
  // line, no sticker edge). Only clears (never re-fogs). The feather is a
  // smooth falloff across FOG_FEATHER world units centred on the hexagon
  // edge. Only cells in the hexagon's bounding box are touched.
  function clearFogHexMask(cx, cy, w) {
    var r = w / 2 + FOG_FEATHER, f2 = FOG_FEATHER / 2;
    var i0 = Math.max(0, Math.floor((cx - r) / FOG_FC)), i1 = Math.min(FOG_FW - 1, Math.ceil((cx + r) / FOG_FC));
    var j0 = Math.max(0, Math.floor((cy - r) / FOG_FC)), j1 = Math.min(FOG_FH - 1, Math.ceil((cy + r) / FOG_FC));
    var i, j, k, px, py, d, t, target;
    for (j = j0; j <= j1; j++) {
      for (i = i0; i <= i1; i++) {
        px = i * FOG_FC + FOG_FC / 2; py = j * FOG_FC + FOG_FC / 2;
        d = hexDist(px, py, cx, cy, w);
        t = (d + f2) / FOG_FEATHER; if (t < 0) t = 0; else if (t > 1) t = 1;
        target = Math.round(255 * t);
        k = j * FOG_FW + i;
        if (target < fogMask[k]) fogMask[k] = target;
      }
    }
  }
  // v46 (Chris): PROGRESSIVE reveal of one hexagon — the miner discovers
  // it the way the scout discovers a tile, but 10x slower. Clears the fog
  // inside hexagon (cx,cy,w) only up to a soft circular front of radius r
  // around the dig point (fx,fy): the reveal starts at the edge where he
  // digs and spreads across the hexagon as r grows. A cell is clear only
  // when BOTH the hexagon feather AND the reveal front say clear (the mask
  // value is the max of the two), so the reveal never clears fog outside
  // the hexagon. Only clears (never re-fogs), same feather as
  // clearFogHexMask. Only cells in the hexagon's bounding box are touched.
  function clearFogHexPartialMask(cx, cy, w, fx, fy, r) {
    var R = w / 2 + FOG_FEATHER, f2 = FOG_FEATHER / 2;
    var i0 = Math.max(0, Math.floor((cx - R) / FOG_FC)), i1 = Math.min(FOG_FW - 1, Math.ceil((cx + R) / FOG_FC));
    var j0 = Math.max(0, Math.floor((cy - R) / FOG_FC)), j1 = Math.min(FOG_FH - 1, Math.ceil((cy + R) / FOG_FC));
    var i, j, k, px, py, d, t, target, dr, tr, reveal;
    for (j = j0; j <= j1; j++) {
      for (i = i0; i <= i1; i++) {
        px = i * FOG_FC + FOG_FC / 2; py = j * FOG_FC + FOG_FC / 2;
        d = hexDist(px, py, cx, cy, w);
        t = (d + f2) / FOG_FEATHER; if (t < 0) t = 0; else if (t > 1) t = 1;
        target = Math.round(255 * t);
        // Reveal front: soft circle of radius r around the dig point.
        dr = Math.hypot(px - fx, py - fy);
        tr = (dr - r + f2) / FOG_FEATHER; if (tr < 0) tr = 0; else if (tr > 1) tr = 1;
        reveal = Math.round(255 * tr);
        if (reveal > target) target = reveal;
        k = j * FOG_FW + i;
        if (target < fogMask[k]) fogMask[k] = target;
      }
    }
  }
  // ---- v38 rock texture (procedural, single continuous field, no tiling) ----
  // A deterministic seeded value-noise fBm. The hash mixes absolute integer
  // grid coordinates (never wrapped), so the field is one continuous random
  // field with no period and no repeating motif — nothing to spot zoomed out.
  var ROCK_SEED = 20261116;
  var rockRGB = null; // Uint8Array, 3 bytes per fog cell (the rock texture)
  function rockHash(gx, gy, salt) {
    var h = (gx * 374761393 + gy * 668265263 + salt * 974634) | 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    h = (h ^ (h >>> 16)) >>> 0;
    return h / 4294967296;
  }
  // One octave's grid values, precomputed (small: a few thousand values).
  function rockGrid(cols, rows, salt) {
    var g = new Float32Array((cols + 1) * (rows + 1)), i, j;
    for (j = 0; j <= rows; j++) for (i = 0; i <= cols; i++) g[j * (cols + 1) + i] = rockHash(i, j, salt);
    return { g: g, cols: cols, rows: rows };
  }
  // One fBm field's octave grids, precomputed once (not per cell).
  // Each octave carries sx/sy (grid cycles per fog cell) so the hot path
  // multiplies instead of dividing.
  function rockFbmGrids(cycles, salt, octaves) {
    var grids = [], amp = 1, norm = 0, o, cols, rows;
    for (o = 0; o < octaves; o++) {
      cols = cycles * (1 << o);
      rows = Math.max(1, Math.round(cols * FOG_FH / FOG_FW));
      grids.push({ grid: rockGrid(cols, rows, salt + o * 101), cols: cols, rows: rows, amp: amp, sx: cols / FOG_FW, sy: rows / FOG_FH });
      norm += amp; amp *= 0.5;
    }
    return { grids: grids, norm: norm };
  }
  // fBm for one cell from a precomputed grid set. The octave interpolation
  // is INLINED here (no per-octave function call) and uses precomputed
  // scales (sx/sy, a multiply instead of a divide) and |0 instead of
  // Math.floor, so the per-cell cost stays low even in unoptimised contexts
  // (a vm/interpreter runs the nested-call version ~20x slower; the phone's
  // JIT is fast either way, but the game must not freeze for seconds on
  // first load). gx/gy are always >= 0 and < cols/rows, so |0 == floor.
  function rockFbmCell(f, i, j) {
    var sum = 0, o, gr, grid, w, gx, gy, ix, iy, u, v, su, sv, a, b, c, d;
    for (o = 0; o < f.grids.length; o++) {
      gr = f.grids[o];
      grid = gr.grid;
      gx = i * gr.sx;
      gy = j * gr.sy;
      w = grid.cols + 1;
      ix = gx | 0; iy = gy | 0;
      if (ix > grid.cols - 1) ix = grid.cols - 1;
      if (iy > grid.rows - 1) iy = grid.rows - 1;
      u = gx - ix; v = gy - iy;
      su = u * u * (3 - 2 * u); sv = v * v * (3 - 2 * v);
      a = grid.g[iy * w + ix]; b = grid.g[iy * w + ix + 1];
      c = grid.g[(iy + 1) * w + ix]; d = grid.g[(iy + 1) * w + ix + 1];
      sum += gr.amp * (a + (b - a) * su + (c - a) * sv + (a - b - c + d) * su * sv);
    }
    return sum / f.norm;
  }
  // Rocky browns/tans, as flat channel arrays (no per-cell array
  // allocation). The mean lands near the old flat fog colour, so the fog
  // still obscures the same amount overall — but now with real rock
  // variation: dark patches, tan highlights, cracks, speckles.
  var ROCK_R = [46, 74, 98, 130, 166];
  var ROCK_G = [30, 50, 69, 95, 128];
  var ROCK_B = [16, 28, 38, 55, 80];
  // Generate the rock texture once (deterministic — same rock every load).
  // Pure JS, no DOM/canvas: safe to run in the harness. ~880k cells.
  // The fBm grids are precomputed once and shared by the field build and by
  // the single-cell computation (so the harness can verify one cell from
  // scratch and prove the stored field matches the pure function).
  var rockGrids = null;
  function ensureRockGrids() {
    if (rockGrids) return rockGrids;
    rockGrids = {
      base: rockFbmGrids(4, 11, 3),    // large irregular rock shapes
      detail: rockFbmGrids(7, 23, 3),  // medium variation (different base freq)
      crack: rockFbmGrids(12, 37, 2)   // ridged cracks
    };
    return rockGrids;
  }
  // The rock RGB for one fog cell, computed from scratch (pure, no cache).
  // Palette lookup is inlined (no array allocation); rounding uses
  // (x+0.5)|0 and no clamp is needed (palette 46..166 x dk<=1 x s<=1.10
  // stays inside 0..255).
  function rockCellRGB(i, j) {
    var g = ensureRockGrids(), t, r, c, dk, s, x, si, f, R, G, B;
    t = 0.62 * rockFbmCell(g.base, i, j) + 0.38 * rockFbmCell(g.detail, i, j);
    if (t < 0) t = 0; else if (t > 1) t = 1;
    x = t * 4;
    si = x >= 4 ? 3 : (x | 0);
    f = x - si;
    R = ROCK_R[si] + (ROCK_R[si + 1] - ROCK_R[si]) * f;
    G = ROCK_G[si] + (ROCK_G[si + 1] - ROCK_G[si]) * f;
    B = ROCK_B[si] + (ROCK_B[si + 1] - ROCK_B[si]) * f;
    // Cracks: ridged noise, darkens along thin ridge crests.
    r = rockFbmCell(g.crack, i, j);
    c = 1 - Math.abs(2 * r - 1);
    dk = 1 - 0.35 * c * c * c;
    // Speckle: per-cell hash jitter, subtle grain.
    s = 0.90 + 0.20 * rockHash(i, j, 53);
    return [(R * dk * s + 0.5) | 0, (G * dk * s + 0.5) | 0, (B * dk * s + 0.5) | 0];
  }
  function genRock() {
    if (rockRGB) return rockRGB;
    var n = FOG_FW * FOG_FH, out = new Uint8Array(n * 3);
    var i, j, k, c;
    for (j = 0; j < FOG_FH; j++) {
      for (i = 0; i < FOG_FW; i++) {
        k = j * FOG_FW + i;
        c = rockCellRGB(i, j);
        out[k * 3] = c[0]; out[k * 3 + 1] = c[1]; out[k * 3 + 2] = c[2];
      }
    }
    rockRGB = out;
    return out;
  }
  // The rock RGB for one fog cell (pure; generates the field on first use).
  function rockAt(i, j) {
    if (!rockRGB) genRock();
    var k = j * FOG_FW + i;
    if (k < 0 || k >= fogMask.length) return null;
    return [rockRGB[k * 3], rockRGB[k * 3 + 1], rockRGB[k * 3 + 2]];
  }
  // The RGBA a cell paints as: rock colour with the mask as alpha.
  function rockRGBA(k) {
    if (!rockRGB) genRock();
    if (k < 0 || k >= fogMask.length) return [0, 0, 0, 0];
    return [rockRGB[k * 3], rockRGB[k * 3 + 1], rockRGB[k * 3 + 2], fogMask[k]];
  }
  // Write the fog mask into the display canvas: ROCK texture per cell (not
  // one flat brown) with the mask as alpha. Guarded: the harness fake
  // canvas has no putImageData, and the game must never crash on it.
  function fogMaskToCanvas() {
    if (!fogX || !fogImg) return false;
    try {
      if (!rockRGB) genRock();
      var d = fogImg.data, k, n = fogMask.length, o;
      for (k = 0; k < n; k++) {
        o = k * 3;
        d[k * 4] = rockRGB[o]; d[k * 4 + 1] = rockRGB[o + 1]; d[k * 4 + 2] = rockRGB[o + 2];
        d[k * 4 + 3] = fogMask[k];
      }
      fogX.putImageData(fogImg, 0, 0);
      return true;
    } catch (e) { return false; }
  }
  function initFog() {
    if (fogReady) return true;
    if (fogInitFailed) return false;
    if (typeof art === 'undefined' || !art.underFog || !art.underFog.complete || !art.underFog.naturalWidth) return false;
    try {
      fogC = document.createElement('canvas');
      fogC.width = FOG_FW; fogC.height = FOG_FH;
      fogX = fogC.getContext('2d');
      if (!fogX || typeof fogX.drawImage !== 'function' || typeof fogX.getImageData !== 'function' || typeof fogX.putImageData !== 'function') { fogInitFailed = true; return false; }
      fogX.drawImage(art.underFog, 0, 0, FOG_FW, FOG_FH);
      var id = fogX.getImageData(0, 0, FOG_FW, FOG_FH);
      fogThreshold(id.data);
      // The entrance hexagon is clear of brown fog from the start of the game.
      clearFogHexMask(ENTRANCE.x, ENTRANCE.y, HEXW);
      // Display canvas for the mask.
      try { fogImg = fogX.createImageData(FOG_FW, FOG_FH); } catch (e) { fogImg = null; }
      if (!fogImg) { try { fogImg = new ImageData(new Uint8ClampedArray(FOG_FW * FOG_FH * 4), FOG_FW, FOG_FH); } catch (e2) { fogImg = null; } }
      fogMaskToCanvas();
      fogReady = true;
      // The fog-map image is only needed to initialise the fog layer; release
      // it so the phone does not hold two 56 MP decoded bitmaps.
      try { art.underFog = null; } catch (e3) {}
      return true;
    } catch (e) { fogInitFailed = true; return false; }
  }
  // Public: clear one hexagon from the fog (the miner, checkpoint 4).
  function clearFogHex(cx, cy, w) {
    if (!fogReady) return false;
    clearFogHexMask(cx, cy, w);
    fogMaskToCanvas();
    return true;
  }
  // Public (v46): progressively reveal one hexagon from a dig point — the
  // miner's slow discovery. r grows from 0 to HEXW + 20 over the discovery.
  function clearFogHexPartial(cx, cy, w, fx, fy, r) {
    if (!fogReady) return false;
    clearFogHexPartialMask(cx, cy, w, fx, fy, r);
    fogMaskToCanvas();
    return true;
  }
  function drawFog() {
    if (typeof ctx === 'undefined') return;
    if (!fogReady) { if (!initFog()) return; }
    if (!fogC) return;
    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(fogC, 0, 0, WORLD.w, WORLD.h);
    ctx.restore();
  }
  window.BASE_FOG = {
    draw: drawFog,
    init: initFog,
    clearHex: clearFogHex,
    clearHexPartial: clearFogHexPartial,
    get ready() { return fogReady; },
    get cell() { return FOG_FC; },
    get size() { return { w: FOG_FW, h: FOG_FH }; },
    get mask() { return fogMask; },
    get rock() { return rockRGB; },
    // Test hooks (pure logic, no canvas needed).
    _hexDist: hexDist,
    _threshold: fogThreshold,
    _clearMask: clearFogHexMask,
    _clearHexPartial: clearFogHexPartialMask,
    _genRock: genRock,
    _rockAt: rockAt,
    _rockRGBA: rockRGBA,
    _rockCell: rockCellRGB
  };
  // The item box only needs to TOUCH the entrance hexagon (Chris): any part of
  // the box overlapping or intersecting the hexagon counts — it may hang over
  // the edge. Only a box that does not touch the hexagon at all is rejected.
  // Separating-axis test: rect vs the convex hexagon (pointy left/right, flat
  // top/bottom, vertices at v1 hexVertex angles i*PI/3). Axes: the rect's x/y
  // axes plus the hexagon's edge normals. Touching exactly on an edge counts.
  function rectTouchesEntranceHex(cx, floorY, w, h) {
    var x0 = cx - w / 2, x1 = cx + w / 2, y0 = floorY - h, y1 = floorY;
    var rx = ENTRANCE.x, ry = ENTRANCE.y, r = HEXW / 2;
    var vx = [], vy = [], i, a;
    for (i = 0; i < 6; i++) { a = i * Math.PI / 3; vx.push(rx + r * Math.cos(a)); vy.push(ry + r * Math.sin(a)); }
    function separated(ax, ay) {
      var minR = Infinity, maxR = -Infinity, minH = Infinity, maxH = -Infinity, k, p;
      var corners = [[x0, y0], [x1, y0], [x0, y1], [x1, y1]];
      for (k = 0; k < 4; k++) { p = corners[k][0] * ax + corners[k][1] * ay; if (p < minR) minR = p; if (p > maxR) maxR = p; }
      for (k = 0; k < 6; k++) { p = vx[k] * ax + vy[k] * ay; if (p < minH) minH = p; if (p > maxH) maxH = p; }
      return maxR < minH || maxH < minR;
    }
    var s3 = Math.sqrt(3) / 2;
    if (separated(1, 0)) return false;
    if (separated(0, 1)) return false;
    if (separated(s3, 0.5)) return false;
    if (separated(-s3, 0.5)) return false;
    return true;
  }
  // ---- CHECKPOINT 4: the 23-cell underground hex grid (v1 CELLS, index.html:398) ----
  // Ported as-is: axial coords c in -6..6, r in -4..4, x = c*CS,
  // y = (r + (c%2 ? 0.5 : 0))*HH, HW = 791, CS = 0.75*HW, HH = HW*sqrt(3)/2,
  // C0 = (3599, 2142.79) chamber px, the 23 closest by d = (x/1.78)^2 + y^2.
  // World coords anchor on the entrance hexagon = the home cell (0,-1):
  // chamber (3599,1452) = world (2812,5039); one chamber px = KW world.
  // (BC.toW is NOT used: the harness stubs BC without it, and the anchor
  // below is exact — the home cell lands exactly on the entrance hexagon.)
  var HEX_GRID = (function () {
    var HW = 791, CS = 0.75 * HW, HH = HW * Math.sqrt(3) / 2, cells = [];
    for (var c = -6; c <= 6; c++) for (var r = -4; r <= 4; r++) {
      var x = c * CS, y = (r + (c % 2 ? 0.5 : 0)) * HH;
      cells.push({ c: c, r: r, d: (x / 1.78) * (x / 1.78) + y * y });
    }
    cells.sort(function (a, b) { return a.d - b.d; });
    return cells.slice(0, 23).map(function (cell) {
      return {
        c: cell.c, r: cell.r, k: cell.c + ',' + cell.r,
        x: ENTRANCE.x + cell.c * CS * KW,
        y: ENTRANCE.y + (cell.r + (cell.c % 2 ? 0.5 : 0) + 1) * HH * KW
      };
    });
  })();
  // Flat-top odd-column offset neighbours of (c,r): odd columns are shifted
  // down half a row (v1's y = (r + (c%2 ? 0.5 : 0))*HH), so the neighbour
  // set depends on the column's parity. (c%2 === 0 is false for c = -1, -3...
  // as well as for odd positives, so the parity test works for negative c too.)
  function hexNeighbours(c, r) {
    if (c % 2 === 0) return [[c + 1, r], [c + 1, r - 1], [c, r - 1], [c - 1, r - 1], [c - 1, r], [c, r + 1]];
    return [[c + 1, r + 1], [c + 1, r], [c, r - 1], [c - 1, r], [c - 1, r + 1], [c, r + 1]];
  }
  function hexCellByKey(k) {
    for (var i = 0; i < HEX_GRID.length; i++) if (HEX_GRID[i].k === k) return HEX_GRID[i];
    return null;
  }
  // The exposed area: the entrance hexagon is exposed from the start; every
  // hexagon the miner clears joins it. The frontier is the fogged cells
  // TOUCHING the exposed area (Chris's corrected rule — v1's surface-tile
  // rule ported to hexagons: a random pick among the tiles touching the
  // discovered area). A cell far away that touches nothing exposed is never picked.
  var clearedCells = { '0,-1': true };
  function frontierCells() {
    var out = [];
    HEX_GRID.forEach(function (cell) {
      if (clearedCells[cell.k]) return;
      var ns = hexNeighbours(cell.c, cell.r);
      for (var i = 0; i < ns.length; i++) {
        if (clearedCells[ns[i][0] + ',' + ns[i][1]]) { out.push(cell); break; }
      }
    });
    return out;
  }
  function pickFrontierCell() {
    var f = frontierCells();
    return f.length ? f[Math.floor(Math.random() * f.length)] : null;
  }
  // CHECKPOINT 4: a placed item only needs to TOUCH a CLEARED hexagon — the
  // entrance hexagon, or any hexagon the miner has cleared. More cleared
  // hexagons = more room to build the base. (The entrance-only test below
  // is kept for the v43 checks; the ghost uses the cleared-hex test.)
  function rectTouchesHex(cx, floorY, w, h, hx, hy) {
    var x0 = cx - w / 2, x1 = cx + w / 2, y0 = floorY - h, y1 = floorY;
    var r = HEXW / 2;
    var vx = [], vy = [], i, a;
    for (i = 0; i < 6; i++) { a = i * Math.PI / 3; vx.push(hx + r * Math.cos(a)); vy.push(hy + r * Math.sin(a)); }
    function separated(ax, ay) {
      var minR = Infinity, maxR = -Infinity, minH = Infinity, maxH = -Infinity, k, p;
      var corners = [[x0, y0], [x1, y0], [x0, y1], [x1, y1]];
      for (k = 0; k < 4; k++) { p = corners[k][0] * ax + corners[k][1] * ay; if (p < minR) minR = p; if (p > maxR) maxR = p; }
      for (k = 0; k < 6; k++) { p = vx[k] * ax + vy[k] * ay; if (p < minH) minH = p; if (p > maxH) maxH = p; }
      return maxR < minH || maxH < minR;
    }
    var s3 = Math.sqrt(3) / 2;
    if (separated(1, 0)) return false;
    if (separated(0, 1)) return false;
    if (separated(s3, 0.5)) return false;
    if (separated(-s3, 0.5)) return false;
    return true;
  }
  function rectTouchesClearedHex(cx, floorY, w, h) {
    for (var i = 0; i < HEX_GRID.length; i++) {
      var cell = HEX_GRID[i];
      if (clearedCells[cell.k] && rectTouchesHex(cx, floorY, w, h, cell.x, cell.y)) return true;
    }
    return false;
  }

  // ---- CHECKPOINT 2: the build cloud (v1 drawBuildCloud, index.html ~1061-1065) ----
  // v1's build cloud: a cover of radial-gradient blobs (BUILD_FX.COLS) that
  // grows in (GROW_S) then fades as the room reveals (REVEAL_S), plus dustAt
  // puffs at the bottom — copied verbatim, only the area is smaller. The
  // cloud COVERS the spot where the item is about to appear; the item is
  // hidden underneath and fades in (buildCover().room) as the cloud clears.
  // It runs for BUILD_SECONDS from the moment she arrives (p.t0), never
  // before. QT is the game clock (same clock the timers use).
  function dustAt(t, wx, wy, dur, k) {
    var fade = Math.min(1, t / .3, (dur - t) / .45);
    if (fade <= 0) return;
    ctx.save(); ctx.translate(wx, wy); ctx.scale(k, k);
    for (var i = 0; i < 25; i++) {
      var p = ((t * .65 + i * .137) % 1), a = i * 2.399;
      var x = Math.cos(a) * p * 120, y = -Math.sin(p * Math.PI) * 80 + (i % 4) * 7;
      var r = (20 + p * 22) * (1 - p * .3);
      ctx.globalAlpha = clamp(fade) * (.16 + .18 * (1 - p));
      ctx.fillStyle = ['#bc9869', '#c9ac7e', '#9b784c'][i % 3];
      ctx.beginPath(); ctx.ellipse(x, y, r, r * .75, 0, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }
  function drawBuildCloud(p) { // p = a building placed item (building, t0 set on her arrival)
    var tt = QT - p.t0;
    if (tt < 0 || tt > BUILD_SECONDS) return;
    var c = buildCover(tt);
    var it = itemById(p.id);
    var h = it ? itemH(it) : p.w * 0.8;
    var cx = p.cx, cy = p.floorY - h / 2; // the item's centre
    var hw = p.w / 2 + 6, hh = h / 2 + 6; // the cloud covers the item box + a margin
    if (c.cover > 0.002) {
      ctx.save();
      for (var j = 0; j < 5; j++) for (var i = 0; i < 4; i++) {
        var n = j * 4 + i, ph = tt * 1.3 + n * 1.7;
        var x = cx + (-1 + 2 * (i + .5) / 4) * hw * .82 + Math.sin(ph) * 4;
        var y = cy + (-1 + 2 * (j + .5) / 5) * hh * .86 + Math.cos(ph * .8) * 4;
        var R0 = Math.max(hw, hh) * (.62 + .06 * Math.sin(ph * 1.1));
        var g = ctx.createRadialGradient(x, y, 0, x, y, R0), col = BUILD_FX.COLS[n % 3], a = c.cover;
        g.addColorStop(0, 'rgba(' + col + ',' + (.96 * a).toFixed(3) + ')');
        g.addColorStop(.55, 'rgba(' + col + ',' + (.82 * a).toFixed(3) + ')');
        g.addColorStop(1, 'rgba(' + col + ',0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(x, y, R0, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    }
    // v1's dust puffs at the item's bottom (miniature: k sized to the item).
    dustAt(tt, cx, p.floorY - h * 0.45, BUILD_SECONDS, Math.max(p.w, 14) / 200);
  }

  // ---- CHECKPOINT 2: placement state ----
  // mode: 'idle' | 'carrying' (ghost follows the finger; a new placement or a move)
  var mode = 'idle', carryId = null, ghost = null, moveFrom = null; // moveFrom = {id, cx, floorY} while moving an existing item
  window.BASE_PLACING = false; // index.html's camera pan/zoom ignores the pointer while this is true.
  function ghostOK() {
    if (!ghost || !carryId) return false;
    var it = itemById(carryId);
    if (!it) return false;
    var h = itemH(it);
    // CHECKPOINT 4: the ghost must touch a CLEARED hexagon — the entrance,
    // or any hexagon the miner has cleared (more cleared hexagons = more room).
    return rectTouchesClearedHex(ghost.cx, ghost.floorY, it.w, h) && !overlapsPlaced(ghost.cx, ghost.floorY, it.w, h);
  }
  function setPlacingUI() {
    // While carrying, taps on the queen and the floor arrows must reach the room, not the buttons.
    var q = document.querySelector('#queenTarget'), f = document.querySelector('#floors');
    var on = mode !== 'idle';
    if (q) q.style.pointerEvents = on ? 'none' : '';
    if (f) f.style.pointerEvents = on ? 'none' : '';
    window.BASE_PLACING = (mode === 'carrying');
  }
  function startSelect(id) {
    // Multiples: an already-placed type can be selected again for another copy.
    if (!isVisible(id)) return; // the bed gate: hidden items cannot be built
    if (typeof state !== 'undefined' && state !== 'underground' && state !== 'menu') return; // only downstairs
    hideBubble();
    // No hexagon picker any more: the item is carried straight into the one entrance hexagon.
    mode = 'carrying'; carryId = id; moveFrom = null;
    ghost = { cx: ENTRANCE.x, floorY: ENTRANCE.y };
    setPlacingUI(); renderMenu();
  }
  function startMove(uid) {
    // Take the placed copy off the floor and carry it; cancelling puts it back where it was.
    var idx = -1;
    for (var i = 0; i < placed.length; i++) if (placed[i].uid === uid) { idx = i; break; }
    if (idx < 0) return;
    var p = placed[idx];
    cancelBuild(p.uid); // a build in progress for THIS copy stops with it
    if (p.id === 'slide' || p.id === 'swingset' || p.id === 'teetertotter' || p.id === 'spinningcircle' || p.id === 'desk') releaseKidsFor(p); // CHECKPOINT 3: picking it up frees any kid riding it / at school there
    if (p.id === 'globe' || p.id === 'microscope' || p.id === 'easelchalk' || p.id === 'easelmap' || p.id === 'dumbbell' || p.id === 'treadmill' || p.id === 'benchpress') releaseTradeFor(p); // CHECKPOINT 4: picking it up frees any ant walking to train / training there
    moveFrom = p; // keep the whole placed object, not just its spot (a moved basket keeps its eggs)
    placed.splice(idx, 1);
    brainReset(); // v1: any build activity distracts the queen
    hideBubble();
    mode = 'carrying'; carryId = p.id; // the TYPE being carried (multiples: the copy itself is in moveFrom)
    ghost = { cx: p.cx, floorY: p.floorY };
    setPlacingUI(); renderMenu();
  }
  function cancelPlacing() {
    if (moveFrom) {
      // Put the whole item back as it was (eggs and all); a cancelled move is
      // not a rebuild, so it is fully revealed, never building.
      moveFrom.building = false;
      placed.push(moveFrom);
    }
    mode = 'idle'; carryId = null; ghost = null; moveFrom = null;
    setPlacingUI(); renderMenu();
  }

  window.BASE_ITEMS = {
    draw: function () {
      if (typeof ctx === 'undefined') return;
      // CHECKPOINT 2: the one entrance hexagon, green OUTLINE only while
      // placing or moving (v34, Chris: the green fill inside it was a haze
      // that hid the dirt — the hexagon is now an exposed clear patch, so
      // building items in it is easy to see). The other game's placing
      // colours: the outline stays green.
      if (mode !== 'idle' && (state === 'underground' || state === 'menu')) {
        // CHECKPOINT 4: the outline follows the CLEARED hexagons — the
        // entrance, plus every hexagon the miner has cleared (more cleared
        // hexagons = more room to build). Green OUTLINE only, never a fill.
        ctx.save();
        HEX_GRID.forEach(function (cell) {
          if (!clearedCells[cell.k]) return;
          ctx.beginPath(); hexPath(cell.x, cell.y, HEXW); ctx.closePath();
          ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(150,255,140,.75)'; ctx.stroke();
        });
        ctx.restore();
      }
      placed.forEach(function (p) {
        // v34: a hatching basket draws v1's cracking-egg timeline, not the plain basket.
        if (p.id === 'eggbasket' && p.egg && p.egg.state === 'hatch') { drawHatchBasket(p); return; }
        // v39 fix 2: a desk with a kid STUDYING at it is hidden — the ksDesk
        // loop (kid + wooden desk) is drawn instead (drawKid). The blue desk
        // reappears when the kid leaves / grows.
        if (p.id === 'desk' && deskOccupied(p.uid)) return;
        // CHECKPOINT 4: a trade item with an ant TRAINING at it is hidden —
        // the training loop (ant + equipment) is drawn instead (drawTrainAnt).
        if (tradeItemTraining(p.uid)) return;
        var im = IMGS[p.id];
        // The basket shows the empty basket until she lays, then two eggs.
        if (p.id === 'eggbasket' && !p.egg) im = IBASKET_EMPTY;
        if (!im || !im.complete || !im.naturalWidth) return;
        var h = p.w * im.naturalHeight / im.naturalWidth;
        // v1: a building item is invisible until she arrives (t0 = DIG_PEND),
        // then fades in as the cloud clears (buildCover().room, the last 1.7s).
        var alpha = 1;
        if (p.building) {
          var tt = QT - p.t0;
          if (tt < 0) return;
          alpha = buildCover(tt).room;
          if (alpha <= 0) return;
        }
        ctx.save(); ctx.globalAlpha = alpha;
        ctx.drawImage(im, p.cx - p.w / 2, p.floorY - h, p.w, h);
        ctx.restore();
      });
      // CHECKPOINT 3: the kids — drawn after the placed items (on top, like
      // the queen), y-sorted among themselves by foot y. A rider is drawn by
      // its play loop (drawRider); a walker / idler by its own sprite.
      ANTS.slice().sort(function (a, b) { return a.y - b.y; }).forEach(function (a) { drawKid(a); });
      // CHECKPOINT 2: the carried ghost — white while it can be set down, red when it cannot.
      if (mode === 'carrying' && ghost && carryId) {
        var it = itemById(carryId);
        var im = IMGS[carryId];
        if (it && im && im.complete && im.naturalWidth) {
          var h = itemH(it), ok = ghostOK();
          ctx.save();
          ctx.globalAlpha = 0.85;
          ctx.drawImage(im, ghost.cx - it.w / 2, ghost.floorY - h, it.w, h);
          ctx.globalAlpha = 1;
          ctx.fillStyle = ok ? 'rgba(255,255,255,.38)' : 'rgba(255,60,40,.42)';
          ctx.fillRect(ghost.cx - it.w / 2, ghost.floorY - h, it.w, h);
          ctx.lineWidth = 2.5; ctx.strokeStyle = ok ? 'rgba(255,255,255,.9)' : 'rgba(255,60,40,.95)';
          ctx.strokeRect(ghost.cx - it.w / 2, ghost.floorY - h, it.w, h);
          ctx.restore();
        }
      }
      // CHECKPOINT 2: the build clouds — one per building item, covering the
      // spot while it builds (v1 drawBuildCloud, after the items so the cloud
      // covers the item being revealed underneath it).
      placed.forEach(function (p) { if (p.building) drawBuildCloud(p); });
    },
    isPlaced: function (id) { return placed.some(function (p) { return p.id === id; }); },
    place: function (id, cx, floorY, moved) {
      if (!isVisible(id) && !moved) return false; // the gate: a FRESH build needs the item visible in the menu (a move re-place is always allowed). A type built once is NOT enough — the basket hides again when the fridge/cooler is erased, and a 2nd basket must not be placeable while it is hidden.
      var it = itemById(id);
      if (!it) return false;
      // CHECKPOINT 2: a placed position (from the ghost) wins; no position = the default spot (checkpoint 1).
      var pcx = (typeof cx === 'number' ? cx : it.cx), pfy = (typeof floorY === 'number' ? floorY : it.floorY);
      // Multiples (Chris, Nov 15): any number of copies of one type. The 1st
      // is FREE, then 10, 20, 30... seed money per type. A moved copy keeps
      // the uid and the cost it was built for — moving is not a new purchase.
      var cost = moved ? moved.cost : nextPrice(id);
      var uid = moved ? moved.uid : nextUid++;
      if (moved) moveFrom = null; // the move is committed; a later cancel must not restore it again
      // v1: the item is added with t0 = DIG_PEND (not dug yet — no cloud,
      // invisible). The queen walks to the spot first; the cloud starts only
      // when she arrives; the timer starts only after the item is built.
      placed.push({ uid: uid, id: it.id, cx: pcx, floorY: pfy, w: it.w, building: true, t0: DIG_PEND, cost: cost }); // v39: no `used` flag — a park piece / desk is occupied while a kid is on it (slotTaken / toSchool) and FREED when he leaves; a waiting kid takes a freed one (Chris's capacity rule). The v32 "used forever" rule is gone.
      queenFree = true; // the QN system takes over from here; checkpoint 1 is done
      brainReset(); // v1: any build activity distracts the queen
      renderMenu();
      startBuild(uid, it.id, pcx, pfy);
      return true;
    },
    removeAt: function (wx, wy) {
      var p = placedItemAt(wx, wy);
      if (!p) return false;
      return removeItem(p.uid);
    },
    removeItem: removeItem,
    startSelect: startSelect,
    startMove: startMove,
    cancel: cancelPlacing,
    get mode() { return mode; },
    get moving() { return moveFrom; }, // the copy being moved (null for a fresh build) — read-only, for tests
    get placing() { return mode === 'carrying'; },
    get placed() { return placed.slice(); },
    get entrance() { return { x: ENTRANCE.x, y: ENTRANCE.y, w: HEXW }; }
  };

  // Test/debug handle for the checkpoint 2 timers (read-only state).
  window.BASE_TIMERS = {
    get brain() { return { t: BR.t, ready: BR.ready, brains: BR.brains, coins: BR.coins }; },
    get chain() { return { gateOpen: bedGate, visible: ITEMS.filter(function (it) { return isVisible(it.id); }).map(function (it) { return it.id; }) }; },
    get prices() { var out = {}; ITEMS.forEach(function (it) { out[it.id] = { count: placedCount(it.id), next: nextPrice(it.id) }; }); return out; },
    get dust() { return placed.filter(function (p) { return p.building; }).length; },
    get build() { return { active: activeBuild ? { id: activeBuild.id, cx: activeBuild.cx, floorY: activeBuild.floorY } : null, queued: buildQueue.length, meters: { food: MV.food, water: MV.water } }; },
    get room() {
      var out = {};
      for (var id in roomTimers) out[id] = { left: roomTimerLeft(id), ready: roomTimers[id].ready };
      return out;
    },
    get basket() {
      var p = basketPlaced();
      return p && p.egg ? { state: p.egg.state, tendsDone: p.egg.tendsDone, left: basketTimer(p) } : null;
    },
    get queen() { return { x: queen.x, y: queen.y, mode: QN.mode, busy: QN.busy, settled: QN.settled, home: QN.home }; },
    get kids() { // CHECKPOINT 3: the kids, generations, and the park/desk gates
      return {
        parkUnlocked: parkUnlocked, firstSlidePass: firstSlidePass, schoolUnlocked: schoolUnlocked,
        kids: ANTS.map(function (a) { return { id: a.id, m: a.m, state: a.state, x: Math.round(a.x), y: Math.round(a.y), slot: a.slot ? a.slot.piece + ':' + a.slot.k : null, rode: a.rode, schooled: a.schooled, toSchool: a.toSchool, schoolDesk: a.schoolDesk }; }),
        gens: GENS.map(function (g) { return { id: g.id, stage: g.stage, phase: g.phase, kids: g.kids.length, bx: g.bx, by: g.by }; }),
        parkVisible: PARK_ITEMS.filter(function (it) { return isVisible(it.id); }).map(function (it) { return it.id; }),
        schoolVisible: SCHOOL_ITEMS.filter(function (it) { return isVisible(it.id); }).map(function (it) { return it.id; }),
        parkPrices: (function () { var out = {}; PARK_ITEMS.forEach(function (it) { out[it.id] = { count: placedCount(it.id), next: nextPrice(it.id) }; }); return out; })(),
        schoolPrices: (function () { var out = {}; SCHOOL_ITEMS.forEach(function (it) { out[it.id] = { count: placedCount(it.id), next: nextPrice(it.id) }; }); return out; })()
      };
    },
    get trade() { // CHECKPOINT 4: trade school state (read-only, for the harness)
      return {
        tradeUnlocked: tradeUnlocked, freeEasel: FREE_EASEL,
        cleared: Object.keys(clearedCells).sort(),
        frontier: frontierCells().map(function (c) { return c.k; }),
        grid: HEX_GRID.map(function (c) { return { k: c.k, x: Math.round(c.x * 100) / 100, y: Math.round(c.y * 100) / 100 }; }),
        tradePrices: (function () { var out = {}; TRADE_ITEMS.forEach(function (it) { out[it.id] = { count: placedCount(it.id), next: nextPrice(it.id), visible: isVisible(it.id) }; }); return out; })(),
        ants: ANTS.map(function (a) { return { id: a.id, job: a.job || null, state: a.state, tradeItem: a.tradeItem || null, mine: a.mine ? a.mine.cell.k : null, mineDur: a.mine ? (a.mine.dur != null ? a.mine.dur : null) : null, hidden: !!a.hidden }; }),
        minerSpeed: MINER_SPEED, trainS: TRAIN_S, mineDiscoverS: MINE_DISCOVER_S, firstMineS: FIRST_MINE_S, minedCount: minedCount
      };
    }
  };
  // Test handle for the timer bubbles (tap entry points, same as the canvas tap).
  window.BASE_TEST = {
    brainBubble: brainBubble,
    roomTimerBubble: roomTimerBubble,
    basketBubbles: basketBubbles,
    tapBrainBubble: tapBrainBubble,
    tapRoomTimerBubble: tapRoomTimerBubble,
    tapBasketBubble: tapBasketBubble,
    get eraseMode() { return eraseMode; }, // v28: menu-bulldozer erase mode, armed or not
    get placed() { return placed.slice(); },
    // CHECKPOINT 3: the park tab / kids state (read-only, for the harness).
    get parkUnlocked() { return parkUnlocked; },
    get firstSlidePass() { return firstSlidePass; },
    get schoolUnlocked() { return schoolUnlocked; }, // v32: the school tab is open once the first slide pass is done
    // CHECKPOINT 4: trade school (read-only, for the harness).
    get tradeUnlocked() { return tradeUnlocked; },
    get freeEasel() { return FREE_EASEL; },
    get hexGrid() { return HEX_GRID.slice(); },
    get clearedCells() { return Object.keys(clearedCells); },
    frontierCells: frontierCells,
    pickFrontierCell: pickFrontierCell,
    _hexNeighbours: hexNeighbours,
    _hexCell: hexCellByKey,
    get kids() { return ANTS.slice(); },
    get gens() { return GENS.slice(); },
    get tabs() { return TABS.map(function (t) { return t.id; }); },
    get activeTab() { return activeTab; },
    // v34: the cracking hatch (read-only, for the harness).
    get hatchTimelineLoaded() { return !!HATCH_TL; },
    get basketEgg() { var p = basketPlaced(); return p && p.egg ? { state: p.egg.state, h0: p.egg.h0, spawned: p.egg.spawned ? p.egg.spawned.slice() : null } : null; }
  };

  // ---- the build menu (always on, just the four items + the bulldozer) ----
  var style = document.createElement('style');
  style.textContent =
    '.bl-head{display:flex;justify-content:space-between;align-items:flex-end;padding:2px 6px 0}' +
    '.bl-title{color:#f3e6c8;font-size:17px;font-weight:700;letter-spacing:.5px}' +
    '.bl-dozer{flex:none;border:2px solid #82562f;border-radius:12px;background:rgba(255,244,220,.14);color:#f3e6c8;font-size:22px;line-height:1;padding:6px 12px;cursor:pointer}' +
    '.bl-dozer.on{background:#a93226;border-color:#e74c3c}' +
    '.bl-dozer img{height:22px;width:auto;display:block}' + // v31: the bulldozer picture (cut from Chris's photo), same height as the old emoji so the button stays the same size
    '.bl-cards{display:flex;gap:10px;justify-content:flex-start;border-top:2px solid #82562f}' +
    '.bl-card{flex:0 0 calc((100% - 30px)/4);position:relative;background:linear-gradient(#2b1c11,#1e130d);border:1px solid #1d100a;border-radius:14px;padding:8px 6px 8px;display:flex;flex-direction:column;align-items:center;gap:5px;box-shadow:inset 0 3px 12px #08040299}' +
    '.bl-thumb{width:100%;height:104px;background-size:contain;background-repeat:no-repeat;background-position:center bottom}' +
    '.bl-name{color:#f3e6c8;font-size:14px}' +
    '.bl-price{position:absolute;top:36px;right:6px;color:#fff;font-weight:700;font-size:13px;text-shadow:0 1px 3px rgba(0,0,0,.85)}' +
    '.bl-build{position:absolute;top:6px;right:6px;border:0;border-radius:9px;background:linear-gradient(180deg,#7fb069,#4c8a3f);color:#fff;font-size:13px;font-weight:700;padding:5px 9px;cursor:pointer}' +
    '.bl-build.bl-cant{background:linear-gradient(180deg,#e74c3c,#c0392b);cursor:not-allowed}' +
    '.bl-build:disabled{background:#5a5148;cursor:default}' +
    '.bl-cancel{background:linear-gradient(180deg,#a93226,#7e241b)}' +
    '.bl-tabs{display:flex;gap:8px;padding:0;align-items:flex-end;flex:1 1 auto;min-width:0}' +
    // folder tab: a real file-folder tab, not a button. Raised flat top with
    // a sloped right side (clip-path), in the menu's own dark brown (no paper
    // colour), a lighter top for depth, a darker bottom edge for thickness,
    // and a cast shadow under the active tab. The tab's right slope runs all
    // the way down to the menu's top edge (the folder line, .bl-cards
    // border-top), so the outline flows continuously from the tab into the
    // menu's top edge as one folder outline. The tab's flat bottom meets
    // the menu body below with no gap, so it reads as part of the folder.
    '.bl-tab{border:0;width:97px;flex:0 1 97px;min-width:0;box-sizing:border-box;padding:5px 20px 4px;margin-bottom:-1px;cursor:pointer;line-height:0;display:flex;justify-content:center;align-items:center;background:linear-gradient(180deg,#3d2c1d,#2a1c11 60%,#20140c);clip-path:polygon(0 100%,0 0,60% 0,80% 100%,100% 100%);box-shadow:inset 0 1px 0 rgba(255,214,160,.18),inset 0 -4px 0 rgba(0,0,0,.35)}' + // v30 fix 1: FIXED width so the park tab is the SAME SIZE as the crown tab — the slide picture (124x112) is narrower than the crown (255x112), so an auto-width park tab came out ~29px narrower. 97px = the crown tab's width (25px-high crown image ~57px + 40px padding). v47 fix 3: the tabs SHRINK (flex:0 1 97px; min-width:0) when all four are visible — v44's 4th (trade) tab made the head row 473px wide on a ~366px phone menu, pushing the bulldozer off the right edge (clipped by the tray). With 1-3 tabs they stay 97px; with 4 they share the space (~73px each) and the bulldozer stays put (flex:none).
    '.bl-tab img{height:25px;width:auto;display:block;clip-path:inset(0 33.2% 0 33%);transform:translateX(-14px)}' +
    '.bl-tab.bl-tab-park img{clip-path:none;transform:translateX(-13px)}' + // v32 fix 1: centre the slide in the park tab — it sat too far right. Same kind of centring as the crown's -14px: the tab's asymmetric shape puts its visual centre at 34.2px (35.2% of 97px), not the geometric 48.5px, and the slide's own ink sits 1.48px left of its image centre at display scale, so the image needs -13px to read centred.
    '.bl-tab.bl-tab-school img{clip-path:none;transform:translateX(-14px)}' + // v32 fix 2: the school tab's picture is the desk (a plain item picture, no clip). Same tab asymmetry as the crown, and the desk's ink sits only 0.29px left of its image centre at display scale, so it needs the same -14px as the crown to read centred.
    '.bl-tab.bl-tab-trade img{clip-path:none;transform:translateX(-14px)}' + // CHECKPOINT 4: the trade tab's picture is the hammer (a tight crop of Chris's photo, no clip). Same tab asymmetry as the crown/desk, and the hammer's ink is centred in its crop, so it needs the same -14px to read centred.
    '.bl-tab.on{background:linear-gradient(180deg,#5a4128,#38271c 55%,#2e1d12);box-shadow:inset 0 1px 0 rgba(255,220,170,.35),inset 0 -4px 0 rgba(0,0,0,.4);filter:drop-shadow(0 3px 3px rgba(0,0,0,.45))}' +
    '.bvFly{position:absolute;z-index:9461;width:28px;height:auto;margin:-14px 0 0 -14px;pointer-events:none}' +
    // v1's food/water meters (index.html #bvMeters / .bm3-meter): the little
    // meters at the top of the screen, crown on top, food + water rows. They
    // flash on while the leaves/droplets fly to them, then fade (2.5s).
    '#bvMeters{--u:0.86px;position:absolute;z-index:6;top:calc(60px + env(safe-area-inset-top,0px));right:calc(84px + env(safe-area-inset-right,0px));display:flex;flex-direction:column;align-items:center;gap:4px;padding:4px 8px 6px;border-radius:12px;background:rgba(40,30,20,.62);pointer-events:none;opacity:0;transition:opacity .6s}' +
    '#bvMeters.on{opacity:1;transition:opacity .15s}' +
    '#bvMeters .crown{display:block;width:calc(34*var(--u));height:auto;clip-path:inset(0 33.2% 0 33%);margin-bottom:-2px}' +
    '.bm3-meter{width:calc(128*var(--u));height:calc(22*var(--u));display:flex;align-items:center;gap:calc(5*var(--u))}' +
    '.bm3-meter i{flex:none;width:calc(20*var(--u));height:calc(20*var(--u));background:center/contain no-repeat}' +
    '.bm3-meter .bar{flex:1;height:calc(10*var(--u));border-radius:calc(6*var(--u));background:rgba(0,0,0,.45);border:1px solid #f3cf82;overflow:hidden}' +
    '.bm3-meter .bar b{display:block;height:100%;width:0;transition:width .3s}' +
    '.bm3-meter em{flex:none;min-width:34px;text-align:right;font:800 calc(13*var(--u))/1 \'BM3 Sans\',\'DejaVu Sans\',sans-serif;color:#fff;font-style:normal;text-shadow:0 1px 2px #000}' +
    // CHECKPOINT 2: the item bubble (tap a placed item).
    '.bl-bubble{position:absolute;z-index:6;display:none;min-width:190px;max-width:260px;background:linear-gradient(#2b1c11,#1e130d);border:2px solid #82562f;border-radius:14px;padding:10px 12px;box-shadow:0 4px 18px #00000080;text-align:center}' +
    '.bl-bname{color:#f3e6c8;font-size:15px;font-weight:700;margin-bottom:8px}' +
    '.bl-bq{color:#f3e6c8;font-size:14px;margin-bottom:10px}' +
    '.bl-brow{display:flex;gap:8px;justify-content:center}' +
    '.bl-brow button{border:0;border-radius:10px;padding:8px 12px;font-size:14px;font-weight:700;cursor:pointer}' +
    '.bl-bmove{background:linear-gradient(180deg,#7fb069,#4c8a3f);color:#fff}' +
    '.bl-berase{background:linear-gradient(180deg,#a93226,#7e241b);color:#fff}' +
    '.bl-berase img{height:16px;width:auto;vertical-align:-2px;margin-right:2px}' + // v33: the bulldozer picture next to "Destroy", same cut-out as the menu button
    '.bl-byes{background:linear-gradient(180deg,#7fb069,#4c8a3f);color:#fff}' +
    '.bl-bno{background:#5a5148;color:#e8dcc8}';
  document.head.appendChild(style);

  // ---- CHECKPOINT 2: the Build menu tabs ----
  // The menu holds the things to build, on tabs. The queen tab holds the four
  // queen items (leaf bed, egg basket, fridge, water cooler). Its icon is v1's
  // crown, assets/menu-ant/hat-crown-lowered.webp, copied unchanged (md5
  // 46a84515). The park tab (checkpoint 3) holds the four park items; its
  // icon is the slide. The school tab (checkpoint 3, v32) holds the desk; its
  // icon is the desk. Each tab's picture is its key item.
  var CROWN_SRC = 'assets/menu-ant/hat-crown-lowered.webp';
  var SLIDE_SRC = 'assets/items/slide.png'; // CHECKPOINT 3: the park tab's picture is the slide
  var DESK_SRC = 'assets/items/desk.png'; // CHECKPOINT 3, v32: the school tab's picture is the desk
  var HAMMER_SRC = 'assets/items/hammer-tab.png?v=44'; // CHECKPOINT 4: the trade school tab's picture is the HAMMER, cropped from Chris's photo (the blue "x3" cut out, background made transparent)
  var schoolUnlocked = false; // v32: opens when a kid completes the first slide pass (the school tab appears, with the desk on it)
  var BULLDOZER_SRC = 'assets/items/bulldozer.png?v=32'; // v32 fix 4: the CARTOON bulldozer from the other game Chris likes better (side view, facing left, big front blade) — cut from his reference screenshot, button background removed, edges decontaminated. Replaces the v31 photo cut-out. Never the tractor emoji.
  var TABS = [{ id: 'queen', icon: CROWN_SRC, items: ITEMS }, { id: 'park', icon: SLIDE_SRC, items: PARK_ITEMS }, { id: 'school', icon: DESK_SRC, items: SCHOOL_ITEMS }, { id: 'trade', icon: HAMMER_SRC, items: TRADE_ITEMS }];
  var activeTab = 'queen';
  function tabOf(id) { for (var i = 0; i < TABS.length; i++) if (TABS[i].id === id) return TABS[i]; return TABS[0]; }

  // ---- CHECKPOINT 2: the food/water meters (v1 #bvMeters / .bm3-meter) ----
  // v1's little meters at the top of the screen (crown on top, food + water
  // rows). The leaves fly up to the right into the food meter and the
  // droplets into the water meter; each landing steps that meter up (v1
  // flyIcons / hud). They flash on while the icons fly, then fade (v1
  // flashMeters, HUD_FLASH_MS 2.5s). Only food + water here — the brain has
  // its own counter above the queen's head, and there is no money HUD.
  var metersEl = null, metT = 0;
  var HUD_FLASH_MS = 2500; // v1
  function setMeter(k, v, cap, label) {
    if (!metersEl) return;
    var rows = metersEl.querySelectorAll('.bm3-meter[data-m="' + k + '"]');
    for (var i = 0; i < rows.length; i++) {
      var r = rows[i], b = r.querySelector('b');
      if (b) b.style.width = (100 * v / cap).toFixed(1) + '%';
      var em = r.querySelector('em');
      if (em && em.textContent !== label) em.textContent = label;
    }
  }
  function hudMeters() {
    setMeter('food', MV.food, METERS.food.cap, String(Math.round(MV.food)));
    setMeter('water', MV.water, METERS.water.cap, String(Math.round(MV.water)));
  }
  function flashMeters() {
    if (!metersEl) return;
    metersEl.classList.add('on');
    clearTimeout(metT);
    metT = setTimeout(function () { metersEl.classList.remove('on'); }, HUD_FLASH_MS);
  }
  function createMeters() {
    var game = document.querySelector('#game');
    if (!game || metersEl) return;
    metersEl = document.createElement('div');
    metersEl.id = 'bvMeters';
    metersEl.setAttribute('aria-label', 'Queen meters');
    metersEl.innerHTML = '<img class="crown" alt="" draggable="false" src="' + CROWN_SRC + '">' +
      '<div class="bm3-meter" data-m="food"><i style="background-image:url(assets/icons/fi_leaf.webp)"></i><span class="bar"><b style="background:linear-gradient(90deg,#ffd27a,#e89a2c)"></b></span><em></em></div>' +
      '<div class="bm3-meter" data-m="water"><i style="background-image:url(assets/icons/icon_water_droplet.png)"></i><span class="bar"><b style="background:linear-gradient(90deg,#9fd6ff,#3f8fd8)"></b></span><em></em></div>';
    game.appendChild(metersEl);
    hudMeters();
  }
  createMeters();

  var tray = document.querySelector('#emptyTray');

  // ---- CHECKPOINT 2: the menu bulldozer arms erase mode (v28) ----
  // The menu bulldozer (top right) is NOT a no-op any more. Pressing it arms
  // erase mode: the bulldozer turns red (.bl-dozer.on) so he can tell it is
  // on. While it is on, tapping a placed item opens the SAME confirmation
  // the bubble's own bulldozer uses — "Are you sure you want to destroy it?"
  // — and only a Yes erases it (removeItem, the bubble erase's own path).
  // Pressing the bulldozer again, or tapping empty space, turns erase mode
  // off. When it is off, tapping a placed item behaves exactly as before
  // (the move/erase bubble). The bulldozer never erases anything by itself;
  // it only arms the mode. (v1's bulldozer is per-room MOVE — the room
  // panel's "Move room (bulldozer)" — there is no menu-level erase mode in
  // v1, so this reuses checkpoint 2's own bubble erase flow instead.)
  var eraseMode = false;

  function renderMenu() {
    if (!tray) return;
    if (activeTab === 'park' && !parkUnlocked) activeTab = 'queen'; // the park tab cannot be active before the first hatch
    if (activeTab === 'school' && !schoolUnlocked) activeTab = 'queen'; // v32: the school tab cannot be active before the first slide pass
    if (activeTab === 'trade' && !tradeUnlocked) activeTab = 'queen'; // CHECKPOINT 4: the trade tab cannot be active before the first kid grows up
    var html = '<div class="bl-head">' +
      '<div class="bl-tabs">' +
      TABS.map(function (t) {
        if (t.id === 'park' && !parkUnlocked) return ''; // the park tab is hidden until the first hatch (no "Locked" tab)
        if (t.id === 'school' && !schoolUnlocked) return ''; // v32: the school tab is hidden until the first slide pass (no "Locked" tab)
        if (t.id === 'trade' && !tradeUnlocked) return ''; // CHECKPOINT 4: the trade tab is hidden until the first kid grows up (no "Locked" tab)
        return '<button type="button" class="bl-tab' + (t.id === 'park' ? ' bl-tab-park' : t.id === 'school' ? ' bl-tab-school' : t.id === 'trade' ? ' bl-tab-trade' : '') + (t.id === activeTab ? ' on' : '') + '" data-tab="' + t.id + '" aria-label="' + t.id + '"><img alt="" draggable="false" src="' + t.icon + '"></button>';
      }).join('') +
      '</div>' +
      '<button type="button" class="bl-dozer' + (eraseMode ? ' on' : '') + '" id="blDozer" aria-label="Bulldozer: remove a placed item"><img alt="" draggable="false" src="' + BULLDOZER_SRC + '"></button></div>' +
      '<div class="bl-cards">';
    tabOf(activeTab).items.forEach(function (it) {
      if (!isVisible(it.id)) return; // the bed gate: hidden items are not shown at all, never "Locked"
      var price = nextPrice(it.id); // the NEXT copy: firstPrice + 10 per copy already placed (per type)
      var afford = canAfford(price); // green when he can build, red only when he cannot afford it
      var active = (mode !== 'idle' && carryId === it.id);
      html += '<div class="bl-card">' +
        '<div class="bl-thumb" style="background-image:url(' + it.src + ');' + (it.thumb || '') + '"></div>' +
        '<div class="bl-name">' + it.name + '</div>' +
        (price === 0 ? '' : '<div class="bl-price">$' + price + '</div>') +
        (active
          ? '<button type="button" class="bl-build bl-cancel" data-cancel="' + it.id + '">\u2715 Cancel</button>'
          : '<button type="button" class="bl-build' + (afford ? '' : ' bl-cant') + '" data-build="' + it.id + '">BUILD</button>') +
        '</div>';
    });
    html += '</div>';
    tray.innerHTML = html;
    var dz = document.getElementById('blDozer');
    if (dz) dz.addEventListener('click', function (e) {
      e.stopPropagation();
      // v28: the menu bulldozer arms erase mode (it is no longer a no-op).
      // Red = armed: tapping a placed item asks "Are you sure you want to
      // destroy it?" first. Pressing it again turns erase mode off.
      eraseMode = !eraseMode;
      if (eraseMode) hideBubble();
      renderMenu();
    });
    tray.querySelectorAll('[data-build]').forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.stopPropagation();
        var id = b.getAttribute('data-build');
        if (!canAfford(nextPrice(id))) return; // red button: not enough seed money, cannot build
        window.BASE_ITEMS.startSelect(id);
      });
    });
    tray.querySelectorAll('[data-cancel]').forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.stopPropagation();
        window.BASE_ITEMS.cancel();
      });
    });
    tray.querySelectorAll('[data-tab]').forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.stopPropagation();
        activeTab = b.getAttribute('data-tab');
        renderMenu();
      });
    });
  }

  // ---- CHECKPOINT 2: the item bubble ----
  // Tap a placed item: a bubble with arrows to MOVE it inside the hexagon and a
  // bulldozer to ERASE it. The bulldozer asks "are you sure?" first.
  var bubbleEl = null, bubbleUid = null, bubbleMode = 'actions', bubbleRAF = null;
  function ensureBubble() {
    if (bubbleEl) return bubbleEl;
    var game = document.querySelector('#game');
    bubbleEl = document.createElement('div');
    bubbleEl.className = 'bl-bubble';
    bubbleEl.id = 'blBubble';
    if (game) game.appendChild(bubbleEl);
    return bubbleEl;
  }
  function renderBubble() {
    var el = ensureBubble();
    if (!bubbleUid) return;
    var bp = null;
    for (var i = 0; i < placed.length; i++) if (placed[i].uid === bubbleUid) { bp = placed[i]; break; }
    if (!bp) { hideBubble(); return; }
    var it = itemById(bp.id);
    var name = it ? it.name : 'Item';
    if (bubbleMode === 'confirm') {
      el.innerHTML = '<div class="bl-bq">Are you sure you want to destroy it?</div>' +
        '<div class="bl-brow"><button type="button" class="bl-byes" data-act="yes">Yes</button>' +
        '<button type="button" class="bl-bno" data-act="no">No</button></div>';
    } else {
      el.innerHTML = '<div class="bl-bname">' + name + '</div>' +
        '<div class="bl-brow"><button type="button" class="bl-bmove" data-act="move">\u2194\uFE0F Move</button>' +
        '<button type="button" class="bl-berase" data-act="erase"><img alt="" draggable="false" src="' + BULLDOZER_SRC + '"> Destroy</button></div>';
    }
    el.querySelectorAll('[data-act]').forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.stopPropagation();
        var act = b.getAttribute('data-act');
        if (act === 'move') startMove(bubbleUid);
        else if (act === 'erase') { bubbleMode = 'confirm'; renderBubble(); }
        else if (act === 'yes') { var uid = bubbleUid; hideBubble(); removeItem(uid); }
        else if (act === 'no') { bubbleMode = 'actions'; renderBubble(); }
      });
    });
  }
  function positionBubble() {
    var el = bubbleEl;
    if (!el || !bubbleUid) return;
    var p = null;
    for (var i = 0; i < placed.length; i++) if (placed[i].uid === bubbleUid) { p = placed[i]; break; }
    if (!p) { hideBubble(); return; }
    var im = IMGS[p.id];
    var h = (im && im.naturalWidth) ? p.w * im.naturalHeight / im.naturalWidth : p.w * 0.8;
    // Screen position of the item's top centre (same transform as positionTarget).
    var c = worldToCanvas(p.cx, p.floorY - h);
    var panY = (typeof pan !== 'undefined' ? pan : 0);
    var sx = view.x + c.x * view.s, sy = view.y + (c.y - panY) * view.s;
    var game = document.querySelector('#game');
    var gw = game ? game.clientWidth : window.innerWidth;
    var bw = el.offsetWidth || 200, bh = el.offsetHeight || 90;
    var left = sx - bw / 2, top = sy - bh - 10;
    if (top < 8) { // near the top: put the bubble below the item instead
      var cb = worldToCanvas(p.cx, p.floorY);
      top = view.y + (cb.y - panY) * view.s + 10;
    }
    left = Math.max(8, Math.min(left, gw - bw - 8));
    top = Math.max(8, top);
    el.style.left = left + 'px';
    el.style.top = top + 'px';
  }
  function showBubble(uid) {
    bubbleUid = uid; bubbleMode = 'actions';
    var el = ensureBubble();
    renderBubble();
    el.style.display = 'block';
    positionBubble();
    if (!bubbleRAF) {
      var loop = function () {
        if (!bubbleEl || bubbleEl.style.display === 'none') { bubbleRAF = null; return; }
        positionBubble();
        bubbleRAF = requestAnimationFrame(loop);
      };
      bubbleRAF = requestAnimationFrame(loop);
    }
  }
  // v28: erase mode — open the bubble straight on the confirmation the
  // bubble's own bulldozer uses. Yes erases it (removeItem, the bubble
  // erase's own path); No goes back to the move/erase actions.
  function showBubbleConfirm(uid) {
    showBubble(uid);
    bubbleMode = 'confirm';
    renderBubble();
  }
  function hideBubble() {
    bubbleUid = null; bubbleMode = 'actions';
    if (bubbleRAF) { cancelAnimationFrame(bubbleRAF); bubbleRAF = null; }
    if (bubbleEl) bubbleEl.style.display = 'none';
  }

  // CHECKPOINT 2 TIMERS: the brain / eat / drink / tend / spoil bubbles are
  // canvas bubbles (v1 hitBubble: nearest bubble within r*1.35 wins). They are
  // checked before the placed-item bubble, so a tap on the brain bubble above
  // her head does not open the bed's move/erase bubble.
  function hitTimerBubble(w) {
    var list = [];
    var bb = brainBubble();
    if (bb) list.push(bb);
    var eb = roomTimerBubble('fridge'); if (eb) list.push(eb);
    var db = roomTimerBubble('watercooler'); if (db) list.push(db);
    var tb = basketBubbles();
    for (var i = 0; i < tb.length; i++) list.push(tb[i]);
    var best = null, bd = 1e18;
    for (var j = 0; j < list.length; j++) {
      var b = list[j], d = Math.hypot(w.x - b.x, w.y - b.y);
      if (d <= b.r * 1.35 && d < bd) { bd = d; best = b; }
    }
    return best;
  }

  // CHECKPOINT 2: tap BUILD and the ghost is carried straight into the one
  // entrance hexagon; drag to move the ghost, tap to set it down. A drag only
  // moves the ghost — only a tap (down and up in one spot) places it.
  // In idle, a tap on a placed item opens its bubble; a tap anywhere else closes it.
  var cv = document.querySelector('#scene');
  var pd = null; // {id, x, y, moved} in eventCanvas coords
  function toWorld(e) {
    var c = eventCanvas(e);
    return canvasToWorld(c.x, c.y + (typeof pan !== 'undefined' ? pan : 0));
  }
  if (cv) {
    cv.addEventListener('pointerdown', function (e) {
      if (typeof state !== 'undefined' && state !== 'underground' && state !== 'menu') return;
      var p = eventCanvas(e);
      pd = { id: e.pointerId, x: p.x, y: p.y, moved: false };
      if (mode === 'carrying') {
        var w = toWorld(e);
        ghost.cx = w.x; ghost.floorY = w.y;
        try { cv.setPointerCapture(e.pointerId); } catch (err) {}
      }
    });
    cv.addEventListener('pointermove', function (e) {
      if (!pd || pd.id !== e.pointerId) return;
      var p = eventCanvas(e);
      if (Math.hypot(p.x - pd.x, p.y - pd.y) > 8) pd.moved = true;
      if (mode === 'carrying' && pd.moved) {
        var w = toWorld(e);
        ghost.cx = w.x; ghost.floorY = w.y;
      }
    });
    var endPlacePtr = function (e) {
      if (!pd || pd.id !== e.pointerId) return;
      var wasTap = !pd.moved; pd = null;
      if (e.type === 'pointercancel') return;
      if (!wasTap) return;
      if (typeof state !== 'undefined' && state !== 'underground' && state !== 'menu') return;
      if (mode === 'carrying') {
        if (ghostOK()) {
          var id = carryId, g = ghost;
          var moved = moveFrom; // the copy being moved (null for a fresh build) — it keeps its uid and cost
          moveFrom = null; // placed now; cancelling must not restore it
          window.BASE_ITEMS.place(id, g.cx, g.floorY, moved);
          cancelPlacing();
        }
        // Red ghost: the tap does nothing, the item stays carried.
        return;
      }
      if (mode === 'idle') {
        var w = toWorld(e);
        var tb = hitTimerBubble(w);
        if (tb) {
          if (tb.kind === 'brain') tapBrainBubble(tb);
          else if (tb.kind === 'eat' || tb.kind === 'drink') tapRoomTimerBubble(tb);
          else if (tb.kind === 'tend' || tb.kind === 'spoil' || tb.kind === 'lay') tapBasketBubble(tb);
          return;
        }
        var hit = placedItemAt(w.x, w.y);
        if (hit) {
          // v28: erase mode armed — the tap asks "Are you sure you want to
          // destroy it?" (the bubble's own confirmation) instead of opening
          // the move/erase bubble; nothing is erased without a Yes.
          if (eraseMode) showBubbleConfirm(hit.uid);
          else showBubble(hit.uid);
        } else {
          // v28: tapping empty space turns erase mode off again.
          if (eraseMode) { eraseMode = false; renderMenu(); }
          hideBubble();
        }
      }
    };
    cv.addEventListener('pointerup', endPlacePtr);
    cv.addEventListener('pointercancel', endPlacePtr);
  }

  renderMenu();

  // TEST-ONLY ?start=downstairs / ?checkpoint=2 / ?checkpoint=3 / ?checkpoint=4: skip the (LOCKED) opening to the exact real arrival state.
  // ?checkpoint=2 is Chris's Checkpoint 2 test link: straight underground, menu open, ready to place.
  // ?checkpoint=3 is the same for checkpoint 3 testing.
  // ?checkpoint=4 is the same for checkpoint 4 testing, PLUS the trade-school
  // prerequisites (setupTradeTest): a grown-up ant at a desk, the trade tab open.
  function setupTradeTest() {
    // CHECKPOINT 4 test shortcut (Chris, Nov 17): start with the
    // prerequisites already met, so checkpoint 4 can be tested WITHOUT
    // playing through checkpoints 1-3. The bed is built (the queen's home,
    // so she walks to the globe and builds it); the desks are built and
    // each is occupied by a grown ant (the drawer rule: he leaves it for
    // the next thing once it is built). Nothing here touches checkpoints 1-3.
    // v47 (Chris, Nov 18): the shortcut covers the WHOLE trade school
    // section — THREE grown ants, one per trade (miner -> scout ->
    // soldier), each waiting at his own desk, so Chris can build the globe,
    // then the easel, then the dumbbell in one test session, without laying
    // eggs or waiting for kids to grow up. The unlock order is unchanged
    // (globe -> easel -> dumbbell, each offered after the previous is
    // built); tryAssignTrade sends the first waiting ant to the first free
    // trade with no worker yet, so the ants go off in order.
    bedGate = true; // she is settled on the bed
    parkUnlocked = true; schoolUnlocked = true; firstSlidePass = true; // the park and school tabs are open already
    tradeUnlocked = true;
    var bed = { uid: nextUid++, id: 'leafbed', cx: 2790, floorY: 5050, w: 27.34, building: false, t0: 0, cost: 0 };
    placed.push(bed);
    QN.home = { x: 2790, y: 5050 - itemH(itemById('leafbed')) * 0.175 }; QN.homeUid = bed.uid; QN.settled = true;
    genN++;
    var g = { id: genN, stage: 'kidschool', phase: 'done', kids: [], until: 0, growEnd: 0, bx: 2835, by: 5060 };
    GENS.push(g);
    // Three desks inside the entrance hexagon (centre 2812,5039, w 136.86):
    // bottom-right, left-middle, top-right — spread out, none overlapping
    // the bed (2790,5050) or each other.
    var deskSpots = [[2835, 5060], [2770, 5020], [2840, 5000]];
    for (var di = 0; di < deskSpots.length; di++) {
      var desk = { uid: nextUid++, id: 'desk', cx: deskSpots[di][0], floorY: deskSpots[di][1], w: 12.5, building: false, t0: 0, cost: 0 };
      placed.push(desk);
      var a = newKid(g, desk.cx, desk.floorY);
      a.m = 1; a.state = 'idle'; a.schooled = true; a.rode = true; a.toSchool = false; a.schoolDesk = desk.uid;
    }
    activeTab = 'trade';
    renderMenu();
  }
  if (URLQ.get('start') === 'downstairs' || URLQ.get('checkpoint') === '2' || URLQ.get('checkpoint') === '3' || URLQ.get('checkpoint') === '4') {
    var go = function () {
      if (typeof ready !== 'undefined' && !ready) { setTimeout(go, 40); return; }
      loadBasement();
      if (!basementReady) { setTimeout(go, 40); return; }
      emergeT0 = performance.now() - BC.EMERGE_SECONDS * 1000 - 1; emerged = true; // she already walked out in checkpoint 1; never replay on later descents
      begin('underground');
      if (URLQ.get('checkpoint') === '4') setupTradeTest(); // CHECKPOINT 4: the trade-school prerequisites, ready to test
      // Snap the camera to the real arrival view. The descending transition
      // does this in the real flow; the hook skips it, so without this the
      // camera stays at the start view and placed items sit off-screen.
      if (window.openingDemo) {
        window.openingDemo.setView({ lookX: BC.SPIRAL_W.x, lookY: BC.SPIRAL_W.y });
      }
    };
    go();
  }
})();
