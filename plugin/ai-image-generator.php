<?php
/**
 * Plugin Name: AI Image Generator
 * Description: Scene-aware AI image integration intake and result portal.
 * Version: 1.0.0
 * Author: AI Image Generator
 * Text Domain: ai-image-generator
 */

if (!defined('ABSPATH')) {
    exit;
}

final class AI_Image_Generator_Plugin
{
    private const OPTION_WEBHOOK_URL = 'aiig_n8n_webhook_url';
    private const OPTION_WEBHOOK_SECRET = 'aiig_n8n_webhook_secret';
    private const POST_TYPE = 'aiig_job';
    private const REST_NAMESPACE = 'ai-image-generator/v1';

    public static function init(): void
    {
        add_action('init', [__CLASS__, 'register_job_post_type']);
        add_action('admin_menu', [__CLASS__, 'register_admin_menu']);
        add_action('admin_init', [__CLASS__, 'register_settings']);
        add_action('rest_api_init', [__CLASS__, 'register_rest_routes']);
        add_shortcode('ai_image_generator_form', [__CLASS__, 'render_submission_form']);
        add_shortcode('ai_image_generator_jobs', [__CLASS__, 'render_job_status_list']);
    }

    public static function activate(): void
    {
        self::register_job_post_type();
        flush_rewrite_rules();
    }

    public static function deactivate(): void
    {
        flush_rewrite_rules();
    }

    public static function register_job_post_type(): void
    {
        register_post_type(self::POST_TYPE, [
            'labels' => [
                'name' => __('AI Image Jobs', 'ai-image-generator'),
                'singular_name' => __('AI Image Job', 'ai-image-generator'),
            ],
            'public' => false,
            'show_ui' => true,
            'show_in_menu' => 'ai-image-generator',
            'supports' => ['title'],
            'capability_type' => 'post',
        ]);
    }

    public static function register_admin_menu(): void
    {
        add_menu_page(
            __('AI Image Generator', 'ai-image-generator'),
            __('AI Images', 'ai-image-generator'),
            'manage_options',
            'ai-image-generator',
            [__CLASS__, 'render_settings_page'],
            'dashicons-format-image'
        );
    }

    public static function register_settings(): void
    {
        register_setting('aiig_settings', self::OPTION_WEBHOOK_URL, [
            'type' => 'string',
            'sanitize_callback' => 'esc_url_raw',
            'default' => '',
        ]);

        register_setting('aiig_settings', self::OPTION_WEBHOOK_SECRET, [
            'type' => 'string',
            'sanitize_callback' => [__CLASS__, 'sanitize_secret'],
            'default' => '',
        ]);
    }

    public static function sanitize_secret($value): string
    {
        return sanitize_text_field((string) $value);
    }

    public static function register_rest_routes(): void
    {
        register_rest_route(self::REST_NAMESPACE, '/jobs', [
            'methods' => 'POST',
            'callback' => [__CLASS__, 'handle_job_submission'],
            'permission_callback' => [__CLASS__, 'can_submit_job'],
            'args' => [
                'summary' => ['required' => true],
                'target_object' => ['required' => true],
                'desired_scene_change' => ['required' => true],
            ],
        ]);

        register_rest_route(self::REST_NAMESPACE, '/questions/(?P<job_id>[^/]+)/answer', [
            'methods' => 'POST',
            'callback' => [__CLASS__, 'handle_client_answer'],
            'permission_callback' => [__CLASS__, 'can_update_job'],
        ]);

        register_rest_route(self::REST_NAMESPACE, '/jobs/(?P<job_id>[^/]+)/rework', [
            'methods' => 'POST',
            'callback' => [__CLASS__, 'handle_rework_request'],
            'permission_callback' => [__CLASS__, 'can_update_job'],
        ]);
    }

    public static function can_submit_job(WP_REST_Request $request): bool
    {
        if (current_user_can('upload_files')) {
            return true;
        }

        $nonce = $request->get_header('X-WP-Nonce');
        return is_string($nonce) && wp_verify_nonce($nonce, 'wp_rest');
    }

