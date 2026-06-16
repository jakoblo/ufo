const { _electron: electron } = require("playwright");
const { test } = require("@playwright/test");
const { execSync } = require("child_process");
const path = require("path");

test("capture all console output and errors", async () => {
  const app = await electron.launch({
    args: [path.join(__dirname, "../.webpack/main/index.js")]
  });

  const win = await app.firstWindow();

  const logs = [];
  win.on("console", msg => {
    logs.push({ type: msg.type(), text: msg.text() });
  });
  win.on("pageerror", err => {
    logs.push({ type: "PAGEERROR", text: err.message + "\n" + err.stack });
  });

  // Wait for full React init
  await win.waitForFunction(() => typeof window.store !== "undefined", { timeout: 15000 })
    .catch(() => logs.push({ type: "TIMEOUT", text: "window.store never became defined" }));

  // Give async effects time to settle
  await win.waitForTimeout(3000);

  // Screenshot of current state
  await win.screenshot({ path: "e2e/screenshots/console-check.png" });

  // Try clicking a folder item to trigger content load
  const firstItem = win.locator(".nav-bar-item__text").first();
  const hasItem = await firstItem.count();
  if (hasItem > 0) {
    const label = await firstItem.textContent();
    console.log("Clicking folder:", label);
    await firstItem.click();
    await win.waitForTimeout(2000);
    await win.screenshot({ path: "e2e/screenshots/console-check-after-click.png" });
  }

  // Print all collected logs
  console.log("\n=== CONSOLE OUTPUT (" + logs.length + " messages) ===");
  const errors = logs.filter(l => l.type === "error" || l.type === "PAGEERROR");
  const warnings = logs.filter(l => l.type === "warning");
  const infos = logs.filter(l => l.type !== "error" && l.type !== "PAGEERROR" && l.type !== "warning");

  console.log("\n--- ERRORS (" + errors.length + ") ---");
  errors.forEach(l => console.log("[" + l.type + "]", l.text));

  console.log("\n--- WARNINGS (" + warnings.length + ") ---");
  warnings.forEach(l => console.log("[warn]", l.text));

  console.log("\n--- INFO/LOG (" + infos.length + ") ---");
  infos.forEach(l => console.log("[" + l.type + "]", l.text));

  const pid = app.process().pid;
  try { await Promise.race([app.evaluate(({ app }) => app.quit()), new Promise(r => setTimeout(r, 3000))]); } catch (_) {}
  try { execSync(`taskkill /F /T /PID ${pid}`, { stdio: "ignore" }); } catch (_) {}
});
