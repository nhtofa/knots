import { overhandPath, retracedLoop } from "./retrace";
import { threadLesson } from "./threading";
export const overhandLoop = threadLesson(
  "overhand-loop",
  "Overhand loop",
  "A fixed eye in doubled cord. This lesson shows the rethreaded method so you can follow both strands.",
  "Leave a long end to bring back through the knot",
  "Check that the end follows the overhand all the way back",
  [retracedLoop(overhandPath, "Make a loose overhand near the end")],
);
