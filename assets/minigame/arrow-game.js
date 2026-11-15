/* Ant Colony - idea mini game (arrow). Chris's firm design, Oct 14 2026 10:38 AM.
   startArrowGame(antName, onDone, opts) -> controller
     onDone(result) is called exactly once: 'brain' (hit, +1 intelligence) or 'question' (miss, 0).
     opts.container (optional): element to play inside; default = full-screen overlay on <body>.
   The arrow swings like a gauge needle (measured from videos/idea mini game.mp4: about -28deg to +24deg,
   one full back-and-forth = 3.0 s, eased at the ends). Player taps anywhere: the arrow stops and
   highlights the BRAIN (|angle| <= 12deg) or the QUESTION MARK on that side.
   Hit: brain picture floats up to the centre, then the caption "<Name> had an idea!". Miss: no words.
   v2 (Oct 27 2026, Chris's rules via Game Manager): multi-brain mode. See README.md.
     opts.brains: 1 (default, the game above, unchanged), 2 or 3. For 2 or 3 the same swing range
       (CFG.center +/- CFG.amp) is split into 3 EQUAL angle spots: left / middle / right.
       2 = two brains + one ? (side picked at random each run), 3 = three brains, no ?.
     opts.ids: array of N hidden ids (multi mode), assigned to the brain spots at random.
       Multi mode onDone: {result:'brain', id} on a brain, 'question' on a ?.
     opts.force: optional 'brain' or 'question'. Unset = no effect. When set and the tap lands on the
       other type, the arrow keeps swinging and stops the first frame it is over a spot of the forced type. */
