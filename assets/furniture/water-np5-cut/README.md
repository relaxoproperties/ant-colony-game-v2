# Water room furniture, cut from NP5 (water-np5-cut v1)

Built 2026-11-13 (ET). PREVIEW ONLY: not for building-v1 or any build, no publish. Source folder `/workspace/ant-colony/underground/rooms/water-room-np5/` was only read (md5 of every file before and after is identical).

Cut from the established NP5 water room: the v2 in-game hex picture `water-room-in-game-hex-no-outline-np5-v2.jpg`, its sprite `tank-sprite-src-b.png` and the build scripts `build_water_v2.py` / `water_np5_stage1b.py`.

## Scale: same rule as the Kitchen cut
- Kitchen: furniture px = 1:1 with its in-game hex picture on the locked template (matched by SIFT, 0.5071 source px per furniture px).
- Here the v2 in-game picture was itself built from the sprite by `build_water_v2.py` on the same locked template (it uses the same outline overlay). So I re-sampled the pieces from `tank-sprite-src-b.png` with that exact code: tank x0.90, barrels x0.50, LANCZOS, RGB*1.06+3, same topleft.
- Check against the v2 picture: 48416 opaque furniture px, mean abs diff 1.601, only 56 px over 16 (where v2 drew its drip stream over the tank). Water at 50% / 100% inside the glass box vs the v2 fill previews: max diff 6 / 5 (JPEG noise). So the cut is 1:1 with the established room.
- Template 1080x1680, CX 540, CY_GREEN 1075.5, floor hex 790.97 px (1:1 with 791). Albert 130 px, queen about 103x143.

## Pieces (template px, draw order)
| Piece | Visible size | Height vs Albert | Topleft | Foot anchor | Sprite scale |
|---|---|---|---|---|---|
| water-barrel-left | 41x61 | 0.469 | (375, 704) | (395.5, 768) | 0.5 |
| water-barrel-right | 44x61 | 0.469 | (722, 705) | (746.0, 769) | 0.5 |
| water-tank-glass-front | 250x203 | 1.562 | (446, 569) | (571.0, 773) | 0.9 |

Each piece has a `-shadow.png` (the v2 contact ellipse, same blur/alpha). No pivots: none of these pieces move. Draw all shadows first, then left barrel, right barrel, tank, then the water layers.

## Water level layer (YES, separate and pixel-aligned)
NP5 v2 already made the level as separate layers, so these are byte-identical copies:
- `water-np5-cut-tank-water-fill-full.png` (167x98), topleft (480, 632) = the tank's glass box [480, 632, 647, 730].
- `water-np5-cut-tank-water-surface-strip.png` (167x5): the bright fill line.
- `water-np5-cut-tank-water-fill-mask.png`: the fill mask.
- Rule (same as `build_water_v2.py` withwater): y_level = round(y_empty - frac*(y_empty - y_full)), with y_empty 730 and y_full 632. Draw rows (y_level-632)..end of the fill PNG at (480, y_level), then the strip at (480, max(y_level-2, 632)). Nothing at y_empty.
- 12 steps: 0->730, 1->722, 2->714, 3->706, 4->697, 5->689, 6->681, 7->673, 8->665, 9->656, 10->648, 11->640, 12->632.
- The tank sprite has no water pixels, so the level rises and falls freely. The water is drawn over the glass (as NP5 did), not between two frame layers.

## Drink spots (measured from the NP5 v2 script, nothing invented)
Feet = the NP5 v2 use spots (`build_water_v2.py` SPOTS). Boxes from placing the real sprites.
- spot1 (470, 850): **queen** in the previews, box [412, 711, 515, 854] (Albert there: [425, 723, 516, 850]).
- spot2 (672, 850): **Albert 130** in the previews, box [627, 723, 718, 850] (queen there: [614, 711, 717, 854]).
- spot3 (395, 975) and spot4 (748, 975): second row, no overlap with furniture.
- Spots 1 and 2 are 74 px in front of the tank base (y 773). Draw the ant after the tank; it covers part of the lower glass. Tank rim top is y 570.

## Clean floor: left out
- the floor plate itself (soil floor, walls, ceiling of the NP5 room)
- wall plumbing: the copper wall pipes and the wall-mounted funnel/spout above the tank (wall art; there are no walls in the furniture set)
- the falling drip stream from the funnel tip (571,493) to y 600: it was drawn by build_water_v2.py, not cut art, and has nothing to fall from without the wall spout
- all wall lanterns (two hanging at the back, the side-wall lanterns)
- floor clutter: pebbles, soil crumbs, roots, moss/plant tufts and the tunnel mouth at the front left
- the floor soil patches that the NP5 sprite cut carried under the tank and under both barrels (alpha removed, see cleanup)
- the tank top-corner / side-panel sliver and dark background strips that the v2 barrel parts carried (alpha removed)