    public static function can_update_job(WP_REST_Request $request): bool
    {
        if (current_user_can('edit_posts')) {
            return true;
        }

        $nonce = $request->get_header('X-WP-Nonce');
        return is_string($nonce) && wp_verify_nonce($nonce, 'wp_rest');
    }

    public static function render_settings_page(): void
    {
        if (!current_user_can('manage_options')) {
            return;
        }
        ?>
        <div class="wrap">
            <h1><?php echo esc_html__('AI Image Generator', 'ai-image-generator'); ?></h1>
            <form method="post" action="options.php">
                <?php settings_fields('aiig_settings'); ?>
                <table class="form-table" role="presentation">
                    <tr>
                        <th scope="row"><label for="<?php echo esc_attr(self::OPTION_WEBHOOK_URL); ?>"><?php echo esc_html__('n8n Webhook URL', 'ai-image-generator'); ?></label></th>
                        <td><input class="regular-text" type="url" id="<?php echo esc_attr(self::OPTION_WEBHOOK_URL); ?>" name="<?php echo esc_attr(self::OPTION_WEBHOOK_URL); ?>" value="<?php echo esc_attr(get_option(self::OPTION_WEBHOOK_URL, '')); ?>"></td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="<?php echo esc_attr(self::OPTION_WEBHOOK_SECRET); ?>"><?php echo esc_html__('Webhook Secret', 'ai-image-generator'); ?></label></th>
                        <td><input class="regular-text" type="password" id="<?php echo esc_attr(self::OPTION_WEBHOOK_SECRET); ?>" name="<?php echo esc_attr(self::OPTION_WEBHOOK_SECRET); ?>" value=""></td>
                    </tr>
                </table>
                <?php submit_button(); ?>
            </form>
            <h2><?php echo esc_html__('Submit Test Job', 'ai-image-generator'); ?></h2>
            <?php echo self::render_submission_form(); ?>
            <h2><?php echo esc_html__('Recent Jobs', 'ai-image-generator'); ?></h2>
            <?php echo self::render_job_status_list(); ?>
            <?php echo self::render_admin_job_detail(); ?>
        </div>
        <?php
    }

    public static function render_submission_form(): string
    {
        $rest_url = esc_url_raw(rest_url(self::REST_NAMESPACE . '/jobs'));
        ob_start();
        ?>
        <form class="aiig-form" method="post" enctype="multipart/form-data" action="<?php echo esc_url($rest_url); ?>">
            <?php wp_nonce_field('wp_rest'); ?>
            <p><label><?php echo esc_html__('Brief summary', 'ai-image-generator'); ?><br><textarea name="summary" required></textarea></label></p>
            <p><label><?php echo esc_html__('Target object', 'ai-image-generator'); ?><br><input type="text" name="target_object" required></label></p>
            <p><label><?php echo esc_html__('Desired scene change', 'ai-image-generator'); ?><br><textarea name="desired_scene_change" required></textarea></label></p>
            <p><label><?php echo esc_html__('Constraints', 'ai-image-generator'); ?><br><textarea name="constraints"></textarea></label></p>
            <p><label><?php echo esc_html__('Scene image', 'ai-image-generator'); ?><br><input type="file" name="scene_image" accept="image/*"></label></p>
            <p><label><?php echo esc_html__('Object reference', 'ai-image-generator'); ?><br><input type="file" name="object_reference" accept="image/*"></label></p>
            <p><label><?php echo esc_html__('Sketch, annotation, or manual', 'ai-image-generator'); ?><br><input type="file" name="supporting_file" accept="image/*,application/pdf,text/plain"></label></p>
            <p><button type="submit"><?php echo esc_html__('Submit job', 'ai-image-generator'); ?></button></p>
        </form>
        <?php
        return (string) ob_get_clean();
    }

