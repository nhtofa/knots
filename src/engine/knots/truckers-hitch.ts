import { overhandPath, retracedLoop } from "./retrace";
import { halfHitch } from "./post-turns";
import { arc, move, threadLesson } from "./threading";
import type { Vec3 } from "./types";
// The mid-line eye is the same retraced overhand taught separately. Its open
// center is at (0.015, 0.124, 0.12). The peg sits to its right, with space
// between the peg and the eye for both finishing hitches.
const loop = retracedLoop(overhandPath, "");
const raw = [...loop.start, ...loop.moves.flatMap((m) => m.points)];
const start: Vec3[] = raw
  .slice(0, -1)
  .map(([x, y, z]) => [x * 0.68 - 0.21, y * 0.8 + 0.03, z * 0.8]);
start[0] = [-0.6, start[1][1], start[1][2]];
start.push(
  [-0.42, 0.05, -0.03],
  [-0.41, 0.045, -0.092],
  [-0.33, 0.045, -0.11],
  [0.32, 0.045, -0.11],
);
export const truckersHitch = threadLesson(
  "truckers-hitch",
  "Trucker’s hitch",
  "Use an eye in the rope as a pulley to tension a line, then tie off the working end.",
  "Begin with one end fixed and an overhand loop in the middle of the line",
  "Follow the two finishing hitches around the return strand",
  [
    {
      start,
      moves: [
        move(
          "Pass the tail around the second anchor",
          ...arc(0.5, (_, a) => [
            0.32 + 0.09 * Math.sin(a),
            0.045 + (0.016 * a) / Math.PI,
            -0.02 - 0.09 * Math.cos(a),
          ]),
        ),
        move(
          "Bring the tail back and feed it through the fixed eye",
          [0.22, 0.063, 0.07],
          [0.12, 0.065, 0.07],
          [0.075, 0.08, 0.08],
          [0.013, 0.084, 0.12],
          [0.01, 0.16, 0.12],
        ),
        move(
          "Pull the tail back toward the anchor",
          [0.065, 0.166, 0.14],
          [0.095, 0.11, 0.143],
          [0.105, 0.083, 0.119],
        ),
        ...[0.157, 0.246].map((x, i) => {
          const h = halfHitch(
            x,
            `Tie the ${i === 0 ? "first" : "second"} half hitch around the tensioned return strand`,
          );
          return { ...h, points: h.points.map(([a, b, c]): Vec3 => [a, b, 0.131 - c]) };
        }),
        move("Draw the free end clear", [0.315, 0.071, 0.12]),
      ],
    },
  ],
  [{ kind: "cylinder", a: [0.32, 0, -0.02], b: [0.32, 0.14, -0.02], radius: 0.07 }],
);
