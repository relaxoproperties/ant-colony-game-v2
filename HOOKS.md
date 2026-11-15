# BUILD A hooks: `window.bv` (for port-b / Builder 2 and the save)

Defined at the end of `<script id="bv1">` (source `wip/src/bv1-h.js`). Classic global, available after page load; the game itself starts
after the queen arrives downstairs (`BV.started`). Coordinates: **world** = the opening's world units (same as `BV.debug.queen()` x/y,
`openingDemo` lookX/lookY); **screen** = CSS px inside `#game` (same as `bv.toScreen()`); **template px** = a room's 1080x1680 template
(`room.tl` + local x,y; world = `BC.RECT.x + px*BC.K`).

| Hook | What it does |
|---|---|
| `bv.onFrame(fn)` | `fn(dt, now)` every frame after BV's own `step()` (dt in s, capped 0.1; game time = `bv.T()`). Not called before arrival. |
| `bv.onRoomDraw(fn)` | `fn(ctx, now, rooms)` inside BV's room pass, **template px transform** (after rooms, ants, queen, build clouds; before bubbles). Use for work loops / room overlays. |
| `bv.onOverlay(fn)` | `fn(ctx, now)` after the bubbles, **world transform** (use for drawTag timers: `bv.toScreen` + `ctx.setTransform` like NP5 drawTag). |
| `bv.hooks.errors` | count of exceptions thrown by hook functions (each hook is wrapped in try/catch, the game keeps running). |
| `bv.hud.flyCoins(x, y, n=5, space='world')` | n seed-money coins fly (NP5 COIN code, 750 ms, 175 ms stagger) from (x,y) to the seed pop top-right; +1 money and one ching per landing; seed pop shows ~2.5 s then fades. `space:'screen'` for CSS px. |
| `bv.hud.flyLeaves(x, y, n=5, space='world')` | n leaves (fi_leaf) fly to the food row of the crowned flash box; each landing = ching + food += 35/5. |
| `bv.hud.flyDrops(x, y, n=5, space='world')` | same with droplets / water += 40/5. |
| `bv.hud.flashSeed()`, `bv.hud.flashMeters(ideas)`, `bv.hud.refresh()` | show the seed pop / flash box (with the Ideas row if `ideas`) for ~2.5 s; redraw HUD numbers. |
| `bv.toScreen(x, y)` | world -> screen. |
| `bv.T()`, `bv.rooms()`, `bv.roomOf(id)` | game time (s), live room objects `{id,k,c,tl:{x,y},t0,fade}` (read-only please). |
| `bv.getState()` | JSON-safe snapshot (below). |
| `bv.setState(obj)` | restores the same shape; returns true. Rooms are rebuilt only if none exist yet (fresh boot after arrival). Times are game `T`; pass the saved `T` and clocks are shifted to the current `T` (away-time catch-up is port-b's: change `T`-based fields / meters before calling, or call `BV.debug.skip(s)`). |

`getState()` shape (v:1):
```
{v:1, T, money, brains, brainT, brainReady, rested, hatchExp,
 meters:{food, water, seeds}, avail,                       // avail = room id offered in the queen's menu, or null
 rooms:[{id, cell, builtAgo}],
 queen:{x, y, mode, busy, home:{x,y}|null, settled},
 baskets:[{spot, state:'empty'|'two'|'hatch'|'spoiled', laidAt, tendsDone, tendDueAt, tendAppearedAt, tapped, spoilAt, hatchAt,
           timeLeft,   // seconds to the next tend / spoil / hatch, or null  (for port-b drawTag basket timers)
           gen}],
 brainLeft,           // seconds to the next brain bubble while she rests on the bed, or null (port-b drawTag over her head)
 firstDone:{...}}
```
Persistent already: `localStorage['antColony.bv.nurseryHatchXp']` (hatch XP, EGG-CYCLE-SPEC §11).

Not in BUILD A (Builder 2 / port-b): room work loops + gym, drawTag timers, stepSoldiers, np4Coins, renderRoomWin, dozerRemove,
softFog/glide/try-catch guard, save + away-time, roster button.
