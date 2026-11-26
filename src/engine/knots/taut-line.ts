import { aroundPeg, halfHitch, peg } from "./post-turns";
import { arc, move, threadLesson } from "./threading";
const thread = aroundPeg(false);
thread.moves.push(
  move(
    "Make two turns around the long part, working toward the post",
    [0.1, 0.064, 0.016],
    ...arc(2, (u, a) => [0.1 - 0.1 * u, 0.063 + 0.042 * Math.sin(a), 0.061 - 0.045 * Math.cos(a)]),
  ),
  move(
    "Bring the end back outside the two turns",
    [0.01, 0.114, 0.041],
    [0.07, 0.124, 0.057],
    [0.125, 0.094, 0.018],
  ),
  halfHitch(0.18, "Finish with one half hitch outside the loop"),
  move("Leave a tail past the last tuck", [0.32, 0.064, 0.019]),
);
export const tautLine = threadLesson(
  "taut-line",
  "Taut-line hitch",
  "An adjustable hitch for a tent guyline. Slide it along the long part while the line is slack.",
  "Bring the guyline around a stake",
  "Check for two turns inside the loop and one hitch outside",
  [thread],
  peg,
);
