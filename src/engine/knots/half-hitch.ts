import { hitchSeries, peg } from "./post-turns";
import { threadLesson } from "./threading";
export const halfHitch = threadLesson(
  "half-hitch",
  "Half hitch",
  "One turn of the working end around its own standing part. It is a building block for many other hitches.",
  "Lead the cord toward the post",
  "Locate the single tuck around the long part",
  [hitchSeries(1)],
  peg,
);
