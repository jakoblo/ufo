//@flow

export const chromeImageSuffixes = [
  ".jpg",
  ".gif",
  ".png",
  ".webp",
  ".apng",
  ".svg",
  ".bmp",
  ".ico"
];

export const FILE_ICON_TYPES = {
  IMAGE: [".tiff", ".psd", ".afdesign", ".bmp", ".eps", ...chromeImageSuffixes],
  DOCUMENT: [
    ".txt",
    ".rtf",
    ".doc",
    ".docm",
    ".docx",
    ".eml",
    ".emlx",
    ".pages",
    ".md",
    ".readme",
    ".rtf",
    ".rtx",
    ".ott",
    ".odt"
  ],
  PDF: [".pdf", ".ai"],
  CODE: [
    ".html",
    ".code",
    ".js",
    ".jsx",
    ".css",
    ".less",
    ".sass",
    ".",
    ".php",
    ".py",
    ".python",
    ".coffee",
    ".applescript",
    ".bat",
    ".sh",
    ".rb",
    ".pl"
  ],
  ZIP: [".7z", ".zip", ".apk", ".gzip", ".jar", ".rar", ".tar"],
  VIDEO: [".mov", ".mpeg", ".avi", ".webm", ".wmv", ".ogg"],
  AUDIO: [".mp3", ".wma", ".aac", ".wav"]
};
