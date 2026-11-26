import { expect, test } from "vitest";
import { knots } from "../../engine/knots";
import { JOBS, KNOT_INFO, essentials } from "./knotInfo";

test("every knot has its page copy, and related knots exist", () => {
  const ids = knots.map((k) => k.id);
  expect(Object.keys(KNOT_INFO).sort()).toEqual([...ids].sort());
  const jobs = JOBS.map(([id]) => id as string);
  for (const [id, info] of Object.entries(KNOT_INFO)) {
    expect(jobs, id).toContain(info.job);
    expect(info.related.length, id).toBeGreaterThan(0);
    for (const r of info.related) expect(ids, `${id} → ${r}`).toContain(r);
  }
});

test("the essentials collection has twenty distinct, playable lessons", () => {
  const ids = knots.map((k) => k.id);
  expect(new Set(ids).size).toBe(ids.length);
  expect(essentials.size).toBe(20);
  for (const id of essentials) expect(ids).toContain(id);
  for (const knot of knots) {
    expect(knot.steps[0].t, knot.id).toBe(0);
    expect(knot.steps.at(-1)!.t, knot.id).toBeLessThanOrEqual(knot.duration);
    for (let i = 1; i < knot.steps.length; i++)
      expect(knot.steps[i].t, knot.id).toBeGreaterThan(knot.steps[i - 1].t);
  }
});
