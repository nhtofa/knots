import { move, threadLesson } from "./threading";
export const cleatHitch = threadLesson(
  "cleat-hitch",
  "Cleat hitch",
  "Lead a dock line around the base of a two-horn cleat, then cross between the horns in a figure eight.",
  "Approach the cleat from one side",
  "Trace the crossing turns from one horn to the other",
  [
    {
      start: [
        [-0.48, 0.03, 0.19],
        [-0.2, 0.03, 0.1],
      ],
      moves: [
        move(
          "Lead past the near horn and take the line around the far end",
          [0.105, 0.027, 0.047],
          [0.131, 0.026, 0.02],
          [0.13, 0.026, -0.024],
          [0.1, 0.027, -0.049],
        ),
        move(
          "Continue around the base of the near horn",
          [-0.1, 0.028, -0.047],
          [-0.136, 0.03, -0.02],
          [-0.138, 0.034, 0.024],
          [-0.112, 0.046, 0.051],
        ),
        move(
          "Cross the top and lead under the far horn",
          [0.005, 0.141, 0.004],
          [0.107, 0.108, -0.053],
          [0.151, 0.064, -0.033],
          [0.157, 0.065, 0.024],
          [0.12, 0.083, 0.054],
        ),
        move(
          "Cross back and turn under the near horn",
          [-0.004, 0.17, 0.002],
          [-0.11, 0.113, -0.057],
          [-0.157, 0.065, -0.029],
          [-0.158, 0.065, 0.027],
          [-0.12, 0.084, 0.055],
        ),
        move(
          "Lay the next crossing alongside the earlier turn",
          [0.018, 0.193, 0.006],
          [0.13, 0.104, -0.061],
          [0.169, 0.062, -0.032],
          [0.168, 0.062, 0.029],
          [0.21, 0.029, 0.16],
        ),
      ],
    },
  ],
  [
    { kind: "capsule", a: [-0.21, 0.101, 0], b: [0.21, 0.101, 0], radius: 0.016 },
    ...[-0.09, 0.09].map((x) => ({
      kind: "cylinder" as const,
      a: [x, 0, 0] as [number, number, number],
      b: [x, 0.1, 0] as [number, number, number],
      radius: 0.025,
    })),
  ],
);
