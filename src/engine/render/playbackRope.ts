import * as THREE from "three";
import type { RopeDef } from "../knots/types";

const SIDES = 12;
const TAU = 2 * Math.PI;

/**
 * Sweep a three-lobed cross-section along the baked material frame. The grooves,
 * yarns and cuffs stay attached to the rope as it moves. Film rendering uses the
 * separate close-up mesh with individual fibres.
 */
export class PlaybackRope extends THREE.Mesh<THREE.BufferGeometry, THREE.MeshLambertMaterial> {
  private readonly shadowPosition: THREE.BufferAttribute;
  private readonly shadowColor: THREE.BufferAttribute;
  private readonly radius: number;
  private readonly section: Float32Array;
  private readonly t = new THREE.Vector3();
  private readonly normal = new THREE.Vector3();
  private readonly binormal = new THREE.Vector3();
  private readonly before = new THREE.Vector3();
  private readonly after = new THREE.Vector3();

  constructor(
    private readonly particles: number,
    rope: RopeDef,
    yarn: THREE.Texture,
  ) {
    const geometry = new THREE.BufferGeometry();
    super(geometry, new THREE.MeshLambertMaterial({ vertexColors: true, map: yarn }));
    const rings = particles;
    const width = SIDES + 1;
    const vertices = rings * width;
    this.section = new Float32Array(vertices * 4);
    const colors = new Float32Array(vertices * 3);
    const uv = new Float32Array(vertices * 2);
    const indices = [];
    const base = new THREE.Color(rope.color ?? "#c39f6a");
    const cuff = new THREE.Color("#918c83");
    for (let i = 0; i < rings; i++) {
      const s = (rope.length * i) / (rings - 1);
      const turns = s / (7 * rope.radius);
      const tip = Math.min(s, rope.length - s) < 1.25 * rope.radius;
      for (let j = 0; j <= SIDES; j++) {
        const v = i * width + j;
        const angle = (TAU * j) / SIDES;
        const twist = angle + TAU * turns;
        const ridge = Math.cos(3 * angle);
        const r = (tip ? 0.99 : 0.94 + 0.12 * ridge) * rope.radius;
        const slope = tip ? 0 : (-0.36 * Math.sin(3 * angle)) / (r / rope.radius);
        const cs = Math.cos(twist),
          sn = Math.sin(twist);
        const scale = 1 / Math.hypot(1, slope);
        this.section.set(
          [r * cs, r * sn, (cs + slope * sn) * scale, (sn - slope * cs) * scale],
          v * 4,
        );
        const shade = tip ? 1 : 0.85 + 0.15 * ridge;
        const color = tip ? cuff : base;
        colors.set([color.r * shade, color.g * shade, color.b * shade], v * 3);
        uv.set([turns, j / SIDES], v * 2);
        if (i + 1 < rings && j < SIDES)
          indices.push(v, v + 1, v + width, v + 1, v + width + 1, v + width);
      }
    }
    const last = (rings - 1) * width;
    for (let j = 1; j + 1 < SIDES; j++) indices.push(0, j + 1, j, last, last + j, last + j + 1);
    geometry.setIndex(indices);
    for (const name of ["position", "normal"]) {
      geometry.setAttribute(
        name,
        new THREE.BufferAttribute(new Float32Array(vertices * 3), 3).setUsage(
          THREE.DynamicDrawUsage,
        ),
      );
    }
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
    this.radius = rope.radius;
    // Project a soft contact shadow onto the table without drawing the whole
    // rope into a second camera. A raised section casts a wider, fainter shadow.
    const shadowGeometry = new THREE.BufferGeometry();
    const shadowIndex = [];
    for (let i = 0; i < rings - 1; i++)
      for (let j = 0; j < 2; j++) {
        const v = i * 3 + j;
        shadowIndex.push(v, v + 1, v + 3, v + 1, v + 4, v + 3);
      }
    shadowGeometry.setIndex(shadowIndex);
    this.shadowPosition = new THREE.BufferAttribute(new Float32Array(rings * 9), 3).setUsage(
      THREE.DynamicDrawUsage,
    );
    this.shadowColor = new THREE.BufferAttribute(new Float32Array(rings * 12).fill(1), 4).setUsage(
      THREE.DynamicDrawUsage,
    );
    shadowGeometry.setAttribute("position", this.shadowPosition);
    shadowGeometry.setAttribute("color", this.shadowColor);
    const shadow = new THREE.Mesh(
      shadowGeometry,
      new THREE.MeshBasicMaterial({
        color: "#785c43",
        vertexColors: true,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    );
    shadow.frustumCulled = false;
    shadow.renderOrder = -1;
    this.add(shadow);
    this.frustumCulled = false;
  }

  update(p: Float32Array, materialNormals: Float32Array) {
    const position = this.geometry.getAttribute("position") as THREE.BufferAttribute;
    const surface = this.geometry.getAttribute("normal") as THREE.BufferAttribute;
    const { t, normal, binormal, section } = this;
    let v = 0;
    for (let i = 0; i < this.particles; i++) {
      this.before.fromArray(p, Math.max(0, i - 1) * 3);
      this.after.fromArray(p, Math.min(this.particles - 1, i + 1) * 3);
      t.subVectors(this.after, this.before).normalize();
      const height = Math.max(0, p[i * 3 + 1]);
      const spread = (1.5 * this.radius + height * 0.15) / (Math.hypot(t.x, t.z) || 1);
      for (let side = -1; side <= 1; side++) {
        const v = i * 3 + side + 1;
        this.shadowPosition.setXYZ(
          v,
          p[i * 3] + 0.24 * height + side * t.z * spread,
          0,
          p[i * 3 + 2] - 0.28 * height - side * t.x * spread,
        );
        this.shadowColor.setW(v, side === 0 ? 0.24 / (1 + height / (4 * this.radius)) : 0);
      }
      normal.fromArray(materialNormals, i * 3);
      binormal.crossVectors(t, normal).normalize();
      normal.crossVectors(binormal, t);
      for (let j = 0; j <= SIDES; j++, v++) {
        const k = v * 4;
        const a = section[k],
          b = section[k + 1],
          c = section[k + 2],
          d = section[k + 3];
        position.setXYZ(
          v,
          p[i * 3] + a * normal.x + b * binormal.x,
          p[i * 3 + 1] + a * normal.y + b * binormal.y,
          p[i * 3 + 2] + a * normal.z + b * binormal.z,
        );
        surface.setXYZ(
          v,
          c * normal.x + d * binormal.x,
          c * normal.y + d * binormal.y,
          c * normal.z + d * binormal.z,
        );
      }
    }
    this.shadowColor.needsUpdate = this.shadowPosition.needsUpdate = true;
    position.needsUpdate = surface.needsUpdate = true;
  }
}

/** A seamless yarn pattern shared by every strand colour in the viewer. */
export function yarnTexture() {
  const size = 128;
  const bytes = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) {
      const yarn = (TAU * (12 * y - 9 * x)) / size;
      const value = Math.round(
        233 + 13 * Math.sin(yarn) + 7 * Math.cos(3 * yarn + (TAU * x) / size),
      );
      bytes.set([value, value, value, 255], (y * size + x) * 4);
    }
  const texture = new THREE.DataTexture(bytes, size, size);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.generateMipmaps = texture.needsUpdate = true;
  return texture;
}
