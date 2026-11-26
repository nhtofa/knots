import * as THREE from "three";
import type { KnotSession } from "../session";
import { PlaybackRope, yarnTexture } from "./playbackRope";
import { createPropMesh, createStage, type Stage } from "./stage";

export const NATURAL_ROPE = "#c39f6a";

/**
 * Draws a knot session on a canvas: owns the three.js stage and the render loop, ticks the
 * session's player and redraws only when the rope or the view changed. Show another session to
 * switch knots.
 */
export class KnotViewer {
  private readonly stage: Stage;
  private readonly yarn = yarnTexture();
  private readonly clock = new THREE.Timer();
  private session: KnotSession | null = null;
  private ropes: PlaybackRope[] = [];
  private props: THREE.Mesh[] = [];
  private firstDraw: (() => void) | null = null;
  /** Time of the frame the ropes show; NaN until the session's first frame is built. */
  private shownTime = NaN;

  constructor(canvas: HTMLCanvasElement) {
    this.stage = createStage(canvas, true);
    this.clock.connect(document);
    this.stage.renderer.setAnimationLoop((now) => this.frame(now));
  }

  /** Replaces what is shown; the previous session stays the caller's to dispose. */
  show(session: KnotSession, onFirstDraw?: () => void) {
    this.clear();
    this.session = session;
    this.firstDraw = onFirstDraw ?? null;
    const { knot, timeline } = session;
    this.ropes = knot.ropes.map((def, k) => {
      const mesh = new PlaybackRope(timeline.counts[k], def, this.yarn);
      this.stage.scene.add(mesh);
      return mesh;
    });
    this.props = (knot.props ?? []).map(createPropMesh);
    for (const prop of this.props) this.stage.scene.add(prop);
  }

  resetView() {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.stage.resetView(performance.now(), reduce);
  }

  isDefaultView = () => this.stage.isDefaultView();

  onViewChange = (listener: () => void) => this.stage.onViewChange(listener);

  dispose() {
    this.stage.renderer.setAnimationLoop(null);
    this.clear();
    this.clock.dispose();
    this.yarn.dispose();
    this.stage.dispose();
  }

  private frame(now: number) {
    this.clock.update(now);
    const session = this.session;
    let changed = false;
    if (session) {
      session.player.tick(this.clock.getDelta());
      const { timeline } = session;
      // Keep the last visible pose when a seek requests a frame still loading.
      const wanted = Math.min(session.player.getSnapshot().time, timeline.duration);
      const time =
        wanted <= timeline.ready ? wanted : Number.isFinite(this.shownTime) ? this.shownTime : 0;
      if (time !== this.shownTime) {
        this.shownTime = time;
        changed = true;
        const { positions, normals } = timeline.sample(time);
        let o = 0;
        this.ropes.forEach((rope, k) => {
          const end = o + timeline.counts[k] * 3;
          rope.update(positions.subarray(o, end), normals.subarray(o, end));
          o = end;
        });
      }
    }
    const drawn = this.stage.render(now, changed);
    if (session && drawn && this.firstDraw) {
      this.firstDraw();
      this.firstDraw = null;
    }
  }

  /** Removes the shown ropes and props and releases their geometry and materials. */
  private clear() {
    for (const object of [...this.ropes, ...this.props]) {
      this.stage.scene.remove(object);
      object.traverse((o) => {
        if (!(o instanceof THREE.Mesh)) return;
        o.geometry.dispose();
        for (const m of [o.material].flat()) m.dispose();
      });
    }
    this.ropes = [];
    this.props = [];
    this.session = null;
    this.shownTime = NaN;
  }
}
