import { Link, useSearchParams } from "react-router";
import type { KnotDef } from "../../../engine/knots/types";
import { useIsClient } from "../../shared/hooks";
import { JOBS, KNOT_INFO, essentials } from "../../shared/knotInfo";
import { knotImagePath, knotPath } from "../../shared/site";
import { PlayIcon } from "../../shared/ui/icons";
import styles from "./grid.module.css";

const seconds = (s: number) => `${Math.round(s * 10) / 10} s`;

const normalize = (text: string) =>
  text
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

export function KnotGrid({ knots }: { knots: KnotDef[] }) {
  const [params, setParams] = useSearchParams();
  // Static HTML is shared by every query string. Apply filters after hydration.
  const isClient = useIsClient();
  const job = (isClient && params.get("job")) || "all";
  const query = (isClient && params.get("q")) || "";
  const selected = isClient && params.get("collection") === "essentials";
  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true, preventScrollReset: true });
  };
  const reset = () => {
    const next = new URLSearchParams(params);
    for (const key of ["job", "q", "collection"]) next.delete(key);
    setParams(next, { replace: true, preventScrollReset: true });
  };
  const words = normalize(query).split(" ");
  const visible = knots.filter((k) => {
    const info = KNOT_INFO[k.id];
    const text = normalize(
      [k.name, k.summary, info.type, info.aliases, info.line, ...info.uses].join(" "),
    );
    return (
      (!selected || essentials.has(k.id)) &&
      (job === "all" || info.job === job) &&
      words.every((w) => text.includes(w))
    );
  });
  return (
    <section aria-labelledby="catalog-heading" id="catalog">
      <div className={styles.toolbar}>
        <h2 id="catalog-heading">Knot library</h2>
        <input
          className={styles.search}
          type="search"
          aria-label="Search knots"
          placeholder="Search by name or use"
          value={query}
          onChange={(e) => update("q", e.target.value)}
        />
      </div>
      <div className={styles.collections} role="group" aria-label="Knot collection">
        <button type="button" aria-pressed={!selected} onClick={() => update("collection", "")}>
          All knots
        </button>
        <button
          type="button"
          aria-pressed={selected}
          onClick={() => update("collection", "essentials")}
        >
          {essentials.size} essentials
        </button>
      </div>
      <div className={styles.filters} role="group" aria-label="Filter by job">
        {JOBS.map(([id, label]) => (
          <button
            key={id}
            type="button"
            aria-pressed={job === id}
            onClick={() => update("job", id === "all" ? "" : id)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className={styles.results}>
        <span role="status">
          {visible.length === 0
            ? "No matching knots"
            : `${visible.length} ${visible.length === 1 ? "knot" : "knots"}`}
        </span>
        {(query || job !== "all" || selected) && (
          <button type="button" onClick={reset}>
            Clear filters
          </button>
        )}
      </div>
      <div className={styles.grid}>
        {visible.map((k) => (
          <Link key={k.id} to={knotPath(k.id)} className={styles.card}>
            <div className={styles.img}>
              <img
                src={knotImagePath(k.id)}
                alt={`${k.name}, finished`}
                width={1200}
                height={630}
                loading="lazy"
                decoding="async"
              />
              <span className={styles.badge}>
                <PlayIcon />
                {seconds(k.duration)}
              </span>
            </div>
            <div className={styles.body}>
              <h3>{k.name}</h3>
              <p>{KNOT_INFO[k.id].line}</p>
              <span className={styles.meta}>
                {KNOT_INFO[k.id].type} · {k.steps.length} steps
                {k.ropes.length > 1 ? ` · ${k.ropes.length} ropes` : ""}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
