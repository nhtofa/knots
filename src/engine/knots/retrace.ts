import { move, type Thread } from "./threading";
import type { Vec3 } from "./types";

// Open crossing layouts sampled just before the pull in our original overhand
// (4.6 s) and figure-eight (13.1 s). The enlarged gaps admit a second strand.
export const overhandPath: Vec3[] = [
  [-0.274, 0.028, 0.01],
  [-0.196, 0.028, 0.006],
  [-0.12, 0.0312, 0.012],
  [-0.048, 0.0632, 0.028],
  [0.02, 0.1176, 0.032],
  [0.096, 0.1336, 0.028],
  [0.16, 0.0856, 0.048],
  [0.154, 0.0312, 0.11],
  [0.088, 0.028, 0.148],
  [0.012, 0.0344, 0.158],
  [-0.06, 0.06, 0.138],
  [-0.106, 0.0952, 0.084],
  [-0.096, 0.1144, 0.012],
  [-0.03, 0.0856, -0.018],
  [0.04, 0.0568, 0.008],
  [0.098, 0.0728, 0.058],
  [0.152, 0.108, 0.106],
  [0.218, 0.1176, 0.148],
];
export const eightPath: Vec3[] = [
  [-0.297, 0.0472, 0.009],
  [-0.2415, 0.0728, 0.0135],
  [-0.186, 0.0952, 0.021],
  [-0.129, 0.1048, 0.027],
  [-0.072, 0.0824, 0.0315],
  [-0.0165, 0.0504, 0.033],
  [0.039, 0.0408, 0.027],
  [0.093, 0.06, 0.009],
  [0.138, 0.0888, -0.024],
  [0.1665, 0.1048, -0.072],
  [0.165, 0.0856, -0.129],
  [0.132, 0.0504, -0.1695],
  [0.0765, 0.028, -0.18],
  [0.027, 0.028, -0.156],
  [0.0015, 0.028, -0.105],
  [0.0045, 0.0504, -0.0495],
  [0.015, 0.1016, 0.0015],
  [0.0105, 0.124, 0.057],
  [-0.018, 0.1112, 0.1065],
  [-0.0675, 0.076, 0.126],
  [-0.1155, 0.0408, 0.1035],
  [-0.1335, 0.028, 0.051],
  [-0.114, 0.0376, -0.003],
  [-0.075, 0.0728, -0.042],
  [-0.027, 0.1048, -0.066],
  [0.0285, 0.1048, -0.0795],
  [0.084, 0.0728, -0.0825],
  [0.1395, 0.0408, -0.0795],
  [0.1965, 0.028, -0.0765],
  [0.2535, 0.028, -0.075],
  [0.312, 0.028, -0.0735],
];

// Offset across the cord's direction, rather than along a fixed world axis:
// parallel strands stay visibly paired as the knot turns back on itself.
export function returnPath(route: Vec3[]): Vec3[] {
  return route
    .map(([x, y, z], i): Vec3 => {
      const prev = route[Math.max(0, i - 1)],
        next = route[Math.min(route.length - 1, i + 1)];
      const dx = next[0] - prev[0],
        dz = next[2] - prev[2],
        d = Math.hypot(dx, dz);
      return [x - (0.023 * dz) / d, y + 0.006, z + (0.023 * dx) / d];
    })
    .reverse();
}
export function retracedLoop(route: Vec3[], first: string): Thread {
  const [x, y, z] = route.at(-1)!;
  const back = returnPath(route);
  return {
    start: [[-0.5, route[0][1], route[0][2]], route[0]],
    moves: [
      move(first, ...route.slice(1)),
      move(
        "Bring the end around to form the eye",
        [x + 0.07, y, z - 0.055],
        [x + 0.15, y, z - 0.06],
        [x + 0.19, y, z],
        [x + 0.15, y, z + 0.073],
        [x + 0.065, y, z + 0.077],
        back[0],
      ),
      move(
        "Trace the first half of the knot backward, beside the original strand",
        ...back.slice(1, Math.floor(back.length / 2)),
      ),
      move(
        "Follow the remaining crossings and bring the tail out beside the long part",
        ...back.slice(Math.floor(back.length / 2)),
        [-0.38, back.at(-1)![1], back.at(-1)![2]],
      ),
    ],
  };
}
