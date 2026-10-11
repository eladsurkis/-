// Opens a Yad2 / Facebook listing in headless Chromium and saves what the
// routine needs to fill an apartment card: the page text and a screenshot.
//
// Usage: node scripts/fetch_listing.js <url> <outDir>
// Prints JSON: { ok, url, finalUrl, title, text, structured, screenshot, blocked, error }
const fs = require("fs");
const path = require("path");
let chromium;
try { ({ chromium } = require("playwright")); }
catch { ({ chromium } = require(path.join(require("child_process").execSync("npm root -g").toString().trim(), "playwright"))); }

const BLOCK_HINTS = [/captcha/i, /are you a human/i, /ShieldSquare/i, /radware/i, /log in to facebook|התחבר(ו)? לפייסבוק|כדי להמשיך.*פייסבוק/i, /You must log in/i];

(async () => {
  const [url, outDir = "."] = process.argv.slice(2);
  const out = { ok: false, url };
  if (!url) { out.error = "missing url"; console.log(JSON.stringify(out)); process.exit(1); }
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch(fs.existsSync("/opt/pw-browsers/chromium") ? { executablePath: "/opt/pw-browsers/chromium" } : {});
  try {
    const page = await browser.newPage({
      locale: "he-IL",
      viewport: { width: 430, height: 1400 },
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
    });
    const resp = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForTimeout(4000);
    // Close common cookie / login overlays so the screenshot shows the listing.
    for (const sel of ['[aria-label="Close"]', '[aria-label="סגירה"]', 'div[role="dialog"] [aria-label*="Close"]']) {
      const el = await page.$(sel); if (el) await el.click().catch(() => {});
    }
    out.status = resp ? resp.status() : null;
    out.finalUrl = page.url();
    out.title = await page.title();
    out.text = (await page.evaluate(() => document.body ? document.body.innerText : "")).replace(/\n{3,}/g, "\n\n").slice(0, 15000);
    // Yad2 is a Next.js site: the listing data usually sits in __NEXT_DATA__.
    out.structured = await page.evaluate(() => {
      const n = document.getElementById("__NEXT_DATA__");
      if (n) return n.textContent.slice(0, 40000);
      const ld = [...document.querySelectorAll('script[type="application/ld+json"]')].map(s => s.textContent).join("\n");
      return ld ? ld.slice(0, 20000) : null;
    });
    const og = await page.evaluate(() => Object.fromEntries([...document.querySelectorAll('meta[property^="og:"]')].map(m => [m.getAttribute("property"), m.getAttribute("content")])));
    out.og = og;
    const shot = path.join(outDir, "listing.jpg");
    await page.screenshot({ path: shot, type: "jpeg", quality: 80, fullPage: false });
    out.screenshot = shot;
    out.blocked = BLOCK_HINTS.some(r => r.test(out.title + "\n" + out.text.slice(0, 3000)));
    out.ok = !out.blocked && out.text.trim().length > 200;
  } catch (e) {
    out.error = String(e && e.message || e).slice(0, 500);
  } finally {
    await browser.close();
  }
  console.log(JSON.stringify(out));
})();
