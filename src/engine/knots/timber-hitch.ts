import { arc, move, threadLesson } from "./threading";
const ring = 0.125,
  height = 0.065;
export const timberHitch = threadLesson(
  "timber-hitch",
  "Timber hitch",
  "The tail twists around the part of the rope that circles the wood. The turns grip when the long end is pulled.",
  "Lay the rope beside a round piece of wood",
  "Count the three twists along the encircling strand",
  [
    {
      start: [
        [0.42, height, ring],
        [0, height, ring],
      ],
      moves: [
        move(
          "Pass the tail all the way around the wood",
          ...arc(1, (u, a) => [-ring * Math.sin(a), height + 0.024 * u, ring * Math.cos(a)]),
        ),
        move(
          "Hook the tail back around the long standing part",
          [0.034, 0.107, 0.12],
          [0.05, 0.09, 0.162],
          [0.045, 0.045, 0.156],
          [0.029, 0.036, 0.115],
          [0.024, 0.066, 0.093],
        ),
        move(
          "Twist the tail around its own encircling strand three times",
          ...arc(3, (u, spin) => {
            const a = 2 * Math.PI * (1 - 0.53 * u);
            const r = ring - 0.03 * Math.cos(spin);
            return [
              -r * Math.sin(a),
              height + 0.024 * (1 - 0.53 * u) + 0.03 * Math.sin(spin),
              r * Math.cos(a),
            ];
          }),
        ),
        move("Draw the standing part to seat the twists", [0.062, 0.057, -0.104]),
      ],
    },
  ],
  [{ kind: "cylinder", a: [0, 0, 0], b: [0, 0.14, 0], radius: 0.085 }],
);