## Cleanup (alpha removal only, no fills)
- tank_bottom: per column x 88..365: rows below (darkest row within +-5 of the rail shadow line)+1 removed (floor soil under the tank)
- stream_above_rim: x 226..236, rows < 2 removed (thin falling stream above the rim; rim top measured on cols 224/238)
- barrel_left: left-barrel part (src x 0..89) kept only inside polygon [(0, 0), (81, 0), (81, 190), (68, 200), (40, 202), (0, 202)]: removes the tank-post sliver / dark background strip x 82..89 and the soil wedge under the barrel
- barrel_right: right-barrel part (src x 362..) kept only inside polygon [(374, 92), (455, 92), (455, 214), (390, 214), (366, 212), (366, 112), (369, 106)]: removes the tank top-corner and side-panel sliver plus the dark background strip (src x 362..373 above the lid, x 362..365 below) and the soil wedge under the barrel
- removed_src_px_alpha_gt0: {'tank': 1697, 'barrel_left': 1367, 'barrel_right': 1338}

## Flags
- GENERATED SOURCE: the NP5 tank and barrels are image-generator art (tank-sprite-src-b.png was cut by water_np5_stage1b.py from /workspace/np5-scratch/gen-water-reg.png, the registered np5-water-generated-raw-a.jpg). None of it is Chris's art; nothing was redrawn here.
- PROCEDURAL WATER: the water-fill and surface-strip layers are not painted art. build_water_v2.py made them (blue gradient + blurred noise, alpha 0.76; 5-row bright strip). They are byte-identical copies of the NP5 v2 files.
- NP5 FILL ALREADY IN SOURCE: water_np5_stage1b.py inpainted the falling stream inside the tank sprite (cv2 TELEA). That fill is in tank-sprite-src-b.png and so in this tank. A faint drip highlight on the inner back wall and a faint vertical line in the glass remain from the source; kept, not edited.
- NO NEW FILLS: this cut made zero hidden-area fills. It only removed alpha (soil, background strips, stream above the rim).
- Right barrel: the bottom hoop flares out to the right (source art); kept. Left barrel: small notch on its left side in the source alpha; kept.
- Mixed scale in the source design: v2 drew the tank at 0.90 x sprite-b px but the barrels at 0.50. This cut keeps both exactly (1:1 with the v2 picture). At the Kitchen's 0.5071 source-px factor the tank would be about 141x117 px instead of 250x203 (v1 used 0.44).
- Water is drawn OVER the tank piece inside the glass box (as NP5 v2 did), not between a back and a front layer. The tank sprite has no water pixels, so the level layer is fully independent.
- Drink spots are the NP5 v2 use spots (build_water_v2.py SPOTS), not new values. Spots 1-2 are 74 px in front of the tank base, so a 130 px Albert / the queen stand in front of the lower glass and cover part of it (drawn after the tank). No drinking art exists; ants are standing idle.
- Contact shadows: v2 drew all three ellipses into one shadow layer; here each piece has its own shadow PNG made with the same ellipse/blur/alpha. Composited together they match v2 (blur tails between pieces barely touch).

## Files
- Piece PNGs + `-shadow.png`, the 3 water-level layer PNGs.
- `water-np5-cut-furniture.png`: combined 1080x1680, empty tank (rest state, as the v2 picture).
- `water-np5-cut-furniture-programming.png` / `-programming-view.jpg`: with the locked hex lines.
- `water-np5-cut-furniture-scale-check.jpg`: programming view, water at 6/12, queen at spot1, Albert 130 at spot2.
- `placement.json`, this README, MD5SUMS. Scripts: `/workspace/fx/water/` (cut.py, build.py, fin.py).

Previews in `/workspace/ant-colony/furniture/previews/` (v13 cell (1,0), JPEG q98 4:4:4, water at 6/12 unless named):
- `water-np5-cut-on-v13-preview-v1-closeup.jpg`
- `water-np5-cut-on-v13-preview-v1-with-ants-closeup.jpg`
- `water-np5-cut-on-v13-preview-v1-with-ants-fill-000-closeup.jpg`
- `water-np5-cut-on-v13-preview-v1-with-ants-fill-000-zoom-crop.jpg`
- `water-np5-cut-on-v13-preview-v1-with-ants-fill-100-closeup.jpg`
- `water-np5-cut-on-v13-preview-v1-with-ants-fill-100-zoom-crop.jpg`
- `water-np5-cut-on-v13-preview-v1-with-ants-zoom-crop.jpg`
- `water-np5-cut-on-v13-preview-v1-with-ants.jpg`
- `water-np5-cut-on-v13-preview-v1-zoom-crop.jpg`
- `water-np5-cut-on-v13-preview-v1.jpg`
- `water-np5-cut-previews-MD5SUMS`
