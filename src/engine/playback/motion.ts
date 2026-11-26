// Each 60 Hz frame contains all XYZ positions, then the material normals in the
// same order. Delta encoding across frames makes slow-moving rope compress well.
export const POSITION_SCALE = 4096;
export const NORMAL_SCALE = 32767;

export function encodeMotionChunk(
  target: Int16Array,
  previous: Int16Array,
  start: number,
  positions: Float32Array,
  normals: Float32Array,
) {
  const stride = previous.length / 2;
  let index = start * previous.length;
  for (let i = 0; i < positions.length; i += stride) {
    for (let k = 0; k < stride; k++) {
      const p = Math.round(positions[i + k] * POSITION_SCALE);
      if (p < -32768 || p > 32767) throw Error("Rope position exceeds motion file range");
      const n = Math.round(normals[i + k] * NORMAL_SCALE);
      target[index + k] = p - previous[k];
      target[index + stride + k] = n - previous[stride + k];
      previous[k] = p;
      previous[stride + k] = n;
    }
    index += previous.length;
  }
}

export function unpackMotion(bytes: ArrayBuffer, particles: number, frames: number) {
  const stride = particles * 6;
  if (bytes.byteLength !== frames * stride * 2) throw Error("Unexpected knot motion file size");
  const samples = new Int16Array(bytes);
  for (let i = stride; i < samples.length; i++) samples[i] += samples[i - stride];
  return samples;
}
