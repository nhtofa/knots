import { hitchSeries, peg } from "./post-turns";
import { threadLesson } from "./threading";
export const twoHalfHitches = threadLesson(
  "two-half-hitches",
  "Two half hitches",
  "Tie a cord to a post with two matching half hitches around the long part.",
  "Leave enough free cord to make two hitches",
  "Look for two matching hitches beside each other",
  [hitchSeries(2)],
  peg,
);
