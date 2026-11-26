import { arc, move, threadLesson, type Thread } from "./threading";
import type { Vec3 } from "./types";

/** Wrap the returning tail toward the standing end, then feed it back through the barrel. */
export function barrel(turns: number, mirror = false, join = false): Thread {
  const side = mirror ? -1 : 1;
  const core = join ? 0.095 : 0.04;
  const y = 0.058;
  const z = join ? 0.014 : 0;
  const point = (x: number, h: number, depth: number): Vec3 => [side * x, h, side * depth];
  const start = [point(-0.4, y, z), point(core + 0.1, y, z)];
  const wrap = arc(turns, (u, a) =>
    point(core + 0.09 - 0.115 * u, y + 0.044 * Math.sin(a), 0.046 * Math.cos(a)),
  );
  const end = point(core + 0.15, y + (join ? 0.022 : 0), -0.009);
  const label = join ? (mirror ? "Tan end" : "Blue end") : "Working end";
  return {
    start,
    color: join && !mirror ? "#2f5fb3" : undefined,
    moves: [
      move(
        `${label} – bend the tip back beside the ${join ? "two cords" : "standing part"}`,
        point(core + 0.13, y, z + 0.017),
        point(core + 0.125, y, 0.044),
        point(core + 0.09, y, 0.046),
      ),
      move(
        turns === 1
          ? `Circle the overlapping cords once`
          : `Wind two turns toward the ${join ? "long end" : "standing part"}`,
        ...wrap,
      ),
      move(
        "Turn the tip back and feed it through the middle of the wrap" + (turns === 1 ? "" : "s"),
        point(core - 0.042, y, 0.036),
        point(core - 0.058, y, 0.008),
        point(core - 0.046, y + (join ? 0.022 : 0), -0.009),
        end,
      ),
    ],
  };
}

/** Pull the long ends apart. Each barrel travels with its cord and slides along the other cord. */
export function fishermansBend(id: string, name: string, summary: string, turns: number) {
  const knot = threadLesson(
    id,
    name,
    summary,
    "Overlap two cords with the ends pointing in opposite directions",
    "Pull the long parts apart to bring the barrels together",
    [barrel(turns, false, true), barrel(turns, true, true)],
  );
  const pull = knot.steps.at(-1)!.t;
  const end = pull + 1.6;
  for (const guide of knot.guides) {
    const last = guide.path.findLast((key) => key.p)!.p!;
    guide.path.pop();
    if (guide.path.at(-1)!.t < pull) guide.path.push({ t: pull });
    const side = guide.rope === 0 ? -1 : 1;
    guide.path.push({ t: end, p: [last[0] + side * 0.061, last[1], last[2]] }, { t: end + 1.4 });
  }
  knot.steps.push({
    t: end,
    title: "Check the two barrels meet and the tails point in opposite directions",
  });
  knot.duration = Math.ceil((end + 1.2) * 10) / 10;
  return knot;
}
