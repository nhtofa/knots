import { eightPath, retracedLoop } from "./retrace";
import { threadLesson } from "./threading";
export const figureEightLoop = threadLesson(
  "figure-eight-loop",
  "Figure-eight follow-through",
  "A fixed eye formed by tracing a figure eight a second time with the free end.",
  "Leave plenty of tail for the return pass",
  "Follow every pair of strands all the way around the figure eight",
  [retracedLoop(eightPath, "Tie a loose figure eight, keeping each crossing open")],
);