(function (g) {
  'use strict';
  var BASE = (function () {
    var s = document.currentScript && document.currentScript.src;
    return s ? s.replace(/[^\/]*$/, '') : '';
  })();
  var CFG = { center: -2.5, amp: 26.5, period: 3000, brainZone: 12, hitHoldMs: 600, missHoldMs: 1500, popMs: 3600 };
  var ARROW_SVG = '<svg viewBox="0 0 100 300" preserveAspectRatio="none"><defs>' +
    '<linearGradient id="agG" x1="0" x2="1"><stop offset="0" stop-color="#b9780c"/><stop offset=".28" stop-color="#ffe27a"/><stop offset=".5" stop-color="#ffd23f"/><stop offset=".78" stop-color="#e9a51c"/><stop offset="1" stop-color="#9a5f06"/></linearGradient>' +
    '<linearGradient id="agH" x1="0" x2="1"><stop offset="0" stop-color="#c88a12"/><stop offset=".45" stop-color="#fff0a8"/><stop offset=".55" stop-color="#ffd53f"/><stop offset="1" stop-color="#a86a08"/></linearGradient></defs>' +
    '<polygon points="50,2 98,104 70,104 70,298 30,298 30,104 2,104" fill="url(#agG)" stroke="#7a4a05" stroke-width="3" stroke-linejoin="round"/>' +
    '<polygon points="50,14 86,96 60,96 60,290 40,290 40,96 14,96" fill="url(#agH)" opacity=".55"/></svg>';
  var Q_SVG = '<svg viewBox="0 0 100 150"><defs><linearGradient id="agQ" x1="0" y1="0" x2=".3" y2="1"><stop offset="0" stop-color="#d9a6ff"/><stop offset=".5" stop-color="#9b4dff"/><stop offset="1" stop-color="#6420c8"/></linearGradient></defs>' +
    '<path d="M18 46C18 18 36 4 54 4c22 0 38 14 38 34 0 18-10 27-22 35-9 6-12 11-12 20v6H36v-9c0-15 6-23 18-31 9-6 13-11 13-19 0-9-6-15-14-15-10 0-15 8-15 21z" fill="url(#agQ)" stroke="#3e0f86" stroke-width="3" stroke-linejoin="round"/>' +
    '<circle cx="47" cy="129" r="15" fill="url(#agQ)" stroke="#3e0f86" stroke-width="3"/>' +
    '<path d="M28 40C30 22 42 13 55 13" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="5" stroke-linecap="round"/></svg>';

  function cssOnce() {
    if (document.getElementById('ag-css')) return;
    var l = document.createElement('link'); l.id = 'ag-css'; l.rel = 'stylesheet'; l.href = BASE + 'arrow-game.css';
    document.head.appendChild(l);
  }
  function el(cls, html, parent) { var d = document.createElement('div'); d.className = cls; if (html) d.innerHTML = html; parent.appendChild(d); return d; }

  // v2: the 3 equal spots for multi mode, as [from, to) angle ranges, left to right (the last one includes its end).
  function spotBounds() {
    var lo = CFG.center - CFG.amp, w = 2 * CFG.amp / 3;
    return [[lo, lo + w], [lo + w, lo + 2 * w], [lo + 2 * w, CFG.center + CFG.amp]];
  }
  function spotIndex(a) {
    var b = spotBounds();
    return a < b[1][0] ? 0 : (a < b[2][0] ? 1 : 2);
  }
  // v2: input checks. Throws before anything is drawn, so a bad call never shows a half-built screen.
  function readMulti(opts) {
    var N = opts.brains == null ? 1 : opts.brains;
    if (N !== 1 && N !== 2 && N !== 3) throw new RangeError('startArrowGame: opts.brains must be 1, 2 or 3 (got ' + String(opts.brains) + ')');
    var f = opts.force == null ? null : opts.force;
    if (f !== null && f !== 'brain' && f !== 'question') throw new RangeError("startArrowGame: opts.force must be 'brain' or 'question' (got " + String(opts.force) + ')');
    if (f === 'question' && N === 3) throw new RangeError("startArrowGame: opts.force 'question' is impossible with 3 brains (there is no ?)");
    var ids = null;
    if (N > 1) {
      if (!Array.isArray(opts.ids) || opts.ids.length !== N) throw new RangeError('startArrowGame: opts.ids must be an array of exactly ' + N + ' ids for ' + N + ' brains (got ' + (Array.isArray(opts.ids) ? 'length ' + opts.ids.length : String(opts.ids)) + ')');
      ids = opts.ids.slice();
    } else if (opts.ids != null && typeof console !== 'undefined') {
      console.warn('startArrowGame: opts.ids is ignored with 1 brain; onDone still returns the plain string \'brain\' or \'question\'');
    }
    return { N: N, force: f, ids: ids };
  }

  function startArrowGame(antName, onDone, opts) {
    opts = opts || {};
    var M = readMulti(opts), N = M.N;
    cssOnce();
    var name = String(antName == null ? '' : antName).trim();
    // Live game rule, build/game/index.html line 376: nameOf = name.charAt(0) + name.slice(1).toLowerCase() on its ALL-CAPS names.
    // Upper-cased first so 'albert' also gives 'Albert' (identical to the game for every game name).
    name = name.toUpperCase(); name = name.charAt(0) + name.slice(1).toLowerCase();
    var host = opts.container || document.body;
    var root = el('ag-root' + (opts.container ? ' ag-in' : ''), '', host);
    if (opts.container) { if (getComputedStyle(host).position === 'static') host.style.position = 'relative'; root.style.setProperty('--ag-h', host.clientHeight + 'px'); }
    var bgUrl = 'url("' + BASE + 'assets/forest_bg.jpg")';
    el('ag-fill', '', root).style.backgroundImage = bgUrl;
    var scene = el('ag-scene', '', root); el('ag-bg', '', scene).style.backgroundImage = bgUrl;
    var qL, brain, qR, spots = null;
    if (N === 1) {
    qL = el('ag-icon ag-q ag-qL', Q_SVG, scene);
    brain = el('ag-icon ag-brain', '<img alt="" draggable="false" src="' + BASE + 'assets/brain.png">', scene);
    qR = el('ag-icon ag-q ag-qR', Q_SVG, scene);
    } else {
      // v2 multi: spot 0 = left, 1 = middle, 2 = right. The middle is always a brain, exactly where the brain is now.
      // A side brain sits where that side's ? sits now; same brain picture and same brain look (class ag-brain).
      var types = ['brain', 'brain', 'brain'];
      if (N === 2) types[Math.random() < 0.5 ? 0 : 2] = 'question';
      var pool = M.ids.slice(), side = ['L', '', 'R'];
      spots = [];
      for (var k = 0; k < 3; k++) {
        var sp = { type: types[k], id: null, el: null };
        if (types[k] === 'brain') {
          sp.id = pool.splice(Math.floor(Math.random() * pool.length), 1)[0];
          sp.el = el('ag-icon ag-brain' + (k === 1 ? '' : ' ag-brain' + side[k]), '<img alt="" draggable="false" src="' + BASE + 'assets/brain.png">', scene);
        } else {
          sp.el = el('ag-icon ag-q ag-q' + side[k], Q_SVG, scene);
        }
        spots.push(sp);
      }
      brain = spots[1].el;
    }
    el('ag-ant', '<img alt="" draggable="false" src="' + BASE + 'assets/ant.png">', scene);
    var arrow = el('ag-arrow', ARROW_SVG, scene);
    var fx = el('ag-fx', '', root);
    // fireflies
    for (var i = 0; i < 16; i++) {
      var f = el('ag-ff', '', scene), x = 5 + Math.random() * 90, y = 25 + Math.random() * 70;
      f.style.left = x + '%'; f.style.top = y + '%';
      f.animate([{ opacity: 0, transform: 'translate(0,0)' }, { opacity: .9, offset: .5, transform: 'translate(' + (Math.random() * 30 - 15) + 'px,' + (-10 - Math.random() * 20) + 'px)' }, { opacity: 0, transform: 'translate(' + (Math.random() * 40 - 20) + 'px,' + (-25 - Math.random() * 25) + 'px)' }],
        { duration: 2500 + Math.random() * 3000, delay: Math.random() * 3000, iterations: Infinity, easing: 'ease-in-out' });
    }

    var state = 'swing', t0 = performance.now(), angle = CFG.center, raf = 0, done = false, timers = [];
    function angleAt(t) { return CFG.center + CFG.amp * Math.sin(2 * Math.PI * (t - t0) / CFG.period + Math.PI * 0.06); }
    function setArrow(a) { angle = a; arrow.style.transform = 'translate(-50%,-100%) rotate(' + a.toFixed(2) + 'deg)'; }
    function tick(now) { if (state !== 'swing') return; setArrow(angleAt(now)); raf = requestAnimationFrame(tick); }
    setArrow(angleAt(t0)); raf = requestAnimationFrame(tick);

    function finish(result) {
      if (done) return; done = true;
      cleanup();
      try { onDone && onDone(result); } catch (e) { setTimeout(function () { throw e; }); }
    }
    function cleanup() {
      state = 'over'; cancelAnimationFrame(raf); timers.forEach(clearTimeout);
      root.removeEventListener('pointerdown', onTap);
      root.getAnimations && root.getAnimations({ subtree: true }).forEach(function (a) { a.cancel(); });
      if (root.parentNode) root.parentNode.removeChild(root);
    }
    function later(fn, ms) { timers.push(setTimeout(fn, ms)); }

    // v2: which kind of spot an angle is over (same maths as the stop below).
    function typeAt(a) { return N === 1 ? (Math.abs(a) <= CFG.brainZone ? 'brain' : 'question') : spots[spotIndex(a)].type; }
    // v2 force: keep swinging (same motion) until the arrow is over a spot of the forced type, then stop there.
    function seek(now) { if (state !== 'seek') return; setArrow(angleAt(now)); if (typeAt(angle) === M.force) { state = 'swing'; onTap(); return; } raf = requestAnimationFrame(seek); }

    function onTap(e) {
      if (state !== 'swing') return;
      if (e && e.preventDefault) e.preventDefault();
      if (M.force && typeAt(angle) !== M.force) { state = 'seek'; cancelAnimationFrame(raf); raf = requestAnimationFrame(seek); return; }
      state = 'stopped'; cancelAnimationFrame(raf);
      if (N === 1) {
      var a = angle, hit = Math.abs(a) <= CFG.brainZone, pick = hit ? brain : (a < 0 ? qL : qR);
      pick.classList.add('ag-pick');
      ctl.result = hit ? 'brain' : 'question'; ctl.stopAngle = a;
      if (hit) later(function () { brainPop(); }, CFG.hitHoldMs);
      else later(function () { finish('question'); }, CFG.missHoldMs);
      } else {
        var a2 = angle, k = spotIndex(a2), sp = spots[k], hit2 = sp.type === 'brain';
        sp.el.classList.add('ag-pick');
        ctl.result = sp.type; ctl.stopAngle = a2; ctl.spot = k; ctl.id = hit2 ? sp.id : null;
        if (hit2) later(function () { brainPop(sp.el, { result: 'brain', id: sp.id }); }, CFG.hitHoldMs);
        else later(function () { finish('question'); }, CFG.missHoldMs);
      }
    }
    root.addEventListener('pointerdown', onTap);

    // Same style as the game's pebble/twig/tool pop-ups: picture floats up to the centre, settles, THEN the caption.
    function brainPop(src, res) {
      if (src) brain = src;   // v2 multi: the picked brain pops (N=1 calls brainPop() with no arguments)
      state = 'pop';
      var R = root.getBoundingClientRect(), B = brain.getBoundingClientRect(), W = R.width, H = R.height;
      var x = B.left - R.left + B.width / 2, y = B.top - R.top + B.height / 2, cx = W / 2, cy = H * 0.42, w = Math.min(150, W * 0.42), D = CFG.popMs;
      brain.style.visibility = 'hidden';
      var s = el('ag-pop', '<img alt="" src="' + BASE + 'assets/brain.png">', fx); s.style.width = w + 'px';
      var k0 = B.width / w;
      s.animate([
        { left: x + 'px', top: y + 'px', transform: 'translate(-50%,-50%) scale(' + k0 + ')', opacity: 1 },
        { left: cx + 'px', top: (cy - 10) + 'px', transform: 'translate(-50%,-50%) scale(1.08)', opacity: 1, offset: 0.30, easing: 'ease-in-out' },
        { left: cx + 'px', top: cy + 'px', transform: 'translate(-50%,-50%) scale(1)', opacity: 1, offset: 0.38 },
        { left: cx + 'px', top: cy + 'px', transform: 'translate(-50%,-50%) scale(1)', opacity: 1, offset: 0.96 },
        { left: cx + 'px', top: cy + 'px', transform: 'translate(-50%,-50%) scale(1)', opacity: 0 }], { duration: D, fill: 'forwards' });
      var c = el('ag-cap', '', fx); c.textContent = (name ? name + ' ' : '') + 'had an idea!';
      c.style.top = ((cy + w * 0.4 + 30) / H * 100) + '%';
      c.animate([{ opacity: 0 }, { opacity: 0, offset: 0.40 }, { opacity: 1, offset: 0.46 }, { opacity: 1, offset: 0.93 }, { opacity: 0, offset: 0.97 }, { opacity: 0 }], { duration: D, fill: 'forwards' });
      later(function () { finish(res || 'brain'); }, D);
    }

    var ctl = {
      result: null, stopAngle: null,
      brains: N, spot: null, id: null,   // v2: spot 0/1/2 and the hidden id that was hit (multi mode only)
      get layout() { return spots ? spots.map(function (s) { return { type: s.type, id: s.id }; }) : null; },
      get angle() { return angle; }, get state() { return state; },
      tap: function () { onTap(); },
      cancel: function () { if (!done) { done = true; cleanup(); } }   // closes without calling onDone
    };
    return ctl;
  }
  startArrowGame.config = CFG;
  startArrowGame.spotBounds = spotBounds;   // v2
  g.startArrowGame = startArrowGame;
})(window);
