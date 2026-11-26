import { arc, move, type Thread } from "./threading";
import type { Prop, Vec3 } from "./types";

// A vertical peg to the left and a standing part running to the right. Raising
// the line slightly leaves the underpasses visible when orbiting the camera.
export const peg: Prop[] = [
  { kind: "cylinder", a: [-0.2, 0, 0], b: [-0.2, 0.17, 0], radius: 0.046 },
];
const y = 0.063,
  z = 0.061;
export const aroundPeg = (extra: boolean): Thread => ({
  start: [
    [0.45, y, z],
    [-0.2, y, z],
  ],
  moves: [
    move(
      extra
        ? "Take a round turn so the line bears twice on the post"
        : "Pass the end around the back of the post",
      ...arc(extra ? 1.5 : 0.5, (u, a) => [
        -0.2 - z * Math.sin(a),
        y + (extra ? 0.045 * u : 0),
        z * Math.cos(a),
      ]),
      [-0.11, extra ? 0.104 : y, -z],
    ),
  ],
});

/** One turn around the long part, tucked under its own entry strand. */
export function halfHitch(x: number, title: string) {
  return move(
    title,
    [x - 0.05, 0.093, z - 0.052],
    [x + 0.022, 0.113, z - 0.015],
    [x + 0.032, 0.101, z + 0.035],
    [x + 0.011, y, z + 0.055],
    [x - 0.015, 0.021, z + 0.03],
    [x - 0.028, 0.018, z - 0.008],
    [x - 0.025, 0.04, z - 0.048],
    [x - 0.003, 0.072, z - 0.031],
    [x + 0.041, 0.081, z - 0.018],
  );
}
export function hitchSeries(count: number, extra = false): Thread {
  const thread = aroundPeg(extra);
  thread.moves.push(
    halfHitch(-0.04, "Circle the long part and tuck the end under its own crossing"),
  );
  if (count === 2)
    thread.moves.push(halfHitch(0.085, "Repeat the half hitch in the same direction"));
  thread.moves.push(
    move("Draw the tail out and pull the standing part", [count === 2 ? 0.24 : 0.15, y, z - 0.045]),
  );
  return thread;
}
export const rail: Prop[] = [
  { kind: "cylinder", a: [-0.37, 0.086, 0], b: [0.37, 0.086, 0], radius: 0.042 },
  ...[-0.35, 0.35].map((x) => ({
    kind: "cylinder" as const,
    a: [x, 0, 0] as Vec3,
    b: [x, 0.086, 0] as Vec3,
    radius: 0.021,
  })),
];
