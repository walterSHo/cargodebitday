import assert from "node:assert/strict";
import fs from "node:fs";
const files=["index.html","calculator.html","np-form.html","storage-form.html"];
for (const f of files){ const html=fs.readFileSync(f,"utf8"); assert.match(html,/--sidebar-w|var\(--sidebar-w\)/,`${f} misses sidebar token usage`); assert.match(html,/var\(--menu-radius\)/,`${f} misses menu radius token`);}
console.log("ui consistency smoke passed:", files.length);
