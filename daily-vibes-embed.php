<?php
/**
 * Plugin Name: Daily Vibes Embed
 * Description: Embeds the Daily Vibes Web3 rewards app into WordPress
 * Version: 1.0.0
 * Author: Digital Prophets
 */

// Security: Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

class DailyVibesEmbed {
    private $plugin_url;
    
    public function __construct() {
        $this->plugin_url = plugin_dir_url(__FILE__);
        
        // Register shortcode
        add_shortcode('daily_vibes', array($this, 'render_app'));
        
        // Register assets
        add_action('wp_enqueue_scripts', array($this, 'enqueue_assets'));
    }
    
    /**
     * Enqueue React app assets
     */
    public function enqueue_assets() {
        // Only load on pages with the shortcode
        global $post;
        if (is_a($post, 'WP_Post') && has_shortcode($post->post_content, 'daily_vibes')) {
            // Enqueue the built React app
            wp_enqueue_script(
                'daily-vibes-app',
                $this->plugin_url . 'dist/assets/index.js',
                array(),
                '1.0.0',
                true
            );
            
            wp_enqueue_style(
                'daily-vibes-styles',
                $this->plugin_url . 'dist/assets/index.css',
                array(),
                '1.0.0'
            );
        }
    }
    
    /**
     * Render the app container
     */
    public function render_app($atts) {
        $attributes = shortcode_atts(array(
            'height' => '800px',
        ), $atts);
        
        ob_start();
        ?>
        <div id="root" style="min-height: <?php echo esc_attr($attributes['height']); ?>; width: 100%;"></div>
        <?php
        return ob_get_clean();
    }
}

// Initialize plugin
new DailyVibesEmbed();
