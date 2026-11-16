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
// ?checkpoint=2 skips the opening for testing: straight underground, menu open.
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
    { id: 'eggbasket',  name: 'Egg basket',  src: 'assets/items/egg-basket.png',  cx: 2835, floorY: 5045, w: 9.69 },
    { id: 'fridge',     name: 'Fridge',      src: 'assets/items/fridge.png',      cx: 2770, floorY: 5060, w: 18.0 },
    { id: 'watercooler',name: 'Water cooler',src: 'assets/items/water-cooler.png',cx: 2855, floorY: 5055, w: 19.5 }
  ];
  var IMGS = {};
  ITEMS.forEach(function (it) {
    var im = new Image();
    im.src = it.src;
    IMGS[it.id] = im;
    it.h = it.w * 0.8; // replaced on load with the true aspect
    im.onload = function () { if (im.naturalHeight) it.h = it.w * im.naturalHeight / im.naturalWidth; };
  });
  function itemById(id) { var found = null; ITEMS.forEach(function (x) { if (x.id === id) found = x; }); return found; }
  function itemH(it) { var im = IMGS[it.id]; return (im && im.naturalWidth) ? it.w * im.naturalHeight / im.naturalWidth : it.w * 0.8; }

  // ---- CHECKPOINT 2: the unlock rule (Chris, Nov 15 — replaces v1's chain) ----
  // The bed is the only gate. At the start the menu shows ONLY the bed; the
  // fridge, water cooler, and egg basket are HIDDEN, not "Locked". Once she
  // settles on the bed, all three appear and are buildable in ANY order —
  // there is no forced sequence. Erasing the bed closes the gate again (the
  // three hide until the bed is rebuilt); moving an item changes nothing.
  // An item is either visible and buildable, or hidden. No "Locked" cards.
  var bedGate = false; // opens when she settles on the bed
  var builtOnce = {}; // items placed at least once (a move re-place is not a first build)
  function isVisible(id) {
    if (id === 'leafbed') return true;
    return bedGate;
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
  // Seed-money price of the NEXT copy of a type (Chris, Nov 15): the 1st is
  // FREE, then 10, 20, 30... — each next copy costs 10 more than the last,
  // counted PER TYPE. No seed-money balance or wallet exists yet (Chris will
  // explain seed money later), so this is the price structure and display
  // only — building is never blocked for cost.
  function nextPrice(id) { return placedCount(id) * 10; } // 0 = FREE for the first copy
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
  // Called from drawUnderground (index.html) once per frame while she is free.
  function queenFrame(now) {
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
    drawQueen(now);
    drawBrainBubble(now);
    drawRoomTimerBubbles(now);
    drawBasketBubbles(now);
    if (QN.mode === 'walk') positionTarget();
  }
  window.BASE_QUEEN = {
    get free() { return queenFree; },
    draw: queenFrame
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
  // The hatch itself spawns kid ants in v1 (GENS/newKid/walkAnt + kid sprites) —
  // that whole kid system is NOT ported, so no babies appear yet (see report).
  var EGG_CYCLE = {
    TEND_AT_S: [120, 240, 360],
    TEND_COUNT: 3,
    HATCH_AT_S: 480,
    SPOIL_WINDOW_S: 120,
    LAY_WAIT_S: 2, TEND_LOOK_S: 2, SPOIL_REMOVE_S: 2
  };
  var IEGG = new Image(); IEGG.src = 'assets/items/egg-cutout.png';
  var IBASKET_EMPTY = new Image(); IBASKET_EMPTY.src = 'assets/items/egg-basket-empty.png';
  var basketJob = null; // 'tend' | 'remove' while she is doing a basket job
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
  // v1 first-play fast hatch (index.html armFirstPlayHatch, FIRST_PLAY_HATCH_S=30):
  // the FIRST basket lay hatches in 30 s with no tends and no spoil, so the
  // player sees a hatch fast the first time. Only ever runs once per session.
  var firstPlayHatch = false;
  var FIRST_PLAY_HATCH_S = 30;
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
    if (e.state !== 'two') return;
    if (e.tendsDone < EGG_CYCLE.TEND_COUNT) {
      if (e.tendAppearedAt == null && QT >= e.tendDueAt) { e.tendAppearedAt = QT; e.spoilAt = QT + EGG_CYCLE.SPOIL_WINDOW_S; }
      else if (e.tendAppearedAt != null && !e.tapped && QT >= e.spoilAt) {
        e.state = 'spoiled'; e.tendAppearedAt = null; e.spoilAt = null; e.hatchAt = null;
      }
    } else if (QT >= e.hatchAt && !QN.busy) {
      // Hatch: v1 spawns kid ants here (GENS/newKid) — NOT ported. The basket empties.
      p.egg = null;
    }
  }
  function runBasketJob(kind) {
    var p = basketPlaced();
    if (!p || !p.egg) return;
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
    if (!p || !p.egg || mode === 'carrying') return [];
    var e = p.egg, out = [], r = bubbleR();
    var im = IMGS[p.id];
    var h = (im && im.naturalWidth) ? p.w * im.naturalHeight / im.naturalWidth : p.w * 0.8;
    var bx = p.cx, by = p.floorY - h - r;
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
        ctx.font = '800 ' + (Rr * .62).toFixed(3) + "px 'BM3 Sans','DejaVu Sans',sans-serif";
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
    if (!p || !p.egg) return;
    if (b.kind === 'tend') {
      p.egg.tapped = true; // v1: the tap counts as the tend in time (spoil clock stops)
      runBasketJob('tend');
    } else if (b.kind === 'spoil') {
      runBasketJob('remove');
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
    return rectTouchesEntranceHex(ghost.cx, ghost.floorY, it.w, h) && !overlapsPlaced(ghost.cx, ghost.floorY, it.w, h);
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
      // CHECKPOINT 2: the one entrance hexagon, lit green (the other game's placing colours) while placing or moving.
      if (mode !== 'idle' && (state === 'underground' || state === 'menu')) {
        ctx.save();
        ctx.beginPath(); hexPath(ENTRANCE.x, ENTRANCE.y, HEXW); ctx.closePath();
        ctx.fillStyle = 'rgba(120,230,110,.20)'; ctx.fill();
        ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(150,255,140,.75)'; ctx.stroke();
        ctx.restore();
      }
      placed.forEach(function (p) {
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
      if (!isVisible(id) && !builtOnce[id]) return false; // the bed gate: a first build needs the item visible (a move re-place is always allowed)
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
      placed.push({ uid: uid, id: it.id, cx: pcx, floorY: pfy, w: it.w, building: true, t0: DIG_PEND, cost: cost });
      builtOnce[it.id] = true;
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
    get queen() { return { x: queen.x, y: queen.y, mode: QN.mode, busy: QN.busy, settled: QN.settled, home: QN.home }; }
  };
  // Test handle for the timer bubbles (tap entry points, same as the canvas tap).
  window.BASE_TEST = {
    brainBubble: brainBubble,
    roomTimerBubble: roomTimerBubble,
    basketBubbles: basketBubbles,
    tapBrainBubble: tapBrainBubble,
    tapRoomTimerBubble: tapRoomTimerBubble,
    tapBasketBubble: tapBasketBubble,
    get placed() { return placed.slice(); }
  };

  // ---- the build menu (always on, just the four items + the bulldozer) ----
  var style = document.createElement('style');
  style.textContent =
    '.bl-head{display:flex;justify-content:space-between;align-items:flex-end;padding:2px 6px 0}' +
    '.bl-title{color:#f3e6c8;font-size:17px;font-weight:700;letter-spacing:.5px}' +
    '.bl-dozer{border:2px solid #82562f;border-radius:12px;background:rgba(255,244,220,.14);color:#f3e6c8;font-size:22px;line-height:1;padding:6px 12px;cursor:pointer}' +
    '.bl-dozer.on{background:#a93226;border-color:#e74c3c}' +
    '.bl-cards{display:flex;gap:10px;justify-content:flex-start}' +
    '.bl-card{flex:0 0 calc((100% - 30px)/4);position:relative;background:linear-gradient(#2b1c11,#1e130d);border:1px solid #1d100a;border-radius:14px;padding:8px 6px 8px;display:flex;flex-direction:column;align-items:center;gap:5px;box-shadow:inset 0 3px 12px #08040299}' +
    '.bl-thumb{width:100%;height:104px;background-size:contain;background-repeat:no-repeat;background-position:center bottom}' +
    '.bl-name{color:#f3e6c8;font-size:14px}' +
    '.bl-build{position:absolute;top:6px;right:6px;border:0;border-radius:9px;background:linear-gradient(180deg,#7fb069,#4c8a3f);color:#fff;font-size:13px;font-weight:700;padding:5px 9px;cursor:pointer}' +
    '.bl-build:disabled{background:#5a5148;cursor:default}' +
    '.bl-cancel{background:linear-gradient(180deg,#a93226,#7e241b)}' +
    '.bl-tabs{display:flex;gap:8px;padding:0;align-items:flex-end}' +
    // folder tab: a real file-folder tab, not a button. Raised flat top with
    // sloped shoulders (clip-path), in the menu's own dark brown (no paper
    // colour), a lighter top for depth, a darker bottom edge for thickness,
    // and a cast shadow under the active tab. The tab's flat bottom meets
    // the menu body below with no gap, so it reads as part of the folder.
    '.bl-tab{border:0;padding:4px 20px 3px;margin-bottom:-1px;cursor:pointer;line-height:0;background:linear-gradient(180deg,#3d2c1d,#2a1c11 60%,#20140c);clip-path:polygon(0 100%,0 0,60% 0,80% 35%,100% 35%,100% 100%);box-shadow:inset 0 1px 0 rgba(255,214,160,.18),inset 0 -4px 0 rgba(0,0,0,.35)}' +
    '.bl-tab img{height:20px;width:auto;display:block;clip-path:inset(0 33.2% 0 33%)}' +
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
    '.bl-byes{background:linear-gradient(180deg,#7fb069,#4c8a3f);color:#fff}' +
    '.bl-bno{background:#5a5148;color:#e8dcc8}';
  document.head.appendChild(style);

  // ---- CHECKPOINT 2: the Build menu tabs ----
  // The menu will hold many kinds of things to build later, so it has tabs.
  // The first (and for now only) tab is the queen tab: the four queen items
  // (leaf bed, egg basket, fridge, water cooler). Its icon is v1's crown,
  // assets/menu-ant/hat-crown-lowered.webp, copied unchanged (md5 46a84515).
  // The tab structure is ready for more tabs later; only the crown tab exists now.
  var CROWN_SRC = 'assets/menu-ant/hat-crown-lowered.webp';
  var TABS = [{ id: 'queen', icon: CROWN_SRC, items: ITEMS }];
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

  function renderMenu() {
    if (!tray) return;
    var html = '<div class="bl-head">' +
      '<div class="bl-tabs">' +
      TABS.map(function (t) {
        return '<button type="button" class="bl-tab' + (t.id === activeTab ? ' on' : '') + '" data-tab="' + t.id + '" aria-label="' + t.id + '"><img alt="" draggable="false" src="' + t.icon + '"></button>';
      }).join('') +
      '</div>' +
      '<button type="button" class="bl-dozer" id="blDozer" aria-label="Bulldozer: remove a placed item">\uD83D\uDE9C</button></div>' +
      '<div class="bl-cards">';
    tabOf(activeTab).items.forEach(function (it) {
      if (!isVisible(it.id)) return; // the bed gate: hidden items are not shown at all, never "Locked"
      var n = placedCount(it.id); // copies of this type on the floor
      var price = n * 10; // the NEXT copy: FREE first, then 10, 20, 30... seed money (per type)
      var active = (mode !== 'idle' && carryId === it.id);
      html += '<div class="bl-card">' +
        '<div class="bl-thumb" style="background-image:url(' + it.src + ')"></div>' +
        '<div class="bl-name">' + it.name + '</div>' +
        (active
          ? '<button type="button" class="bl-build bl-cancel" data-cancel="' + it.id + '">\u2715 Cancel</button>'
          : '<button type="button" class="bl-build" data-build="' + it.id + '">' + (price === 0 ? 'BUILD' : 'BUILD \uD83C\uDF31 ' + price) + '</button>') +
        '</div>';
    });
    html += '</div>';
    tray.innerHTML = html;
    var dz = document.getElementById('blDozer');
    if (dz) dz.addEventListener('click', function (e) {
      e.stopPropagation();
      // CHECKPOINT 2: the bulldozer stays a no-op in the menu (erase lives in the item bubble).
    });
    tray.querySelectorAll('[data-build]').forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.stopPropagation();
        window.BASE_ITEMS.startSelect(b.getAttribute('data-build'));
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
      el.innerHTML = '<div class="bl-bq">Are you sure you want to erase it?</div>' +
        '<div class="bl-brow"><button type="button" class="bl-byes" data-act="yes">Yes</button>' +
        '<button type="button" class="bl-bno" data-act="no">No</button></div>';
    } else {
      el.innerHTML = '<div class="bl-bname">' + name + '</div>' +
        '<div class="bl-brow"><button type="button" class="bl-bmove" data-act="move">\u2194\uFE0F Move</button>' +
        '<button type="button" class="bl-berase" data-act="erase">\uD83D\uDE9C Erase</button></div>';
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
          else if (tb.kind === 'tend' || tb.kind === 'spoil') tapBasketBubble(tb);
          return;
        }
        var hit = placedItemAt(w.x, w.y);
        if (hit) showBubble(hit.uid);
        else hideBubble();
      }
    };
    cv.addEventListener('pointerup', endPlacePtr);
    cv.addEventListener('pointercancel', endPlacePtr);
  }

  renderMenu();

  // TEST-ONLY ?start=downstairs / ?checkpoint=2: skip the (LOCKED) opening to the exact real arrival state.
  // ?checkpoint=2 is Chris's Checkpoint 2 test link: straight underground, menu open, ready to place.
  if (URLQ.get('start') === 'downstairs' || URLQ.get('checkpoint') === '2') {
    var go = function () {
      if (typeof ready !== 'undefined' && !ready) { setTimeout(go, 40); return; }
      loadBasement();
      if (!basementReady) { setTimeout(go, 40); return; }
      emergeT0 = performance.now() - BC.EMERGE_SECONDS * 1000 - 1; emerged = true; // she already walked out in checkpoint 1; never replay on later descents
      begin('underground');
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
