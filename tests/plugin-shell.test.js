import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const pluginPath = path.resolve("plugin", "ai-image-generator.php");
const plugin = fs.readFileSync(pluginPath, "utf8");

test("WordPress plugin shell exposes required MVP surfaces", () => {
  assert.match(plugin, /Plugin Name:\s*AI Image Generator/);
  assert.match(plugin, /register_activation_hook/);
  assert.match(plugin, /register_post_type\(self::POST_TYPE/);
  assert.match(plugin, /add_menu_page/);
  assert.match(plugin, /register_rest_route\(self::REST_NAMESPACE, '\/jobs'/);
  assert.match(plugin, /register_rest_route\(self::REST_NAMESPACE, '\/questions\/\(\?P<job_id>\[\^\/\]\+\)\/answer'/);
  assert.match(plugin, /register_rest_route\(self::REST_NAMESPACE, '\/jobs\/\(\?P<job_id>\[\^\/\]\+\)\/rework'/);
  assert.match(plugin, /sanitize_textarea_field/);
  assert.match(plugin, /sanitize_text_field/);
  assert.match(plugin, /esc_html/);
  assert.doesNotMatch(plugin, /sk-[A-Za-z0-9]/);
});
