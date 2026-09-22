const fs = require('fs');
const path = require('path');

const inputPath = path.resolve(__dirname, '../node_modules/pdf-parse/dist/worker/esm/index.js');
const outputPath = path.resolve(__dirname, '../src/nodes/io/workerData.ts');

const content = fs.readFileSync(inputPath, 'utf-8');

const startMarker = 'var pdf_worker_min_default = "';
let startIdx = content.indexOf(startMarker);

if (startIdx === -1) {
    console.error('Could not find worker data in pdf-parse');
    process.exit(1);
}

startIdx += startMarker.length;
const endIdx = content.indexOf('";\n', startIdx);

const base64Str = content.substring(startIdx, endIdx);

fs.writeFileSync(outputPath, `export const workerData = "${base64Str}";\n`, 'utf-8');
