import { ipcRenderer } from "electron";
import '../themes/light/less/style.less';
import './app.jsx';

window.addEventListener("error", e =>
  ipcRenderer.send("ufo-log", { level: "error", args: ["[renderer error] " + String(e.error || e.message)] })
);
window.addEventListener("unhandledrejection", e =>
  ipcRenderer.send("ufo-log", { level: "error", args: ["[renderer unhandledrejection] " + String(e.reason)] })
);
