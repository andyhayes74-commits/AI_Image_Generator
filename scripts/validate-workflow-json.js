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
  const nodeNames = new Set(workflow.nodes.map((node) => node.name));
  const requiredNodes = [
    "Client Submission Webhook",
    "Build Job State",
    "Mock Input Analysis",
    "Mock Research and Planning",
    "Mock Composition Blueprint",
    "Mock Generation and Validation",
    "Mock ImageManager Decision",
    "Validate ImageManager Decision",
    "Route ImageManager Decision",
    "Respond Final Result",
    "Respond Client Question"
  ];
  for (const nodeName of requiredNodes) {
    if (!nodeNames.has(nodeName)) {
      throw new Error(`${file} is missing required workflow node: ${nodeName}`);
    }
  }
  const validateNode = workflow.nodes.find((node) => node.name === "Validate ImageManager Decision");
  const validateCode = validateNode?.parameters?.jsCode ?? "";
  const requiredValidationSnippets = [
    "loop.attempt >= loop.max_attempts",
    "ask_client decision requires",
    "repair decisions require",
    "approve_final requires passing final validation evidence"
  ];
  for (const snippet of requiredValidationSnippets) {
    if (!validateCode.includes(snippet)) {
      throw new Error(`${file} ImageManager validation node is missing guard: ${snippet}`);
    }
  }
  const serialized = JSON.stringify(workflow).toLowerCase();
  for (const forbidden of ["api_key", "apikey", "credentialid", "password", "sk-"]) {
    if (serialized.includes(forbidden)) {
      throw new Error(`${file} appears to contain credential-like content: ${forbidden}`);
    }
  }
  console.log(`PASS ${file}`);
}
