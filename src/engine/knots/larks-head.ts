import type { KnotDef, Vec3 } from "./types";

const R = 0.011;
const railY = 0.066;
const width = 0.056;
// A folded cord straddles the rail, with the fold on the far side. Both
// legs follow the same profile, giving the bight room to swing back under.
const leg: Vec3[] = [
  [-width, R, 0.23],
  [-width, R, 0.1],
  [-width, 0.06, 0.034],
  [-width, 0.097, 0],
  [-width, 0.06, -0.034],
  [-width, R, -0.1],
  [-width, R, -0.22],
];
const start: Vec3[] = [...leg];
for (let i = 1; i < 12; i++) {
  const a = (i * Math.PI) / 12;
  start.push([-width * Math.cos(a), R, -0.22 - width * Math.sin(a)]);
}
start.push(...leg.toReversed().map(([x, y, z]): Vec3 => [-x, y, z]));
const length = start
  .slice(1)
  .reduce(
    (s, [x, y, z], i) => s + Math.hypot(x - start[i][0], y - start[i][1], z - start[i][2]),
    0,
  );

export const larksHead: KnotDef = {
  id: "larks-head",
  name: "Lark’s head",
  summary:
    "Fasten a folded cord to a rail. Both ends pass together through the fold to make a cow hitch.",
  ropes: [{ length, radius: R, start }],
  props: [
    { kind: "cylinder", a: [-0.39, railY, 0], b: [0.39, railY, 0], radius: 0.02 },
    ...[-0.37, 0.37].map((x) => ({
      kind: "cylinder" as const,
      a: [x, 0, 0] as Vec3,
      b: [x, railY, 0] as Vec3,
      radius: 0.02,
    })),
  ],
  duration: 8.5,
  steps: [
    { t: 0, title: "Fold the cord in half and hang the fold over the rail" },
    { t: 0.4, title: "Bring the folded end back under the rail" },
    { t: 2.9, title: "Open the fold and pass both loose ends through it" },
    { t: 5.7, title: "Pull the two ends together to seat the hitch" },
    { t: 7.8, title: "Find the two turns and the collar across them" },
  ],
  guides: [
    // Keep the two sides of the opening apart until the tails are through.
    ...[-1, 1].map((side, i) => ({
      at: i === 0 ? 0.44 : 0.56,
      grab: 0.4,
      force: 95,
      path: [
        { t: 1.4, p: [side * 0.09, 0.016, -0.1] as Vec3 },
        { t: 2.05, p: [side * 0.1, 0.017, 0.035] as Vec3 },
        { t: 2.9, p: [side * 0.1, 0.025, 0.145] as Vec3 },
        { t: 4.4, p: [side * 0.095, 0.05, 0.14] as Vec3 },
        { t: 5.7, p: [side * 0.07, 0.065, 0.075] as Vec3 },
      ],
    })),
    {
      at: 0.5,
      grab: 0.4,
      force: 100,
      path: [
        { t: 1.3, p: [0, R, -0.17] },
        { t: 2.0, p: [0, R, 0.04] },
        { t: 2.9, p: [0, R, 0.22] },
        { t: 3.8, p: [0, 0.08, 0.225] },
        { t: 4.7, p: [0, 0.125, 0.17] },
        { t: 5.7, p: [0, 0.105, 0.1] },
        { t: 6.8, p: [0, 0.079, 0.055] },
        { t: 7.1 },
      ],
    },
    ...[-1, 1].map((side, i) => ({
      at: i,
      grab: 0,
      force: 85,
      path: [
        { t: 0.55, p: [side * 0.037, 0.09, 0.17] as Vec3 },
        { t: 2.9 },
        { t: 3.65, p: [side * 0.034, 0.07, 0.145] as Vec3 },
        { t: 4.4, p: [side * 0.03, 0.018, 0.15] as Vec3 },
        { t: 5.7, p: [side * 0.032, R, 0.27] as Vec3 },
        { t: 7.35, p: [side * 0.018, R, 0.52] as Vec3 },
        { t: 7.8 },
      ],
    })),
  ],
};
