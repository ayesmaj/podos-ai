/**
 * inspect-glb.mjs — quick stats on a GLB file's JSON chunk:
 *   - file size + JSON chunk size
 *   - whether textures are embedded or external (uri vs bufferView)
 *   - mesh bounding box (model-local, before node transforms)
 *   - per-buffer sizes
 *
 * Usage: node scripts/inspect-glb.mjs path/to/file.glb
 *
 * Why we need this: dropping a Meshy GLB into a Three.js scene can fail
 * silently if textures are externally referenced (the .bin file isn't
 * shipped) or if the model is so far off-origin that it disappears
 * outside the camera frustum. Reading the JSON chunk manually is faster
 * than booting Three.js + react-three-fiber to debug.
 */
import fs from "node:fs";

const path = process.argv[2];
if (!path) {
  console.error("Usage: node scripts/inspect-glb.mjs <path-to-glb>");
  process.exit(1);
}

const buf = fs.readFileSync(path);
const magic = buf.readUInt32LE(0);
const version = buf.readUInt32LE(4);
const fileLen = buf.readUInt32LE(8);
const jsonChunkLen = buf.readUInt32LE(12);
const jsonStr = buf.slice(20, 20 + jsonChunkLen).toString("utf8");
const json = JSON.parse(jsonStr);

console.log("file:", path);
console.log("  magic OK?", magic === 0x46546c67);
console.log("  version:", version);
console.log("  file length:", fileLen, "(", (fileLen / 1048576).toFixed(2), "MB )");
console.log("  JSON chunk length:", jsonChunkLen, "(", (jsonChunkLen / 1024).toFixed(1), "KB )");
console.log("");
console.log("  scenes:", json.scenes?.length, "nodes:", json.nodes?.length, "meshes:", json.meshes?.length);
console.log("  materials:", json.materials?.length, "textures:", json.textures?.length, "images:", json.images?.length);

if (json.images?.length) {
  console.log("");
  console.log("  === IMAGES ===");
  json.images.forEach((img, i) => {
    if (img.uri) console.log(`    [${i}] EXTERNAL uri: ${img.uri}`);
    else if (img.bufferView !== undefined) console.log(`    [${i}] EMBEDDED bufferView=${img.bufferView} mime=${img.mimeType}`);
    else console.log(`    [${i}] (unknown source)`);
  });
}

if (json.buffers?.length) {
  console.log("");
  console.log("  === BUFFERS ===");
  json.buffers.forEach((b, i) => {
    console.log(`    [${i}] uri=${b.uri ?? "(self/embedded)"}, ${(b.byteLength / 1048576).toFixed(2)} MB`);
  });
}

if (json.accessors && json.meshes) {
  let gMin = [Infinity, Infinity, Infinity];
  let gMax = [-Infinity, -Infinity, -Infinity];
  json.meshes.forEach((mesh) => {
    mesh.primitives?.forEach((p) => {
      const posAccIdx = p.attributes?.POSITION;
      if (posAccIdx === undefined) return;
      const acc = json.accessors[posAccIdx];
      if (!acc?.min || !acc?.max) return;
      for (let k = 0; k < 3; k++) {
        if (acc.min[k] < gMin[k]) gMin[k] = acc.min[k];
        if (acc.max[k] > gMax[k]) gMax[k] = acc.max[k];
      }
    });
  });
  console.log("");
  console.log("  === MESH BOUNDS (local) ===");
  console.log("    min:", gMin.map((x) => x.toFixed(3)));
  console.log("    max:", gMax.map((x) => x.toFixed(3)));
  console.log("    size:", gMin.map((_, k) => (gMax[k] - gMin[k]).toFixed(3)));
}
