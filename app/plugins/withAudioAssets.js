const { withDangerousMod } = require("expo/config-plugins");
const fs = require("fs");
const path = require("path");

const AUDIO_EXTENSIONS = /\.(mp3|wav|m4a|ogg)$/i;

function walk(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else files.push(full);
  }
  return files;
}

function sanitize(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function copyAudio(src, dest, prefix) {
  if (!fs.existsSync(src)) return;
  for (const file of walk(src)) {
    if (!AUDIO_EXTENSIONS.test(file)) continue;
    const relative = path.relative(src, file).replace(/\\/g, "/");
    const basename = relative.replace(/\.[^.]+$/, "");
    const extension = path.extname(file).toLowerCase();
    const resource = `${prefix}_${sanitize(basename)}`;
    fs.copyFileSync(file, path.join(dest, `${resource}${extension}`));
  }
}

module.exports = function withAudioAssets(config) {
  return withDangerousMod(config, [
    "android",
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const rawDir = path.join(
        config.modRequest.platformProjectRoot,
        "app/src/main/res/raw",
      );
      fs.mkdirSync(rawDir, { recursive: true });
      copyAudio(path.join(projectRoot, "content/audio"), rawDir, "frangolingo_audio");
      copyAudio(path.join(projectRoot, "assets/sfx"), rawDir, "frangolingo_sfx");
      return config;
    },
  ]);
};
