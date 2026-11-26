import { describe, expect, test } from "vitest";
import { knots } from "../knots";
import { bake } from "./bake";

import { FINGERPRINTS } from "../knots/fingerprints";

describe("bake fingerprint", () => {
  test.each(knots.map((k) => [k.id, k] as const))(
    "%s bakes bit-identically",
    async (id, knot) => {
      const chunks: Float32Array[] = [];
      bake(knot, (c) => chunks.push(c.frames));
      const all = new Float32Array(chunks.reduce((n, c) => n + c.length, 0));
      chunks.reduce((at, c) => (all.set(c, at), at + c.length), 0);
      const digest = new Uint8Array(await crypto.subtle.digest("SHA-1", all));
      const hex = [...digest].map((b) => b.toString(16).padStart(2, "0")).join("");
      expect(hex.slice(0, 12)).toBe(FINGERPRINTS[id]);
    },
    // Long, doubled ropes need more time on shared CI runners.
    120_000,
  );
});
