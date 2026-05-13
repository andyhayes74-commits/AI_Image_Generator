import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const workflowPath = path.join(repoRoot, "n8n", "workflows", "01-master-job-controller.json");
const userFolder = fs.mkdtempSync(path.join(os.tmpdir(), "aiig-n8n-"));

try {
  execFileSync(
    "npx",
    ["-y", "n8n@2.20.6", "import:workflow", `--input=${workflowPath}`],
    {
      cwd: repoRoot,
      env: {
        ...process.env,
        N8N_USER_FOLDER: userFolder
      },
      stdio: "inherit"
    }
  );
  console.log("PASS n8n workflow imports cleanly.");
} finally {
  fs.rmSync(userFolder, { recursive: true, force: true });
}
