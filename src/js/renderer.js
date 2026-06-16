import { ipcRenderer } from "electron";
import '../themes/light/less/style.less';
import './app.jsx';

// Capture phase runs before webpack-dev-server's bubble-phase overlay listener,
// so we can silently swallow this benign browser notice before it shows as an overlay.
window.addEventListener("error", e => {
  if (e.message === "ResizeObserver loop limit exceeded") {
    e.stopImmediatePropagation();
    return;
  }
  ipcRenderer.send("ufo-log", { level: "error", args: ["[renderer error] " + String(e.error || e.message)] });
}, true);

window.addEventListener("unhandledrejection", e =>
  ipcRenderer.send("ufo-log", { level: "error", args: ["[renderer unhandledrejection] " + String(e.reason)] })
);
