import { arc, move, threadLesson } from "./threading";
import type { Vec3 } from "./types";
const w = 0.037,
  y = 0.061;
const bight: Vec3[] = [
  [0.51, y, -w],
  [0, y, -w],
  ...arc(0.5, (_, a) => [-w * Math.sin(a), y, -w * Math.cos(a)]),
  [0.25, y, w],
];
export const doubleSheetBend = threadLesson(
  "double-sheet-bend",
  "Double sheet bend",
  "An extra wrap around the folded cord distinguishes the double sheet bend from the single.",
  "Fold the thicker tan cord into a U",
  "Both short ends should emerge on the same side",
  [
    { start: bight, radius: 0.012, moves: [] },
    {
      start: [
        [-0.47, 0.022, 0],
        [-0.088, 0.022, 0],
      ],
      color: "#2f5fb3",
      radius: 0.0085,
      moves: [
        move(
          "Bring blue up through the U and over the short tan leg",
          [0.012, 0.024, 0],
          [0.033, 0.075, 0.008],
          [0.045, 0.102, 0.045],
          [0.052, 0.066, 0.078],
        ),
        move(
          "Wrap behind both legs of the U",
          ...arc(0.75, (u, a) => [0.052 + 0.031 * u, y - 0.042 * Math.sin(a), 0.078 * Math.cos(a)]),
        ),
        move(
          "Make a second wrap alongside the first",
          ...arc(1, (u, a) => [0.083 + 0.03 * u, y + 0.042 * Math.cos(a), 0.078 * Math.sin(a)]),
        ),
        move(
          "Tuck blue under its first crossing, alongside the short tan end",
          [0.094, 0.087, 0.014],
          [0.06, 0.083, 0.023],
          [0.035, 0.083, 0.045],
          [0.02, 0.072, 0.078],
          [-0.015, 0.035, 0.18],
        ),
      ],
    },
  ],
);
