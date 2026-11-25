// Checkpoint 5 squirrel v66 — rebuilt from the OCTOBER 19 v3 video.
// Chris, testing v65 (Nov 25, 02:33): "You understood the fundamentals
// of the squirrel. But it was just underwhelming. It looked like a
// squirrel. It dropped the acorn the way I wanted. I guess the part that
// I found underwhelming is that it was very short. I didn't see the
// squirrel run very much, because the camera would've had to be way more
// zoomed out. I've seen you make unbelievably good videos. For some
// reason, you've been struggling with this one." Then (Nov 25, 02:36):
// "Look at my email, October 19. There's a squirrel. And there's a
// chipmunk. You have been trying for one month to get this right. And I
// think it's worse today than it was then." So NO new generation: v66
// rebuilds from the Oct 19 v3 video itself (squirrel_v3_alpha.webm,
// 1284x426, 150 frames @ 24 fps, 6.25 s) — the benchmark.
// WHAT v3 DOES (measured in build_v66.py): a real low bound in from the
// right (nose 884 -> 256, feet planting as it lands), rears up and
// stands holding the acorn looking around, crouch + big leap left, clean
// exit, gone by video 145. The squirrel is ~35% of the plate in a wide
// shot — the camera IS zoomed way out, so you see it run.
// TAIL: frames 0-6 of the source have the tail CUT OFF at the plate's
// right edge (the rear is sliced) — that is why Chris asked for the
// camera to be more zoomed out (Nov 25, 02:38). Frames 0-6 are NOT
// drawn: the scene starts at video f7, the first frame with a whole
// tail. The tail tip also reaches y=2 at the top during the stand, so
// the plate is padded +12 px at the top. The whole squirrel incl. tail
// fits inside the plate with clearance at every beat (harness-checked).
// ACORN: the video NEVER shows the acorn resting on the ground — the
// squirrel holds it through the stand and leaps away with it; frames
// 145-149 are empty. The game's acorn at rest has ALWAYS been the
// game's own drawn plain bank acorn (v1 drawAcorn, restFrame 56). So,
// following v1 and the v64 pattern: the plain bank canvas is pasted
// into the composited frames from video f56 (the "place" beat), on the
// ground in front of the squirrel's nose, UNDER the squirrel (so the
// exit leap occludes it naturally), and the game draws the SAME canvas
// at the SAME place from restFrame on. No video acorn is erased: the
// video acorn is in the paws, not on the ground.
// Timeline: 143 frames @ 24 fps, 5.96 s, 1:1 — DATA index i IS video
// frame (7+i). No run-cycle loop, no sprint, no held pause, no LUNGE,
// no run-frames exit. restFrame 138 (video 145): the first frame with
// no squirrel, so the PLAIN bank acorn takes over with no jump, no
// orientation change and no double acorn. The plate ORIGIN is
// calibrated so the paste centre lands exactly on acorn.c (2914.64,
// 4940.24). Acorn centre/REST rect byte-identical to v63/v64/v65.
// Scale k = 1.0: each sprite is placed at its VIDEO position in the
// 1284x438 plate (1284x426 video + 12 px top pad), so the video's own
// framing — fixed camera, constant size — IS the motion.
// CAMERA: the game camera is FIXED on the plate box (cp5.js FIX_K) —
// the video has NO camera motion at all, so there is nothing to double.
// The plate field below is the framing box.
// MEMORY (v65 lesson): the frame IMAGES are 0.5x while every rect, the
// plate, the plate origin and the acorn calibration are full-size —
// cp5.js stretches each image to its rect, so the on-screen size,
// position, feet, stop point and acorn landing do not move.
window.CP5_DATA={"mapPx":1.0,"n":143,"fps":24,"clipFrames":143,"restFrame":138,"acorn":{"tl":[2861.1672619894734,4886.434341273684],"wh":[101.63478947368421,114.10531578947369],"c":[2914.6425,4940.2393],"k":1.0},"plate":{"x":2610.6425,"y":4573.2393,"w":1284,"h":438},"frames":[[3326.64,4647.24,532,253],[3303.64,4648.24,543,251],[3262.64,4652.24,569,245],[3222.64,4637.24,591,268],[3219.64,4646.24,574,254],[3184.64,4645.24,587,258],[3134.64,4654.24,616,252],[3130.64,4653.24,601,260],[3122.64,4658.24,591,253],[3097.64,4660.24,598,251],[3067.64,4661.24,612,250],[3034.64,4653.24,630,283],[3022.64,4653.24,627,282],[2986.64,4655.24,648,276],[2987.64,4663.24,633,289],[2970.64,4665.24,636,294],[2954.64,4675.24,638,286],[2937.64,4682.24,640,279],[2916.64,4687.24,646,273],[2898.64,4685.24,648,272],[2871.64,4685.24,661,272],[2874.64,4684.24,644,273],[2868.64,4683.24,637,278],[2866.64,4672.24,628,291],[2866.64,4673.24,618,289],[2869.64,4672.24,608,287],[2872.64,4670.24,594,288],[2871.64,4654.24,587,306],[2889.64,4654.24,561,305],[2888.64,4653.24,554,306],[2887.64,4652.24,549,308],[2885.64,4653.24,549,307],[2886.64,4654.24,540,306],[2902.64,4653.24,518,306],[2909.64,4646.24,507,315],[2920.64,4641.24,494,318],[2943.64,4640.24,469,320],[2945.64,4638.24,465,323],[2946.64,4632.24,464,329],[2945.64,4633.24,462,329],[2945.64,4631.24,461,331],[2944.64,4631.24,462,331],[2938.64,4630.24,467,331],[2921.64,4631.24,483,331],[2898.64,4631.24,506,330],[2882.64,4632.24,521,330],[2890.64,4642.24,512,319],[2886.64,4646.24,516,318],[2896.64,4642.24,506,320],[2883.64,4637.24,518,324],[2883.64,4636.24,518,325],[2883.64,4636.24,518,325],[2883.64,4635.24,518,330],[2883.64,4637.24,518,328],[2883.64,4638.24,518,327],[2883.64,4639.24,519,322],[2883.64,4629.24,519,332],[2883.64,4603.24,518,358],[2883.64,4594.24,519,367],[2883.64,4593.24,518,368],[2883.64,4595.24,518,366],[2883.64,4593.24,519,368],[2883.64,4590.24,519,370],[2883.64,4587.24,520,374],[2883.64,4585.24,521,376],[2883.64,4586.24,523,375],[2883.64,4586.24,527,375],[2883.64,4585.24,527,376],[2883.64,4587.24,527,374],[2883.64,4587.24,528,373],[2883.64,4586.24,529,374],[2883.64,4587.24,529,373],[2883.64,4587.24,529,373],[2883.64,4587.24,531,374],[2883.64,4587.24,531,373],[2883.64,4586.24,535,375],[2883.64,4587.24,535,374],[2883.64,4587.24,533,375],[2883.64,4586.24,535,375],[2883.64,4587.24,534,374],[2883.64,4587.24,535,374],[2883.64,4588.24,535,373],[2883.64,4585.24,535,375],[2883.64,4587.24,536,374],[2883.64,4587.24,536,374],[2883.64,4587.24,536,374],[2883.64,4587.24,537,373],[2883.64,4588.24,537,373],[2883.64,4588.24,537,373],[2883.64,4587.24,537,373],[2883.64,4588.24,539,372],[2883.64,4589.24,537,372],[2883.64,4588.24,538,373],[2883.64,4587.24,538,374],[2883.64,4588.24,539,373],[2883.64,4588.24,539,373],[2883.64,4587.24,539,374],[2883.64,4588.24,539,374],[2883.64,4588.24,539,373],[2883.64,4588.24,539,373],[2883.64,4588.24,539,374],[2883.64,4588.24,539,374],[2883.64,4588.24,540,373],[2883.64,4588.24,539,374],[2883.64,4588.24,539,374],[2883.64,4588.24,539,374],[2883.64,4588.24,539,373],[2883.64,4588.24,541,374],[2883.64,4588.24,539,374],[2883.64,4588.24,540,374],[2883.64,4588.24,541,374],[2883.64,4588.24,541,373],[2883.64,4589.24,539,373],[2883.64,4591.24,539,369],[2883.64,4590.24,539,370],[2883.64,4591.24,539,369],[2883.64,4591.24,539,369],[2883.64,4591.24,539,369],[2883.64,4591.24,539,369],[2883.64,4590.24,539,370],[2883.64,4591.24,539,369],[2883.64,4591.24,539,369],[2883.64,4591.24,539,369],[2883.64,4591.24,539,369],[2883.64,4592.24,539,368],[2883.64,4591.24,539,370],[2883.64,4592.24,539,368],[2883.64,4595.24,539,366],[2883.64,4601.24,539,359],[2883.64,4612.24,539,348],[2883.64,4631.24,543,329],[2862.64,4625.24,560,335],[2767.64,4628.24,655,333],[2635.64,4637.24,787,323],[2624.64,4644.24,795,316],[2624.64,4654.24,500,306],[2624.64,4613.24,337,347],[2624.64,4591.24,337,369],[2883.64,4905.24,78,55],[2883.64,4905.24,78,55],[2883.64,4905.24,78,55],[2883.64,4905.24,78,55],[2883.64,4905.24,78,55]]};
