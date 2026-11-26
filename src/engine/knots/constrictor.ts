import { rail } from "./post-turns";
import { arc, move, threadLesson } from "./threading";
const y = 0.086,
  r = 0.063;
export const constrictor = threadLesson(
  "constrictor",
  "Constrictor knot",
  "A binding knot with an extra tuck trapped beneath the diagonal turn. It can be difficult to undo.",
  "Lay the cord across the top of a round rail",
  "Find the short end passing under the diagonal binding turn",
  [
    {
      start: [
        [-0.055, y + r, 0.31],
        [-0.055, y + r, 0],
      ],
      moves: [
        move(
          "Go behind the rail and return underneath",
          ...arc(0.76, (u, a) => [-0.055 + 0.12 * u, y + r * Math.cos(a), -r * Math.sin(a)]),
        ),
        move(
          "Cross the standing part and go around again",
          [0.055, y + 0.047, 0.056],
          [-0.04, y + 0.095, 0.004],
          [-0.11, y + 0.054, -0.039],
          [-0.12, y, -r],
          [-0.12, y - 0.048, -0.04],
          [-0.12, y - r, 0],
          [-0.112, y - 0.029, 0.054],
        ),
        move(
          "Take the tip over the standing part, under the diagonal, then under the first turn",
          [-0.103, y + 0.026, 0.065],
          [-0.064, y + 0.083, 0.061],
          [-0.026, y + 0.09, 0.033],
          [-0.026, y + 0.065, 0.009],
          [-0.053, y + 0.06, -0.014],
          [-0.087, y + 0.045, -0.047],
        ),
        move("Draw the short end through", [-0.14, y + 0.019, -0.18]),
      ],
    },
  ],
  rail,
);
