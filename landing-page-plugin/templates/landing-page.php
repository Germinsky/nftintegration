<style>
:root {
    --dvl-primary: <?php echo esc_attr($primary_color); ?>;
    --dvl-secondary: <?php echo esc_attr($secondary_color); ?>;
    --dvl-accent: <?php echo esc_attr($accent_color); ?>;
}
</style>

<div class="dvl-landing-page">
    <!-- Hero Section -->
    <section class="dvl-hero">
        <div class="dvl-container">
            <div class="dvl-hero-content">
                <h1><?php echo wp_kses_post($hero_title); ?></h1>
                <p><?php echo esc_html($hero_subtitle); ?></p>
                <div class="dvl-hero-buttons">
                    <a href="<?php echo esc_url($cta_primary_url); ?>" class="dvl-primary-button"><?php echo esc_html($cta_primary_text); ?></a>
                    <a href="<?php echo esc_url($cta_secondary_url); ?>" class="dvl-secondary-button"><?php echo esc_html($cta_secondary_text); ?></a>
                </div>
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="dvl-features">
        <div class="dvl-container">
            <h2 class="dvl-section-title">Features</h2>
            <p class="dvl-section-subtitle">Everything you need to build your on-chain music economy</p>
            
            <div class="dvl-feature-grid">
                <div class="dvl-feature-card dvl-animate-in">
                    <div class="dvl-feature-icon">🎵</div>
                    <h3>Reward Listeners</h3>
                    <p>Automatically distribute crypto tokens to fans when they listen to your music. Every play counts.</p>
                </div>
                
                <div class="dvl-feature-card dvl-animate-in">
                    <div class="dvl-feature-icon">💎</div>
                    <h3>Your Own Token</h3>
                    <p>Deploy your custom ERC20 token on Base blockchain. Complete control, full ownership.</p>
                </div>
                
                <div class="dvl-feature-card dvl-animate-in">
                    <div class="dvl-feature-icon">🔗</div>
                    <h3>Web3 Integration</h3>
                    <p>Built with MetaMask and RainbowKit for seamless wallet connection and crypto interactions.</p>
                </div>
                
                <div class="dvl-feature-card dvl-animate-in">
                    <div class="dvl-feature-icon">📊</div>
                    <h3>Track Analytics</h3>
                    <p>Monitor plays, reward claims, and wallet connections in real-time.</p>
                </div>
                
                <div class="dvl-feature-card dvl-animate-in">
                    <div class="dvl-feature-icon">🔌</div>
                    <h3>WordPress Plugin</h3>
                    <p>Easy integration with your existing WordPress site using a simple shortcode.</p>
                </div>
                
                <div class="dvl-feature-card dvl-animate-in">
                    <div class="dvl-feature-icon">🚀</div>
                    <h3>Standalone App</h3>
                    <p>Deploy as an independent web application or embed anywhere.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- How It Works Section -->
    <section id="how-it-works" class="dvl-how-it-works">
        <div class="dvl-container">
            <h2 class="dvl-section-title">How It Works</h2>
            <p class="dvl-section-subtitle">Get started in four simple steps</p>
            
            <div class="dvl-steps">
                <div class="dvl-step dvl-animate-in">
                    <div class="dvl-step-number">1</div>
                    <h3>Deploy Your Token</h3>
                    <p>Create your custom ERC20 token on Base blockchain with your brand.</p>
                </div>
                
                <div class="dvl-step dvl-animate-in">
                    <div class="dvl-step-number">2</div>
                    <h3>Install the App</h3>
                    <p>Add the WordPress plugin or deploy the standalone web app.</p>
                </div>
                
                <div class="dvl-step dvl-animate-in">
                    <div class="dvl-step-number">3</div>
                    <h3>Upload Your Music</h3>
                    <p>Add your tracks and configure reward amounts per play.</p>
                </div>
                
                <div class="dvl-step dvl-animate-in">
                    <div class="dvl-step-number">4</div>
                    <h3>Grow Your Economy</h3>
                    <p>Fans listen, earn tokens, and become part of your community.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Benefits Section -->
    <section id="benefits" class="dvl-benefits">
        <div class="dvl-container">
            <h2 class="dvl-section-title">Benefits</h2>
            <p class="dvl-section-subtitle">Why artists are choosing on-chain economies</p>
            
            <div class="dvl-benefit-grid">
                <div class="dvl-benefit-item dvl-animate-in">
                    <h3>💰 New Revenue Streams</h3>
                    <p>Create value beyond streaming platforms. Your tokens can appreciate as your community grows.</p>
                </div>
                
                <div class="dvl-benefit-item dvl-animate-in">
                    <h3>🤝 Direct Fan Connection</h3>
                    <p>Build a direct relationship with your audience without intermediaries.</p>
                </div>
                
                <div class="dvl-benefit-item dvl-animate-in">
                    <h3>🎯 Loyal Community</h3>
                    <p>Token holders become invested stakeholders in your success.</p>
                </div>
                
                <div class="dvl-benefit-item dvl-animate-in">
                    <h3>🌟 Early Adopter Advantage</h3>
                    <p>Be among the first artists to build an on-chain music economy.</p>
                </div>
                
                <div class="dvl-benefit-item dvl-animate-in">
                    <h3>🔒 You Own Everything</h3>
                    <p>Full control over your token, data, and community. No platform lock-in.</p>
                </div>
                
                <div class="dvl-benefit-item dvl-animate-in">
                    <h3>📈 Scalable Growth</h3>
                    <p>Your economy grows with your fanbase. Built on Base for low fees and fast transactions.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section id="get-started" class="dvl-cta-section">
        <div class="dvl-container">
            <h2>Ready to Launch Your Music Economy?</h2>
            <p>Join the future of music monetization on the blockchain</p>
            <div class="dvl-cta-buttons">
                <a href="mailto:<?php echo esc_attr($contact_email); ?>" class="dvl-cta-button">Contact Us</a>
                <a href="<?php echo esc_url($github_url); ?>" class="dvl-cta-button" target="_blank" rel="noopener">View on GitHub</a>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="dvl-footer">
        <div class="dvl-container">
            <div class="dvl-footer-links">
                <a href="#features">Features</a>
                <a href="#how-it-works">How It Works</a>
                <a href="#benefits">Benefits</a>
                <a href="mailto:<?php echo esc_attr($contact_email); ?>">Contact</a>
            </div>
            
            <div class="dvl-social-links">
                <?php if (!empty($twitter_url)): ?>
                <a href="<?php echo esc_url($twitter_url); ?>" target="_blank" rel="noopener" aria-label="Twitter">𝕏</a>
                <?php endif; ?>
                <?php if (!empty($github_url)): ?>
                <a href="<?php echo esc_url($github_url); ?>" target="_blank" rel="noopener" aria-label="GitHub">GitHub</a>
                <?php endif; ?>
                <?php if (!empty($discord_url)): ?>
                <a href="<?php echo esc_url($discord_url); ?>" target="_blank" rel="noopener" aria-label="Discord">Discord</a>
                <?php endif; ?>
            </div>
            
            <p>&copy; <?php echo date('Y'); ?> Daily Vibes Rewards. Built on Base blockchain.</p>
        </div>
    </footer>
</div>

<script>
(function() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '#get-started') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('dvl-visible');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.dvl-animate-in').forEach(el => {
        observer.observe(el);
    });
})();
</script>