    public static function render_job_status_list(): string
    {
        $jobs = get_posts([
            'post_type' => self::POST_TYPE,
            'post_status' => 'any',
            'numberposts' => 10,
            'orderby' => 'date',
            'order' => 'DESC',
        ]);

        if (empty($jobs)) {
            return '<p>' . esc_html__('No jobs yet.', 'ai-image-generator') . '</p>';
        }

        $output = '<table class="widefat striped"><thead><tr><th>' . esc_html__('Job', 'ai-image-generator') . '</th><th>' . esc_html__('Status', 'ai-image-generator') . '</th></tr></thead><tbody>';
        foreach ($jobs as $job) {
            $status = get_post_meta($job->ID, '_aiig_status', true) ?: 'submitted';
            $output .= '<tr><td>' . esc_html($job->post_title) . '</td><td>' . esc_html($status) . '</td></tr>';
        }
        $output .= '</tbody></table>';

        return $output;
    }

    private static function render_admin_job_detail(): string
    {
        $job_id = isset($_GET['aiig_job_id']) ? absint($_GET['aiig_job_id']) : 0;
        if ($job_id <= 0 || get_post_type($job_id) !== self::POST_TYPE) {
            return '';
        }

        $submission = self::decode_meta_json($job_id, '_aiig_submission_packet');
        $questions = self::decode_meta_json($job_id, '_aiig_client_questions');
        $answers = self::decode_meta_json($job_id, '_aiig_client_answers');
        $reworks = self::decode_meta_json($job_id, '_aiig_rework_requests');
        $finals = self::decode_meta_json($job_id, '_aiig_final_results');

        ob_start();
        ?>
        <hr>
        <h2><?php echo esc_html__('Job Detail', 'ai-image-generator'); ?></h2>
        <?php echo self::render_packet_block(__('Submission Packet', 'ai-image-generator'), $submission); ?>
        <?php echo self::render_packet_block(__('Questions', 'ai-image-generator'), $questions); ?>
        <?php echo self::render_packet_block(__('Answers', 'ai-image-generator'), $answers); ?>
        <?php echo self::render_packet_block(__('Rework Requests', 'ai-image-generator'), $reworks); ?>
        <?php echo self::render_final_results($finals); ?>
        <?php
        return (string) ob_get_clean();
    }

    private static function render_packet_block(string $title, $packet): string
    {
        return '<h3>' . esc_html($title) . '</h3><pre>' . esc_html(wp_json_encode($packet, JSON_PRETTY_PRINT)) . '</pre>';
    }

    private static function render_final_results($finals): string
    {
        if (!is_array($finals) || empty($finals)) {
            return '<h3>' . esc_html__('Final Outputs', 'ai-image-generator') . '</h3><p>' . esc_html__('No final outputs yet.', 'ai-image-generator') . '</p>';
        }

        $output = '<h3>' . esc_html__('Final Outputs', 'ai-image-generator') . '</h3><div class="aiig-final-results">';
        foreach ($finals as $final) {
            $image = $final['image'] ?? [];
            $uri = isset($image['uri']) ? esc_url($image['uri']) : '';
            $version = isset($final['version']) ? absint($final['version']) : 0;
            $output .= '<figure>';
            if ($uri !== '') {
                $output .= '<img src="' . $uri . '" alt="' . esc_attr(sprintf(__('AI image result version %d', 'ai-image-generator'), $version)) . '" style="max-width:320px;height:auto;">';
            }
            $output .= '<figcaption>' . esc_html(sprintf(__('Version %d: %s', 'ai-image-generator'), $version, $final['status'] ?? 'unknown')) . '</figcaption>';
            $output .= '</figure>';
        }
        $output .= '</div>';

        return $output;
    }

    public static function handle_job_submission(WP_REST_Request $request): WP_REST_Response
    {
        $packet = self::build_submission_packet($request);
        $post_id = wp_insert_post([
            'post_type' => self::POST_TYPE,
            'post_status' => 'publish',
            'post_title' => $packet['job_id'],
        ]);

        if (is_wp_error($post_id)) {
            return new WP_REST_Response(['error' => 'job_storage_failed'], 500);
        }

        update_post_meta($post_id, '_aiig_status', 'submitted');
        update_post_meta($post_id, '_aiig_submission_packet', wp_json_encode($packet));

        $handoff = self::send_to_n8n($packet);
        if ($handoff['sent']) {
            update_post_meta($post_id, '_aiig_status', 'intake_analysis');
        }

        return new WP_REST_Response([
            'job_id' => $packet['job_id'],
            'status' => get_post_meta($post_id, '_aiig_status', true),
            'packet' => $packet,
            'handoff' => $handoff,
        ], 201);
    }

