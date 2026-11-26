import { rail } from "./post-turns";
import { arc, move, threadLesson } from "./threading";
const r = 0.061,
  y = 0.086;
export const rollingHitch = threadLesson(
  "rolling-hitch",
  "Rolling hitch",
  "An extra turn on the side of the pull helps a cord grip a spar lengthwise. This is the spar version.",
  "Lead the standing part toward the left along the spar",
  "The two close turns sit on the side of the expected pull",
  [
    {
      start: [
        [-0.39, y + 0.013, 0.16],
        [-0.065, y, r],
      ],
      moves: [
        move(
          "Wind twice around the spar on the side of the pull",
          ...arc(2, (u, a) => [-0.065 - 0.065 * u, y + r * Math.sin(a), r * Math.cos(a)]),
        ),
        move(
          "Cross both turns toward the other side",
          [-0.12, y + 0.048, 0.068],
          [-0.064, y + 0.085, 0.019],
          [0.02, y + 0.059, -0.03],
        ),
        move(
          "Pass behind the spar and underneath the diagonal crossing",
          [0.035, y + 0.023, -0.057],
          [0.032, y - 0.042, -0.047],
          [0.022, y - r, 0],
          [0.01, y - 0.022, 0.059],
          [-0.025, y + 0.035, 0.058],
          [-0.052, y + 0.057, 0.022],
          [-0.04, y + 0.067, -0.028],
        ),
        move("Draw the tail clear of the turns", [0.011, y + 0.045, -0.16]),
      ],
    },
  ],
  rail,
);
