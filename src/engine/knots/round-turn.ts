import { hitchSeries, peg } from "./post-turns";
import { threadLesson } from "./threading";
export const roundTurn = threadLesson(
  "round-turn",
  "Round turn and two half hitches",
  "An extra turn around the post adds friction before the two finishing hitches.",
  "Start on the near side of the post",
  "Count the turns on the post and the two hitches on the rope",
  [hitchSeries(2, true)],
  peg,
);
