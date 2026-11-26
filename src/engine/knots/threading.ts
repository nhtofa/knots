import type { Guide, KnotDef, Prop, RopeDef, Vec3 } from "./types";

// Some lessons feed a cord through several closely spaced turns. Describe the
// route of its tip once. The guides feed successive points of the rope along
// that same route, retaining the gaps that let a learner inspect the crossings.
export type Move = { title: string; points: Vec3[] };
export const move = (title: string, ...points: Vec3[]): Move => ({ title, points });
export const arc = (turns: number, point: (fraction: number, angle: number) => Vec3): Vec3[] => {
  const n = Math.ceil(Math.abs(turns) * 16);
  return Array.from({ length: n }, (_, i) =>
    point((i + 1) / n, (2 * Math.PI * turns * (i + 1)) / n),
  );
};
const distance = (a: Vec3, b: Vec3) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const mix = (a: Vec3, b: Vec3, u: number): Vec3 => [
  a[0] + u * (b[0] - a[0]),
  a[1] + u * (b[1] - a[1]),
  a[2] + u * (b[2] - a[2]),
];

export interface Thread {
  start: Vec3[];
  moves: Move[];
  radius?: number;
  color?: string;
}

/** Assemble ordinary KnotDef guides. Multiple cords take turns, in array order. */
export function threadLesson(
  id: string,
  name: string,
  summary: string,
  setup: string,
  check: string,
  threads: Thread[],
  props?: Prop[],
): KnotDef {
  const ropes: RopeDef[] = [];
  const guides: Guide[] = [];
  const steps = [{ t: 0, title: setup }];
  let clock = 0.7;
  for (const [rope, thread] of threads.entries()) {
    const points = [...thread.start];
    const lengths = [0];
    const measure = () => {
      for (let i = lengths.length; i < points.length; i++)
        lengths.push(lengths[i - 1] + distance(points[i - 1], points[i]));
    };
    measure();
    const initial = lengths.at(-1)!;
    const phases = [{ t: clock, s: initial }];
    for (const m of thread.moves) {
      steps.push({ t: clock, title: m.title });
      points.push(...m.points);
      measure();
      const s = lengths.at(-1)!;
      clock += Math.max(1.15, (s - phases.at(-1)!.s) / 0.24);
      phases.push({ t: clock, s });
    }
    const length = lengths.at(-1)!;
    const atDistance = (s: number): Vec3 => {
      let i = 1;
      while (i < lengths.length - 1 && s > lengths[i]) i++;
      return mix(points[i - 1], points[i], (s - lengths[i - 1]) / (lengths[i] - lengths[i - 1]));
    };
    const start = thread.moves.length
      ? [atDistance(initial - length), ...thread.start]
      : thread.start;
    ropes.push({ length, radius: thread.radius ?? 0.009, color: thread.color, start });
    const count = Math.ceil(length / 0.043);
    for (let i = 0; i <= count; i++) {
      const offset = (1 - i / count) * length;
      const path: Guide["path"] = [];
      if (phases[0].t > 0) path.push({ t: phases[0].t });
      for (let j = 1; j < phases.length; j++) {
        const a = phases[j - 1],
          b = phases[j];
        // Sample every hand on the same clock. Uneven Hermite intervals would
        // accelerate adjacent guides differently along the straight supply end.
        const samples = Math.ceil((b.s - a.s) / 0.019);
        for (let k = 1; k <= samples; k++) {
          const fraction = k / samples;
          path.push({
            t: a.t + (b.t - a.t) * fraction,
            p: atDistance(a.s + (b.s - a.s) * fraction - offset),
          });
        }
      }
      guides.push({ rope, at: i / count, grab: 0, force: 55, compliance: 0.00025, path });
    }
  }
  steps.push({ t: clock, title: check });
  const duration = Math.ceil((clock + 1.4) * 10) / 10;
  for (const guide of guides) guide.path.push({ t: duration + 0.25 });
  return { id, name, summary, ropes, guides, props, steps, duration };
}
