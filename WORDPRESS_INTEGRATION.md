# Adding Daily Vibes to WordPress

You have **3 options** to integrate the Daily Vibes app into your WordPress blog:

---

## Option 1: WordPress Plugin (Recommended)

### Steps:
1. **Copy built files to WordPress**:
   ```bash
   # Create plugin directory
   mkdir -p /path/to/wordpress/wp-content/plugins/daily-vibes-embed
   
   # Copy the plugin file
   cp ~/daily-vibes-rewards/daily-vibes-embed.php /path/to/wordpress/wp-content/plugins/daily-vibes-embed/
   
   # Copy the built React app
   cp -r ~/daily-vibes-rewards/dist /path/to/wordpress/wp-content/plugins/daily-vibes-embed/
   ```

2. **Activate the plugin** in WordPress:
   - Go to **Plugins → Installed Plugins**
   - Find "Daily Vibes Embed"
   - Click **Activate**

3. **Add to a page**:
   - Create a new page or edit existing
   - Add this shortcode: `[daily_vibes]`
   - Optional: Set custom height: `[daily_vibes height="1000px"]`
   - Publish!

---

## Option 2: Upload to WordPress Uploads Directory

### Steps:
1. **Build and upload**:
   ```bash
   # Upload built files via FTP/SFTP to:
   # /wp-content/uploads/daily-vibes/
   ```

2. **Create custom page template** (`page-daily-vibes.php`):
   ```php
   <?php
   /*
   Template Name: Daily Vibes
   */
   get_header(); ?>
   
   <div id="root"></div>
   
   <script type="module" src="/wp-content/uploads/daily-vibes/assets/index.js"></script>
   <link rel="stylesheet" href="/wp-content/uploads/daily-vibes/assets/index.css">
   
   <?php get_footer(); ?>
   ```

3. **Create a page** and select "Daily Vibes" template

---

## Option 3: Iframe Embed (Easiest for External Hosting)

If you host the app elsewhere (like Vercel, Netlify, or your own server):

### Steps:
1. **Deploy the app** to a hosting service:
   ```bash
   # Using Vercel
   npm install -g vercel
   cd ~/daily-vibes-rewards
   vercel
   ```

2. **Add iframe to WordPress page**:
   - Edit page in WordPress
   - Switch to **HTML mode**
   - Add:
   ```html
   <iframe 
     src="https://your-app-url.vercel.app" 
     width="100%" 
     height="800px" 
     frameborder="0"
     style="border: none; min-height: 800px;">
   </iframe>
   ```

---

## Quick WordPress Integration Using Your Server

If digitalprophets.blog is on the same server:

```bash
# Find your WordPress root
WP_ROOT="/var/www/html"  # Adjust this path

# Create plugin directory
sudo mkdir -p $WP_ROOT/wp-content/plugins/daily-vibes-embed

# Copy plugin and built files
sudo cp ~/daily-vibes-rewards/daily-vibes-embed.php $WP_ROOT/wp-content/plugins/daily-vibes-embed/
sudo cp -r ~/daily-vibes-rewards/dist $WP_ROOT/wp-content/plugins/daily-vibes-embed/

# Fix permissions
sudo chown -R www-data:www-data $WP_ROOT/wp-content/plugins/daily-vibes-embed
```

Then activate the plugin and use `[daily_vibes]` shortcode on any page!

---

## Recommended Page Setup

1. Create a new WordPress page called "Daily Vibes"
2. Set permalink to `/daily-vibes/`
3. Add shortcode: `[daily_vibes height="900px"]`
4. Optional: Use full-width page template
5. Publish!

---

## Important Notes

- **WalletConnect Project ID**: Update `projectId` in App.jsx before deploying
- **Rewards Contract**: Deploy contract and update `REWARDS_ADDRESS`
- **Mobile Optimization**: The app is responsive but test on mobile
- **HTTPS Required**: Web3 wallets require secure connections

---

## Testing Locally

Before deploying, test the build:

```bash
cd ~/daily-vibes-rewards
npm run build
npm run preview
```

Visit http://localhost:4173 to see the production build.
