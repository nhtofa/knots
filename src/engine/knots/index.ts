import { sheetBend } from "./sheet-bend";
import { larksHead } from "./larks-head";
import { doubleOverhand } from "./double-overhand";
import { halfHitch } from "./half-hitch";
import { twoHalfHitches } from "./two-half-hitches";
import { roundTurn } from "./round-turn";
import { tautLine } from "./taut-line";
import { timberHitch } from "./timber-hitch";
import { cleatHitch } from "./cleat-hitch";
import { constrictor } from "./constrictor";
import { fishermansKnot } from "./fishermans-knot";
import { doubleFishermans } from "./double-fishermans";
import { overhandLoop } from "./overhand-loop";
import { figureEightLoop } from "./figure-eight-loop";
import { doubleSheetBend } from "./double-sheet-bend";
import { anchorHitch } from "./anchor-hitch";
import { rollingHitch } from "./rolling-hitch";
import { improvedClinch } from "./improved-clinch";
import { truckersHitch } from "./truckers-hitch";
import { flemishBend } from "./flemish-bend";
import { bowline } from "./bowline";
import { cloveHitch } from "./clove-hitch";
import { daisyChain } from "./daisy-chain";
import { figureEight } from "./figure-eight";
import { overhand } from "./overhand";
import { poachersKnot } from "./poachers-knot";
import { slipKnot } from "./slip-knot";
import { squareKnot } from "./square-knot";
import type { KnotDef } from "./types";
import { zeppelin } from "./zeppelin";

/** Every knot in the app, in menu order. Add new knots here. */
export const knots: KnotDef[] = [
  overhand,
  slipKnot,
  figureEight,
  bowline,
  cloveHitch,
  zeppelin,
  squareKnot,
  poachersKnot,
  daisyChain,
  sheetBend,
  larksHead,
  doubleOverhand,
  halfHitch,
  twoHalfHitches,
  roundTurn,
  tautLine,
  timberHitch,
  cleatHitch,
  constrictor,
  fishermansKnot,
  doubleFishermans,
  overhandLoop,
  figureEightLoop,
  doubleSheetBend,
  anchorHitch,
  rollingHitch,
  improvedClinch,
  truckersHitch,
  flemishBend,
];
