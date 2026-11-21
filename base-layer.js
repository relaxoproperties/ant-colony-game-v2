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
// no HUD, no idea minigame. The counter IS the brain-giver. CHECKPOINT 2 STOPPED
// at 8 brains; CHECKPOINT 5 (v54) raises the cap to 9, where the squirrel comes
// (idea game at 10 is checkpoint 6).
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
// CHECKPOINT 5 (Nov 21, v54): the SQUIRREL, layered on checkpoint 4. At 9
// brains the squirrel runs in from the right, drops the plain acorn (the
// future Seed Money Bank's acorn, 1:1) on the first free surface hex, and
// runs out left; the game stays above ground and the acorn stays drawn.
// Brains are NOT reset — the 10th brain / idea game / bank are checkpoint 6.
// ?checkpoint=5 starts with 8 brains (one brain-bubble tap from the squirrel).
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
    { id: 'dumbbell',   name: 'Dumbbell curls',     src: 'assets/gym/dumbbell_curls/chris_ant_dumbbell_curls_empty_equipment.png?v=44',     cx: 2812, floorY: 5085, w: 23.5, first: 0,  trade: 'soldier', thumb: 'background-image:url(assets/gym/dumbbell_curls/chris_ant_dumbbell_curls_empty_equipment_thumb.png?v=51);' }, // v51 fix 2: the empty-equipment picture is two tiny dumbbells at the bottom of a 300x395 transparent frame (ink 133x30 px at y318-348), so at 104px contain it read as a ~46x10 black bar. The card thumbnail is a tight CROP of the same picture (173x66, ink fills it) — the in-game item is unchanged. Treadmill (423x230 ink) and bench (452x305 ink) already read large; left alone.
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
    // v55: while the queen's brain menu is open, its numbers stay live —
    // the S.W.A.R.M.S. counts, the food/water meters and the roster refresh
    // twice a second as ants change task. (bmRefreshT is declared with the
    // v55 block below; var hoisting makes this safe before it runs.)
    // v57: the roster panel refreshes on the same tick while it is open.
    // v59: the roster button lives INSIDE the brain menu now (Chris:
    // "I only want that to be in the brain menu, not in the actual
    // game"), so no game-screen visibility toggle is needed — the
    // button is hidden whenever the menu is hidden.
    if (typeof window !== 'undefined' && QT - bmRefreshT > 0.5) {
      bmRefreshT = QT;
      if (window.BrainMenu3 && BrainMenu3.isOpen) BrainMenu3.refresh();
      if (typeof rosterWin !== 'undefined' && rosterWin && !rosterWin.hidden) renderRosterWin();
    }
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
    drawUp: drawUpScout, // v49: draw the scout(s) on the surface while they are out (upstairs); v52: also the patrolling soldier(s)
  };

  // ---- CHECKPOINT 2: the brain timer (v1 CHAMBER_BUB / BRAIN_BED_ONLY) ----
  // v1: a 2-minute timer that runs ONLY while she rests idle and settled on her
  // Royal grass bed. When it completes, a brain bubble appears above her head;
  // tap = +1 brain, 2-3 coins (counted in BR.coins; checkpoint 2 has no money
  // HUD and no idea minigame). The timer pauses while placing and resets
  // whenever she leaves the bed (any build activity distracts her, v1 brainReset).
  var BRAIN_EVERY = 120; // v1 CHAMBER_BUB.EVERY_S
  var BRAIN_COINS = [2, 3]; // v1
  var BRAIN_CAP = 9; // CHECKPOINT 5 ends at 9 brains (v1's squirrel comes at 9, idea game at 10 — checkpoint 6)
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
  // v55 fix 1 (Chris, Nov 21): the bubble must ALSO appear while the build
  // menu is open (state === 'menu'). The timer already runs in menu state,
  // but the old `state === 'menu'` suppression meant that at 00:00 the
  // screen showed neither the counter (hidden once BR.ready) nor the
  // bubble. The placing suppression stays (hidden while carrying, per v1).
  function brainBubble() {
    if (!BR.ready || mode === 'carrying') return null;
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
    // Checkpoint 5 stops at 9 brains: no counter once she has 9.
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
    BR.ready = false; BR.t = 0; BR.brains = Math.min(BRAIN_CAP, BR.brains + 1); // checkpoint 5 stops at 9 brains
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
  // v53 (Chris, Nov 20): ANT SIZES — the queen WALKING is the reference.
  // Measured from the sprite files (PIL, alpha>=32, largest component):
  // queen-walk.webp frame: ant body 104x69 px, drawn at QUEEN_UNDER_W/200
  // world/px -> 17.86 wide x 11.85 high world. A grown side-walk sprite
  // (kid50/side_*.png) is visible 59x42 px, drawn at KW*2 world/px ->
  // 20.42 x 14.53 world — ~9% wider, ~15% taller than the queen walking.
  // That is why the scout/soldier read BIGGER when walking. WALK_F scales
  // every WALKING sprite so its visible body matches the queen's walking
  // body (width ratio 0.875, height ratio 0.816, geometric mean 0.845).
  // Idle sprites are NOT scaled: grown idle is 23.53 high vs the queen
  // idle 25.38 — already within 7%. Kids stay half-size (their walk is
  // WALK_F * 0.5, so a kid walking is half a grown ant walking, as in v1).
  var QUEEN_WALK_BODY_W = 17.86, QUEEN_WALK_BODY_H = 11.85;
  var WALK_F = 0.845;
  // v53 miner: the old "41 px visible ant" was WRONG — 41 px was the
  // frame rows 0..40, which include the baked-in DIRT DOTS. The ant body
  // itself (largest component, PIL) is 24 px wide x 27 px high, rows
  // 14..40, feet on row 40. At the old PW_S (23.53/41) the body was only
  // 13.8 x 15.5 world — that is why the digger looked super small.
  // MINER_PW_S sizes the body WIDTH to the queen's walking body width:
  // 24 px * PW_S = 17.86 world (body then 20.1 world high, digging pose).
  var MINER_BODY_W_PX = 24, MINER_BODY_H_PX = 27, MINER_FEET_ROW = 40;
  var MINER_PW_S = QUEEN_WALK_BODY_W / MINER_BODY_W_PX; // ~0.744 world/px
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
  function drawKidWalk(name, x, y, flip, m) { // v53: WALKING only — same sprite, scaled by WALK_F so the visible walking body matches the queen's walking body (17.86 x 11.85 world). Idle/riding sprites keep their v1 scale.
    drawKidSprite(name, x, y, flip, m * WALK_F);
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
    if (a.job === 'soldier' && a.guard) return; // v52: guarding UPSTAIRS — drawn in drawUp, never underground
    if (a.state === 'ride') { drawRider(a); return; }
    // CHECKPOINT 4: a training ant is the training loop (ant + equipment,
    // like the ksDesk loop), not the idle sprite — and a digging miner is
    // the dig strip. Both replace the ant's own sprite while they run.
    if (a.state === 'train') { drawTrainAnt(a); return; }
    if (a.state === 'dig') { drawMinerDig(a); return; }
    // v51: a scout carrying/delivering downstairs (v1 'down' / 'rest' /
    // 'downOut') is drawn underground at his under position, walking or
    // idle there — not at his (stale) surface spot, and not hidden.
    if (a.job === 'scout' && a.scout && a.scout.under && (a.scout.state === 'down' || a.scout.state === 'rest' || a.scout.state === 'downOut')) {
      var U = a.scout.under;
      if (U.path.length) drawKidWalk('side_' + pad2n(Math.floor(U.wf) % 16) + '.png', U.x, U.y, U.flip, a.m); // v53: walking size = queen walking size
      else drawKidSprite('idle_' + pad2n(IDLE_PLAY[Math.floor((QT + a.ph) * IDLE_FPS) % IDLE_PLAY.length]) + '.png', U.x, U.y, false, a.m);
      return;
    }
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
      drawKidWalk('side_' + pad2n(Math.floor(a.wf) % 16) + '.png', a.x, a.y, a.flip, a.m); // v53: walking size = queen walking size
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
  // v51: the 20 s wander-and-return timer (SCOUT_OUT_S, returnScout,
  // scoutNextOut) is GONE — it was invented in v49/v50; v1 has no such
  // timer. The scout below is the v1 tile machine (see the scout section).
  var GUARD_ARC = [165, 140, 115, 90, 65, 40, 15]; // v1 cp4 GUARD.ARC (degrees, around the hole)
  var GUARD_RX = 30, GUARD_RY = 16; // v1 cp4 GUARD.RX/RY (world units)
  var GUARD_SPEED = 40 * 69 * 0.175 / 26.1; // v1 cp4 GUARD.SPEED = v1's scoutSpeed (~18.5 world/s)
  var GUARD_GONE_S = 0.6, GUARD_FADE_S = 0.4; // v1 cp4 GUARD.GONE_S / FADE_S (emerge pause + fade-in)
  var GUARD_STEP_R = 8; // v1 cp4 GUARD.STEP_R (each extra soldier patrols one ring further out)
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
  // v51 fix 3 (Chris, Nov 19): the chalk/map training loops are drawn at
  // their OWN scale, not LOOP_S — the easel in the loop must match the
  // static easel item on the floor. Measured: the static easel image is
  // 244x420, ink 205 px wide, drawn at w=15 -> easel ink 12.60 world wide.
  // At LOOP_S (0.07837) the loop easels were 258 px (chalk) / 256 px (map)
  // of ink -> 20.2 / 20.1 world wide, ~1.6x the static easel — that is why
  // the training easel read "much larger" in his screenshot. The loop
  // scale is static-ink-width / loop-ink-width: 12.60/258 = 0.0488 (chalk),
  // 12.60/256 = 0.0492 (map). Same desk-swap idea as KSDESK_W (v40 fix 3):
  // the loop is sized by what it has to match, not by the generic loop
  // scale. TRADE-OFF, stated plainly: the loop easels are WIDE boards on
  // short legs while the static easel is NARROW and TALL, so no one uniform
  // scale matches both dimensions — width-matched, the loop easel stands
  // shorter than the static one (chalk frame 21.0 tall vs static 25.8),
  // and the ant in the loop shrinks with it (~15.8 world vs a grown ant's
  // 23.5). The globe/microscope loops are untouched (not part of this fix).
  var KS_CHALK_S = 0.0488, KS_MAP_S = 0.0492;
  var KS_CHALK = loadLoopFrames({ dir: 'assets/items/ks-chalk-nostep/chris_ant_chalkboard_', n: 32, fps: 8, ax: 150, ay: 413, s: KS_CHALK_S });
  var KS_MAP = loadLoopFrames({ dir: 'assets/items/ks-map-nostep/chris_ant_point_map_', n: 24, fps: 8, ax: 150, ay: 343, s: KS_MAP_S });
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
    var s = loop.s || LOOP_S, w = im.naturalWidth * s, h = im.naturalHeight * s; // v51 fix 3: chalk/map loops carry their own scale (loop.s) so the easel matches the static item; every other loop uses LOOP_S
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
    // are at a.y and his head is MINER_BODY_H_PX*MINER_PW_S above it (the
    // digging ant's body height, same formula as drawMinerDig), so the
    // timer sits at a.y - MINER_BODY_H_PX*MINER_PW_S - 8. It counts down from the full
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
      drawTag(a.x, a.y - MINER_BODY_H_PX * MINER_PW_S - 8, brainMmss(left), 1, 0); // v53: MINER_PW_S, same as drawMinerDig
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
    // v55 redesign (Chris, Nov 21): NO skill points — the brain menu is a
    // queen-only colony overview now, and the S.W.A.R.M.S. card numbers are
    // live counts of ants on each task, not spendable points. Nothing here
    // grants points any more.
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
    // SIZE (v53, Chris Nov 20): the miner digs at the QUEEN's walking
    // size. CORRECTION to the v46 measurement: "41 px" was the frame rows
    // 0..40, which include the baked-in DIRT DOTS. The ant BODY itself
    // (largest component, PIL) is 24 px wide x 27 px high, rows 14..40,
    // feet on row 40 — at the old PW_S (23.53/41) the body was only
    // 13.8 x 15.5 world, which is why the digger looked super small.
    // MINER_PW_S sizes the body WIDTH to the queen's walking body width
    // (24 px * PW_S = 17.86 world; body then 20.1 world high, digging pose).
    // The digging animation plays the WHOLE discovery, with the dirt dots
    // baked into the strip flying behind him the whole time (v46: the slow
    // progressive reveal — the animation never stops until the hexagon is
    // fully discovered). v48: no dustAt cloud (Chris — it looked like a
    // little tornado); the strip's own dirt dots are the whole effect.
    // The discovery is 120 s for the first hexagon, 2352 s after that (v48).
    // v58 (Chris, Nov 21): the arms ARE re-posed now — the front leg is
    // re-drawn frame by frame in plain-work-arms.webp (new file; the v57
    // cleaned strip is the source, original untouched). Hip fixed at
    // (46,33); the foot scrapes forward to x54, drags back, lifts, and
    // plants again — measured foot-tip x per frame [52,54,50,49,52,53],
    // max 5 px from the old static toe (49,39); v57 measured 0 px. Only
    // the leg patch (x44-56, y33-41) differs from the cleaned strip.
    var strip = art.plainWork;
    if (!strip || !strip.complete || !strip.naturalWidth) {
      drawKidSprite('idle_' + pad2n(IDLE_PLAY[Math.floor((QT + a.ph) * IDLE_FPS) % IDLE_PLAY.length]) + '.png', a.x, a.y, false, a.m);
      return;
    }
    var t0 = (a.mine && a.mine.digT0 != null) ? a.mine.digT0 : QT;
    var f = Math.floor((QT - t0) * 8) % 6;
    if (f < 0) f += 6;
    var PW_S = MINER_PW_S; // v53: body width = queen walking body width (17.86 world)
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
    // Feet (frame row 40) land on a.y; frame centred on a.x.
    ctx.drawImage(strip, f * 64, 0, 64, 61, -W / 2, -MINER_FEET_ROW * PW_S, W, H);
    ctx.restore();
    // v48 (Chris, Nov 18): NO dust cloud on the digging miner — the v1
    // dustAt puffs here looked like "a little tornado cloud" and he
    // doesn't want it. The dirt kicked up behind him is the dirt dots
    // BAKED INTO the plain-work strip itself (he likes those), so the
    // strip alone is the whole effect. dustAt itself stays (the build
    // cloud still uses it) — only the miner's call is gone.
  }
  // ---- the scout's job (Chris, Nov 17; v51 port from v1, Nov 19) ----
  // v51: the scout is v1's scout, ported faithfully from the old game
  // (index.html scout section + cp4 followers/solo). The v49/v50 scout —
  // a 20 s wander near the hole with no tile, no fog, no seeds, returning
  // on a clock (SCOUT_OUT_S, returnScout, scoutNextOut) — is GONE; that
  // whole timer loop was invented, v1 has no 20-second return timer.
  // v1's scout, in full:
  //  * TILE SYSTEM: the surface is tiles (TILE_MAP 311.67 x 526.53 world,
  //    centred on the mound). Home tile (0,0) first; then a tile picked at
  //    RANDOM from the 3x3 around his own tile (scoutChoices) that touches
  //    the discovered area (selectableTile). He finishes the tile, then
  //    picks the next one straight away.
  //  * SURFACE FOG: a fog mask (FM, 10-world cells, FOG_ALPHA 0.5) covers
  //    the map; the home tile is cleared at the start (clearHomeTile). He
  //    walks to the NEAREST fogged cell in his tile (nearestFog) and clears
  //    fog in a ~55-world radius only inside that tile (clearFogIn). When
  //    no fog is left in the tile, the tile is done (tileDone — cleared
  //    whole, soft edge) and joins the discovered area.
  //  * SMALL SEEDS: picked up ON THE MOVE at tile completion — never
  //    stopped for (+1 seed, +2-3 coins; the first one unlocks the farm
  //    in v1). Counted here (scoutSeedsFound / scoutCoinsEarned); this
  //    build has no seed inventory, no coins/wallet and no farm yet, so
  //    there is nothing to unlock or pay into — the counts are kept for
  //    checkpoint 6 (seed money bank), and the farm unlock is NOT claimed.
  //  * GIANT SEEDS: only after a tile is fully revealed, if a giant seed
  //    is on it (giantOnTile — the bird-feeder seed patches, coords copied
  //    verbatim from cp4's SEED_EXACT/SEED_XFORM; map-hd.jpg is exactly
  //    5625x10000 = WORLD, so those coords are world coords): he carries
  //    it home (toHole -> goneDown -> down to the classroom drop -> rest
  //    3 s -> downOut -> emerge) and picks the next tile. That is v1's
  //    carry-home path (index.html:758) — cp4's holdFinder (parking him
  //    idle at the found seed, finderHeld, never released in the code
  //    read) is NOT ported, per the task: no invented release.
  //  * MAP DONE: when no selectable tile is left anywhere, he comes home
  //    and STAYS home (cp4 scoutsStep: waiting -> toHole, rest held).
  //  * FOLLOWERS / SOLO (cp4): a second scout graduate FOLLOWS the lead
  //    at FOLLOW_OFF offsets while the lead is still scouting; once the
  //    lead has already found a seed, the second graduate scouts ALONE
  //    (solo — same tile machine, his own tile, starting where the lead
  //    stopped). Ported; the lead's speed stays the first-scout pace
  //    (cp4: joining must not bump SCOUT_LADDER).
  // Per-ant state: a.scout (lead or solo machine) or a.follow (follower).
  // a.state stays 'out' + a.hidden while he is on the surface; while he
  // is downstairs carrying/delivering (down/rest/downOut) he is drawn
  // underground at S.under (drawKid branch) and a.hidden is false.
  var SCOUT_TILE_W = 311.6667, SCOUT_TILE_H = 526.5278;
  var SCOUT_GX = HEX.cx, SCOUT_GY = HEX.cy;
  var SCOUT_ORIG = SCOUT_TILE_W / 499; // v1 ORIG_TO_MAP
  var SCOUT_R = 88 * SCOUT_ORIG; // ~55 world — fog clear radius around him
  var SCOUT_FOG_CLEAR = 24, SCOUT_FC = 10, SCOUT_TILE_MARGIN = 14 * SCOUT_ORIG;
  var SCOUT_FOG_ALPHA = 0.5, SCOUT_TILE_F = 70; // tileDone soft edge
  var SCOUT_WALK = 40 * 69 * 0.175 / 26.1; // v1 SCOUT_WALK (~18.5 world/s)
  // v1 HOLE_UP / EMERGE_UP, from the opening's own numbers (the mound door
  // and the spot just out of it). Falls back to the mound hex centre when
  // the opening's consts are not in scope (harness).
  var SCOUT_HOLE_UP = (function () {
    try {
      if (typeof MAP_RECT !== 'undefined' && typeof START_SPP !== 'undefined' && typeof FAR !== 'undefined' && typeof Q !== 'undefined' && typeof D !== 'undefined')
        return { x: MAP_RECT.x + (FAR.ox + D.x * FAR.s) / START_SPP, y: MAP_RECT.y + (FAR.oy + (D.bottom - 28) * FAR.s) / START_SPP };
    } catch (e) {}
    return { x: HEX.cx, y: HEX.cy };
  })();
  var SCOUT_EMERGE_UP = (function () {
    try {
      if (typeof MAP_RECT !== 'undefined' && typeof START_SPP !== 'undefined' && typeof FAR !== 'undefined' && typeof Q !== 'undefined' && typeof D !== 'undefined')
        return { x: MAP_RECT.x + (FAR.ox + (2 * Q.x - D.x) * FAR.s) / START_SPP, y: MAP_RECT.y + (FAR.oy + (2 * Q.y - (D.bottom - 28)) * FAR.s) / START_SPP };
    } catch (e) {}
    return { x: HEX.cx + 12, y: HEX.cy + 22 };
  })();
  // ---- surface fog (v1 FM / fogCanvas, black at FOG_ALPHA) ----
  var SF_FW = Math.ceil(WORLD.w / SCOUT_FC), SF_FH = Math.ceil(WORLD.h / SCOUT_FC);
  var SFM = new Uint8Array(SF_FW * SF_FH).fill(255);
  var sfC = null, sfX = null, sfID = null, sfDirty = true, sfPutAt = -1e9, sfOn = false, sfCanvasOk = false;
  var scoutDiscovered = new Set(['0,0']);
  var scoutScoutsHome = false; // map fully explored: scouts come home and stay home
  var scoutSeedsFound = 0, scoutCoinsEarned = 0, scoutFirstSeed = false;
  var SCOUT_SMALL = []; // {x,y,taken}
  var SCOUT_LEAD = null; // the ant running the lead scout machine
  function sfInitCanvas() {
    if (sfC) return sfCanvasOk;
    try {
      sfC = document.createElement('canvas'); sfC.width = SF_FW; sfC.height = SF_FH;
      sfX = sfC.getContext('2d');
      if (!sfX || typeof sfX.createImageData !== 'function' || typeof sfX.putImageData !== 'function') { sfCanvasOk = false; return false; }
      sfID = sfX.createImageData(SF_FW, SF_FH);
      sfCanvasOk = true; return true;
    } catch (e) { sfCanvasOk = false; return false; }
  }
  function sfFogCanvas(now) { // v1 fogCanvas: putImageData at most every 90 ms; alpha = mask, RGB black
    if (!sfInitCanvas()) return null;
    if (sfDirty && now - sfPutAt > 90) {
      var d = sfID.data, k;
      for (k = 0; k < SFM.length; k++) d[k * 4 + 3] = SFM[k];
      try { sfX.putImageData(sfID, 0, 0); } catch (e) { return null; }
      sfDirty = false; sfPutAt = now;
    }
    return sfC;
  }
  function scoutFogAt(x, y) { var i = Math.floor(x / SCOUT_FC), j = Math.floor(y / SCOUT_FC); if (i < 0 || j < 0 || i >= SF_FW || j >= SF_FH) return 255; return SFM[j * SF_FW + i]; }
  function scoutTileRect(c, r) { var cx = SCOUT_GX + c * SCOUT_TILE_W, cy = SCOUT_GY + r * SCOUT_TILE_H; return { x0: cx - SCOUT_TILE_W / 2, y0: cy - SCOUT_TILE_H / 2, x1: cx + SCOUT_TILE_W / 2, y1: cy + SCOUT_TILE_H / 2, cx: cx, cy: cy }; }
  function scoutTileValid(c, r) { var t = scoutTileRect(c, r); return t.cx >= 0 && t.cx <= WORLD.w && t.cy >= 0 && t.cy <= WORLD.h; }
  function scoutTileCells(c, r) { var t = scoutTileRect(c, r); return { i0: Math.max(0, Math.ceil(t.x0 / SCOUT_FC)), i1: Math.min(SF_FW, Math.floor(t.x1 / SCOUT_FC)), j0: Math.max(0, Math.ceil(t.y0 / SCOUT_FC)), j1: Math.min(SF_FH, Math.floor(t.y1 / SCOUT_FC)), t: t }; }
  function scoutTileOfPt(x, y) { return [Math.round((x - SCOUT_GX) / SCOUT_TILE_W), Math.round((y - SCOUT_GY) / SCOUT_TILE_H)]; }
  function scoutTileBusy(k) { // a tile is busy while the lead or a solo scout is working it
    for (var i = 0; i < ANTS.length; i++) { var a = ANTS[i]; if (a.scout && a.scout.tile && !a.scout.tileDone && a.scout.tile.join(',') === k) return true; }
    return false;
  }
  function scoutSelectableTile(c, r) { // v1 selectableTile: home first, then an unexplored tile touching the scouted area
    var k = c + ',' + r;
    if (!scoutTileValid(c, r) || scoutTileBusy(k)) return false;
    var lead = SCOUT_LEAD && SCOUT_LEAD.scout;
    if (!c && !r) return !(lead && lead.homeDone);
    if (!(lead && lead.homeDone)) return false;
    if (scoutDiscovered.has(k)) return false;
    for (var dc = -1; dc <= 1; dc++) for (var dr = -1; dr <= 1; dr++) if ((dc || dr) && scoutDiscovered.has((c + dc) + ',' + (r + dr))) return true;
    return false;
  }
  function scoutChoices(x, y) { // v1 scoutChoices: the 3x3 around the ant's own tile, else the nearest open tiles on the scouted edge
    var c0r0 = scoutTileOfPt(x, y), c0 = c0r0[0], r0 = c0r0[1], out = [], p, c, r;
    for (p = 1; p <= 9; p++) { c = c0 + (p - 1) % 3 - 1; r = r0 + Math.floor((p - 1) / 3) - 1; if (scoutSelectableTile(c, r)) out.push(c + ',' + r); }
    if (out.length) return out;
    var all = [];
    scoutDiscovered.forEach(function (kk) { var pp = kk.split(','), cc = +pp[0], rr = +pp[1]; for (var dc = -1; dc <= 1; dc++) for (var dr = -1; dr <= 1; dr++) { var n = (cc + dc) + ',' + (rr + dr); if ((dc || dr) && all.indexOf(n) < 0 && scoutSelectableTile(cc + dc, rr + dr)) all.push(n); } });
    if (!all.length) return all;
    var d = function (kk) { var pp = kk.split(','); return Math.max(Math.abs(+pp[0] - c0), Math.abs(+pp[1] - r0)); };
    var b = Math.min.apply(null, all.map(d));
    return all.filter(function (kk) { return d(kk) === b; });
  }
  function scoutNearestFog(c, r, x, y) { // v1 nearestFog: the nearest still-fogged cell in the tile
    var q = scoutTileCells(c, r), t = q.t, best = null, bd = 1e18, i, j, px, py, dd;
    for (j = q.j0; j < q.j1; j++) for (i = q.i0; i < q.i1; i++) {
      if (SFM[j * SF_FW + i] <= SCOUT_FOG_CLEAR) continue;
      px = clamp(i * SCOUT_FC + SCOUT_FC / 2, t.x0 + SCOUT_TILE_MARGIN, t.x1 - SCOUT_TILE_MARGIN);
      py = clamp(j * SCOUT_FC + SCOUT_FC / 2, t.y0 + SCOUT_TILE_MARGIN, t.y1 - SCOUT_TILE_MARGIN);
      dd = (px - x) * (px - x) + (py - y) * (py - y);
      if (dd < bd) { bd = dd; best = { x: px, y: py }; }
    }
    return best;
  }
  function scoutClearFogIn(x, y, rad, c, rr) { // v1 clearFogIn: clears only inside his chosen tile
    var t = scoutTileRect(c, rr);
    if (x < t.x0 || x > t.x1 || y < t.y0 || y > t.y1) return;
    var i0 = Math.max(0, Math.floor((Math.max(x - rad, t.x0)) / SCOUT_FC)), i1 = Math.min(SF_FW - 1, Math.floor((Math.min(x + rad, t.x1)) / SCOUT_FC));
    var j0 = Math.max(0, Math.floor((Math.max(y - rad, t.y0)) / SCOUT_FC)), j1 = Math.min(SF_FH - 1, Math.floor((Math.min(y + rad, t.y1)) / SCOUT_FC));
    for (var j = j0; j <= j1; j++) for (var i = i0; i <= i1; i++) {
      var d = Math.hypot(i * SCOUT_FC + SCOUT_FC / 2 - x, j * SCOUT_FC + SCOUT_FC / 2 - y) / rad;
      if (d >= 1) continue;
      var q = Math.max(0, (d - 0.55) / 0.45), v = Math.round(255 * q * q * (3 - 2 * q)), k = j * SF_FW + i;
      if (v < SFM[k]) { SFM[k] = v; sfDirty = true; }
    }
  }
  function scoutTileDone(c, r) { // v1 tileDone: the finished tile clears whole, soft edge outside it
    var t = scoutTileRect(c, r), F = SCOUT_TILE_F;
    var i0 = Math.max(0, Math.floor((t.x0 - F) / SCOUT_FC)), i1 = Math.min(SF_FW - 1, Math.ceil((t.x1 + F) / SCOUT_FC));
    var j0 = Math.max(0, Math.floor((t.y0 - F) / SCOUT_FC)), j1 = Math.min(SF_FH - 1, Math.ceil((t.y1 + F) / SCOUT_FC));
    for (var j = j0; j <= j1; j++) for (var i = i0; i <= i1; i++) {
      var x = i * SCOUT_FC + SCOUT_FC / 2, y = j * SCOUT_FC + SCOUT_FC / 2;
      var dx = Math.max(t.x0 - x, 0, x - t.x1), dy = Math.max(t.y0 - y, 0, y - t.y1);
      var u = clamp(Math.hypot(dx, dy) / F, 0, 1), v = Math.round(255 * u * u * (3 - 2 * u)), k = j * SF_FW + i;
      if (v < SFM[k]) { SFM[k] = v; sfDirty = true; }
    }
    scoutDiscovered.add(c + ',' + r);
  }
  function scoutClearHomeTile() { // v1 clearHomeTile: one fog, soft oval = the feathered close-up (or the home tile, fallback)
    if (typeof MAP_RECT !== 'undefined' && typeof START_SPP !== 'undefined') {
      var rx = 360 / START_SPP, ry = 640 / START_SPP, cx = MAP_RECT.x + rx, cy = MAP_RECT.y + ry, i, j, x, y, e, u, v;
      for (j = Math.max(0, Math.floor((cy - ry) / SCOUT_FC)); j < Math.min(SF_FH, Math.ceil((cy + ry) / SCOUT_FC)); j++)
        for (i = Math.max(0, Math.floor((cx - rx) / SCOUT_FC)); i < Math.min(SF_FW, Math.ceil((cx + rx) / SCOUT_FC)); i++) {
          x = i * SCOUT_FC + SCOUT_FC / 2; y = j * SCOUT_FC + SCOUT_FC / 2;
          e = Math.hypot((x - cx) / rx, (y - cy) / ry); u = clamp((e - 0.55) / 0.45, 0, 1); v = Math.round(255 * u * u * (3 - 2 * u));
          if (v < SFM[j * SF_FW + i]) SFM[j * SF_FW + i] = v;
        }
      sfDirty = true; return;
    }
    var q = scoutTileCells(0, 0), F = 24, i2, j2, x2, y2, d, u2, v2;
    for (j2 = q.j0; j2 < q.j1; j2++) for (i2 = q.i0; i2 < q.i1; i2++) {
      x2 = i2 * SCOUT_FC + SCOUT_FC / 2; y2 = j2 * SCOUT_FC + SCOUT_FC / 2;
      d = Math.min(x2 - q.t.x0, q.t.x1 - x2, y2 - q.t.y0, q.t.y1 - y2); u2 = clamp(d / F, 0, 1); v2 = Math.round(255 * (1 - u2 * u2 * (3 - 2 * u2)));
      if (v2 < SFM[j2 * SF_FW + i2]) SFM[j2 * SF_FW + i2] = v2;
    }
    sfDirty = true;
  }
  // ---- small + giant seeds (v1 placeSmallSeeds / cp4 giantList) ----
  // The big-seed exclusion list is v1's (world coords); the giant list is
  // cp4's SEED_EXACT/SEED_XFORM verbatim (map-hd.jpg is 5625x10000, so
  // those coords are world coords). The giant seed patches themselves are
  // baked into map-hd.jpg — nothing is drawn for them here; the fog
  // lifting reveals them, as in v1.
  var SCOUT_BIG_SEEDS = [[1824.2, 426.7], [2782.9, 1309.9], [2405.3, 3320.3], [1986.9, 3994.3], [3753.3, 4226.7], [3398.9, 4854.2], [1690.6, 4987.9], [1928.8, 5324.9], [3410.5, 6167.4], [2655.1, 7730.4], [1894.0, 8741.4], [2302, 2559], [4121, 3341]];
  var SCOUT_GIANTS = [
    { id: 's01', kind: 'safflower', x: 1739 + 175 / 2, y: 348 + 175 / 2 },
    { id: 's10', kind: 'corn', x: 4222 + 209 / 2, y: 4031 + 209 / 2 },
    { id: 's12', kind: 'sunflower', x: 3294 + 219 / 2, y: 4751 + 219 / 2 },
    { id: 's02', kind: 'sunflower', x: 2790, y: 1314 },
    { id: 's09', kind: 'sunflower', x: 1992, y: 4001 },
    { id: 's11', kind: 'sunflower', x: 3751, y: 4236 },
    { id: 's14', kind: 'sunflower', x: 1928, y: 5333 },
    { id: 's15', kind: 'sunflower', x: 3408, y: 6177 },
    { id: 's18', kind: 'sunflower', x: 1896, y: 8751 },
    { id: 's05', kind: 'corn', x: 2302, y: 2559 },
    { id: 's08', kind: 'corn', x: 4121, y: 3341 }
  ];
  function scoutGiantOnTile(c, r) { var t = scoutTileRect(c, r); return SCOUT_GIANTS.filter(function (s) { return s.x >= t.x0 && s.x <= t.x1 && s.y >= t.y0 && s.y <= t.y1; }); }
  function scoutPlaceSmallSeeds() {
    var c, r, ring, t, tries, x, y, ok, b;
    for (c = -3; c <= 3; c++) for (r = -3; r <= 3; r++) {
      if (!c && !r || !scoutTileValid(c, r)) continue;
      ring = Math.max(Math.abs(c), Math.abs(r));
      if (Math.random() > (ring === 1 ? 0.5 : 0.35)) continue;
      t = scoutTileRect(c, r);
      for (tries = 0; tries < 20; tries++) {
        x = t.x0 + SCOUT_TILE_MARGIN + Math.random() * (SCOUT_TILE_W - 2 * SCOUT_TILE_MARGIN);
        y = t.y0 + SCOUT_TILE_MARGIN + Math.random() * (SCOUT_TILE_H - 2 * SCOUT_TILE_MARGIN);
        ok = true;
        for (b = 0; b < SCOUT_BIG_SEEDS.length; b++) if (Math.hypot(SCOUT_BIG_SEEDS[b][0] - x, SCOUT_BIG_SEEDS[b][1] - y) < 60) { ok = false; break; }
        if (!ok) continue;
        SCOUT_SMALL.push({ x: x, y: y, taken: false }); break;
      }
    }
    if (SCOUT_SMALL.length < 2) { var t2 = scoutTileRect(1, 0); SCOUT_SMALL.push({ x: t2.cx, y: t2.cy - 40, taken: false }); }
  }
  function scoutSmallSeedFound() { for (var i = 0; i < SCOUT_SMALL.length; i++) if (!SCOUT_SMALL[i].taken && scoutFogAt(SCOUT_SMALL[i].x, SCOUT_SMALL[i].y) <= SCOUT_FOG_CLEAR) return i; return -1; }
  // ---- the walk helpers (v1 walkSimple / trail) ----
  function scoutTrail(S, d) { S.wf += d / (KSTEP * K_SIDE_AD * KW); var L = S.trail, p = L[L.length - 1]; if (!p || Math.hypot(p.x - S.x, p.y - S.y) > 1.5) { L.push({ x: S.x, y: S.y }); if (L.length > 600) L.shift(); } }
  function scoutWalkSimple(S, dt, speed, done) {
    var left = speed * dt;
    while (left > 1e-9 && S.path.length) {
      var p = S.path[0], dx = p.x - S.x, dy = p.y - S.y, dd = Math.hypot(dx, dy);
      if (dd > 1e-6) S.dir = Math.atan2(dy, dx);
      var st = Math.min(left, dd);
      S.x += dx / (dd || 1) * st; S.y += dy / (dd || 1) * st; left -= st;
      scoutTrail(S, st);
      if (st >= dd - 1e-6) S.path.shift();
    }
    if (!S.path.length) done();
  }
  function scoutWalkUnder(U, dt) { // the downstairs leg (v1 'down'/'downOut'): walk a path at grown-ant speed
    var left = AD_SPEED * dt;
    while (left > 0 && U.path.length) {
      var p = U.path[0], dx = p.x - U.x, dy = p.y - U.y, d = Math.hypot(dx, dy);
      if (Math.abs(dx) > 0.3) U.flip = dx < 0;
      var s = Math.min(left, d);
      U.x += dx / (d || 1) * s; U.y += dy / (d || 1) * s; left -= s;
      U.wf += s / (KSTEP * K_SIDE_AD * KW);
      var L = U.trail, q = L[L.length - 1];
      if (!q || Math.hypot(q.x - U.x, q.y - U.y) > 6) { L.push({ x: U.x, y: U.y }); if (L.length > 300) L.shift(); }
      if (s >= d - 1e-6) U.path.shift();
    }
  }
  function scoutPick(a) { // v1 scoutPick: one tile at random from the choices; no choices = map done -> come home and stay (cp4 scoutsStep)
    var S = a.scout, f = scoutChoices(S.x, S.y);
    if (!f.length) {
      S.state = 'toHole'; S.carry = false; S.target = null;
      S.path = [{ x: SCOUT_EMERGE_UP.x, y: SCOUT_EMERGE_UP.y }, { x: SCOUT_HOLE_UP.x, y: SCOUT_HOLE_UP.y }];
      scoutScoutsHome = true;
      return;
    }
    var k = f[Math.floor(Math.random() * f.length)], parts = k.split(','), c = +parts[0], r = +parts[1];
    S.tile = [c, r]; S.tileDone = false; S.tiles.push(k);
    var t = scoutTileRect(c, r);
    S.target = { x: t.cx, y: t.cy }; S.state = 'out';
  }
  function scoutLeadScouting(lead) { var S = lead && lead.scout; return !!(S && !scoutLeadFound(lead) && ['emerge', 'out', 'scouting'].indexOf(S.state) >= 0); } // cp4 albertScouting
  function scoutLeadFound(lead) { var S = lead && lead.scout; return !!(S && (S.carry || ['toHole', 'goneDown', 'down', 'rest', 'downOut'].indexOf(S.state) >= 0)); } // cp4 albertFound (no finderHeld: v1's carry-home is the rule)
  function stepScoutAnt(a, dt) { // v1 stepScout, per ant (lead or solo)
    var S = a.scout;
    if (!S) return;
    if (S.state === 'emerge') {
      S.alpha = clamp(S.alpha + dt / 0.4, 0, 1);
      scoutWalkSimple(S, dt, SCOUT_WALK, function () { S.alpha = 1; scoutPick(a); });
      return;
    }
    if (S.state === 'toHole') {
      scoutWalkSimple(S, dt, SCOUT_WALK, function () { S.state = 'goneDown'; S.ph = 0; });
      S.alpha = clamp(Math.hypot(S.x - SCOUT_HOLE_UP.x, S.y - SCOUT_HOLE_UP.y) / 12, 0, 1);
      return;
    }
    if (S.state === 'goneDown') {
      S.ph += dt;
      if (S.ph >= 0.6) {
        var drop = { x: BC.HOLE_W.x, y: BC.HOLE_W.y + 120 };
        S.state = 'down';
        S.under = { x: BC.HOLE_W.x, y: BC.HOLE_W.y + 30, path: [drop], wf: 0, flip: false, trail: [] };
        a.hidden = false; // drawn underground from here (drawKid, under pos)
      }
      return;
    }
    if (S.state === 'down') {
      scoutWalkUnder(S.under, dt);
      if (!S.under.path.length) {
        if (S.carry) { S.carry = false; scoutSeedsFound++; if (!scoutFirstSeed) scoutFirstSeed = true; } // v1: the giant seed delivered (meterFill seeds + farm unlock — counted; no farm/inventory in cp4)
        S.state = 'rest'; S.ph = 0;
        a.state = 'idle'; // home underground, drawn at the drop
      }
      return;
    }
    if (S.state === 'rest') {
      if (scoutScoutsHome) { S.ph = 0; return; } // cp4: map done — he stays home for good (rest held)
      S.ph += dt;
      if (S.ph >= 3) { S.state = 'downOut'; S.under.path = [{ x: BC.HOLE_W.x, y: BC.HOLE_W.y + 30 }]; }
      return;
    }
    if (S.state === 'downOut') {
      scoutWalkUnder(S.under, dt);
      if (!S.under.path.length) {
        S.state = 'emerge'; S.x = SCOUT_HOLE_UP.x; S.y = SCOUT_HOLE_UP.y;
        S.path = [{ x: SCOUT_EMERGE_UP.x, y: SCOUT_EMERGE_UP.y }]; S.alpha = 0; S.under = null;
        a.hidden = true; a.state = 'out';
      }
      return;
    }
    if (S.state === 'waiting') return; // unreachable: scoutPick sends map-done scouts home; kept for safety
    // --- v1 NP5 search loop (unchanged): nearest fog in the tile, clear as he walks, tile done -> seeds -> giant or next tile ---
    var left = SCOUT_WALK * dt, guard;
    for (guard = 0; guard < 6 && left > 0 && S.state !== 'toHole'; guard++) {
      if (!S.tile) { scoutPick(a); if (S.state === 'toHole') break; continue; }
      if (!S.target) {
        var cr = S.tile, n = scoutNearestFog(cr[0], cr[1], S.x, S.y);
        if (!n) {
          if (!S.tileDone) { S.tileDone = true; scoutTileDone(cr[0], cr[1]); if (!cr[0] && !cr[1]) S.homeDone = true; }
          // v1 R3-13: a scout NEVER stops for a small seed — picked up on the move at tile completion.
          var sIdx;
          for (sIdx = scoutSmallSeedFound(); sIdx >= 0; sIdx = scoutSmallSeedFound()) {
            SCOUT_SMALL[sIdx].taken = true; S.seen.push(sIdx);
            scoutSeedsFound++; scoutCoinsEarned += 2 + Math.floor(Math.random() * 2); // v1: +1 seed, +2-3 coins (counted here for the later bank)
            if (!scoutFirstSeed) scoutFirstSeed = true; // v1: first seed unlocks the farm — no farm in this build
          }
          if (scoutGiantOnTile(cr[0], cr[1]).length) { S.carry = true; S.state = 'toHole'; S.path = [{ x: SCOUT_EMERGE_UP.x, y: SCOUT_EMERGE_UP.y }, { x: SCOUT_HOLE_UP.x, y: SCOUT_HOLE_UP.y }]; S.target = null; break; } // giant only after this tile is fully revealed
          scoutPick(a);
          if (S.state === 'toHole') break;
          continue;
        }
        S.target = n; S.state = 'scouting';
      }
      var dx = S.target.x - S.x, dy = S.target.y - S.y, dd = Math.hypot(dx, dy);
      if (dd > 1e-6) S.dir = Math.atan2(dy, dx);
      var st = Math.min(left, dd);
      S.x += dx / (dd || 1) * st; S.y += dy / (dd || 1) * st; left -= st;
      S.wf += st / (KSTEP * K_SIDE_AD * KW);
      if (S.tile) scoutClearFogIn(S.x, S.y, SCOUT_R, S.tile[0], S.tile[1]);
      if (st >= dd - 1e-6) S.target = null;
    }
  }
  // ---- followers / solo (cp4) ----
  var FOLLOW_OFF = [{ dx: 16, dy: 10 }, { dx: -14, dy: 12 }, { dx: 18, dy: -8 }, { dx: -16, dy: -10 }, { dx: 12, dy: 16 }, { dx: -12, dy: 14 }];
  function stepFollower(a, dt) { // cp4 stepFollowers: walk to the lead's side and stay with him
    var lead = SCOUT_LEAD, f = a.follow;
    if (!lead || !lead.scout || !f) return;
    var target = { x: lead.scout.x + f.off.dx, y: lead.scout.y + f.off.dy };
    if (f.state === 'wait' && scoutLeadScouting(lead)) f.state = 'toAlbert';
    f.alpha = clamp((f.alpha || 0) + dt / 0.4, 0, 1);
    var dx = target.x - f.x, dy = target.y - f.y, d = Math.hypot(dx, dy);
    if (d > 1e-6) f.dir = Math.atan2(dy, dx);
    var st = Math.min(d, SCOUT_WALK * dt);
    f.x += dx / (d || 1) * st; f.y += dy / (d || 1) * st;
    if (st > 0.15) f.wf += st / (KSTEP * K_SIDE_AD * KW);
    if (d <= 5) { f.state = 'together'; f.alpha = 1; }
  }
  function startScouting(a) { // v1 joinScouts + cp4 spawnFollower/startSolo, by what the lead is doing
    walkAnt(a, { x: BC.HOLE_W.x, y: BC.HOLE_W.y }, function () {
      a.state = 'out'; a.hidden = true;
      var lead = SCOUT_LEAD, k, fi;
      if (lead && lead !== a && lead.job === 'scout' && lead.scout && scoutLeadScouting(lead)) {
        fi = 0;
        for (k = 0; k < ANTS.length; k++) if (ANTS[k].follow) fi++;
        a.follow = { off: FOLLOW_OFF[fi % FOLLOW_OFF.length], state: 'toAlbert', alpha: 0, wf: 0, x: SCOUT_HOLE_UP.x, y: SCOUT_HOLE_UP.y, dir: 0 };
        return;
      }
      if (lead && lead !== a && lead.job === 'scout' && lead.scout && scoutLeadFound(lead)) {
        a.scout = { role: 'solo', state: 'out', x: lead.scout.x, y: lead.scout.y, dir: lead.scout.dir || 0, path: [], tile: lead.scout.tile ? lead.scout.tile.slice() : null, target: null, tileDone: false, tiles: (lead.scout.tiles || []).slice(), seen: [], alpha: 1, wf: 0, trail: [], carry: false, under: null, ph: 0, homeDone: false };
        if (a.scout.tile) { var nn = scoutNearestFog(a.scout.tile[0], a.scout.tile[1], a.scout.x, a.scout.y); if (nn) { a.scout.target = nn; a.scout.state = 'scouting'; } else scoutPick(a); }
        else scoutPick(a);
        return;
      }
      SCOUT_LEAD = a; // the first scout graduate is the lead (v1 joinScouts)
      a.scout = { role: 'lead', state: 'emerge', x: SCOUT_HOLE_UP.x, y: SCOUT_HOLE_UP.y, dir: 0, path: [{ x: SCOUT_EMERGE_UP.x, y: SCOUT_EMERGE_UP.y }], tile: null, target: null, tileDone: false, tiles: [], seen: [], scoutPts: 1, alpha: 0, wf: 0, trail: [], carry: false, under: null, ph: 0, homeDone: false };
      if (!sfOn) { sfOn = true; scoutClearHomeTile(); scoutPlaceSmallSeeds(); }
    });
  }
  function drawUpScout(now) { // v1 drawUp: small seeds, then the scouts AND the soldier(s), then the surface fog over the map
    // v52: the soldier patrols UPSTAIRS — drawn here alongside the scouts,
    // whether or not any scout has switched the surface fog on yet.
    for (var s0 = 0; s0 < ANTS.length; s0++) {
      var sa = ANTS[s0];
      if (sa.job !== 'soldier' || !sa.guard) continue;
      var G = sa.guard;
      if (G.wait > 0) continue;
      ctx.save(); ctx.globalAlpha *= (G.alpha == null ? 1 : G.alpha);
      drawKidWalk('side_' + pad2n(Math.floor(G.wf) % 16) + '.png', G.x, G.y, Math.cos(G.dir || 0) < 0, 1); // v53: walking size = queen walking size
      ctx.restore();
    }
    if (!sfOn) return;
    var i, j, a;
    ctx.save(); ctx.fillStyle = '#8a5a2b'; ctx.strokeStyle = '#3b2410'; ctx.lineWidth = 0.4; // v1 drawUpSeeds (placeholder seed shape)
    for (i = 0; i < SCOUT_SMALL.length; i++) {
      var sm = SCOUT_SMALL[i];
      if (sm.taken || scoutFogAt(sm.x, sm.y) > 128) continue;
      ctx.beginPath(); ctx.ellipse(sm.x, sm.y, 2.2, 1.5, 0.4, 0, 7); ctx.fill(); ctx.stroke();
    }
    ctx.restore();
    for (j = 0; j < ANTS.length; j++) { // v1 drawUpScouts + cp4 followers/solo, grown-ant size
      a = ANTS[j];
      if (a.job !== 'scout') continue;
      if (a.scout) {
        var S = a.scout;
        if (['emerge', 'out', 'scouting', 'waiting', 'toHole'].indexOf(S.state) < 0) continue;
        var walking = S.state !== 'waiting';
        var frame = walking ? 'side_' + pad2n(Math.floor(S.wf) % 16) + '.png' : 'idle_' + pad2n(IDLE_PLAY[Math.floor((QT + a.ph) * IDLE_FPS) % IDLE_PLAY.length]) + '.png';
        ctx.save(); ctx.globalAlpha *= (S.alpha == null ? 1 : S.alpha);
        if (walking) drawKidWalk(frame, S.x, S.y, Math.cos(S.dir || 0) < 0, 1); // v53: walking size = queen walking size
        else drawKidSprite(frame, S.x, S.y, Math.cos(S.dir || 0) < 0, 1); // waiting: idle, v1 scale
        ctx.restore();
        if (S.carry) { ctx.save(); ctx.fillStyle = '#8a5a2b'; ctx.strokeStyle = '#3b2410'; ctx.lineWidth = 0.4; ctx.beginPath(); ctx.ellipse(S.x, S.y - 12, 2.2, 1.5, 0.4, 0, 7); ctx.fill(); ctx.stroke(); ctx.restore(); } // v1: the carried seed over him
      } else if (a.follow) {
        var f = a.follow;
        var moving = f.state === 'toAlbert' || (SCOUT_LEAD && SCOUT_LEAD.scout && SCOUT_LEAD.scout.state !== 'waiting');
        ctx.save(); ctx.globalAlpha *= (f.alpha == null ? 1 : f.alpha);
        if (moving) drawKidWalk('side_' + pad2n(Math.floor(f.wf) % 16) + '.png', f.x, f.y, Math.cos(f.dir || 0) < 0, 1); // v53: walking size = queen walking size
        else drawKidSprite('idle_00.png', f.x, f.y, Math.cos(f.dir || 0) < 0, 1); // idle, v1 scale
        ctx.restore();
      }
    }
    var fc = sfFogCanvas(now); // v1 drawUp: the fog over the map (NP5 fog of war)
    if (fc) { ctx.save(); ctx.globalAlpha = SCOUT_FOG_ALPHA; ctx.imageSmoothingEnabled = true; ctx.drawImage(fc, 0, 0, SF_FW * SCOUT_FC, SF_FH * SCOUT_FC); ctx.restore(); }
  }
  // ---- the soldier's job (Chris, Nov 17) ----
  // After training he GUARDS UPSTAIRS: he walks out through the hole to
  // the surface (the same emerge path the v51 scout uses — SCOUT_HOLE_UP /
  // SCOUT_EMERGE_UP), then patrols the mound on v1 cp4's GUARD arc around
  // the surface mound hole (RX 30, RY 16, angles 165..15, back and forth,
  // SPEED = v1's scoutSpeed ~18.5 world/s). NO THREAT in checkpoint 4 —
  // he patrols only; the attacks come in a future checkpoint.
  // v52 fix 1: the v44-v51 code patrolled BELOW ground — guardPoint used
  // BC.HOLE_W (the underground spiral hole, ~2820,4980) and the normal
  // underground ant draw drew him there. That whole path is gone: he now
  // emerges upstairs (a.guard, stepped by stepSoldierUp from stepTrade,
  // drawn in drawUp alongside the scout) and is never drawn underground
  // while guarding. guardRoute / stepSoldierUp are v1 cp4's guardRoute /
  // stepSoldiersUp, ported verbatim (arc centre HOLE_UP - 3, +sin, route
  // reversed at each end, GONE_S 0.6 emerge pause, FADE_S 0.4 fade-in).
  function guardRoute(a, rev) {
    var k = 0;
    for (var i = 0; i < ANTS.length; i++) { if (ANTS[i] === a) break; if (ANTS[i].guard) k++; } // v1 STEP_R: each extra soldier patrols one ring further out
    var rx = GUARD_RX + GUARD_STEP_R * k, ry = GUARD_RY + GUARD_STEP_R * 0.55 * k;
    var C = { x: SCOUT_HOLE_UP.x, y: SCOUT_HOLE_UP.y - 3 };
    var pts = GUARD_ARC.map(function (d) { var th = d * Math.PI / 180; return { x: C.x + rx * Math.cos(th), y: C.y + ry * Math.sin(th) }; });
    if (rev) pts.reverse();
    return pts;
  }
  function startGuarding(a) { // v1 cp4 soldierStep: walk to the underground hole, then emerge upstairs to patrol
    walkAnt(a, { x: BC.HOLE_W.x, y: BC.HOLE_W.y }, function () {
      a.state = 'gone'; a.hidden = true; // upstairs now — never drawn underground while guarding
      a.guard = { x: SCOUT_HOLE_UP.x, y: SCOUT_HOLE_UP.y, alpha: 0, wf: 0, dir: 0, rev: false, path: [], wait: GUARD_GONE_S };
      a.guard.path = guardRoute(a, false);
    });
  }
  function stepSoldierUp(a, dt) { // v1 cp4 stepSoldiersUp: fade in, then walk the arc back and forth at GUARD_SPEED
    var g = a.guard;
    if (!g) return;
    if (g.wait > 0) { g.wait -= dt; return; }
    g.alpha = clamp(g.alpha + dt / GUARD_FADE_S, 0, 1);
    var left = GUARD_SPEED * dt, n = 0;
    while (left > 1e-9 && n++ < 8) {
      if (!g.path.length) { g.rev = !g.rev; g.path = guardRoute(a, g.rev); }
      var p = g.path[0], dx = p.x - g.x, dy = p.y - g.y, d = Math.hypot(dx, dy);
      if (d > 1e-6) g.dir = Math.atan2(dy, dx);
      var st = Math.min(left, d);
      g.x += dx / (d || 1) * st; g.y += dy / (d || 1) * st; left -= st;
      g.wf += st / (KSTEP * K_SIDE_AD * KW); // same walk-cycle units as the scout's upstairs wf
      if (st >= d - 1e-6) g.path.shift();
    }
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
      else if (a.job === 'scout' && a.scout) stepScoutAnt(a, dt); // v51: the v1 tile machine (lead or solo)
      else if (a.job === 'scout' && a.follow) stepFollower(a, dt); // v51: a follower walks with the lead (cp4)
      else if (a.job === 'soldier' && a.guard) stepSoldierUp(a, dt); // v52: the soldier patrols UPSTAIRS on the guard arc (v1 cp4)
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
        ants: ANTS.map(function (a) { return { id: a.id, job: a.job || null, state: a.state, tradeItem: a.tradeItem || null, mine: a.mine ? a.mine.cell.k : null, mineDur: a.mine ? (a.mine.dur != null ? a.mine.dur : null) : null, hidden: !!a.hidden, guard: a.guard ? { x: +a.guard.x.toFixed(1), y: +a.guard.y.toFixed(1), alpha: +a.guard.alpha.toFixed(2), rev: !!a.guard.rev, wait: +(a.guard.wait || 0).toFixed(2), path: a.guard.path.length } : null, scout: a.scout ? { role: a.scout.role, state: a.scout.state, tile: a.scout.tile ? a.scout.tile.join(',') : null, x: +a.scout.x.toFixed(1), y: +a.scout.y.toFixed(1), carry: !!a.scout.carry } : (a.follow ? { role: 'follower', state: a.follow.state, tile: null, x: +a.follow.x.toFixed(1), y: +a.follow.y.toFixed(1), carry: false } : null) }; }),
        minerSpeed: MINER_SPEED, trainS: TRAIN_S, mineDiscoverS: MINE_DISCOVER_S, firstMineS: FIRST_MINE_S, minedCount: minedCount, guardSpeed: GUARD_SPEED, guardArc: GUARD_ARC.slice(), guardRx: GUARD_RX, guardRy: GUARD_RY,
        walkF: WALK_F, queenWalkBodyW: QUEEN_WALK_BODY_W, queenWalkBodyH: QUEEN_WALK_BODY_H, minerPwS: MINER_PW_S, minerBodyW: MINER_BODY_W_PX, minerBodyH: MINER_BODY_H_PX, minerFeetRow: MINER_FEET_ROW
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
    // v51: the v1 scout (read-only, for the harness).
    get scout() {
      return {
        on: sfOn, discovered: Array.from(scoutDiscovered).sort(), scoutsHome: scoutScoutsHome,
        seedsFound: scoutSeedsFound, coinsEarned: scoutCoinsEarned, firstSeed: scoutFirstSeed,
        small: SCOUT_SMALL.map(function (s) { return { x: +s.x.toFixed(1), y: +s.y.toFixed(1), taken: s.taken }; }),
        giants: SCOUT_GIANTS.map(function (g) { return { id: g.id, kind: g.kind, x: g.x, y: g.y }; }),
        lead: SCOUT_LEAD ? SCOUT_LEAD.id : null
      };
    },
    get scoutMask() { return SFM; }, // the live surface-fog mask (harness seeds/clears it, like BASE_FOG.mask)
    get scoutDiscovered() { return scoutDiscovered; }, // the live discovered-tile set (harness adds tiles for the map-done test)
    _scoutTileRect: scoutTileRect,
    _scoutTileValid: scoutTileValid,
    _scoutStart: startScouting, // harness drives a second graduate into the scout machine (follower/solo test)
    _scoutTileOfPt: scoutTileOfPt,
    _scoutChoices: scoutChoices,
    _scoutSelectableTile: scoutSelectableTile,
    _scoutGiantOnTile: scoutGiantOnTile,
    _scoutFogAt: scoutFogAt,
    _scoutFogCount: function (c, r) { var q = scoutTileCells(c, r), n = 0, i, j; for (j = q.j0; j < q.j1; j++) for (i = q.i0; i < q.i1; i++) if (SFM[j * SF_FW + i] > SCOUT_FOG_CLEAR) n++; return n; },
    _scoutHoleUp: function () { return { x: SCOUT_HOLE_UP.x, y: SCOUT_HOLE_UP.y }; },
    _guardRoute: guardRoute, // v52: the soldier's guard arc (v1 cp4 guardRoute), for the harness
    _guardHoleUp: function () { return { x: SCOUT_HOLE_UP.x, y: SCOUT_HOLE_UP.y }; },
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
    '.bl-head{display:flex;justify-content:space-between;align-items:flex-end;padding:2px 6px 0;position:sticky;top:0;z-index:2;background:linear-gradient(110deg,#38271c,#583e28 48%,#302018)}' + // v51 fix 1: the header (tabs + bulldozer) is STICKY — it stays put while the cards scroll underneath it (the tray scrolls vertically on short screens, and the cards scroll sideways below it)
    '.bl-title{color:#f3e6c8;font-size:17px;font-weight:700;letter-spacing:.5px}' +
    '.bl-dozer{flex:none;border:2px solid #82562f;border-radius:12px;background:rgba(255,244,220,.14);color:#f3e6c8;font-size:22px;line-height:1;padding:6px 12px;cursor:pointer}' +
    '.bl-dozer.on{background:#a93226;border-color:#e74c3c}' +
    '.bl-dozer img{height:22px;width:auto;display:block}' + // v31: the bulldozer picture (cut from Chris's photo), same height as the old emoji so the button stays the same size
    '.bl-cards{display:flex;gap:10px;justify-content:flex-start;border-top:2px solid #82562f;overflow-x:auto;overflow-y:hidden;touch-action:pan-x;-webkit-overflow-scrolling:touch;scrollbar-width:thin}' + // v51 fix 1: the cards scroll SIDEWAYS (one row, never wrapped) — 7 trade cards, 4 fit, so he swipes through the rest; the header above stays fixed (sticky) and the bulldozer stays top-right
    '.bl-cards-wrap{position:relative}' + // v52 fix 2: the scroll-hint sliver anchors to this wrap (the cards row's right edge)
    '.bl-scrollhint{position:absolute;right:0;top:50%;transform:translateY(-50%);width:20px;height:38px;display:none;align-items:center;justify-content:center;pointer-events:none;z-index:3;border-radius:10px 0 0 10px;background:linear-gradient(90deg,rgba(43,28,17,0),rgba(43,28,17,.92) 45%);color:#f3e6c8;font-size:22px;font-weight:700;line-height:1;text-shadow:0 1px 2px rgba(0,0,0,.6)}' + // v52 fix 2: a small sliver + › on the RIGHT edge of the cards row — a hint ONLY (pointer-events:none, mid-row so it never covers a card's top-right BUILD button, same dark brown as the menu). Shown only while more cards sit to the right; hidden at the far right end and whenever nothing scrolls.
    '.bl-scrollhint.on{display:flex}' +
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

  function updateScrollHint() { // v52 fix 2: the sliver + › shows ONLY while the cards row can scroll further right (more cards off to the right). At the far right end, or when everything fits (4 or fewer cards), it hides. Hint only — pointer-events:none in CSS, so it can never block a BUILD button.
    if (!tray) return;
    var hint = tray.querySelector('.bl-scrollhint');
    var cardsEl = tray.querySelector('.bl-cards');
    if (!hint || !cardsEl) return;
    var canScroll = cardsEl.scrollWidth - cardsEl.clientWidth > 2;
    var moreRight = canScroll && (cardsEl.scrollWidth - cardsEl.clientWidth - cardsEl.scrollLeft) > 2;
    if (moreRight) hint.classList.add('on');
    else hint.classList.remove('on');
  }

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
      '<div class="bl-cards-wrap"><div class="bl-cards">';
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
    html += '</div><div class="bl-scrollhint" aria-hidden="true">\u203a</div></div>'; // v52 fix 2: the scroll hint lives OUTSIDE the scrolling row (in the wrap), so it never scrolls away and never takes a card's place
    tray.innerHTML = html;
    updateScrollHint(); // v52 fix 2: show the hint only while more cards sit to the right (tab change / unlock re-renders, so it re-checks then too)
    var cardsEl = tray.querySelector('.bl-cards');
    if (cardsEl) cardsEl.addEventListener('scroll', updateScrollHint);
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
        // v56: no giant menu any more — the queen's tap goes straight to the
        // brain menu, so there is nothing to close here (NP5 worldTap is gone).
        var w = toWorld(e);
        var tb = hitTimerBubble(w);
        if (tb) {
          if (tb.kind === 'brain') tapBrainBubble(tb);
          else if (tb.kind === 'eat' || tb.kind === 'drink') tapRoomTimerBubble(tb);
          else if (tb.kind === 'tend' || tb.kind === 'spoil' || tb.kind === 'lay') tapBasketBubble(tb);
          return;
        }
        // v55 redesign (Chris, Nov 21): the queen is the ONLY ant with a
        // menu. Tapping a worker ant opens nothing — she is tapped through
        // #queenTarget, not the canvas (the button sits over her).
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

  // ---- v56: the BRAIN MENU, QUEEN-ONLY (ported from NP5, old-game-NP5-code) ----
  // Fix 2 — the brain menu, QUEEN-ONLY colony overview (Chris, Nov 21):
  // "I'm not doing an individual ant world anymore." The queen guides
  // everything, so SHE is the only ant with a menu. v56 (Chris, Nov 21):
  // "I get why you put the big ant menu, but that's actually not what I
  // was requesting" — the GIANT ANT MENU (#menuAnt, head/body/bottom zones,
  // glow sweep, brain icon in a bubble) is DELETED. Tapping the queen
  // (#queenTarget) goes STRAIGHT to the full-screen brain menu (.bm3).
  // The hammer button inside the brain menu still opens the build sheet
  // (BuildShortcut.go); the build menu itself still opens the usual way
  // (arrival auto-open, programmatic queenTarget click). Tapping a worker
  // ant opens NOTHING. No #bvBrainBtn, no flashing HUDs, no header on the
  // build menu.
  //
  // The six S.W.A.R.M.S. cards stay EXACTLY as they were (Chris: "the cards
  // are supposed to stay the same. It's supposed to spell the word swarms.
  // It's an acronym."): Strength "Carries +5 items", Work "Builds faster",
  // Attack "Wins in fewer hits", Rally (no effect line — undecided, blank),
  // Mine "Digs faster", Scout "Finds more items", same icons, same coloured
  // bottom strips, same two-rows-of-three layout. What changed is the NUMBER
  // on each card: it is the count of ants on that task RIGHT NOW, live —
  // cards are NOT spendable, there are NO skill points any more (the old
  // "You have N skill points to add" line is gone: it has no source in this
  // design). colonyCounts() maps jobs to cards (see below).
  //
  // Inside the brain menu (Chris: "a pretty cool way to look at what's
  // inside the queen's brain"): the roster — the old top-left list of every
  // ant and what it is doing — opens from the "…" button as a "Colony"
  // panel; the ideas open from the Idea button as an "Ideas" panel. The
  // Idea button shows the count (0 in cp5 — the idea mini-game is
  // checkpoint 6 territory; tapping it shows the ideas list, it does not
  // start a mini-game). MINOR CHANGE (Chris, Nov 21): the food and water
  // meters are added to the brain menu (top row, flanking the seed-money
  // pill) — they were never there before.
  //
  // THE PICTURE (v59 — Chris sent the ORIGINAL queen brain-menu
  // screenshot, Grok's build): Albert FRONT-FACING AND LARGE in the
  // 390x334 frame — big round head facing the camera, big eyes, smile,
  // body + legs below, feet on the forest floor — with the gold crown
  // with red jewels sitting high on top of his head between the
  // antennae. Built from bm_portraitAlbert.webp (same ant, same forest
  // + wooden sign): Albert cut out and scaled 2.0x, crown-only crop of
  // hat-crown-lowered.webp at ~50% of head width. NOT the queen's idle
  // front-strip frame (v56/v57 used that — wrong) and NOT the small
  // Albert + crown (v59 v1 — too small). Backups in /tmp:
  // queen-portrait-idle-v57-backup.webp, queen-albert-small-crown-v1-backup.webp.
  //
  // ASSET GAPS (none of these exist in the workspace or on the live site):
  //  * queen-brain-portrait-v3b.webp — MISSING (see above; the composite
  //    replaces it). menuAnt.webp — NO LONGER NEEDED (giant menu deleted).
  //  * hammerIcon.svg, bm3-sans.woff, bm3-banner.woff — MISSING. The hammer
  //    button uses the game's own hammer art (assets/items/hammer-tab.png);
  //    the @font-face rules are ported verbatim and fall back to DejaVu
  //    Sans / Georgia, as the canvas text already does.
  //  * The queen's crown layers (wings-tips-behind, base-underhat-headtop)
  //    are missing too (only hat-crown-lowered.webp exists); the queen
  //    portrait already wears her crown, so no crown overlay is drawn.
  var bmRefreshT = 0; // v55: last time the open brain menu refreshed (stepFrame throttle)
  var ANT_NAMES = ['ALBERT', 'ALLEN', 'ANDY', 'ANNA', 'AMOS', 'AVA']; // NP5 line 697
  var QUEEN_ANT = { id: 'queen', queen: true, name: 'QUEEN', portrait: 'assets/brain-v3/queen-brain-portrait.webp?v=59', lvl: 1, ideas: 0 };
  var brainById = {}; // ant id -> roster record (name + portrait only now)
  var brainNameN = 0;
  function brainFor(a) {
    if (!a) return null;
    if (a.queen) return QUEEN_ANT;
    var rec = brainById[a.id];
    if (!rec) {
      var ni = brainNameN++;
      rec = { id: a.id, name: ANT_NAMES[ni] || ('ANT ' + (ni + 1)), portrait: 'assets/brain-v3/' + (ni % 2 ? 'bm_portraitAllen.webp' : 'bm_portraitAlbert.webp') };
      brainById[a.id] = rec;
    }
    return rec;
  }
  // ---- v55: job counts for the S.W.A.R.M.S. cards (one ant, one card, except
  // Strength — see below). Live from ANTS, refreshed while the menu is open.
  //   Mine     = ants with job 'miner' (training at the globe/microscope, or mining)
  //   Scout    = ants with job 'scout' (training at an easel, or scouting)
  //   Attack   = ants with job 'soldier' (training in the gym, or patrolling)
  //   Work     = grown, schooled ants with NO trade job yet (the available workforce)
  //   Strength = ants carrying a giant seed home (a scout on the carry counts
  //              on Scout AND on Strength — he is doing both at once)
  //   Rally    = 0, honestly: there is no rally system in checkpoints 1-5.
  // Kids still in the nursery / at school are not on any card — they show in
  // the roster instead.
  function colonyCounts() {
    var c = { str: 0, work: 0, atk: 0, rally: 0, mine: 0, scout: 0 };
    for (var i = 0; i < ANTS.length; i++) {
      var a = ANTS[i];
      if (!a || a.state === 'gone' || a.hidden) continue;
      if (a.job === 'miner') c.mine++;
      else if (a.job === 'scout') { c.scout++; if (a.scout && a.scout.carry) c.str++; }
      else if (a.job === 'soldier') c.atk++;
      else if (a.m > KID_SCALE && a.schooled) c.work++;
    }
    return c;
  }
  var RIDE_NAMES = { slide: 'the slide', swingset: 'the swing set', spinningcircle: 'the spinning circle', teetertotter: 'the teeter totter' };
  function antActivity(a) { // one plain line for the roster: what this ant is doing
    if (!a) return '';
    if (a.train) return a.train.trade === 'miner' ? 'Training to mine' : a.train.trade === 'scout' ? 'Training to scout' : 'Training to be a soldier';
    if (a.job === 'miner') return a.mine ? 'Mining' : 'Going to mine';
    if (a.job === 'scout') return a.scout ? (a.scout.carry ? 'Carrying a giant seed home' : 'Scouting') : 'Going to scout';
    if (a.job === 'soldier') return a.guard ? 'Patrolling upstairs' : 'Going to guard';
    if (a.state === 'grow') return 'Growing up';
    if (a.state === 'ride') return 'Playing on ' + (RIDE_NAMES[(a.slot && a.slot.piece)] || 'a park piece');
    if (a.toSchool) return a.state === 'idle' ? 'Studying at school' : 'Going to school';
    if (a.state === 'walk') return 'Walking';
    if (a.m > KID_SCALE && a.schooled) return 'Waiting for work';
    return 'In the nursery';
  }
  function queenActivity() {
    if (QN.mode === 'walk') return 'Walking';
    if (QN.mode === 'act') return 'Busy';
    if (QN.settled) return 'Resting on her bed';
    return 'In the entrance';
  }
  function rosterRows() { // queen first, then every ant in the colony
    var rows = [{ n: 'QUEEN', v: queenActivity() }];
    for (var i = 0; i < ANTS.length; i++) {
      var a = ANTS[i];
      if (!a || a.state === 'gone' || a.hidden) continue;
      rows.push({ n: brainFor(a).name, v: antActivity(a) });
    }
    return rows;
  }
  var UI = { brain: null }; // v56: the queen's tap goes straight to the brain menu — no giant menu, no UI.ant/part

  // ---- v56 CSS: the brain menu (NP5 CSS lines 54-147, verbatim except as noted) ----
  // The giant ant menu CSS (#menuAnt, #bub, #o11n20) is DELETED in v56.
  // Noted adaptation: the .bm3-meter / .bm3-pause rules are scoped under
  // .bm3 — the base layer already has an UNSCOPED .bm3-meter for the
  // food/water meters (#bvMeters), and NP5's absolute positioning would
  // break those if it leaked out. (v56: the old #menuAnt img.ma adaptation
  // is gone with the giant menu.)
  var bm3style = document.createElement('style');
  bm3style.textContent = `
@font-face{font-family:'BM3 Sans';src:url(assets/brain-v3/bm3-sans.woff) format('woff');font-weight:700}
@font-face{font-family:'BM3 Banner';src:url(assets/brain-v3/bm3-banner.woff) format('woff');font-weight:400 900}
.bm3{--u:calc(var(--bm-w,390px)/390);--pic:296;--dy:0;position:absolute;inset:0;z-index:40;background:#1d130d;overflow:hidden;
  font-family:'BM3 Sans','DejaVu Sans',Verdana,sans-serif;font-weight:700;user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent;touch-action:manipulation}
.bm3[data-tall='1']{--pic:334;--dy:40}
.bm3[hidden]{display:none}
.bm3-portrait{position:absolute;left:0;top:0;width:100%;height:calc(var(--pic)*var(--u));background:center top/100% calc(334*var(--u)) no-repeat}
.bm3-portrait::after{content:'';position:absolute;left:0;right:0;bottom:0;height:calc(22*var(--u));background:linear-gradient(transparent,#1d130d)}
.bm3-name{position:absolute;left:0;right:0;top:calc(128*var(--u));transform:translateY(-50%);text-align:center;
  font:900 calc(31*var(--u))/1 'BM3 Banner',Georgia,serif;letter-spacing:calc(1.2*var(--u));
  background:linear-gradient(#fff2c4 0%,#f3cf82 45%,#d8a24c 72%,#f1c978 100%);-webkit-background-clip:text;background-clip:text;color:transparent;
  filter:drop-shadow(0 calc(1.2*var(--u)) 0 #7a4a1c) drop-shadow(0 calc(2*var(--u)) calc(2*var(--u)) rgba(0,0,0,.6));white-space:nowrap}
.bm3-btn{position:absolute;top:calc(41*var(--u));width:calc(30*var(--u));height:calc(30*var(--u));border-radius:50%;border:0;padding:0;background:rgba(58,52,48,.92);display:grid;place-items:center;cursor:pointer}
.bm3-btn svg{width:46%;height:46%}
.bm3-close{left:calc(19*var(--u))}.bm3-more{right:calc(19*var(--u))}
.bm3-lvl{position:absolute;left:50%;top:calc((300 + var(--dy))*var(--u));transform:translateX(-50%);min-width:calc(120*var(--u));height:calc(34*var(--u));box-sizing:border-box;padding:0 calc(16*var(--u));
  border-radius:calc(9*var(--u));background:linear-gradient(#f6d27a,#e0a940 55%,#c98d2c);border:calc(2*var(--u)) solid #8a5a1c;
  box-shadow:inset 0 calc(1*var(--u)) 0 rgba(255,255,255,.55),0 calc(2*var(--u)) calc(4*var(--u)) rgba(0,0,0,.5);
  display:grid;place-items:center;font:700 calc(18*var(--u))/1 'BM3 Sans',sans-serif;letter-spacing:calc(.6*var(--u));color:#4a2c0e;white-space:nowrap}
.bm3-skill{position:absolute;left:0;right:0;top:calc((349 + var(--dy))*var(--u));transform:translateY(-50%);text-align:center;white-space:nowrap;
  font:700 calc(16*var(--u))/1.25 'BM3 Sans',sans-serif;letter-spacing:calc(.3*var(--u));color:#fffd76;text-shadow:0 0 calc(2*var(--u)) rgba(255,230,90,.55);animation:bm3flash 1s steps(1,end) infinite}
.bm3-skill.zero,.bm3[data-flash=off] .bm3-skill{animation:none;color:#d9c3a0;text-shadow:none}
@keyframes bm3flash{50%{opacity:.35}}
.bm3-card{position:absolute;width:calc(114*var(--u));height:calc(100*var(--u));box-sizing:border-box;padding:calc(5*var(--u)) calc(4*var(--u)) 0;border-radius:calc(10*var(--u));overflow:hidden;
  background:#f8ecd3;border:calc(2*var(--u)) solid #c9a46a;box-shadow:0 calc(2*var(--u)) calc(4*var(--u)) rgba(0,0,0,.5);cursor:default; /* v55: cards are counts, not spendable — no pointer */
  display:flex;flex-direction:column;align-items:center;font-family:inherit;color:#3a2208;transition:transform .08s}
.bm3-card:active{transform:scale(.95)}
.bm3-top{display:flex;align-items:center;justify-content:center;gap:calc(8*var(--u));height:calc(30*var(--u));flex:none}
.bm3-card i{display:block;width:calc(40*var(--u));height:calc(30*var(--u));background:center/contain no-repeat;flex:none}
.bm3-card b{display:block;margin-top:calc(1*var(--u));font:700 calc(15*var(--u))/calc(18*var(--u)) 'BM3 Sans',sans-serif;color:#3a2208;white-space:nowrap}
.bm3-card .bm3-num{display:block;font:700 calc(26*var(--u))/calc(30*var(--u)) 'BM3 Sans',sans-serif;color:#55351e;min-width:calc(18*var(--u))}
.bm3-card em{display:block;margin-top:calc(1*var(--u));font:700 calc(13*var(--u))/calc(15*var(--u)) 'BM3 Sans',sans-serif;font-style:normal;color:#6a4626;text-align:center;max-height:calc(30*var(--u));overflow:hidden}
.bm3-card::after{content:'';position:absolute;left:0;right:0;bottom:0;height:calc(6*var(--u));background:var(--strip)}
.bm3-card.bump .bm3-num{animation:bm3bump .25s}
@keyframes bm3bump{50%{transform:scale(1.3)}}
.bm3[data-points="0"] .bm3-card{cursor:default}
.bm3-idea{position:absolute;left:calc(16*var(--u));bottom:calc(14*var(--u));width:calc(128*var(--u));height:calc(50*var(--u));box-sizing:border-box;padding:0;
  border-radius:calc(14*var(--u));background:linear-gradient(#f6d27a,#e0a940 55%,#c98d2c);border:calc(2*var(--u)) solid #8a5a1c;
  box-shadow:inset 0 calc(1*var(--u)) 0 rgba(255,255,255,.55),0 calc(3*var(--u)) calc(8*var(--u)) rgba(0,0,0,.6);
  display:flex;align-items:center;justify-content:center;gap:calc(6*var(--u));font:700 calc(22*var(--u))/1 'BM3 Sans',sans-serif;color:#4a2c0e;white-space:nowrap;cursor:pointer}
.bm3-idea img{height:calc(28*var(--u))}
.bm3-idea.tick{animation:bm3bump .35s}
.bm3-hammer{position:absolute;left:calc(154*var(--u));bottom:calc(10*var(--u));width:calc(58*var(--u));height:calc(58*var(--u));box-sizing:border-box;border-radius:50%;border:calc(3*var(--u)) solid #fff;padding:0;
  background:rgba(40,30,20,.78) center/calc(44*var(--u)) no-repeat;box-shadow:0 calc(3*var(--u)) calc(10*var(--u)) #0009;cursor:pointer}
.bm3-hammer[hidden]{display:none}
.bm3-zone{position:absolute;left:calc(226*var(--u));right:calc(10*var(--u));top:calc((584 + var(--dy)*1.2)*var(--u));bottom:calc(10*var(--u));pointer-events:none}
.bm3-spot{position:absolute;right:calc(10*var(--u));bottom:calc(10*var(--u));width:calc(164*var(--u));height:calc(150*var(--u));pointer-events:none;z-index:3}
.bm3[data-tall='1'] .bm3-spot{height:calc(214*var(--u))}
.bm3-fly{position:absolute;inset:0;background:center/contain no-repeat;opacity:0;transform:translate(calc(160*var(--u)),0) scale(.4);
  transition:transform .55s cubic-bezier(.2,1.3,.4,1),opacity .3s;filter:drop-shadow(0 0 calc(14*var(--u)) rgba(255,207,58,.85))}
.bm3-fly.in{opacity:1;transform:none}
.bm3-fly.swap{opacity:0;transition:opacity .35s}
.bm3-fly.out{opacity:0;transform:translate(var(--tx),var(--ty)) scale(.15);transition:transform .6s ease-in,opacity .6s ease-in}
.bm3-fly.gone{opacity:0;transform:scale(.6);transition:transform .5s ease-in,opacity .5s ease-in}
.bm3-fly.q{filter:drop-shadow(0 calc(3*var(--u)) calc(6*var(--u)) rgba(0,0,0,.55))}
.smRead{display:inline-flex;align-items:center;gap:6px;padding:3px 10px;border-radius:16px;background:rgba(40,30,20,.78);border:2px solid #f3cf82;color:#f3cf82;font:700 13px/1 'BM3 Sans','AntUI Sans','DejaVu Sans',sans-serif;white-space:nowrap}.smRead b{color:#fff3d6;font-size:17px}
.bm3 .smBrain{position:absolute;right:calc(16*var(--u));bottom:calc(14*var(--u));height:calc(30*var(--u));z-index:2}
.bm3 .bm3-meter{position:absolute;left:calc(16*var(--u));bottom:calc(70*var(--u));width:calc(128*var(--u));height:calc(22*var(--u));display:flex;align-items:center;gap:calc(5*var(--u));z-index:2;pointer-events:none}
.bm3 .bm3-meter[hidden]{display:none} .bm3 .bm3-pause{position:absolute;left:calc(16*var(--u));bottom:calc(98*var(--u));z-index:2;pointer-events:none;font:800 calc(12*var(--u))/1 'BM3 Sans','DejaVu Sans',sans-serif;color:#ffd0e6;text-shadow:0 1px 2px #000;white-space:nowrap} .bm3 .bm3-pause[hidden]{display:none}
.bm3 .bm3-meter i{flex:none;width:calc(20*var(--u));height:calc(20*var(--u));background:url(assets/brain-v3/iBrain.webp) center/contain no-repeat}
.bm3 .bm3-meter .bar{flex:1;height:calc(10*var(--u));border-radius:calc(6*var(--u));background:rgba(0,0,0,.45);border:1px solid #f3cf82;overflow:hidden}
.bm3 .bm3-meter .bar b{display:block;height:100%;width:0;background:linear-gradient(90deg,#ff9ad0,#ff5fa8);transition:width .3s}
.bm3 .bm3-meter em{flex:none;font:800 calc(13*var(--u))/1 'BM3 Sans','DejaVu Sans',sans-serif;color:#fff;font-style:normal;text-shadow:0 1px 2px #000}
.bm3-idea.ready{box-shadow:0 0 calc(12*var(--u)) #ffd84a;animation:bm3bump 1.2s infinite}
/* v55 redesign: the food + water meters (Chris, Nov 21 — they were never in
   the brain menu). Two small pills in the top row (food left, water right):
   leaf/droplet icon + mini bar + number, live from MV. v57: the position
   selectors were .bm3-fw.food / .bm3-fw.water but the HTML classes are
   bm3-food / bm3-water (the .bm3-fw element does NOT carry a 'food' class),
   so neither pill got left/right positioning — both sat at the static left
   edge overlapping, water (later in the DOM) painting on top, and both pills
   (z-index 2) covered the close X. That is exactly Chris's v56 screenshot:
   one pill cut off at the far left, no food pill, no X. Fixed selectors. */
.bm3-fw{position:absolute;top:calc(41*var(--u));height:calc(30*var(--u));display:flex;align-items:center;gap:calc(4*var(--u));padding:0 calc(6*var(--u));border-radius:calc(15*var(--u));background:rgba(40,30,20,.78);border:2px solid #f3cf82;color:#f3cf82;font:700 calc(13*var(--u))/1 'BM3 Sans','DejaVu Sans',sans-serif;white-space:nowrap;z-index:2}
.bm3-fw.bm3-food{left:calc(54*var(--u))}.bm3-fw.bm3-water{right:calc(71*var(--u))} /* v59: water moved 54u -> 71u so it never overlaps the roster button at right:19u */
.bm3-fw i{flex:none;width:calc(14*var(--u));height:calc(14*var(--u));background:center/contain no-repeat}
.bm3-fw .bar{flex:none;width:calc(22*var(--u));height:calc(8*var(--u));border-radius:calc(4*var(--u));background:rgba(0,0,0,.45);border:1px solid #f3cf82;overflow:hidden}
.bm3-fw .bar b{display:block;height:100%;width:0}
.bm3-fw.bm3-food .bar b{background:linear-gradient(90deg,#b5e048,#6da332)}
.bm3-fw.bm3-water .bar b{background:linear-gradient(90deg,#7cc4e8,#3a7fc1)}
.bm3-fw em{font-style:normal;color:#fff3d6;font-size:calc(14*var(--u))}
/* v55 redesign: the ideas panel inside the brain menu (NP5 .pwin
   "Colony" look: #1d130d body, #8a5a1c gold frame, dark header with gold
   banner title, round close X, cream #f6ead0 rows). Opens from the Idea
   button; closes back to the menu. v57: the roster no longer lives here —
   it moved to the designed #rosterBtn on the game screen (NP5). v59: Chris
   ("I only want that to be in the brain menu, not in the actual game") —
   the button + panel are back INSIDE the brain menu (children of .bm3). */
.bm3-panel{position:absolute;z-index:21;left:12px;right:12px;top:64px;bottom:16px;display:flex;flex-direction:column;background:#1d130d;color:#fff3d6;border:3px solid #8a5a1c;border-radius:16px;box-shadow:0 6px 18px #000a;overflow:hidden}
.bm3-panel[hidden]{display:none}
.bm3-panel-head{flex:none;height:46px;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:0 7px 0 14px;background:linear-gradient(#3a2614,#26180d);border-bottom:3px solid #8a5a1c}
.bm3-panel-title{font-family:'BM3 Banner',Georgia,serif;font-weight:900;font-size:18px;color:#f3cf82}
.bm3-panel-x{width:34px;height:34px;border-radius:50%;background:#4a3a30;border:0;color:#fff;font-size:16px;display:grid;place-items:center;padding:0;cursor:pointer}
.bm3-panel-body{overflow:auto;padding:8px;display:flex;flex-direction:column;gap:6px;-webkit-overflow-scrolling:touch}
.bm3-row{display:flex;justify-content:space-between;align-items:center;gap:10px;background:#f6ead0;color:#3a2208;border:2px solid #c9a46a;border-radius:10px;padding:7px 10px;font-size:15px;line-height:1.15}
.bm3-row b{font-size:15px;white-space:nowrap}
.bm3-row span{font-size:13px;color:#6a4626;text-align:right}
.bm3-empty{color:#d9c3a0;font-size:14px;padding:6px 4px}
/* v59: the DESIGNED roster button (NP5 #rosterBtn, verbatim look: gold
   circular button with a list icon). Chris (Nov 21): "I only want that
   to be in the brain menu, not in the actual game" — so it lives INSIDE
   the brain menu (.bm3), top row, top-RIGHT where the deleted "…"
   button was (right 19u, top 41u). The water pill moved right:54u ->
   right:71u so the two never overlap. The button is hidden whenever
   the menu is hidden (it is a child of .bm3); no JS visibility toggle.
   It opens the Colony roster (names + what each ant is doing). */
#rosterBtn{position:absolute;z-index:2;right:calc(19*var(--u));top:calc(41*var(--u));width:44px;height:44px;border-radius:50%;border:2px solid #8a5a1c;background:linear-gradient(#f6d27a,#e0a940 55%,#c98d2c);box-shadow:inset 0 1px 0 rgba(255,255,255,.55),0 3px 8px rgba(0,0,0,.6);display:grid;place-items:center;padding:0;cursor:pointer}
#rosterBtn svg{width:24px;height:24px}
/* v59: the roster panel lives inside the brain menu now (child of .bm3),
   so it uses the inside-menu panel geometry (top 64px, like the Ideas
   panel) instead of the v57 game-screen geometry (top 144px). */
#rosterWin{top:calc(64px + env(safe-area-inset-top,0px));bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:21}
`;
  document.head.appendChild(bm3style);

  // ---- Brain Menu v3 (NP5 JS lines 163-271, verbatim except the ResizeObserver
  // guard — the test harness has no ResizeObserver, and the module must not
  // throw there; real browsers have it). Assets are re-pointed below, NP5-style.
  (function (global) {
    'use strict';
    const BASE = (document.currentScript && document.currentScript.src) ? document.currentScript.src.replace(/[^/]*$/, '') : 'brain-menu-v3/';
    const assets = {
      portraitAlbert: BASE + 'assets/portrait-albert.webp', portraitAllen: BASE + 'assets/portrait-allen.webp',
      hammer: BASE + 'assets/hammer-icon.svg', brain: BASE + 'assets/iBrain.webp', noIdea: BASE + 'assets/no-idea.svg', workbench: BASE + 'assets/worktable-chris.png',
      strength: BASE + 'assets/icon-strength.png', work: BASE + 'assets/icon-work.png', attack: BASE + 'assets/icon-attack.png',
      rally: BASE + 'assets/icon-rally.png', mine: BASE + 'assets/icon-mine.png', scout: BASE + 'assets/icon-scout.png',
    };
    const TEMPLATE = {
      cardW: 114, cardH: 100,
      slots: [[10, 370], [138, 364], [266, 370], [10, 478], [138, 472], [266, 478]],
      stats: [
        { key: 'str', label: 'Strength', art: 'strength', strip: '#8f5c25', desc: 'Carries +5 items' },
        { key: 'work', label: 'Work', art: 'work', strip: '#467d39', desc: 'Builds faster' },
        { key: 'atk', label: 'Attack', art: 'attack', strip: '#b9342b', desc: 'Wins in fewer hits' },
        { key: 'rally', label: 'Rally', art: 'rally', strip: 'linear-gradient(90deg,#c99a3c,#edbe62 50%,#c99a3c)', desc: '' },
        { key: 'mine', label: 'Mine', art: 'mine', strip: '#30609e', desc: 'Digs faster' },
        { key: 'scout', label: 'Scout', art: 'scout', strip: '#60489e', desc: 'Finds more items' },
      ],
      levelText: (n) => `Level ${n}`, // v55: skillText is gone — no skill points in this design
      ideaText: (n) => `Idea ${n}`,
      TALL: 1.95,
    };
    const KEYS = TEMPLATE.stats.map((s) => s.key);
    function ensure(a) { // v55: only the queen's own fields — name, level, ideas. No st/sp.
      if (typeof a.lvl !== 'number') a.lvl = 1; if (typeof a.ideas !== 'number') a.ideas = 0; if (!a.name) a.name = 'QUEEN'; return a;
    }
    const portraitFor = (a) => a.portrait || (a.id % 2 ? assets.portraitAllen : assets.portraitAlbert);
    let R = null, cur = null, flyT = []; const listeners = [];
    const emit = (t, d) => listeners.forEach((fn) => fn(t, d));
    const $ = (s) => R.querySelector(s);
    function mount(host) {
      if (R) return API;
      R = document.createElement('div'); R.className = 'bm3'; R.hidden = true;
      R.innerHTML = `<div class="bm3-portrait"></div><div class="bm3-name"></div>
      <button class="bm3-btn bm3-close" aria-label="Close"><svg viewBox="0 0 24 24"><path d="M5 5L19 19M19 5L5 19" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/></svg></button>
      <div class="bm3-lvl"></div>
      ${TEMPLATE.stats.map((s, i) => {
        const [l, t] = TEMPLATE.slots[i];
        return `<button class="bm3-card" data-k="${s.key}" style="left:calc(${l}*var(--u));top:calc((${t} + var(--dy))*var(--u));--strip:${s.strip}"><span class="bm3-top"><i style="background-image:url('${assets[s.art]}')"></i><span class="bm3-num">0</span></span><b>${s.label}</b>${s.desc ? `<em>${s.desc}</em>` : ''}</button>`;
      }).join('')}
      <button class="bm3-idea"><img alt="" src="${assets.brain}"><span></span></button>
      <button class="bm3-hammer" aria-label="build" hidden style="background-image:url('${assets.hammer}')"></button>
      <div class="bm3-zone"></div><div class="bm3-spot"></div>
      <div class="bm3-fw bm3-food" aria-label="food"><i style="background-image:url('assets/icons/fi_leaf.webp')"></i><span class="bar"><b></b></span><em></em></div>
      <div class="bm3-fw bm3-water" aria-label="water"><i style="background-image:url('assets/icons/icon_water_droplet.png')"></i><span class="bar"><b></b></span><em></em></div>
      <div class="bm3-panel" hidden><div class="bm3-panel-head"><span class="bm3-panel-title"></span><button class="bm3-panel-x" type="button" aria-label="Close">✕</button></div><div class="bm3-panel-body"></div></div>`;
      (host || document.body).appendChild(R);
      const fit = () => { R.style.setProperty('--bm-w', R.clientWidth + 'px'); R.dataset.tall = R.clientHeight / Math.max(1, R.clientWidth) >= TEMPLATE.TALL ? '1' : '0'; };
      R._fit = fit;
      if (typeof ResizeObserver !== 'undefined') { try { new ResizeObserver(fit).observe(R); } catch (e) {} }
      const tap = (el, fn) => el.addEventListener('click', (e) => { e.stopPropagation(); fn(e); });
      // v55: the cards are counts, not buttons — no tap wiring at all.
      tap($('.bm3-close'), close);
      tap($('.bm3-idea'), () => emit('idea', { ant: cur, ideas: cur && cur.ideas }));
      tap($('.bm3-panel-x'), () => { const p = $('.bm3-panel'); if (p) p.hidden = true; });
      tap($('.bm3-hammer'), () => { emit('hammer', { ant: cur }); if (global.BuildShortcut) global.BuildShortcut.go('brain'); });
      return API;
    }
    function render() {
      if (!cur) return; const a = cur;
      $('.bm3-name').textContent = a.name; $('.bm3-portrait').style.backgroundImage = `url("${portraitFor(a)}")`;
      $('.bm3-lvl').textContent = TEMPLATE.levelText(a.lvl);
      // v55: the number on each card is the LIVE count of ants on that task
      // (colonyCounts, outer scope) — never a skill level, never spendable.
      // Labels are set here too (not just in the template): the harness fake
      // DOM drops text nodes from innerHTML, so a template-only label reads
      // empty there. Numbers are stored as strings (textContent coerces in
      // real browsers, but the fake DOM stores the raw value).
      var c = colonyCounts();
      R.querySelectorAll('.bm3-card').forEach((el) => {
        var st = null;
        for (var si = 0; si < TEMPLATE.stats.length; si++) if (TEMPLATE.stats[si].key === el.dataset.k) st = TEMPLATE.stats[si];
        if (st) el.querySelector('b').textContent = st.label;
        el.querySelector('.bm3-num').textContent = String(c[el.dataset.k]);
      });
      // (Single-class queries only: the harness fake DOM cannot do '.bm3-idea span'.)
      var ib = $('.bm3-idea'); if (ib && ib.children[1]) ib.children[1].textContent = TEMPLATE.ideaText(a.ideas);
      // v55: food + water meters (Chris — they were never in the brain menu).
      // (Single-class queries only: the harness fake DOM cannot do '.bar b'.)
      var fw = $('.bm3-food'), ww = $('.bm3-water'), fb = fw && fw.querySelector('.bar'), wb = ww && ww.querySelector('.bar');
      if (fw && fb && fb.children[0]) { fb.children[0].style.width = (100 * MV.food / METERS.food.cap).toFixed(1) + '%'; fw.querySelector('em').textContent = String(Math.round(MV.food)); }
      if (ww && wb && wb.children[0]) { wb.children[0].style.width = (100 * MV.water / METERS.water.cap).toFixed(1) + '%'; ww.querySelector('em').textContent = String(Math.round(MV.water)); }
      updateSeedPill(); updateIdeaMeter(); // outer-scope, hoisted
    }
    function open(ant, o = {}) { if (!R) mount(); cur = ensure(ant); if ('hammer' in o) setHammer(o.hammer);
      // a fresh open never shows a stale panel (v59: ALL panels — the Ideas
      // panel AND the roster panel are both .bm3-panel children of R; the
      // old code closed only the first match, so the roster stayed open)
      R.querySelectorAll('.bm3-panel').forEach(function (p) { p.hidden = true; });
      R.hidden = false; R._fit(); render(); emit('open', { ant }); return API; }
    function close() { if (!R) return; flyT.forEach(clearTimeout); flyT = []; $('.bm3-spot').innerHTML = ''; R.hidden = true; const a = cur; cur = null; emit('close', { ant: a }); }
    function setIdeas(n) { if (cur) { cur.ideas = n; render(); } }
    function setHammer(on) { $('.bm3-hammer').hidden = !on; }
    function showIdea({ result = 'idea', pic = assets.workbench, hold = 1600, phase = null } = {}) {
      const z = $('.bm3-spot'); z.innerHTML = ''; flyT.forEach(clearTimeout); flyT = [];
      const mk = (img, cls) => { const f = document.createElement('div'); f.className = 'bm3-fly ' + (cls || ''); f.style.backgroundImage = `url("${img}")`; z.appendChild(f); return f; };
      const zb = z.getBoundingClientRect(), ib = $('.bm3-idea').getBoundingClientRect();
      const aim = (f) => { f.style.setProperty('--tx', (ib.left + ib.width / 2 - (zb.left + zb.width / 2)) + 'px'); f.style.setProperty('--ty', (ib.top + ib.height / 2 - (zb.top + zb.height / 2)) + 'px'); };
      const land = () => { cur.ideas++; render(); setHammer(true); const b = $('.bm3-idea'); b.classList.remove('tick'); void b.offsetWidth; b.classList.add('tick'); emit('ideaLanded', { ant: cur, ideas: cur.ideas }); };
      if (result !== 'idea') {
        const q = mk(assets.noIdea, 'q');
        if (phase) { q.classList.add('in'); return API; }
        void q.offsetWidth; q.classList.add('in');
        flyT.push(setTimeout(() => q.classList.add('gone'), 550 + hold)); flyT.push(setTimeout(() => q.remove(), 550 + hold + 500));
        return API;
      }
      const brain = mk(assets.brain), thing = mk(pic); aim(thing);
      if (phase === 'brain') { brain.classList.add('in'); return API; }
      if (phase === 'in') { thing.classList.add('in'); brain.remove(); return API; }
      if (phase === 'out') { thing.classList.add('in', 'out'); brain.remove(); land(); return API; }
      void brain.offsetWidth; brain.classList.add('in');
      flyT.push(setTimeout(() => { brain.classList.add('swap'); thing.style.transition = 'opacity .35s'; thing.style.transform = 'none'; thing.classList.add('in'); }, 900));
      flyT.push(setTimeout(() => { thing.style.transition = ''; thing.classList.add('out'); }, 1250 + hold));
      flyT.push(setTimeout(() => { land(); z.innerHTML = ''; }, 1250 + hold + 600));
      return API;
    }
    const API = {
      mount, open, close, refresh: render, setIdeas, setHammer, showIdea,
      ensure, TEMPLATE, assets, get current() { return cur; }, get isOpen() { return !!(R && !R.hidden); }, get root() { return R; },
      on(fn) { listeners.push(fn); return () => listeners.splice(listeners.indexOf(fn), 1); }, setFlash(on) { if (R) R.dataset.flash = on ? 'on' : 'off'; }
    };
    global.BrainMenu3 = API;
  })(window);

  // ---- v55: BrainMenu3 assets, seed-money pill, ideas meter (NP5 integration, adapted) ----
  // NP5 re-points every asset to assets/brain-v3/; the hammer falls back to
  // the game's own hammer art (hammerIcon.svg is missing — see the header).
  Object.assign(BrainMenu3.assets, {
    portraitAlbert: 'assets/brain-v3/bm_portraitAlbert.webp', portraitAllen: 'assets/brain-v3/bm_portraitAllen.webp',
    hammer: 'assets/items/hammer-tab.png', noIdea: 'assets/brain-v3/noIdea.webp', brain: 'assets/brain-v3/iBrain.webp', workbench: 'assets/brain-v3/wtChris.webp',
    strength: 'assets/brain-v3/bm3_strength.webp', work: 'assets/brain-v3/bm3_work.webp', attack: 'assets/brain-v3/bm3_attack.webp',
    rally: 'assets/brain-v3/bm3_rally.webp', mine: 'assets/brain-v3/bm3_mine.webp', scout: 'assets/brain-v3/bm3_scout.webp'
  });
  BrainMenu3.mount(document.querySelector('#game'));
  (function () {
    var r = BrainMenu3.root, d = document.createElement('div');
    d.className = 'smRead smBrain'; d.setAttribute('aria-label', 'seed money'); d.innerHTML = 'seed money <b class="smAmt">0</b>'; r.appendChild(d);
    ['pointerdown', 'pointerup', 'click', 'touchstart', 'touchend', 'wheel'].forEach(function (k) { r.addEventListener(k, function (e) { e.stopPropagation(); }); });
  })();
  // Ideas meter (NP5 lines 1455-1466): the brain meter, bottom-left, queen
  // only. Bar = brains collected toward the cap (BR.brains / BRAIN_CAP);
  // the Idea button is NEVER .ready in v55 — the mini-game is checkpoint 6,
  // so nothing here may imply it is available.
  var ideaMeter = document.createElement('div'); ideaMeter.className = 'bm3-meter'; ideaMeter.innerHTML = '<i></i><span class="bar"><b></b></span><em></em>'; BrainMenu3.root.appendChild(ideaMeter);
  var ideaPause = document.createElement('div'); ideaPause.className = 'bm3-pause'; ideaPause.hidden = true; BrainMenu3.root.appendChild(ideaPause);
  function updateSeedPill() {
    var els = BrainMenu3.root.querySelectorAll('.smAmt');
    for (var i = 0; i < els.length; i++) els[i].textContent = String(BR.coins);
  }
  function updateIdeaMeter() {
    var q = BrainMenu3.current === QUEEN_ANT;
    ideaMeter.hidden = !q;
    if (!q) return;
    ideaMeter.querySelector('b').style.width = (100 * BR.brains / BRAIN_CAP).toFixed(1) + '%';
    var em = ideaMeter.querySelector('em'), t = BR.brains + ' / ' + BRAIN_CAP;
    if (em.textContent !== t) em.textContent = t;
  }
  BrainMenu3.on(function (t) {
    if (t === 'open') { updateSeedPill(); updateIdeaMeter(); }
    if (t === 'close') { UI.brain = null; restoreBuildMenu(); }
    if (t === 'idea') openIdeas(); // Idea button = the ideas list, NOT the mini-game (cp6)
  });
  // ---- v55: the roster + ideas panels INSIDE the brain menu ----
  // One shared panel (.bm3-panel, NP5 .pwin "Colony" look). Rows are built
  // with createElement + textContent (never innerHTML strings), so the
  // harness fake DOM — which drops text nodes from innerHTML — reads them.
  function bmPanel(title, rows, emptyText) {
    var p = BrainMenu3.root.querySelector('.bm3-panel');
    if (!p) return;
    var t = p.querySelector('.bm3-panel-title'); if (t) t.textContent = title;
    var body = p.querySelector('.bm3-panel-body');
    while (body.children.length) body.removeChild(body.children[0]); // (no firstChild in the harness fake DOM)
    if (!rows.length) {
      var e = document.createElement('div'); e.className = 'bm3-empty'; e.textContent = emptyText || 'Nothing here yet'; body.appendChild(e);
    } else {
      rows.forEach(function (r) {
        var row = document.createElement('div'); row.className = 'bm3-row';
        var b = document.createElement('b'); b.textContent = r.n; row.appendChild(b);
        var s = document.createElement('span'); s.textContent = r.v; row.appendChild(s);
        body.appendChild(row);
      });
    }
    p.hidden = false;
  }
  function openRoster() { openRosterWin(); }
  function openIdeas() {
    // v55: the colony has NO ideas yet in cp5 — the idea game (10th brain)
    // is checkpoint 6. Show that honestly; do NOT start a mini-game.
    bmPanel('Ideas', [{ n: 'Idea 0', v: 'None yet — the queen has her next idea at 10 brains (checkpoint 6)' }], '');
  }
  // ---- v59: the DESIGNED roster button (NP5 #rosterBtn) — INSIDE the
  // brain menu only (Chris, Nov 21: "I only want that to be in the
  // brain menu, not in the actual game"). The button + panel are
  // children of the brain menu root (BrainMenu3.root), NOT #game, so
  // they can never appear during normal play. The "…" button stays
  // deleted — one clear roster button, top-right of the menu.
  var rosterBtn = document.createElement('button');
  rosterBtn.id = 'rosterBtn'; rosterBtn.type = 'button'; rosterBtn.setAttribute('aria-label', 'Colony roster');
  rosterBtn.innerHTML = '<svg viewBox="0 0 24 24"><g fill="#4a2c0e"><circle cx="5" cy="6" r="1.9"/><circle cx="5" cy="12" r="1.9"/><circle cx="5" cy="18" r="1.9"/><rect x="9" y="4.7" width="12" height="2.6" rx="1.3"/><rect x="9" y="10.7" width="12" height="2.6" rx="1.3"/><rect x="9" y="16.7" width="12" height="2.6" rx="1.3"/></g></svg>';
  var rosterWin = document.createElement('div');
  rosterWin.id = 'rosterWin'; rosterWin.className = 'bm3-panel'; rosterWin.hidden = true;
  rosterWin.innerHTML = '<div class="bm3-panel-head"><span class="bm3-panel-title"></span><button class="bm3-panel-x" type="button" aria-label="Close">✕</button></div><div class="bm3-panel-body"></div>';
  rosterWin.querySelector('.bm3-panel-title').textContent = 'Colony';
  var gameRootEl = document.querySelector('#game');
  var bmRootEl = (typeof BrainMenu3 !== 'undefined' && BrainMenu3.root) || null;
  if (bmRootEl) { bmRootEl.appendChild(rosterBtn); bmRootEl.appendChild(rosterWin); }
  else if (gameRootEl) { gameRootEl.appendChild(rosterBtn); gameRootEl.appendChild(rosterWin); } // fallback: mount ran later (never in practice — mount is line ~4523)
  // NP5 pattern: the button + panel swallow their own gestures so a tap on
  // them never reaches the canvas below.
  ['pointerdown', 'click', 'touchstart', 'touchend', 'wheel'].forEach(function (ev) {
    rosterBtn.addEventListener(ev, function (e) { e.stopPropagation(); });
    rosterWin.addEventListener(ev, function (e) { e.stopPropagation(); });
  });
  function renderRosterWin() {
    if (!rosterWin) return;
    var body = rosterWin.querySelector('.bm3-panel-body'); if (!body) return;
    while (body.children.length) body.removeChild(body.children[0]);
    var rows = rosterRows();
    if (!rows.length) {
      var e = document.createElement('div'); e.className = 'bm3-empty'; e.textContent = 'No ants yet'; body.appendChild(e);
    } else {
      rows.forEach(function (r) {
        var row = document.createElement('div'); row.className = 'bm3-row';
        var b = document.createElement('b'); b.textContent = r.n; row.appendChild(b);
        var s = document.createElement('span'); s.textContent = r.v; row.appendChild(s);
        body.appendChild(row);
      });
    }
  }
  function openRosterWin() { renderRosterWin(); rosterWin.hidden = false; }
  function closeRosterWin() { rosterWin.hidden = true; }
  rosterBtn.addEventListener('click', function () { if (rosterWin.hidden) openRosterWin(); else closeRosterWin(); });
  rosterWin.querySelector('.bm3-panel-x').addEventListener('click', closeRosterWin);
  window.BASE_TEST.rosterBtnEl = rosterBtn; // harness handle
  var bmWasOpen = false, bmNoRestore = false, bmAutoOpened = false; // build-menu state across the brain menu (v56; v57 adds bmAutoOpened)
  // v57: index.html's begin('underground') calls this after the ARRIVAL
  // auto-open (queenTarget.click()) so the close path knows the build menu
  // opened by itself, not by the player. See closeBuildMenuForBrain.
  window.__bmNoteAutoOpen = function () { bmAutoOpened = true; };
  // v57: any trusted touch inside the build menu means the player is USING
  // it — the menu is theirs from then on, so the auto-open flag clears and
  // a later brain-menu close restores it. (Programmatic clicks do not fire
  // pointerdown, so arrival/hammer/restore clicks never clear it.)
  var bmElForAuto = document.querySelector('#buildMenu');
  if (bmElForAuto) bmElForAuto.addEventListener('pointerdown', function () { bmAutoOpened = false; }, true);
  window.BuildShortcut = { go: function () { bmNoRestore = true; bmAutoOpened = false; BrainMenu3.close(); bmNoRestore = false; openBuildMenu(); } };
  // ---- v56: the QUEEN opens the BRAIN MENU directly (Chris, Nov 21) ----
  // v55 made her tap open the GIANT ANT MENU first (head -> brain icon);
  // Chris: "that's actually not what I was requesting" — the giant menu is
  // DELETED. A trusted tap on the queen (#queenTarget) now opens the
  // full-screen brain menu straight away. The build menu sheet closes
  // while the brain menu is open (state back underground) and is restored
  // when the brain menu closes, so the two menus never overlap and the
  // player comes back to exactly where they were. The hammer in the brain
  // menu still opens the build sheet (BuildShortcut.go above) — and the
  // build menu itself still opens the usual way (arrival auto-open,
  // programmatic queenTarget click), so the build sheet stays reachable.
  function closeBuildMenuForBrain() {
    var bm = document.querySelector('#buildMenu');
    // v57: restore ONLY a menu the player actually had open. The build
    // menu auto-opens on arrival (locked cp1 behaviour: "the build menu
    // opens by itself when she gets downstairs"), so plain
    // classList.contains('open') is true even when the player never asked
    // for it — and v56 restored it on every brain-menu close, which is how
    // Chris got the build menu popping open after closing the brain menu
    // (his 11:34 screenshot). bmAutoOpened is set by begin('underground')
    // via __bmNoteAutoOpen and cleared by the first trusted touch inside
    // the menu, so "was open" now means "open AND the player used it".
    bmWasOpen = !!(bm && bm.classList.contains('open')) && !bmAutoOpened;
    if (bm) bm.classList.remove('open');
    if (typeof state !== 'undefined' && state === 'menu') { state = 'underground'; if (typeof pan !== 'undefined') pan = 0; if (typeof syncFloors === 'function') syncFloors(); }
  }
  function restoreBuildMenu() {
    if (bmNoRestore || !bmWasOpen) return; // the hammer opens the build sheet itself — no double open
    bmWasOpen = false;
    openBuildMenu();
  }
  function openBrain(a) {
    if (!a || !a.queen) return; // v56: queen-only — only her brain menu exists
    if (window.BrainMenu3 && BrainMenu3.isOpen) return; // already open — a second tap must not reset bmWasOpen (the build-menu restore)
    closeBuildMenuForBrain();
    BrainMenu3.open(QUEEN_ANT, { hammer: false });
    updateSeedPill(); updateIdeaMeter();
    UI.brain = 'queen';
  }
  function openBuildMenu() {
    // The build menu is index.html's queenTarget click (state -> 'menu').
    // Called programmatically, so it is an UNTRUSTED click: the queenTarget
    // interceptor below lets it through and the build menu opens as on arrival.
    var q = document.querySelector('#queenTarget');
    if (q) q.click();
  }
  // ---- v56: tapping the QUEEN opens her BRAIN MENU directly ----
  // index.html's queenTarget click still opens the build menu — and the
  // arrival auto-open (begin('underground') -> queenTarget.click(), a
  // LOCKED checkpoint-1 behaviour) must keep doing exactly that. So this
  // capture listener on #game only intercepts TRUSTED taps (a real finger):
  // those open the brain menu straight away — no giant menu, no head zone,
  // no brain icon in a bubble. Programmatic clicks pass through untouched.
  var gameEl = document.querySelector('#game');
  if (gameEl) gameEl.addEventListener('click', function (e) {
    if (!e || !e.target || e.target.id !== 'queenTarget') return;
    if (!e.isTrusted) return;
    if (typeof state !== 'undefined' && state !== 'underground' && state !== 'menu') return;
    if (window.BrainMenu3 && BrainMenu3.isOpen) return;
    if (e.stopPropagation) e.stopPropagation();
    if (e.preventDefault) e.preventDefault();
    openBrain(QUEEN_ANT);
  }, true);

  // ---- v55 test handles (read-only state + tap entry points, same pattern as BASE_TEST) ----
  window.BASE_TEST.openBrain = openBrain;
  window.BASE_TEST.openRoster = openRoster;
  window.BASE_TEST.openIdeas = openIdeas;
  window.BASE_TEST.brainFor = brainFor;
  window.BASE_TEST.colonyCounts = colonyCounts;
  window.BASE_TEST.rosterRows = rosterRows;
  window.BASE_TEST._finishTrain = finishTrain;
  window.BASE_TEST.tapQueen = function () { openBrain(QUEEN_ANT); }; // harness: the trusted-tap equivalent (v56: straight to the brain menu)
  window.BASE_TEST.refreshBrainMenu = function () { if (window.BrainMenu3) BrainMenu3.refresh(); };
  Object.defineProperty(window.BASE_TEST, 'brainMenu', {
    get: function () {
      if (!window.BrainMenu3 || !BrainMenu3.isOpen) return null;
      var c = BrainMenu3.current;
      var panel = BrainMenu3.root.querySelector('.bm3-panel');
      var panelRows = null;
      if (panel && !panel.hidden) {
        panelRows = { title: (panel.querySelector('.bm3-panel-title') || {}).textContent || '', rows: Array.prototype.slice.call(panel.querySelectorAll('.bm3-row')).map(function (r) { return { n: (r.querySelector('b') || {}).textContent || '', v: (r.querySelector('span') || {}).textContent || '' }; }) };
      }
      return { name: c.name, lvl: c.lvl, ideas: c.ideas, counts: colonyCounts(), seedMoney: BR.coins, food: Math.round(MV.food), water: Math.round(MV.water), panel: panelRows };
    }
  });
  // v57: the game-screen roster panel (NP5 #rosterWin) — null while closed.
  Object.defineProperty(window.BASE_TEST, 'rosterWin', {
    get: function () {
      if (typeof rosterWin === 'undefined' || !rosterWin || rosterWin.hidden) return null;
      var body = rosterWin.querySelector('.bm3-panel-body');
      return { title: (rosterWin.querySelector('.bm3-panel-title') || {}).textContent || '', rows: Array.prototype.slice.call(body.querySelectorAll('.bm3-row')).map(function (r) { return { n: (r.querySelector('b') || {}).textContent || '', v: (r.querySelector('span') || {}).textContent || '' }; }) };
    }
  });
  Object.defineProperty(window.BASE_TEST, 'seedMoney', { get: function () { return BR.coins; } });

  renderMenu();

  // TEST-ONLY ?start=downstairs / ?checkpoint=2 / ?checkpoint=3 / ?checkpoint=4 / ?checkpoint=5: skip the (LOCKED) opening to the exact real arrival state.
  // ?checkpoint=2 is Chris's Checkpoint 2 test link: straight underground, menu open, ready to place.
  // ?checkpoint=3 is the same for checkpoint 3 testing.
  // ?checkpoint=4 is the same for checkpoint 4 testing, PLUS the trade-school
  // prerequisites (setupTradeTest): a grown-up ant at a desk, the trade tab open.
  // ?checkpoint=5 is the same for checkpoint 5 testing, PLUS the trade-school
  // prerequisites AND 8 brains already collected (setupCp5Test): the queen
  // rests on her bed, so the 120 s brain timer runs and the next brain bubble
  // (tap = 9 brains) brings the squirrel. No save exists, so a reload starts
  // over at 8 brains again — the squirrel replays once per session.
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
    queenFree = true; // v57 (Chris, Nov 21): the ?checkpoint=4/5 shortcut
    // simulates the post-placement state (bed + desks already built), so the
    // QN system must take over from load. Before this, queenFree stayed false
    // until the player's FIRST placement — and index.html's drawUnderground
    // overwrites queen.x/y to the spiral every frame while !BASE_QUEEN.free,
    // and stepFrame (the brain timer) never runs. That is why the
    // ?checkpoint=5 shortcut never started on his phone: the queen stood at
    // the spiral, no countdown showed, and his first placement reset BR.t to
    // 0 (brainReset), so a full 2:00 counter started. Test shortcuts only;
    // normal play is untouched (queenFree still flips on first placement).
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
  function setupCp5Test() {
    // CHECKPOINT 5 test shortcut: the whole checkpoint 4 test setup (bed,
    // three grown ants at desks, trade school open) PLUS 8 brains already
    // collected, so the squirrel is one brain-bubble tap away. The brain
    // timer itself is untouched (120 s, bed-only) except that the shortcut
    // starts it at 110 s elapsed (v55: 10 s left) — she rests on the bed and
    // the bubble appears ~10 s in, exactly as in the real flow.
    setupTradeTest();
    BR.brains = 8; BR.t = 110; BR.ready = false; // v55 (Chris, Nov 21): the
    // ?checkpoint=5 test shortcut starts with only 10 s left on the 120 s
    // timer, so the bubble appears ~10 s in — he is testing specific things
    // and does not want to wait the full 2 minutes. Test shortcut ONLY; the
    // normal 120 s timer is unchanged everywhere else.
    // v54: she is ALREADY resting on the bed (the real flow settles her there
    // when the bed is built — the shortcut must match that end state, or the
    // 120 s brain timer never runs: atHome() needs her within 2 units of home
    // and nothing sends her home while idle). Without this she stands at the
    // spiral and the 9th brain never comes from just waiting.
    queen.x = QN.home.x; queen.y = QN.home.y;
  }
  if (URLQ.get('start') === 'downstairs' || URLQ.get('checkpoint') === '2' || URLQ.get('checkpoint') === '3' || URLQ.get('checkpoint') === '4' || URLQ.get('checkpoint') === '5') {
    var go = function () {
      if (typeof ready !== 'undefined' && !ready) { setTimeout(go, 40); return; }
      loadBasement();
      if (!basementReady) { setTimeout(go, 40); return; }
      emergeT0 = performance.now() - BC.EMERGE_SECONDS * 1000 - 1; emerged = true; // she already walked out in checkpoint 1; never replay on later descents
      begin('underground');
      if (URLQ.get('checkpoint') === '4') setupTradeTest(); // CHECKPOINT 4: the trade-school prerequisites, ready to test
      if (URLQ.get('checkpoint') === '5') setupCp5Test(); // CHECKPOINT 5: trade-school prerequisites + 8 brains, ready to test
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
