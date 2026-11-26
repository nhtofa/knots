import { describe, expect, test } from "vitest";
import { Player } from "./player";

const steps = [
  { t: 0, title: "a" },
  { t: 1, title: "b" },
  { t: 2, title: "c" },
];
const make = (autoplay = true) => {
  const p = new Player(steps, 3);
  if (autoplay) p.play();
  p.setReady(3);
  return p;
};

describe("Player", () => {
  test("plays at its speed and tracks the step", () => {
    const p = make();
    p.setSpeed(2);
    p.tick(0.6);
    expect(p.getSnapshot()).toMatchObject({ time: 1.2, step: 1 });
  });

  test("ignores a negative time step", () => {
    const p = make();
    p.tick(-0.9);
    expect(p.getSnapshot().time).toBe(0);
  });

  test("buffers a slow bake once, then advances without stopping at chunk boundaries", () => {
    const p = make();
    p.setReady(0.5);
    p.tick(2);
    expect(p.getSnapshot()).toMatchObject({ time: 0, playing: true });
    p.setReady(1.5);
    p.tick(0.2);
    expect(p.getSnapshot().time).toBe(0);
    p.setReady(3);
    p.tick(0.2);
    expect(p.getSnapshot().time).toBe(0.2);
  });

  test("keeps a seek ahead of the bake and resumes from the selected step", () => {
    const p = make();
    p.setReady(0.5);
    p.seek(2);
    p.tick(0.2);
    expect(p.getSnapshot()).toMatchObject({ time: 2, step: 2 });
    p.setReady(3);
    p.tick(0.1);
    expect(p.getSnapshot().time).toBe(2.1);
  });

  test("stops at the end, and play starts over", () => {
    const p = make();
    p.tick(5);
    expect(p.getSnapshot()).toMatchObject({ time: 3, playing: false });
    p.togglePlay();
    expect(p.getSnapshot()).toMatchObject({ time: 0, playing: true });
  });

  test("loops after resting on the finished knot", () => {
    const p = make();
    p.toggleLoop();
    p.tick(3.5);
    expect(p.getSnapshot()).toMatchObject({ time: 3.5, playing: true });
    p.tick(1);
    expect(p.getSnapshot()).toMatchObject({ time: 0, playing: true });
  });

  test("steps back and forth and clamps at the ends", () => {
    const p = make(false);
    p.stepBy(1);
    p.stepBy(1);
    p.stepBy(1);
    expect(p.getSnapshot()).toMatchObject({ time: 2, step: 2 });
    p.stepBy(-5);
    expect(p.getSnapshot()).toMatchObject({ time: 0, step: 0 });
  });

  test("notifies only on change, with a new snapshot", () => {
    const p = make(false);
    let calls = 0;
    p.subscribe(() => calls++);
    const before = p.getSnapshot();
    p.tick(1); // paused: no change
    p.seek(0); // same time
    expect(calls).toBe(0);
    p.seek(1);
    expect(calls).toBe(1);
    expect(p.getSnapshot()).not.toBe(before);
  });
});
