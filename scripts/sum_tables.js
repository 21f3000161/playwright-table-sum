import { chromium } from "playwright";

const urls = [
  "https://sanand0.github.io/tdsdata/js_table/?seed=8",
  "https://sanand0.github.io/tdsdata/js_table/?seed=9",
  "https://sanand0.github.io/tdsdata/js_table/?seed=10",
  "https://sanand0.github.io/tdsdata/js_table/?seed=11",
  "https://sanand0.github.io/tdsdata/js_table/?seed=12",
  "https://sanand0.github.io/tdsdata/js_table/?seed=13",
  "https://sanand0.github.io/tdsdata/js_table/?seed=14",
  "https://sanand0.github.io/tdsdata/js_table/?seed=15",
  "https://sanand0.github.io/tdsdata/js_table/?seed=16",
  "https://sanand0.github.io/tdsdata/js_table/?seed=17"
];

function extractNumbers(text) {
  const matches = text.match(/-?\d+(?:\.\d+)?/g);
  if (!matches) return [];
  return matches.map(Number).filter((n) => Number.isFinite(n));
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  let grandTotal = 0;

  for (const url of urls) {
    await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });

    // Wait for JS to render the table
    await page.waitForSelector("table", { timeout: 60000 });

    // Get all tables' text (if multiple)
    const tableTexts = await page.$$eval("table", (tables) =>
      tables.map((t) => t.innerText || "")
    );

    let pageTotal = 0;
    for (const t of tableTexts) {
      for (const n of extractNumbers(t)) pageTotal += n;
    }

    grandTotal += pageTotal;

    console.log(`URL: ${url}`);
    console.log(`Tables: ${tableTexts.length}`);
    console.log(`Page total: ${pageTotal}`);
    console.log("--------------------------------");
  }

  console.log("====================================");
  console.log(`FINAL GRAND TOTAL: ${grandTotal}`);
  console.log("====================================");

  await browser.close();
})();
