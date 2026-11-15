// ===================== BASE LAYER (Nov 15 2026) + CHECKPOINT 2 PLACEMENT (Nov 15 2026) =====================
// Checkpoint 1 (LOCKED): the opening (unchanged) + the pocket downstairs + the queen's
// idle + a build menu that is always on, 2/3 as tall, with just the four first
// build items (leaf bed, egg basket, fridge, water cooler) and a bulldozer to
// remove a placed item. No brain menu, no crown, no ants menu, no seed money,
// no water/food meters. The menu opens by itself when she gets downstairs.
// Checkpoint 2 (placement): BUILD lights the free hexagons in the pocket (green,
// the other game's placing colours); tap a hexagon and the item appears as a
// white ghost that follows the finger; tap the screen to set it down. Over
// another item, or outside the pocket, it turns red and cannot be set down.
// ?checkpoint=2 skips the opening for testing: straight underground, menu open.
(function () {
  'use strict';
  var URLQ = new URLSearchParams(location.search);

  // ---- the four first build items (default spots in the entrance hex; Chris will place them) ----
  // Spots sit in the middle of the cleared pocket, above the build menu, so a
  // placed item is visible the moment you tap BUILD (Nov 15 fix: the low spots
  // hid behind the menu).
  var ITEMS = [
    { id: 'leafbed',    name: 'Leaf bed',    src: 'assets/items/leaf-bed.png',    cx: 2790, floorY: 5000, w: 50 },
    { id: 'eggbasket',  name: 'Egg basket',  src: 'assets/items/egg-basket.png',  cx: 2862, floorY: 4995, w: 28 },
    { id: 'fridge',     name: 'Fridge',      src: 'assets/items/fridge.png',      cx: 2762, floorY: 5010, w: 36 },
    { id: 'watercooler',name: 'Water cooler',src: 'assets/items/water-cooler.png',cx: 2865, floorY: 5005, w: 33 }
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

  // ---- placed items (drawn in world space by drawUnderground) ----
  var placed = []; // {id, cx, floorY, w, h}
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

  // ---- CHECKPOINT 2: the hex grid in the pocket (flat-top, same size as HEX) ----
  // The other game puts rooms on fixed hex cells and lights the free ones green
  // while placing; this layer reuses that shape and those colours.
  var HEXW = HEX.w, HEXHH = HEX.w * Math.sqrt(3) / 2, HEXCS = 0.75 * HEX.w;
  function hexCenter(c, r) { return { x: HEX.cx + c * HEXCS, y: HEX.cy + (r + (c % 2 ? 0.5 : 0)) * HEXHH }; }
  function inHexPt(p, cx, cy) { var dx = Math.abs(p.x - cx), dy = Math.abs(p.y - cy); return dy <= HEXHH / 2 && dx <= HEXW / 2 - dy / Math.sqrt(3); } // v1 inHex
  // The cleared pocket, exactly as build_fog_map.py cut it (world coords).
  function inPocket(x, y) {
    var dx = (x - 2820.9) / 63, dy = (y - 4974.5) / 88.7;
    if (dx * dx + dy * dy <= 1) return true;
    var d2 = function (cx, cy, r) { var ax = x - cx, ay = y - cy; return ax * ax + ay * ay <= r * r; };
    return d2(2798, 5018.8, 42) || d2(2844.7, 5030.5, 39.7) || d2(2820.9, 4925.5, 46.7);
  }
  // Hexes whose area touches the pocket, except the entrance hex (0,0) where the
  // queen arrives — the other game likewise never builds on the spiral cell.
  var PLACE_HEXES = (function () {
    var out = [];
    for (var c = -2; c <= 2; c++) for (var r = -2; r <= 2; r++) {
      if (c === 0 && r === 0) continue;
      var ctr = hexCenter(c, r), ok = inPocket(ctr.x, ctr.y);
      if (!ok) for (var i = 0; i < 6 && !ok; i++) {
        var v = hexVertex(ctr.x, ctr.y, HEXW, i);
        if (inPocket(v.x, v.y)) ok = true;
        var w2 = hexVertex(ctr.x, ctr.y, HEXW, (i + 1) % 6);
        if (inPocket((v.x + w2.x) / 2, (v.y + w2.y) / 2)) ok = true;
      }
      if (ok) out.push({ c: c, r: r, x: ctr.x, y: ctr.y });
    }
    return out;
  })();
  function freeHexes() {
    return PLACE_HEXES.filter(function (h) {
      return !placed.some(function (p) { return inHexPt({ x: p.cx, y: p.floorY }, h.x, h.y); });
    });
  }
  function hexAt(wx, wy) {
    var p = { x: wx, y: wy }, list = freeHexes();
    for (var i = 0; i < list.length; i++) if (inHexPt(p, list[i].x, list[i].y)) return list[i];
    return null;
  }

  // ---- CHECKPOINT 2: placement state ----
  // mode: 'idle' | 'selectHex' (BUILD tapped, hexagons lit) | 'carrying' (ghost follows the finger)
  var mode = 'idle', carryId = null, ghost = null; // ghost = {cx, floorY}
  window.BASE_PLACING = false; // index.html's camera pan/zoom ignores the pointer while this is true.
  function ghostOK() {
    if (!ghost || !carryId) return false;
    var it = itemById(carryId);
    if (!it) return false;
    return inPocket(ghost.cx, ghost.floorY) && !overlapsPlaced(ghost.cx, ghost.floorY, it.w, itemH(it));
  }
  function setPlacingUI() {
    // While choosing a spot or carrying, taps on the queen and the floor arrows must reach the room, not the buttons.
    var q = document.querySelector('#queenTarget'), f = document.querySelector('#floors');
    var on = mode !== 'idle';
    if (q) q.style.pointerEvents = on ? 'none' : '';
    if (f) f.style.pointerEvents = on ? 'none' : '';
    window.BASE_PLACING = (mode === 'carrying');
  }
  function startSelect(id) {
    if (window.BASE_ITEMS.isPlaced(id)) return;
    if (typeof state !== 'undefined' && state !== 'underground' && state !== 'menu') return; // only downstairs
    mode = 'selectHex'; carryId = id; ghost = null;
    setPlacingUI(); renderMenu();
  }
  function cancelPlacing() {
    mode = 'idle'; carryId = null; ghost = null;
    setPlacingUI(); renderMenu();
  }

  window.BASE_ITEMS = {
    draw: function () {
      if (typeof ctx === 'undefined') return;
      // CHECKPOINT 2: the free hexagons, lit green (the other game's placing colours) while choosing a spot or carrying.
      if (mode !== 'idle' && (state === 'underground' || state === 'menu')) {
        ctx.save();
        freeHexes().forEach(function (h) {
          ctx.beginPath(); hexPath(h.x, h.y, HEXW); ctx.closePath();
          ctx.fillStyle = 'rgba(120,230,110,.20)'; ctx.fill();
          ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(150,255,140,.75)'; ctx.stroke();
        });
        ctx.restore();
      }
      placed.forEach(function (p) {
        var im = IMGS[p.id];
        if (!im || !im.complete || !im.naturalWidth) return;
        var h = p.w * im.naturalHeight / im.naturalWidth;
        ctx.drawImage(im, p.cx - p.w / 2, p.floorY - h, p.w, h);
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
    },
    isPlaced: function (id) { return placed.some(function (p) { return p.id === id; }); },
    place: function (id, cx, floorY) {
      if (this.isPlaced(id)) return false;
      var it = itemById(id);
      if (!it) return false;
      // CHECKPOINT 2: a placed position (from the ghost) wins; no position = the default spot (checkpoint 1).
      placed.push({ id: it.id, cx: (typeof cx === 'number' ? cx : it.cx), floorY: (typeof floorY === 'number' ? floorY : it.floorY), w: it.w });
      renderMenu();
      return true;
    },
    removeAt: function (wx, wy) {
      for (var i = placed.length - 1; i >= 0; i--) {
        var p = placed[i], im = IMGS[p.id];
        if (!im || !im.naturalWidth) continue;
        var h = p.w * im.naturalHeight / im.naturalWidth;
        if (wx >= p.cx - p.w / 2 && wx <= p.cx + p.w / 2 && wy >= p.floorY - h && wy <= p.floorY) {
          placed.splice(i, 1);
          renderMenu();
          return true;
        }
      }
      return false;
    },
    startSelect: startSelect,
    cancel: cancelPlacing,
    get mode() { return mode; },
    get placing() { return mode === 'carrying'; }
  };

  // ---- the build menu (always on, just the four items + the bulldozer) ----
  var style = document.createElement('style');
  style.textContent =
    '.bl-head{display:flex;justify-content:space-between;align-items:center;padding:2px 6px 8px}' +
    '.bl-title{color:#f3e6c8;font-size:17px;font-weight:700;letter-spacing:.5px}' +
    '.bl-dozer{border:2px solid #82562f;border-radius:12px;background:rgba(255,244,220,.14);color:#f3e6c8;font-size:22px;line-height:1;padding:6px 12px;cursor:pointer}' +
    '.bl-dozer.on{background:#a93226;border-color:#e74c3c}' +
    '.bl-cards{display:flex;gap:10px}' +
    '.bl-card{flex:1;position:relative;background:linear-gradient(#2b1c11,#1e130d);border:1px solid #1d100a;border-radius:14px;padding:8px 6px 8px;display:flex;flex-direction:column;align-items:center;gap:5px;box-shadow:inset 0 3px 12px #08040299}' +
    '.bl-thumb{width:100%;height:104px;background-size:contain;background-repeat:no-repeat;background-position:center bottom}' +
    '.bl-name{color:#f3e6c8;font-size:14px}' +
    '.bl-build{position:absolute;top:6px;right:6px;border:0;border-radius:9px;background:linear-gradient(180deg,#7fb069,#4c8a3f);color:#fff;font-size:13px;font-weight:700;padding:5px 9px;cursor:pointer}' +
    '.bl-build:disabled{background:#5a5148;cursor:default}' +
    '.bl-cancel{background:linear-gradient(180deg,#a93226,#7e241b)}' +
    '.bl-placed{position:absolute;top:6px;right:6px;border-radius:9px;background:#5a5148;color:#e8dcc8;font-size:12px;font-weight:700;padding:5px 8px}';
  document.head.appendChild(style);

  var demolish = false;
  var tray = document.querySelector('#emptyTray');

  function renderMenu() {
    if (!tray) return;
    var html = '<div class="bl-head"><div class="bl-title">Build</div>' +
      '<button type="button" class="bl-dozer' + (demolish ? ' on' : '') + '" id="blDozer" aria-label="Bulldozer: remove a placed item">\uD83D\uDE9C</button></div>' +
      '<div class="bl-cards">';
    ITEMS.forEach(function (it) {
      var done = window.BASE_ITEMS.isPlaced(it.id);
      var active = (mode !== 'idle' && carryId === it.id);
      html += '<div class="bl-card"><div class="bl-thumb" style="background-image:url(' + it.src + ')"></div>' +
        '<div class="bl-name">' + it.name + '</div>' +
        (done
          ? '<span class="bl-placed">\u2713 Built</span>'
          : active
            ? '<button type="button" class="bl-build bl-cancel" data-cancel="' + it.id + '">\u2715 Cancel</button>'
            : '<button type="button" class="bl-build" data-build="' + it.id + '">BUILD</button>') +
        '</div>';
    });
    html += '</div>';
    tray.innerHTML = html;
    var dz = document.getElementById('blDozer');
    if (dz) dz.addEventListener('click', function (e) {
      e.stopPropagation();
      // CHECKPOINT 2: the bulldozer stays a no-op for now (it is not part of placement).
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
  }

  // Demolish: tap the bulldozer, then tap a placed item in the room to remove it.
  var cv = document.querySelector('#scene');
  if (cv) cv.addEventListener('pointerdown', function (e) {
    if (!demolish) return;
    try {
      var c = eventCanvas(e);
      var p = canvasToWorld(c.x, c.y + (typeof pan !== 'undefined' ? pan : 0));
      if (window.BASE_ITEMS.removeAt(p.x, p.y)) demolish = false;
    } catch (err) { /* demolish tap ignored */ }
  });

  // CHECKPOINT 2: tap a lit hexagon to take the item; drag to move the ghost; tap to set it down.
  // A drag only moves the ghost — only a tap (down and up in one spot) places it.
  var pd = null; // {id, x, y, moved} in eventCanvas coords
  function toWorld(e) {
    var c = eventCanvas(e);
    return canvasToWorld(c.x, c.y + (typeof pan !== 'undefined' ? pan : 0));
  }
  if (cv) {
    cv.addEventListener('pointerdown', function (e) {
      if (mode === 'idle') return;
      if (state !== 'underground' && state !== 'menu') return;
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
      if (state !== 'underground' && state !== 'menu') return;
      if (mode === 'selectHex') {
        var w = toWorld(e);
        var h = hexAt(w.x, w.y);
        if (h) {
          ghost = { cx: h.x, floorY: h.y };
          mode = 'carrying';
          setPlacingUI(); renderMenu();
        }
        return;
      }
      if (mode === 'carrying') {
        if (ghostOK()) {
          var id = carryId, g = ghost;
          window.BASE_ITEMS.place(id, g.cx, g.floorY);
          cancelPlacing();
        }
        // Red ghost: the tap does nothing, the item stays carried.
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
      emergeT0 = performance.now() - BC.EMERGE_SECONDS * 1000 - 1;
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
