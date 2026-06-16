const { _electron: electron } = require("playwright");
const { test, expect } = require("@playwright/test");
const { execSync } = require("child_process");
const path = require("path");

let electronApp;

test.beforeAll(async () => {
  electronApp = await electron.launch({
    args: [path.join(__dirname, "../.webpack/main/index.js")]
  });
});

test.afterAll(async () => {
  if (!electronApp) return;
  const pid = electronApp.process().pid;
  try {
    // Give app.quit() 3 s, then hard-kill if it hangs (Electron 13 quirk)
    await Promise.race([
      electronApp.evaluate(({ app }) => app.quit()),
      new Promise(r => setTimeout(r, 3000))
    ]);
  } catch (_) {}
  try { execSync(`taskkill /F /T /PID ${pid}`, { stdio: "ignore" }); } catch (_) {}
});

test("app launches and shows main window", async () => {
  const window = await electronApp.firstWindow();
  await window.waitForLoadState("domcontentloaded");

  const title = await window.title();
  console.log("Window title:", title);
  expect(title).toBe("ufo");

  await expect(window.locator("#app")).toBeVisible({ timeout: 10000 });

  await window.screenshot({ path: "e2e/screenshots/launch.png" });

  const state = await window.evaluate(() => window.store.getState());
  console.log("Redux state keys:", Object.keys(state));
  expect(Object.keys(state).length).toBeGreaterThan(0);
});
