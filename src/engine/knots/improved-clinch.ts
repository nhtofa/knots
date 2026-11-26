import { arc, move, threadLesson } from "./threading";
import type { Prop, Vec3 } from "./types";
// A closed swivel eye in the vertical yz plane, drawn and collided against
// with the same ring of short capsules. The thin line is enlarged for study.
const eye = (a: number): Vec3 => [-0.21, 0.081 + 0.057 * Math.sin(a), 0.057 * Math.cos(a)];
const ring: Prop[] = Array.from({ length: 16 }, (_, i) => ({
  kind: "capsule",
  a: eye((2 * Math.PI * i) / 16),
  b: eye((2 * Math.PI * (i + 1)) / 16),
  radius: 0.009,
}));
export const improvedClinch = threadLesson(
  "improved-clinch",
  "Improved clinch knot",
  "A fishing knot for an eye or swivel. The tag end returns through two openings after the wraps.",
  "Point the tag end of the line toward the eye",
  "Trace both tucks before drawing the wraps down to the eye",
  [
    {
      radius: 0.0065,
      start: [
        [0.44, 0.083, 0.026],
        [-0.135, 0.083, 0.026],
      ],
      moves: [
        move(
          "Pass the tag through the swivel eye and turn it back",
          [-0.24, 0.083, 0.026],
          [-0.259, 0.083, 0.06],
          [-0.232, 0.083, 0.089],
          [-0.16, 0.083, 0.087],
          [-0.102, 0.083, 0.068],
        ),
        move(
          "Wrap the tag around the standing line five times",
          ...arc(5, (u, a) => [
            -0.102 + 0.22 * u,
            0.083 + 0.037 * Math.sin(a),
            0.026 + 0.042 * Math.cos(a),
          ]),
        ),
        move(
          "Pass the tag back through the small opening beside the eye",
          [0.07, 0.128, 0.125],
          [-0.055, 0.131, 0.124],
          [-0.14, 0.113, 0.064],
          [-0.164, 0.058, 0.054],
        ),
        move(
          "Bring the tag through the larger loop that the return pass just formed",
          [-0.13, 0.043, 0.097],
          [-0.055, 0.056, 0.097],
          [-0.024, 0.11, 0.096],
          [-0.014, 0.152, 0.092],
          [0.105, 0.139, 0.081],
        ),
      ],
    },
  ],
  ring,
);
