// ===================== BASE LAYER (Nov 15 2026) + CHECKPOINT 2 PLACEMENT (Nov 15 2026, REDESIGNED) =====================
// Checkpoint 1 (LOCKED): the opening (unchanged) + the pocket downstairs + the queen's
// idle + a build menu that is always on, 2/3 as tall, with just the four first
// build items (leaf bed, egg basket, fridge, water cooler) and a bulldozer to
// remove a placed item. No brain menu, no crown, no ants menu, no seed money,
// no water/food meters. The menu opens by itself when she gets downstairs.
// Checkpoint 2 (placement, REDESIGNED Nov 15 18:02 — replaces the 6-hexagon flow):
// ONLY the one entrance hexagon (the VISUAL one below the hole, centre world
// (2812,5039), w 136.86 — NOT the grid's (0,0) at (2812,4999.5)). Tap BUILD and
// the item appears as a white ghost; drag/tap anywhere inside the entrance hex
// to place it (white = can place, red = outside the hex or overlapping another
// item). Tap a placed item and a bubble appears: arrows to MOVE it inside the
// hex, bulldozer to ERASE it (asks "are you sure?" first). No item functions
// or timers in this build — placed items are drawn and marked Built, nothing more.
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
  function placedItemAt(wx, wy) {
    for (var i = placed.length - 1; i >= 0; i--) {
      var p = placed[i], im = IMGS[p.id];
      if (!im || !im.naturalWidth) continue;
      var h = p.w * im.naturalHeight / im.naturalWidth;
      if (wx >= p.cx - p.w / 2 && wx <= p.cx + p.w / 2 && wy >= p.floorY - h && wy <= p.floorY) return p;
    }
    return null;
  }
  function removeItem(id) {
    for (var i = placed.length - 1; i >= 0; i--) {
      if (placed[i].id === id) { placed.splice(i, 1); renderMenu(); return true; }
    }
    return false;
  }

  // ---- CHECKPOINT 2: the ONE entrance hexagon (visual, below the hole) ----
  // The hexagon Chris sees and confirmed, from the game's own grid overlay:
  // chamber centre (3599,1452), w 791 px = world centre (2812,5039), w 136.86.
  // This is NOT the placement grid's (0,0) at HEX (2812,4999.5) — the visual
  // entrance hex sits ~40 world units lower, near SPIRAL_W. Only this one hex
  // is the play area; the full hexagon pattern is NOT built.
  var HEXW = HEX.w, HEXHH = HEX.w * Math.sqrt(3) / 2;
  var ENTRANCE = { x: 2812, y: 5039 };
  function inHexPt(p, cx, cy) { var dx = Math.abs(p.x - cx), dy = Math.abs(p.y - cy); return dy <= HEXHH / 2 && dx <= HEXW / 2 - dy / Math.sqrt(3); } // v1 inHex
  // The whole item rect must sit inside the entrance hexagon.
  function rectInEntranceHex(cx, floorY, w, h) {
    var corners = [
      { x: cx - w / 2, y: floorY - h }, { x: cx + w / 2, y: floorY - h },
      { x: cx - w / 2, y: floorY },     { x: cx + w / 2, y: floorY }
    ];
    for (var i = 0; i < corners.length; i++) if (!inHexPt(corners[i], ENTRANCE.x, ENTRANCE.y)) return false;
    return true;
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
    return rectInEntranceHex(ghost.cx, ghost.floorY, it.w, h) && !overlapsPlaced(ghost.cx, ghost.floorY, it.w, h);
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
    if (window.BASE_ITEMS.isPlaced(id)) return;
    if (typeof state !== 'undefined' && state !== 'underground' && state !== 'menu') return; // only downstairs
    hideBubble();
    // No hexagon picker any more: the item is carried straight into the one entrance hexagon.
    mode = 'carrying'; carryId = id; moveFrom = null;
    ghost = { cx: ENTRANCE.x, floorY: ENTRANCE.y };
    setPlacingUI(); renderMenu();
  }
  function startMove(id) {
    // Take the placed item off the floor and carry it; cancelling puts it back where it was.
    var idx = -1;
    for (var i = 0; i < placed.length; i++) if (placed[i].id === id) { idx = i; break; }
    if (idx < 0) return;
    var p = placed[idx];
    moveFrom = { id: p.id, cx: p.cx, floorY: p.floorY };
    placed.splice(idx, 1);
    hideBubble();
    mode = 'carrying'; carryId = id;
    ghost = { cx: p.cx, floorY: p.floorY };
    setPlacingUI(); renderMenu();
  }
  function cancelPlacing() {
    if (moveFrom) {
      var it = itemById(moveFrom.id);
      placed.push({ id: moveFrom.id, cx: moveFrom.cx, floorY: moveFrom.floorY, w: it ? it.w : 0 });
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
      var p = placedItemAt(wx, wy);
      if (!p) return false;
      return removeItem(p.id);
    },
    removeItem: removeItem,
    startSelect: startSelect,
    startMove: startMove,
    cancel: cancelPlacing,
    get mode() { return mode; },
    get placing() { return mode === 'carrying'; },
    get placed() { return placed.slice(); },
    get entrance() { return { x: ENTRANCE.x, y: ENTRANCE.y, w: HEXW }; }
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
    '.bl-placed{position:absolute;top:6px;right:6px;border-radius:9px;background:#5a5148;color:#e8dcc8;font-size:12px;font-weight:700;padding:5px 8px}' +
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

  var tray = document.querySelector('#emptyTray');

  function renderMenu() {
    if (!tray) return;
    var html = '<div class="bl-head"><div class="bl-title">Build</div>' +
      '<button type="button" class="bl-dozer" id="blDozer" aria-label="Bulldozer: remove a placed item">\uD83D\uDE9C</button></div>' +
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
  }

  // ---- CHECKPOINT 2: the item bubble ----
  // Tap a placed item: a bubble with arrows to MOVE it inside the hexagon and a
  // bulldozer to ERASE it. The bulldozer asks "are you sure?" first.
  var bubbleEl = null, bubbleItemId = null, bubbleMode = 'actions', bubbleRAF = null;
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
    if (!bubbleItemId) return;
    var it = itemById(bubbleItemId);
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
        if (act === 'move') startMove(bubbleItemId);
        else if (act === 'erase') { bubbleMode = 'confirm'; renderBubble(); }
        else if (act === 'yes') { var id = bubbleItemId; hideBubble(); removeItem(id); }
        else if (act === 'no') { bubbleMode = 'actions'; renderBubble(); }
      });
    });
  }
  function positionBubble() {
    var el = bubbleEl;
    if (!el || !bubbleItemId) return;
    var p = null;
    for (var i = 0; i < placed.length; i++) if (placed[i].id === bubbleItemId) { p = placed[i]; break; }
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
  function showBubble(id) {
    bubbleItemId = id; bubbleMode = 'actions';
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
    bubbleItemId = null; bubbleMode = 'actions';
    if (bubbleRAF) { cancelAnimationFrame(bubbleRAF); bubbleRAF = null; }
    if (bubbleEl) bubbleEl.style.display = 'none';
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
          moveFrom = null; // placed now; cancelling must not restore it
          window.BASE_ITEMS.place(id, g.cx, g.floorY);
          cancelPlacing();
        }
        // Red ghost: the tap does nothing, the item stays carried.
        return;
      }
      if (mode === 'idle') {
        var w = toWorld(e);
        var hit = placedItemAt(w.x, w.y);
        if (hit) showBubble(hit.id);
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
