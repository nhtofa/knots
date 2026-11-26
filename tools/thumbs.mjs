// Run against the dev server or a served production build. Pass --knot=id,id
// to capture only part of the catalog. Each JPEG comes from the real viewer.
import { mkdirSync } from "node:fs";
import { chromium } from "@playwright/test";

const args = process.argv.slice(2);
const base = args.find((a) => !a.startsWith("--")) ?? "http://localhost:5173";
const requested = args
  .find((a) => a.startsWith("--knot="))
  ?.slice(7)
  .split(",");
const out = new URL("../public/og/", import.meta.url);
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ headless: !args.includes("--headed") });
// The camera scales with viewport height. Frame a wider view for knots with an eye or a long chain.
const heights = {
  "daisy-chain": 425,
  "truckers-hitch": 520,
  "figure-eight-loop": 440,
  "flemish-bend": 495,
  "overhand-loop": 440,
  "larks-head": 850,
  "sheet-bend": 930,
  "double-overhand": 870,
  "improved-clinch": 760,
};
try {
  const index = await browser.newPage();
  await index.goto(base, { waitUntil: "domcontentloaded" });
  const cards = index.locator('#catalog a[href^="/knots/"]');
  await cards.first().waitFor();
  const ids = await cards.evaluateAll((links) =>
    links.map((a) => new URL(a.href).pathname.split("/")[2]),
  );
  await index.close();
  const selected = requested ?? ids;
  for (const id of selected) {
    if (!ids.includes(id)) throw Error(`Unknown knot: ${id}`);
    const page = await browser.newPage({
      viewport: { width: 450, height: 360 },
      deviceScaleFactor: 2,
      reducedMotion: "reduce",
    });
    try {
      await page.goto(`${base}/knots/${id}/`, { waitUntil: "domcontentloaded" });
      await page.locator("[data-baked=true]").waitFor({ timeout: 120_000 });
      const timeline = page.getByRole("slider", { name: "Timeline" });
      await timeline.press("End");
      await page.waitForFunction(() => {
        const input = document.querySelector('input[aria-label="Timeline"]');
        return input && Number(input.value) >= Number(input.max) - 0.011;
      });
      await page
        .locator("canvas")
        .evaluate((c) => c.parentElement.setAttribute("data-capture", ""));
      await page.addStyleTag({
        content: `body * {visibility:hidden!important} [data-capture] {position:fixed!important; inset:0!important; width:100vw!important; height:100vh!important; max-height:none!important; border-radius:0!important; z-index:9999} canvas {visibility:visible!important}`,
      });
      const width = 1000,
        height = heights[id] ?? 700;
      await page.setViewportSize({ width, height });
      await page.evaluate(() => {
        window.scrollTo(0, 0);
        return new Promise((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(resolve)),
        );
      });
      const path = new URL(`${id}.jpg`, out).pathname;
      await page.screenshot({
        path,
        type: "jpeg",
        quality: 85,
        timeout: 120_000,
        clip: {
          x:
            (width - 600) / 2 +
            (["overhand-loop", "figure-eight-loop", "double-overhand"].includes(id) ? 45 : 0),
          y:
            Math.round((height - 315) / 2) -
            (["figure-eight-loop", "flemish-bend", "double-overhand"].includes(id) ? 24 : 0),
          width: 600,
          height: 315,
        },
      });
      console.log(path);
    } finally {
      await page.close();
    }
  }
} finally {
  await browser.close();
}
