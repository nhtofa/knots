import { halfHitch, peg } from "./post-turns";
import { arc, move, threadLesson, type Thread } from "./threading";
// Leave an opening between the post and its two turns for the vertical tuck.
const thread: Thread = {
  start: [
    [0.45, 0.063, 0.061],
    [-0.09, 0.063, 0.061],
    [-0.2, 0.063, 0.086],
  ],
  moves: [
    move(
      "Wrap the cord twice around the attachment",
      ...arc(1.5, (u, a) => [-0.2 - 0.086 * Math.sin(a), 0.063 + 0.048 * u, 0.086 * Math.cos(a)]),
      [-0.11, 0.111, -0.086],
    ),
  ],
};
thread.moves.push(
  move(
    "Go over the standing part and pass the end under both turns",
    [-0.12, 0.128, 0.004],
    [-0.154, 0.128, 0.062],
    [-0.179, 0.124, 0.07],
    [-0.194, 0.083, 0.067],
    [-0.201, 0.041, 0.065],
    [-0.18, 0.032, 0.095],
  ),
  halfHitch(-0.01, "Add a half hitch around the standing part"),
  move("Bring the free tail out beside the long part", [0.16, 0.055, 0.025]),
);
export const anchorHitch = threadLesson(
  "anchor-hitch",
  "Anchor hitch",
  "A round turn with the first hitch tucked under both wraps. This differentiates it from an ordinary round turn and two half hitches.",
  "Leave room between the turns and the attachment",
  "Follow the first tuck underneath both turns",
  [thread],
  peg,
);
