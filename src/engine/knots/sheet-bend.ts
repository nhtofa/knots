import type { KnotDef, Vec3 } from "./types";

// The thicker tan cord is folded back on itself. Keep the bend raised just long
// enough to feed blue underneath, then pinch the two tan legs for the wrap.
const R = 0.012;
const w = 0.058;
const tan: Vec3[] = [
  [0.56, R, -w],
  [0, R, -w],
];
for (let i = 1; i <= 12; i++) {
  const a = (Math.PI * i) / 12;
  tan.push([-w * Math.sin(a), R, -w * Math.cos(a)]);
}
tan.push([0.23, R, w]);
const length = 0.56 + 24 * w * Math.sin(Math.PI / 24) + 0.23;

export const sheetBend: KnotDef = {
  id: "sheet-bend",
  name: "Sheet bend",
  summary:
    "Join two cords by folding the thicker cord and wrapping the thinner one around the fold. Also called the weaver’s knot.",
  ropes: [
    {
      length: 1.05,
      radius: 0.0095,
      color: "#2f5fb3",
      start: [
        [-1.16, 0.0095, 0],
        [-0.11, 0.0095, 0],
      ],
    },
    { length, radius: R, start: tan },
  ],
  duration: 9.5,
  steps: [
    { t: 0, title: "Fold the thicker tan cord into a U" },
    { t: 0.4, title: "Bring the blue end up through the U and over the short tan leg" },
    { t: 2.7, title: "Wrap the blue end behind both tan legs" },
    { t: 4.7, title: "Cross the tan cord and tuck the end under the blue strand" },
    { t: 6.7, title: "Hold the tails and draw the long ends apart" },
    { t: 8.8, title: "Check that both short ends are on the same side" },
  ],
  guides: [
    {
      rope: 1,
      at: (0.56 + (Math.PI * w) / 2) / length,
      grab: 0,
      force: 90,
      path: [{ t: 0.48, p: [-w, 0.055, 0] }, { t: 1.4 }, { t: 1.9, p: [-w, R, 0] }, { t: 6.6 }],
    },
    ...[0.56 - 0.09, length - 0.23 + 0.09].map((d, i) => ({
      rope: 1,
      at: d / length,
      grab: 0.1,
      force: 90,
      path: [
        { t: 2.7 },
        { t: 3.2, p: [0.09, 0.067, i === 0 ? -w : w] as Vec3 },
        { t: 4.6 },
        { t: 5.05, p: [0.09, R, i === 0 ? -w : w] as Vec3 },
        { t: 6.7 },
      ],
    })),
    {
      at: 1,
      grab: 0.4,
      force: 110,
      path: [
        { t: 0.9, p: [-0.07, 0.011, 0] },
        { t: 1.35, p: [0.025, 0.011, 0] },
        { t: 1.65, p: [0.045, 0.045, 0.02] },
        { t: 1.95, p: [0.065, 0.055, 0.085] },
        { t: 2.7, p: [0.105, 0.012, 0.28] },
        { t: 3.2, p: [0.17, 0.011, 0.12] },
        { t: 3.65, p: [0.12, 0.011, 0.035] },
        { t: 4.05, p: [0.12, 0.011, -0.08] },
        { t: 4.7, p: [0.12, 0.011, -0.19] },
        { t: 5.15, p: [0.065, 0.061, -0.105] },
        { t: 5.55, p: [0.042, 0.052, -0.035] },
        { t: 5.85, p: [0.038, 0.037, 0.025] },
        { t: 6.15, p: [0.04, 0.034, 0.065] },
        { t: 6.7, p: [0.02, 0.02, 0.19] },
      ],
    },
    // Lift the blue strand where it first crossed the short leg for the final tuck.
    {
      at: 0.72,
      grab: 4.45,
      force: 80,
      path: [
        { t: 5.15, p: [0.054, 0.084, 0.062] },
        { t: 6.35 },
        { t: 6.75, p: [0.052, 0.04, 0.065] },
      ],
    },
    { at: 1, grab: 6.7, force: 45, path: [{ t: 7.4, p: [-0.055, 0.025, 0.18] }, { t: 8.3 }] },
    {
      rope: 1,
      at: 1,
      grab: 6.7,
      force: 35,
      path: [{ t: 7.4, p: [0.19, 0.023, 0.09] }, { t: 8.3 }],
    },
    { at: 0, grab: 6.7, force: 180, path: [{ t: 8.35, p: [-0.77, 0.025, -0.05] }, { t: 8.8 }] },
    {
      rope: 1,
      at: 0,
      grab: 6.7,
      force: 180,
      path: [{ t: 8.35, p: [0.62, 0.025, -0.03] }, { t: 8.8 }],
    },
  ],
};
