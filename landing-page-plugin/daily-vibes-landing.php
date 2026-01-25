<?php
/**
 * Plugin Name: Daily Vibes Landing Page
 * Plugin URI: https://github.com/yourusername/daily-vibes-landing
 * Description: A customizable landing page for Daily Vibes Rewards platform with shortcode support and admin settings.
 * Version: 1.0.0
 * Author: Daily Vibes
 * Author URI: https://dailyvibes.xyz
 * License: MIT
 * Text Domain: daily-vibes-landing
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('DVL_VERSION', '1.0.0');
define('DVL_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('DVL_PLUGIN_URL', plugin_dir_url(__FILE__));

class DailyVibesLanding {
    
    private static $instance = null;
    
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_init', array($this, 'register_settings'));
        add_shortcode('daily_vibes_landing', array($this, 'render_landing_page'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_styles'));
    }
    
    public function add_admin_menu() {
        add_menu_page(
            'Daily Vibes Landing',
            'Daily Vibes Landing',
            'manage_options',
            'daily-vibes-landing',
            array($this, 'render_admin_page'),
            'dashicons-megaphone',
            30
        );
    }
    
    public function register_settings() {
        register_setting('dvl_settings_group', 'dvl_hero_title');
        register_setting('dvl_settings_group', 'dvl_hero_subtitle');
        register_setting('dvl_settings_group', 'dvl_cta_primary_text');
        register_setting('dvl_settings_group', 'dvl_cta_primary_url');
        register_setting('dvl_settings_group', 'dvl_cta_secondary_text');
        register_setting('dvl_settings_group', 'dvl_cta_secondary_url');
        register_setting('dvl_settings_group', 'dvl_contact_email');
        register_setting('dvl_settings_group', 'dvl_github_url');
        register_setting('dvl_settings_group', 'dvl_twitter_url');
        register_setting('dvl_settings_group', 'dvl_discord_url');
        register_setting('dvl_settings_group', 'dvl_primary_color');
        register_setting('dvl_settings_group', 'dvl_secondary_color');
        register_setting('dvl_settings_group', 'dvl_accent_color');
    }
    
    public function render_admin_page() {
        if (!current_user_can('manage_options')) {
            return;
        }
        
        if (isset($_GET['settings-updated'])) {
            add_settings_error('dvl_messages', 'dvl_message', 'Settings Saved', 'updated');
        }
        
        settings_errors('dvl_messages');
        ?>
        <div class="wrap">
            <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
            
            <div style="background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #6366f1;">
                <h3>📋 Shortcode</h3>
                <p>Use this shortcode to display the landing page:</p>
                <code style="background: #f0f0f1; padding: 10px; display: inline-block; font-size: 14px;">[daily_vibes_landing]</code>
                <p style="margin-top: 10px;">You can add this to any page or post to display the full landing page.</p>
            </div>
            
            <form action="options.php" method="post">
                <?php
                settings_fields('dvl_settings_group');
                ?>
                
                <h2 class="title">Hero Section</h2>
                <table class="form-table">
                    <tr>
                        <th scope="row"><label for="dvl_hero_title">Hero Title</label></th>
                        <td>
                            <input type="text" id="dvl_hero_title" name="dvl_hero_title" 
                                   value="<?php echo esc_attr(get_option('dvl_hero_title', 'Turn Your Music Into an On-Chain Economy')); ?>" 
                                   class="regular-text" />
                            <p class="description">Main headline on the landing page</p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="dvl_hero_subtitle">Hero Subtitle</label></th>
                        <td>
                            <textarea id="dvl_hero_subtitle" name="dvl_hero_subtitle" rows="3" class="large-text"><?php echo esc_textarea(get_option('dvl_hero_subtitle', 'Reward your fans with crypto tokens for listening to your music. Build a loyal community and create new revenue streams on the Base blockchain.')); ?></textarea>
                            <p class="description">Subtitle text below the main headline</p>
                        </td>
                    </tr>
                </table>
                
                <h2 class="title">Call-to-Action Buttons</h2>
                <table class="form-table">
                    <tr>
                        <th scope="row"><label for="dvl_cta_primary_text">Primary Button Text</label></th>
                        <td>
                            <input type="text" id="dvl_cta_primary_text" name="dvl_cta_primary_text" 
                                   value="<?php echo esc_attr(get_option('dvl_cta_primary_text', 'Launch Your Economy')); ?>" 
                                   class="regular-text" />
                        </td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="dvl_cta_primary_url">Primary Button URL</label></th>
                        <td>
                            <input type="url" id="dvl_cta_primary_url" name="dvl_cta_primary_url" 
                                   value="<?php echo esc_url(get_option('dvl_cta_primary_url', '#get-started')); ?>" 
                                   class="regular-text" />
                        </td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="dvl_cta_secondary_text">Secondary Button Text</label></th>
                        <td>
                            <input type="text" id="dvl_cta_secondary_text" name="dvl_cta_secondary_text" 
                                   value="<?php echo esc_attr(get_option('dvl_cta_secondary_text', 'See How It Works')); ?>" 
                                   class="regular-text" />
                        </td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="dvl_cta_secondary_url">Secondary Button URL</label></th>
                        <td>
                            <input type="url" id="dvl_cta_secondary_url" name="dvl_cta_secondary_url" 
                                   value="<?php echo esc_url(get_option('dvl_cta_secondary_url', '#how-it-works')); ?>" 
                                   class="regular-text" />
                        </td>
                    </tr>
                </table>
                
                <h2 class="title">Contact Information</h2>
                <table class="form-table">
                    <tr>
                        <th scope="row"><label for="dvl_contact_email">Contact Email</label></th>
                        <td>
                            <input type="email" id="dvl_contact_email" name="dvl_contact_email" 
                                   value="<?php echo esc_attr(get_option('dvl_contact_email', 'hello@dailyvibes.xyz')); ?>" 
                                   class="regular-text" />
                        </td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="dvl_github_url">GitHub URL</label></th>
                        <td>
                            <input type="url" id="dvl_github_url" name="dvl_github_url" 
                                   value="<?php echo esc_url(get_option('dvl_github_url', 'https://github.com/yourusername/daily-vibes-rewards')); ?>" 
                                   class="regular-text" />
                        </td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="dvl_twitter_url">Twitter/X URL</label></th>
                        <td>
                            <input type="url" id="dvl_twitter_url" name="dvl_twitter_url" 
                                   value="<?php echo esc_url(get_option('dvl_twitter_url', 'https://twitter.com/dailyvibes')); ?>" 
                                   class="regular-text" />
                        </td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="dvl_discord_url">Discord URL</label></th>
                        <td>
                            <input type="url" id="dvl_discord_url" name="dvl_discord_url" 
                                   value="<?php echo esc_url(get_option('dvl_discord_url', 'https://discord.gg/dailyvibes')); ?>" 
                                   class="regular-text" />
                        </td>
                    </tr>
                </table>
                
                <h2 class="title">Color Scheme</h2>
                <table class="form-table">
                    <tr>
                        <th scope="row"><label for="dvl_primary_color">Primary Color</label></th>
                        <td>
                            <input type="color" id="dvl_primary_color" name="dvl_primary_color" 
                                   value="<?php echo esc_attr(get_option('dvl_primary_color', '#6366f1')); ?>" />
                            <p class="description">Main brand color (default: Indigo)</p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="dvl_secondary_color">Secondary Color</label></th>
                        <td>
                            <input type="color" id="dvl_secondary_color" name="dvl_secondary_color" 
                                   value="<?php echo esc_attr(get_option('dvl_secondary_color', '#8b5cf6')); ?>" />
                            <p class="description">Secondary brand color (default: Purple)</p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="dvl_accent_color">Accent Color</label></th>
                        <td>
                            <input type="color" id="dvl_accent_color" name="dvl_accent_color" 
                                   value="<?php echo esc_attr(get_option('dvl_accent_color', '#ec4899')); ?>" />
                            <p class="description">Accent color for highlights (default: Pink)</p>
                        </td>
                    </tr>
                </table>
                
                <?php submit_button('Save Settings'); ?>
            </form>
        </div>
        <?php
    }
    
    public function enqueue_styles() {
        if (has_shortcode(get_post()->post_content ?? '', 'daily_vibes_landing')) {
            wp_enqueue_style('dvl-landing-styles', DVL_PLUGIN_URL . 'assets/landing.css', array(), DVL_VERSION);
        }
    }
    
    public function render_landing_page($atts) {
        $atts = shortcode_atts(array(), $atts, 'daily_vibes_landing');
        
        // Get options with defaults
        $hero_title = get_option('dvl_hero_title', 'Turn Your Music<br/>Into an On-Chain Economy');
        $hero_subtitle = get_option('dvl_hero_subtitle', 'Reward your fans with crypto tokens for listening to your music. Build a loyal community and create new revenue streams on the Base blockchain.');
        $cta_primary_text = get_option('dvl_cta_primary_text', 'Launch Your Economy');
        $cta_primary_url = get_option('dvl_cta_primary_url', '#get-started');
        $cta_secondary_text = get_option('dvl_cta_secondary_text', 'See How It Works');
        $cta_secondary_url = get_option('dvl_cta_secondary_url', '#how-it-works');
        $contact_email = get_option('dvl_contact_email', 'hello@dailyvibes.xyz');
        $github_url = get_option('dvl_github_url', 'https://github.com/yourusername/daily-vibes-rewards');
        $twitter_url = get_option('dvl_twitter_url', 'https://twitter.com/dailyvibes');
        $discord_url = get_option('dvl_discord_url', 'https://discord.gg/dailyvibes');
        $primary_color = get_option('dvl_primary_color', '#6366f1');
        $secondary_color = get_option('dvl_secondary_color', '#8b5cf6');
        $accent_color = get_option('dvl_accent_color', '#ec4899');
        
        ob_start();
        include DVL_PLUGIN_DIR . 'templates/landing-page.php';
        return ob_get_clean();
    }
}

// Initialize the plugin
DailyVibesLanding::get_instance();
