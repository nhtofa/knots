import { RopeSim } from "../sim/rope";
import { larksHead } from "../knots/larks-head";
import { expect, test } from "vitest";
import { encodeMotionChunk, NORMAL_SCALE, POSITION_SCALE, unpackMotion } from "./motion";

test("motion chunks preserve every particle and frame, including signed delta overflow", () => {
  const particles = 2;
  const stride = particles * 3;
  const frames = 4;
  const data = new Int16Array(frames * stride * 2);
  const prev = new Int16Array(stride * 2);
  const positions = Float32Array.from({ length: stride * frames }, (_, i) => Math.sin(i) * 7.6);
  const normals = Float32Array.from(positions, (p) => Math.sign(p));
  for (let frame = 0; frame < frames; frame += 2) {
    const a = frame * stride,
      b = (frame + 2) * stride;
    encodeMotionChunk(data, prev, frame, positions.subarray(a, b), normals.subarray(a, b));
  }
  const decoded = unpackMotion(data.buffer, particles, frames);
  for (let i = 0; i < positions.length; i++) {
    const k = Math.floor(i / stride) * stride * 2 + (i % stride);
    expect(Math.abs(decoded[k] / POSITION_SCALE - positions[i])).toBeLessThanOrEqual(
      0.5 / POSITION_SCALE,
    );
    expect(decoded[k + stride] / NORMAL_SCALE).toBe(normals[i]);
  }
  expect(() => unpackMotion(new ArrayBuffer(0), particles, frames)).toThrow();
});

test("the lark’s head starts without a sudden jump off its rail", () => {
  const sim = new RopeSim(larksHead);
  for (let frame = 0; frame < 10; frame++) {
    const last = sim.x.slice();
    sim.step();
    for (let i = 0; i < sim.x.length; i += 3) {
      const distance = Math.hypot(
        sim.x[i] - last[i],
        sim.x[i + 1] - last[i + 1],
        sim.x[i + 2] - last[i + 2],
      );
      expect(distance).toBeLessThan(larksHead.ropes[0].radius);
    }
  }
});