    public static function handle_client_answer(WP_REST_Request $request): WP_REST_Response
    {
        $job_id = sanitize_text_field((string) $request['job_id']);
        $answer = sanitize_text_field((string) $request->get_param('answer'));
        $packet = [
            'answer_id' => 'a-' . wp_generate_uuid4(),
            'question_id' => sanitize_text_field((string) $request->get_param('question_id')),
            'job_id' => $job_id,
            'answer' => $answer,
            'answered_at' => gmdate('c'),
        ];

        self::append_job_meta_entry($job_id, '_aiig_client_answers', $packet);
        self::update_job_status_by_job_id($job_id, 'researching');

        return new WP_REST_Response($packet, 200);
    }

    public static function handle_rework_request(WP_REST_Request $request): WP_REST_Response
    {
        $job_id = sanitize_text_field((string) $request['job_id']);
        $change = sanitize_textarea_field((string) $request->get_param('requested_change'));
        $packet = [
            'rework_id' => 'rw-' . wp_generate_uuid4(),
            'job_id' => $job_id,
            'source' => 'client',
            'requested_change' => $change,
            'impact' => self::classify_rework_impact($change),
            'preserve' => ['validated placement', 'version history'],
            'created_at' => gmdate('c'),
        ];

        self::append_job_meta_entry($job_id, '_aiig_rework_requests', $packet);
        self::update_job_status_by_job_id($job_id, 'rework_requested');

        return new WP_REST_Response($packet, 201);
    }

    private static function build_submission_packet(WP_REST_Request $request): array
    {
        $job_id = 'img-job-' . gmdate('YmdHis') . '-' . wp_generate_password(6, false, false);
        $constraints = array_filter(array_map('trim', preg_split('/\r\n|\r|\n/', (string) $request->get_param('constraints'))));

        $packet = [
            'submission_id' => 'sub-' . wp_generate_uuid4(),
            'job_id' => $job_id,
            'submitted_at' => gmdate('c'),
            'source' => is_admin() ? 'wordpress_admin' : 'wordpress_client_portal',
            'client_brief' => [
                'summary' => sanitize_textarea_field((string) $request->get_param('summary')),
                'target_object' => sanitize_text_field((string) $request->get_param('target_object')),
                'desired_scene_change' => sanitize_textarea_field((string) $request->get_param('desired_scene_change')),
                'constraints' => array_map('sanitize_text_field', $constraints),
                'protected_elements' => [],
            ],
            'assets' => self::collect_uploaded_assets(),
            'requested_mode' => 'mock',
        ];

        return self::normalise_submission_packet($packet);
    }

    private static function collect_uploaded_assets(): array
    {
        $assets = [];
        $roles = [
            'scene_image' => 'scene_image',
            'object_reference' => 'object_reference',
            'supporting_file' => 'unknown',
        ];

        foreach ($roles as $field => $role) {
            if (empty($_FILES[$field]['name'])) {
                continue;
            }
            $file = $_FILES[$field];
            $attachment_id = self::handle_uploaded_file($field);
            $uri = $attachment_id > 0 ? wp_get_attachment_url($attachment_id) : sanitize_file_name((string) $file['name']);
            $assets[] = [
                'asset_id' => 'asset-' . sanitize_key($field) . '-' . wp_generate_password(6, false, false),
                'declared_role' => $role,
                'media_type' => sanitize_mime_type((string) $file['type']),
                'uri' => $uri ?: sanitize_file_name((string) $file['name']),
                'client_label' => sanitize_text_field((string) $file['name']),
                'attachment_id' => $attachment_id,
            ];
        }

        if (empty($assets)) {
            $assets[] = [
                'asset_id' => 'asset-placeholder-scene',
                'declared_role' => 'unknown',
                'media_type' => 'text/plain',
                'uri' => 'mock://wordpress/no-upload-provided',
                'client_label' => 'No upload provided',
            ];
        }

        return $assets;
    }

