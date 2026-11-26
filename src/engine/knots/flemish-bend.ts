import { eightPath, returnPath } from "./retrace";
import { move, threadLesson } from "./threading";
const back = returnPath(eightPath),
  tip = back[0];
export const flemishBend = threadLesson(
  "flemish-bend",
  "Figure-eight bend",
  "Two cords join by tracing the same figure eight from opposite ends. This is also called the Flemish bend.",
  "Bring two free ends toward each other",
  "Check for paired strands throughout and tails leaving opposite ends",
  [
    {
      start: [[-0.47, eightPath[0][1], eightPath[0][2]], eightPath[0]],
      moves: [move("Make a loose figure eight in the tan cord", ...eightPath.slice(1))],
    },
    {
      start: [
        [0.55, tip[1], tip[2]],
        [tip[0] + 0.08, tip[1], tip[2]],
      ],
      color: "#2f5fb3",
      moves: [
        move(
          "Enter beside the tan tip and follow its turns backward",
          ...back.slice(0, Math.floor(back.length / 2)),
        ),
        move(
          "Trace the remaining crossings and leave a tail on the far side",
          ...back.slice(Math.floor(back.length / 2)),
          [-0.36, back.at(-1)![1], back.at(-1)![2]],
        ),
      ],
    },
  ],
);
