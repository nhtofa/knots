import { createHash } from "node:crypto";
import { copyFile, mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { gzipSync } from "node:zlib";
import { motionFilename } from "../src/engine/knots/fingerprints";
import type { KnotDef } from "../src/engine/knots/types";
import { encodeMotionChunk } from "../src/engine/playback/motion";
import { bake, frameCount } from "../src/engine/sim/bake";
import { particleCount } from "../src/engine/sim/rope";

/** Build the default lessons once. Only a selected lesson is downloaded by the browser. */
export async function buildMotion(knots: KnotDef[], clientDirectory: string) {
  const output = join(clientDirectory, "motion");
  const cache = "node_modules/.cache/knots-motion";
  await Promise.all([mkdir(output, { recursive: true }), mkdir(cache, { recursive: true })]);
  const inputs = ["sim/rope.ts", "sim/bake.ts", "sim/frames.ts", "playback/motion.ts"];
  const version = createHash("sha256");
  for (const input of inputs) version.update(await readFile(join("src/engine", input)));
  for (const knot of knots) {
    const key = version.copy().update(JSON.stringify(knot)).digest("hex");
    const cached = join(cache, key + ".gz");
    const dest = join(output, motionFilename(knot.id));
    try {
      await copyFile(cached, dest);
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
      const particles = knot.ropes.reduce((n, r) => n + particleCount(r), 0);
      const previous = new Int16Array(particles * 6);
      const delta = new Int16Array(frameCount(knot) * previous.length);
      bake(knot, (chunk) =>
        encodeMotionChunk(delta, previous, chunk.start, chunk.frames, chunk.normals),
      );
      const temporary = cached + "." + process.pid;
      await writeFile(temporary, gzipSync(Buffer.from(delta.buffer), { level: 6 }));
      await rename(temporary, cached);
      await copyFile(cached, dest);
    }
  }
}
