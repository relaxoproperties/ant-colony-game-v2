// ===================== BASE LAYER (Nov 15 2026) =====================
// The base layer: the opening (unchanged) + the pocket downstairs + the queen's
// idle + a build menu that is always on, 2/3 as tall, with just the four first
// build items (leaf bed, egg basket, fridge, water cooler) and a bulldozer to
// remove a placed item. No brain menu, no crown, no ants menu, no seed money,
// no water/food meters. The menu opens by itself when she gets downstairs.
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

  // ---- placed items (drawn in world space by drawUnderground) ----
  var placed = []; // {id, cx, floorY, w, h}
  window.BASE_ITEMS = {
    draw: function () {
      if (typeof ctx === 'undefined') return;
      placed.forEach(function (p) {
        var im = IMGS[p.id];
        if (!im || !im.complete || !im.naturalWidth) return;
        var h = p.w * im.naturalHeight / im.naturalWidth;
        ctx.drawImage(im, p.cx - p.w / 2, p.floorY - h, p.w, h);
      });
    },
    isPlaced: function (id) { return placed.some(function (p) { return p.id === id; }); },
    place: function (id) {
      if (this.isPlaced(id)) return false;
      var it = null;
      ITEMS.forEach(function (x) { if (x.id === id) it = x; });
      if (!it) return false;
      placed.push({ id: it.id, cx: it.cx, floorY: it.floorY, w: it.w });
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
    }
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
      html += '<div class="bl-card"><div class="bl-thumb" style="background-image:url(' + it.src + ')"></div>' +
        '<div class="bl-name">' + it.name + '</div>' +
        (done
          ? '<span class="bl-placed">\u2713 Built</span>'
          : '<button type="button" class="bl-build" data-build="' + it.id + '">BUILD</button>') +
        '</div>';
    });
    html += '</div>';
    tray.innerHTML = html;
    var dz = document.getElementById('blDozer');
    if (dz) dz.addEventListener('click', function (e) {
      e.stopPropagation();
      // CHECKPOINT 1: no tapping/placing yet — placing is checkpoint 2.
    });
    tray.querySelectorAll('[data-build]').forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.stopPropagation();
        // CHECKPOINT 1: no tapping/placing yet — placing is checkpoint 2.
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

  renderMenu();

  // TEST-ONLY ?start=downstairs: skip the (LOCKED) opening to the exact real arrival state.
  if (URLQ.get('start') === 'downstairs') {
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
