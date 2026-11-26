// Hashes of every knot's baked positions. A refactor must leave them unchanged; a deliberate change
// to a knot or to the physics updates its hash here (the failure message prints the new one).
export const FINGERPRINTS: Record<string, string> = {
  overhand: "6fa9fda654de",
  "slip-knot": "d0d933bace65",
  "figure-eight": "815fa7a4f198",
  bowline: "edc1585db70c",
  "clove-hitch": "e47109ab703c",
  zeppelin: "1d60633c1b56",
  "square-knot": "5ad8a78873cf",
  "poachers-knot": "e896f68b2854",
  "daisy-chain": "58a16779bccd",
  "sheet-bend": "134f4f669d2b",
  "larks-head": "e3a3c4d6a964",
  "double-overhand": "4756139150ec",
  "half-hitch": "d8c2e522041f",
  "two-half-hitches": "d1360417177d",
  "round-turn": "eb2baa13e0ec",
  "taut-line": "0946b462279d",
  "timber-hitch": "5c34d1a9882c",
  "cleat-hitch": "e8e44be28493",
  constrictor: "638c9525967b",
  "fishermans-knot": "7a60461ea522",
  "double-fishermans": "e7ae1f657a37",
  "overhand-loop": "cef87817999e",
  "figure-eight-loop": "ceb86868211a",
  "double-sheet-bend": "837eeb3c2639",
  "anchor-hitch": "837462621819",
  "rolling-hitch": "06c229d2f379",
  "improved-clinch": "7230cc7ad7c2",
  "truckers-hitch": "78be7465a742",
  "flemish-bend": "0f1e8ec46ff8",
};

/** A changed simulation gets a new URL when an existing lesson is updated. */
export const motionFilename = (id: string) => `${id}.${FINGERPRINTS[id]}.v1.bin.gz`;