    private static function handle_uploaded_file(string $field): int
    {
        if (!function_exists('media_handle_upload')) {
            require_once ABSPATH . 'wp-admin/includes/file.php';
            require_once ABSPATH . 'wp-admin/includes/media.php';
            require_once ABSPATH . 'wp-admin/includes/image.php';
        }

        if (empty($_FILES[$field]['name'])) {
            return 0;
        }

        $attachment_id = media_handle_upload($field, 0);
        if (is_wp_error($attachment_id)) {
            return 0;
        }

        return (int) $attachment_id;
    }

    private static function normalise_submission_packet(array $packet): array
    {
        foreach ($packet['assets'] as &$asset) {
            if (isset($asset['attachment_id']) && (int) $asset['attachment_id'] <= 0) {
                unset($asset['attachment_id']);
            }
        }
        unset($asset);

        return $packet;
    }

    private static function send_to_n8n(array $packet): array
    {
        $webhook_url = get_option(self::OPTION_WEBHOOK_URL, '');
        if (empty($webhook_url)) {
            return [
                'sent' => false,
                'mode' => 'mock',
                'message' => 'No webhook URL configured.',
            ];
        }

        $secret = get_option(self::OPTION_WEBHOOK_SECRET, '');
        $headers = ['Content-Type' => 'application/json'];
        if (!empty($secret)) {
            $headers['X-AIIG-Signature'] = hash_hmac('sha256', wp_json_encode($packet), $secret);
        }

        $response = wp_remote_post($webhook_url, [
            'headers' => $headers,
            'body' => wp_json_encode($packet),
            'timeout' => 15,
        ]);

        return [
            'sent' => !is_wp_error($response),
            'mode' => 'webhook',
            'status_code' => is_wp_error($response) ? null : wp_remote_retrieve_response_code($response),
        ];
    }

    private static function append_job_meta_entry(string $job_id, string $meta_key, array $entry): void
    {
        $job = self::find_job_by_job_id($job_id);
        if (!$job) {
            return;
        }

        $existing = self::decode_meta_json($job->ID, $meta_key);
        if (!is_array($existing)) {
            $existing = [];
        }
        $existing[] = $entry;
        update_post_meta($job->ID, $meta_key, wp_json_encode($existing));
    }

    private static function update_job_status_by_job_id(string $job_id, string $status): void
    {
        $job = self::find_job_by_job_id($job_id);
        if ($job) {
            update_post_meta($job->ID, '_aiig_status', sanitize_key($status));
        }
    }

    private static function find_job_by_job_id(string $job_id): ?WP_Post
    {
        $jobs = get_posts([
            'post_type' => self::POST_TYPE,
            'title' => $job_id,
            'post_status' => 'any',
            'numberposts' => 1,
        ]);

        if (empty($jobs)) {
            return null;
        }

        return $jobs[0];
    }

    private static function decode_meta_json(int $post_id, string $meta_key)
    {
        $decoded = json_decode((string) get_post_meta($post_id, $meta_key, true), true);
        return is_array($decoded) ? $decoded : [];
    }

    private static function classify_rework_impact(string $change): string
    {
        $lower = strtolower($change);
        if (str_contains($lower, 'brighter') || str_contains($lower, 'warmer') || str_contains($lower, 'contrast')) {
            return 'visual_polish';
        }
        if (str_contains($lower, 'move') || str_contains($lower, 'other wall') || str_contains($lower, 'nearer')) {
            return 'placement_change';
        }
        if (str_contains($lower, 'different') || str_contains($lower, 'change object') || str_contains($lower, 'model')) {
            return 'object_change';
        }
        return 'unknown';
    }
}

AI_Image_Generator_Plugin::init();
register_activation_hook(__FILE__, ['AI_Image_Generator_Plugin', 'activate']);
register_deactivation_hook(__FILE__, ['AI_Image_Generator_Plugin', 'deactivate']);
