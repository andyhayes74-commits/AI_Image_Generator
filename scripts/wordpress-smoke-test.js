import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import fs from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const wpPath = process.env.WP_TEST_PATH ?? "/tmp/aiig-wp";
const schemaPath = path.join(repoRoot, "schemas", "client_submission.schema.json");

if (!fs.existsSync(wpPath)) {
  throw new Error(`WordPress test install not found at ${wpPath}. Set WP_TEST_PATH to a prepared WordPress path.`);
}

const php = `
wp_set_current_user(1);

$request = new WP_REST_Request('POST', '/ai-image-generator/v1/jobs');
$request->set_param('summary', 'Add a blender to the counter.');
$request->set_param('target_object', 'black blender');
$request->set_param('desired_scene_change', 'Place it near the socket.');
$request->set_param('constraints', 'Keep the kettle visible.');

$response = rest_do_request($request);

echo 'AIIG_JSON:' . wp_json_encode(array(
  'status' => $response->get_status(),
  'data' => $response->get_data(),
)) . "\n";
`;

const output = execFileSync(
  "wp",
  ["eval", php, `--path=${wpPath}`, "--allow-root"],
  { encoding: "utf8" }
);

const line = output.split(/\r?\n/).find((entry) => entry.startsWith("AIIG_JSON:"));
if (!line) {
  throw new Error(`WordPress smoke test did not return a parseable response.\n${output}`);
}

const result = JSON.parse(line.slice("AIIG_JSON:".length));
if (result.status !== 201) {
  throw new Error(`Expected WordPress REST status 201, got ${result.status}.`);
}

const packet = result.data?.packet;
if (!packet) {
  throw new Error("WordPress REST response did not include a client submission packet.");
}

const ajv = new Ajv2020({ allErrors: true, strict: true, strictRequired: false });
addFormats(ajv);
const validate = ajv.compile(JSON.parse(fs.readFileSync(schemaPath, "utf8")));

if (!validate(packet)) {
  throw new Error(`WordPress submission packet failed schema validation: ${ajv.errorsText(validate.errors)}`);
}

console.log(`PASS WordPress plugin created schema-valid submission ${packet.job_id}.`);
