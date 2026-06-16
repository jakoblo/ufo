// @flow

/**
 * @file Central logger setup for the main process.
 * Writes a single persistent log file combining main process,
 * renderer console and Redux action logs via IPC relay.
 */

import log from "electron-log";
import { app, ipcMain } from "electron";
import path from "path";

// resolvePath is called lazily on first write (after app is ready)
log.transports.file.resolvePath = () =>
  path.join(app.getPath("userData"), "logs", "ufo.log");
log.transports.file.level = "debug";
log.transports.file.format =
  "[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}";

log.catchErrors({ log });

// Route existing console.* calls in the main process into the log file
Object.assign(console, log.functions);

// Receive log messages forwarded from the renderer process
ipcMain.on("ufo-log", (_, { level, args }) => {
  log[level] ? log[level]("[renderer]", ...args) : log.info("[renderer]", ...args);
});

// Print the log path to stdout once the app is ready (lazy because getPath needs ready)
app.once("ready", () => {
  const logFilePath = path.join(app.getPath("userData"), "logs", "ufo.log");
  process.stdout.write(`[ufo] log file: ${logFilePath}\n`);
});

export default log;
