# Meridian QA: issues and coverage

QA log. Builds: v86 = live at start; v87 = hotfix; later builds noted per item.
Test tools (scratchpad): `t226.js` reproductions, `t224.js` ring and building walks, `t199b.js` hub routes,
`t227.js` interaction and placement audit, `t218.js` eye-level tour, `tperf.js` performance.
Movement in tests uses the game's own controls (`keys.KeyW`, `jumpQ`, `update()`), with `hubTick` run every step so prompts,
zones and tags are live. Teleports are only used to start a walk.

## Measured player numbers
- Eye height (`EYE`): see `t227` output. Jump apex: 1.14 m; with the class air jump: 4.52 m; while running and pressing
  jump repeatedly the player reached 8.67 m. Any collision top under about 9 m can be stood on.

## Issues

| # | Area | Reproduction | Expected | Observed (v86) | Sev | Status |
|---|------|--------------|----------|----------------|-----|--------|
| 1 | Hangar 0 ship displays | Run and jump at a sale ship (R2) | Ship is solid to full height | Ship boxes 4.2 m; jump reaches 8.7 m: you land inside the ship model | Blocker | Fixed v87: boxes 15 x 16 x 14 m; R2 passes from front, left and right of all 5 ships |
| 2 | Hangar 0 sale pad 1 | Static check R3 | Nothing else on a ship pad | Fuel truck (moved in v84) sat on pad 1 inside the ship; containers on pad 4's edge | Major | Fixed v87: truck to (44,1094); outer pads moved to x ±50 |
| 3 | Signs everywhere (shared helper) | R5: list two-sided signs | Back copy is an exact mirror | 13 back copies tilted ~46 deg, crossing the front ("HANGAR H1" doubled) | Major | Fixed v87 in `sign()` (rotation set, not just y) |
| 4 | Take-off from Hangar 0 | Board ship, take off (R4) | Walking prompt disappears | "E · BOARD YOUR SHIP" stayed on the flight HUD | Major | Fixed v87: `hubPromptOff()` in `hubLaunch` |
| 5 | Outside the concourse/hangar | Stand at (90,1000) (R6) | Zone/objective "outer deck" | Said "Outfitter"/"Armoury"/"Hangar" outside the walls | Minor | Fixed v87: zones use the walker's footprints |
| 6 | Transit | Ride from the plaza pylon (R7) | Arrive on floor facing the stop's destination | Arrived facing away (dot -0.92) | Minor | Fixed v87: arrival faces the hangar door / platform |
| 7 | Hangars H1-H6 floor | Ray down inside H1 (R8) | Drawn floor at the walker's feet | Floor top 0.45 m, strips 0.65 m above the feet | Major | Fixed v87: floor top 0.05, strips 0.09 |
| 8 | Hangars H1-H6 doors | Ray through the door (R9) | Real opening | Solid 8 m wall and a 4 m gantry behind a painted panel; a cargo block in front of the door inside | Blocker | Fixed v87: wall and gantry split around a 12 x 9.5 m opening; block removed; panel removed |
| 9 | Hangar 0 and concourse exterior | Walk round the outside (t224) | Walls solid from outside | v86: the walls only stopped you from inside; you could walk into the gap between the buildings | Blocker | Fixed v86-hotfix (in v87): walker uses the station walls everywhere except inside |
| 10 | Hangar 0 side walls | Jump at the wall (R1) | Wall full height | Collision was 1 m tall | Major | Fixed v87: 64 m |
| 11 | Landing platforms | Owner screenshot | Edge railing reads as a railing | Gold posts every 8 m read as two lines of glowing dots | Minor | Fixed v87: dark posts every 4 m + continuous gold rail |
| 12 | Hangar mouth edges | Walk out of a hangar mouth sideways (t224) | Stop at the edge | v86: no edge check inside the old hub block | Blocker | Fixed v87 (t224 legs) |
| 13 | Hangar 0 ship pads | Stand at a sale ship (hangar pictures) | A thin glowing ring marks the pad | The ring was a torus drawn as a 3 m wide pale-blue band that filled the view (owner's screenshot) | Major | Fixed v88: 0.4 m flat ring |
| 14 | Hangars H1-H6 | Hangar pictures, all six | Same baseline as Hangar 0 | Near-black floor, no floor lighting, no cargo, H5/H6 had no ship | Major | Fixed v88: ship on a pad in every hangar, 9 light pools each, container stacks on both walls (solid) |
| 15 | Hangar 0 | Static people list | People stand clear of ship pads | An onlooker stood inside sale pad 2 by the ship's wing | Minor | Fixed v88: moved to the pad's edge |
| 16 | Ship shop counter (test) | t227 approach from behind | Prompt reachable from the front | Test approached from behind the kiosk | Test bug | Fixed: t227 tries four directions |
| 18 | Cars (new, v89) | Drive into walls (t230) | Car stays on Meridian | First build: Thalassa's map clamp in `pushOut` teleported the car to z = -258.6 on the first frame | Blocker | Fixed v89: `pushOut(p,r,true)` for Meridian cars; t230 all pass |
| 19 | Sky Garden (new, v90) | `t234` terrace scan | Garden fits the model's terrace | First build: the walk area ran over the model's trench and 4.8 m parapet, a lamp stood in a colonnade column, the top lift cab crossed the parapet, and you arrived facing a column | Major | Fixed v90: walk area r 700-836, columns solid with planter skirts, glass kiosk between columns, arrival faces the garden |
| 17 | NPC check (test) | t227 | Feet on the floor | Test read local hip positions | Test bug | Fixed: world-space feet from the bounding box |

## Coverage checklist (what was actually exercised)

Legend: W = walked with game controls, J = jumped at, I = interaction opened/closed, S = screenshot at eye level, A = automated static check.
See the table at the end of the QA run for the final state.

| Area | Walked (game controls) | Jumped at walls/props | Interactions | Eye-level pictures | Automated checks |
|------|------------------------|-----------------------|--------------|--------------------|------------------|
| Hangar 0 floor, sale ships, own ship | yes (t226, t224, t199b) | yes: all 5 ships from 3 sides, both side walls | ship shop opens/closes; your ship: take off, fly, land, back on foot | yes (t228 h0, 8 views) | pads clear (R3), prompt off in flight (R4) |
| Hangar 0 mouth and platform 0 | yes (t224, t199b) | — | — | yes (tour) | edge stops at rim and platform sides |
| Grand Concourse hall, plaza door, hangar back door | yes (t199b, t224) | — | mission board opens, Stay returns | yes (tour) | doors not blocked (t227) |
| Armoury (Hollis), outfitter (Ines) | yes (t199b) | — | both shops open/close and return control | yes (tour) | — |
| Plaza and outside the concourse/hangar walls | yes (t224) | — | — | yes (tour) | zones correct outside buildings (R6) |
| Outer deck ring, terrace wall, rim | yes (t224) | — | — | yes (tour r_*) | rim and terrace stop you |
| Platforms 1-4 | all four walked to the middle, side edge, tip and past the tip (t229) | — | — | yes (platform 1) | platform clamp |
| Hangars H1-H6 | all six walked in through the door, against a side wall, to the mouth edge and back out (t229) | — | — | yes, all six (t228, 6 views each) | door open (R9), floor height (R8) on H1; same code builds all six |
| Transit pylons (11) | arrival walk-away tested at all 11 | — | all 11 rides tested | — | arrivals not blocked (t227) |
| NPCs (15 moving) | — | — | — | — | feet on floor, outside collision (t227) |
| Pause/resume, stage cards | — | — | pause/resume at Meridian; stage-complete card (t216); Mission 2 landing into Meridian (t178) | — | — |

Not done: real mouse play (pointer lock does not work in the headless browser, so look direction is set in code); stairs and
ramps (Meridian has none since v80; pad step skirts covered by t199b); the parked ships in H1-H6 were measured on their pads (first solid along each centre line at r 1,124-1,126).
| Sky Garden (v90) | walked toward every edge, pushed from outside (t234) | jumped at the edge | lift up and down | yes (7 pictures) | floor height, columns, parapet, headroom measured with rays |
| Cars (4) | driven with game keys (t230) | rim, tower wall, Hangar 0 wall from outside, H1 door | get in / get out with E | yes (5 pictures) | — |

## Final verification (v89, live)
All pass, no browser errors:
- `t226` reproductions R1-R9 (R2 from three sides of all 5 ships)
- `t227` (all interaction points including the 4 cars; pause/resume; reserved spots; NPC feet)
- `t224`, `t229` (every hangar and platform), `t230` (cars)
- `t199b`, `t216`, `t178`, `t169`, `t70`

Performance, measured in a software renderer (no GPU) at 960x600, so only the comparison between builds means anything:

| View | Draw calls | Triangles | Before the cars (v88) |
|------|-----------:|----------:|-----------------------|
| Hangar 0 | 1,463 | 4.13 M | 1,349 |
| Armoury | 1,737 | 4.37 M | 1,509 |
| Outfitter | 1,862 | 4.40 M | 1,748 |

The cars add about 110-230 draws when in view; each car is about 40 separate parts. Merging each car's fixed parts would cut this.
Not verified: real mouse and keyboard play at full speed (pointer lock does not work headless); frame rate on a real GPU.
