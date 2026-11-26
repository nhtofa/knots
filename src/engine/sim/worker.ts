import { motionFilename } from "../knots/fingerprints";
import type { KnotDef } from "../knots/types";
import { unpackMotion } from "../playback/motion";
import { bake, type BakeChunk } from "./bake";
import type { RopePhysics } from "./rope";

type Request =
  | { kind: "load"; id: string; particles: number; frames: number }
  | { kind: "simulate"; knot: KnotDef; physics: RopePhysics };
export type MotionMessage =
  | { kind: "loaded"; samples: Int16Array }
  | { kind: "unavailable" }
  | { kind: "chunk"; chunk: BakeChunk };

self.onmessage = async ({ data }: MessageEvent<Request>) => {
  if (data.kind === "load") {
    try {
      const response = await fetch(`/motion/${encodeURIComponent(motionFilename(data.id))}`);
      if (!response.ok) throw Error("Motion file unavailable");
      let bytes = await response.arrayBuffer();
      // Some static hosts send Content-Encoding: gzip, others serve the raw gzip file.
      const header = new Uint8Array(bytes, 0, 2);
      if (header[0] === 0x1f && header[1] === 0x8b) {
        const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"));
        bytes = await new Response(stream).arrayBuffer();
      }
      const samples = unpackMotion(bytes, data.particles, data.frames);
      self.postMessage({ kind: "loaded", samples }, { transfer: [samples.buffer] });
    } catch {
      self.postMessage({ kind: "unavailable" });
    }
    return;
  }
  bake(
    data.knot,
    (chunk) =>
      self.postMessage(
        { kind: "chunk", chunk },
        { transfer: [chunk.frames.buffer, chunk.normals.buffer] },
      ),
    30,
    data.physics,
  );
};
