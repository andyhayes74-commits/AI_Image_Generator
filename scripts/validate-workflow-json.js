import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const workflowDir = path.resolve(__dirname, "..", "n8n", "workflows");
const files = fs.readdirSync(workflowDir).filter((file) => file.endsWith(".json")).sort();

if (files.length === 0) {
  throw new Error("No n8n workflow JSON files found.");
}

for (const file of files) {
  const workflow = JSON.parse(fs.readFileSync(path.join(workflowDir, file), "utf8"));
  const required = ["name", "nodes", "connections"];
  for (const key of required) {
    if (!(key in workflow)) {
      throw new Error(`${file} is missing required n8n workflow key: ${key}`);
    }
  }
  if (!Array.isArray(workflow.nodes) || workflow.nodes.length === 0) {
    throw new Error(`${file} must contain at least one node.`);
  }
  const serialized = JSON.stringify(workflow).toLowerCase();
  for (const forbidden of ["api_key", "apikey", "credentialid", "password", "sk-"]) {
    if (serialized.includes(forbidden)) {
      throw new Error(`${file} appears to contain credential-like content: ${forbidden}`);
    }
  }
  console.log(`PASS ${file}`);
}
