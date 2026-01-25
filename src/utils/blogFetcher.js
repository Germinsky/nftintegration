const BLOG_URL = 'https://digitalprophets.blog';
const WP_API_URL = 'https://digitalprophets.blog/wp-json/wp/v2/posts';

export async function fetchSongsFromBlog() {
  try {
    // Use WordPress REST API instead of scraping HTML
    const response = await fetch(`${WP_API_URL}?per_page=20&_embed`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch blog posts');
    }

    const posts = await response.json();
    const songs = [];
    
    // Extract songs from WordPress posts
    for (const post of posts) {
      const songData = extractSongFromPost(post);
      
      if (songData && songData.audioUrl) {
        songs.push(songData);
      }
    }
    
    // If no songs were found from blog, use fallback
    if (songs.length === 0) {
      console.log('No songs found from blog, using fallback songs');
      return getFallbackSongs();
    }
    
    console.log(`Loaded ${songs.length} songs from blog`);
    return songs;
  } catch (error) {
    console.error('Error fetching songs from blog:', error);
    return getFallbackSongs();
  }
}

function extractSongFromPost(post) {
  const song = {
    id: '',
    title: '',
    date: '',
    image: '',
    audioUrl: '',
    downloadUrl: '',
    blogUrl: '',
    headlines: ''
  };

  // Extract title and URL
  if (post.title && post.title.rendered) {
    song.title = post.title.rendered.replace(/&[#0-9a-z]+;/gi, ''); // Strip HTML entities
    song.blogUrl = post.link;
    // Create ID from slug or title
    song.id = post.slug || song.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 50);
  }

  // Extract date
  if (post.date) {
    const postDate = new Date(post.date);
    song.date = postDate.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  // Extract featured image
  if (post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0]) {
    const media = post._embedded['wp:featuredmedia'][0];
    if (media.media_details && media.media_details.sizes && media.media_details.sizes.medium) {
      song.image = media.media_details.sizes.medium.source_url;
    } else if (media.source_url) {
      song.image = media.source_url;
    }
  }

  // Extract audio URL from content
  // WordPress posts contain audio player with download links
  if (post.content && post.content.rendered) {
    const content = post.content.rendered;
    
    // Look for .wav or .mp3 file URLs in the content
    const audioMatch = content.match(/href="([^"]+\.(wav|mp3))"/) || 
                      content.match(/data-audiopath="([^"]+\.(wav|mp3))"/) ||
                      content.match(/src="([^"]+\.(wav|mp3))"/);
    
    if (audioMatch && audioMatch[1]) {
      song.audioUrl = audioMatch[1];
      song.downloadUrl = audioMatch[1];
    }
  }

  // Extract headlines from excerpt or content
  if (post.excerpt && post.excerpt.rendered) {
    let headlines = post.excerpt.rendered.replace(/<[^>]*>/g, '').trim(); // Strip HTML
    if (headlines.length > 300) {
      headlines = headlines.substring(0, 300) + '...';
    }
    song.headlines = headlines;
  } else if (post.content && post.content.rendered) {
    // Parse content for text
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = post.content.rendered;
    let headlines = tempDiv.textContent.trim();
    if (headlines.length > 300) {
      headlines = headlines.substring(0, 300) + '...';
    }
    song.headlines = headlines;
  }

  return song;
}

// Fallback songs if blog fetch fails
function getFallbackSongs() {
  return [
    {
      id: 'flop-year-blues-2026-edition',
      title: 'Flop Year Blues (2026 Edition)',
      date: 'January 17, 2026',
      image: 'https://digitalprophets.blog/wp-content/uploads/2026/01/4704747e-0e61-4bd9-b91e-8124b7129908.jpg',
      audioUrl: 'https://digitalprophets.blog/wp-content/uploads/2026/01/Flop-Year-Blues-2026-Edition_.wav',
      downloadUrl: 'https://digitalprophets.blog/wp-content/uploads/2026/01/Flop-Year-Blues-2026-Edition_.wav',
      blogUrl: 'https://digitalprophets.blog/flop-year-blues-2026-edition/',
      headlines: 'CHAOS IN 2026: TRUMP\'S EMPIRE CRUMBLING WHILE THE WORLD BURNS'
    },
    {
      id: 'foreclosure-blues-insurrection-lullaby',
      title: 'Foreclosure Blues (Insurrection Lullaby)',
      date: 'January 16, 2026',
      image: 'https://digitalprophets.blog/wp-content/uploads/2026/01/ca02c2bf-9cb6-441e-a94e-8056dca57fc1-1024x1024.jpeg',
      audioUrl: 'https://digitalprophets.blog/wp-content/uploads/2026/01/Foreclosure-Blues-Insurrection-Lullaby.wav',
      downloadUrl: 'https://digitalprophets.blog/wp-content/uploads/2026/01/Foreclosure-Blues-Insurrection-Lullaby.wav',
      blogUrl: 'https://digitalprophets.blog/foreclosure-blues-insurrection-lullaby/',
      headlines: 'CHAOS ON MAIN STREET – AMERICA\'S SLOW-MOTION MELTDOWN IS HERE'
    },
    {
      id: 'bullet-wont-miss-2026-rage-anthem',
      title: 'Bullet Won\'t Miss (2026 Rage Anthem)',
      date: 'January 15, 2026',
      image: 'https://digitalprophets.blog/wp-content/uploads/2026/01/69554406-1a0f-4921-9b6b-def826e3a4d8.jpg',
      audioUrl: 'https://digitalprophets.blog/wp-content/uploads/2026/01/Bullet-Wont-Miss-2026-Rage-Anthem-1.wav',
      downloadUrl: 'https://digitalprophets.blog/wp-content/uploads/2026/01/Bullet-Wont-Miss-2026-Rage-Anthem-1.wav',
      blogUrl: 'https://digitalprophets.blog/bullet-wont-miss-2026-rage-anthem/',
      headlines: 'TEHRAN STRAIGHT-UP PROMISES TO PUT A BULLET IN TRUMP THIS TIME'
    },
    {
      id: 'bubble-poppin-2026-edition',
      title: 'Bubble Poppin\' (2026 Edition)',
      date: 'January 14, 2026',
      image: 'https://digitalprophets.blog/wp-content/uploads/2026/01/3df65137-dadc-4aab-9432-2aa9a9e29f48.jpg',
      audioUrl: 'https://digitalprophets.blog/wp-content/uploads/2026/01/Bubble-Poppin-2026-Edition.wav',
      downloadUrl: 'https://digitalprophets.blog/wp-content/uploads/2026/01/Bubble-Poppin-2026-Edition.wav',
      blogUrl: 'https://digitalprophets.blog/bubble-poppin-2026-edition/',
      headlines: 'TRUMP FLIPS OFF FORD WORKER SCREAMING PEDOPHILE PROTECTOR'
    },
    {
      id: 'subpoena-sunset',
      title: 'Subpoena Sunset',
      date: 'January 12, 2026',
      image: 'https://digitalprophets.blog/wp-content/uploads/2026/01/4a52a374-11e9-4341-974e-4f8f9c728b20.jpg',
      audioUrl: 'https://digitalprophets.blog/wp-content/uploads/2026/01/Subpoena-Sunset.wav',
      downloadUrl: 'https://digitalprophets.blog/wp-content/uploads/2026/01/Subpoena-Sunset.wav',
      blogUrl: 'https://digitalprophets.blog/subpoena-sunset/',
      headlines: 'TRUMP UNLEASHES CRIMINAL PROBE ON FED CHAIRMAN POWELL'
    },
    {
      id: 'greenland-freeze-tehran-burn',
      title: 'Greenland Freeze / Tehran Burn',
      date: 'January 12, 2026',
      image: 'https://digitalprophets.blog/wp-content/uploads/2026/01/65093334-67b4-4c6c-9233-eb77655f1df3.jpg',
      audioUrl: 'https://digitalprophets.blog/wp-content/uploads/2026/01/Greenland-Freeze-_-Tehran-Burn.wav',
      downloadUrl: 'https://digitalprophets.blog/wp-content/uploads/2026/01/Greenland-Freeze-_-Tehran-Burn.wav',
      blogUrl: 'https://digitalprophets.blog/greenland-freeze-tehran-burn/',
      headlines: 'ARMY DRAWS UP GREENLAND INVASION PLANS MASSACRE FEARED IN IRAN'
    },
    {
      id: 'powder-keg-prayer',
      title: 'Powder Keg Prayer',
      date: 'January 10, 2026',
      image: 'https://digitalprophets.blog/wp-content/uploads/2026/01/946bb338-64b8-4fbd-b3b6-883d147c29e2-1024x1024.jpeg',
      audioUrl: 'https://digitalprophets.blog/wp-content/uploads/2026/01/Powder-Keg-Prayer.wav',
      downloadUrl: 'https://digitalprophets.blog/wp-content/uploads/2026/01/Powder-Keg-Prayer.wav',
      blogUrl: 'https://digitalprophets.blog/powder-keg-prayer/',
      headlines: 'ICE AGENT BLOWS AWAY MOTORIST IN MINNEAPOLIS'
    },
    {
      id: 'americas-shared-horizon-v2',
      title: 'America\'s Shared Horizon',
      date: 'January 10, 2026',
      image: 'https://digitalprophets.blog/wp-content/uploads/2026/01/7320d691-99df-4006-b72a-d0694c203bd9-1024x1024.jpeg',
      audioUrl: 'https://digitalprophets.blog/wp-content/uploads/2026/01/Americas-Shared-Horizon-v2.wav',
      downloadUrl: 'https://digitalprophets.blog/wp-content/uploads/2026/01/Americas-Shared-Horizon-v2.wav',
      blogUrl: 'https://digitalprophets.blog/americas-shared-horizon/',
      headlines: 'A Melody That Whispers Unity Amid America\'s Immigration Heartache'
    },
    {
      id: 'border-blood-dc-betrayal',
      title: 'Border Blood & DC Betrayal',
      date: 'January 10, 2026',
      image: 'https://digitalprophets.blog/wp-content/uploads/2026/01/7dea8052-7162-4c6d-a6d7-3a4eaef7d4c6-1024x1024.jpeg',
      audioUrl: 'https://digitalprophets.blog/wp-content/uploads/2026/01/Border-Blood-DC-Betrayal.wav',
      downloadUrl: 'https://digitalprophets.blog/wp-content/uploads/2026/01/Border-Blood-DC-Betrayal.wav',
      blogUrl: 'https://digitalprophets.blog/border-blood-dc-betrayal/',
      headlines: 'CHAOS ON THE BORDER, BETRAYAL IN DC, AND THE WORLD ON FIRE'
    },
    {
      id: 'ice-storm-inferno',
      title: 'Ice Storm Inferno',
      date: 'January 9, 2026',
      image: 'https://digitalprophets.blog/wp-content/uploads/2026/01/e34ce650-bba1-4a2e-bcc1-be7117422f7a.jpg',
      audioUrl: 'https://digitalprophets.blog/wp-content/uploads/2026/01/Ice-Storm-Inferno.wav',
      downloadUrl: 'https://digitalprophets.blog/wp-content/uploads/2026/01/Ice-Storm-Inferno.wav',
      blogUrl: 'https://digitalprophets.blog/ice-storm-inferno/',
      headlines: 'ICE unleashes chaos, protests explode nationwide'
    },
    {
      id: 'regulators-2026',
      title: 'Regulators 2026',
      date: 'January 8, 2026',
      image: 'https://digitalprophets.blog/wp-content/uploads/2026/01/531f4b1d-3ee8-4fd1-a84d-b64ed1c898d2-1024x1024.jpeg',
      audioUrl: 'https://digitalprophets.blog/wp-content/uploads/2026/01/Regulators-2026.wav',
      downloadUrl: 'https://digitalprophets.blog/wp-content/uploads/2026/01/Regulators-2026.wav',
      blogUrl: 'https://digitalprophets.blog/regulators-2026/',
      headlines: 'Mount up for the ride through chaos'
    },
    {
      id: 'caracas-drill-maduros-fall',
      title: 'Caracas Drill – Maduro\'s Fall',
      date: 'January 7, 2026',
      image: 'https://digitalprophets.blog/wp-content/uploads/2026/01/image-6.jpg',
      audioUrl: 'https://digitalprophets.blog/wp-content/uploads/2026/01/Caracas-Drill-Maduros-Fall.wav',
      downloadUrl: 'https://digitalprophets.blog/wp-content/uploads/2026/01/Caracas-Drill-Maduros-Fall.wav',
      blogUrl: 'https://digitalprophets.blog/caracas-drill-maduros-fall/',
      headlines: 'Venezuela chaos as Maduro crumbles'
    },
    {
      id: 'global-circus-blaze',
      title: 'Global Circus Blaze',
      date: 'January 6, 2026',
      image: 'https://digitalprophets.blog/wp-content/uploads/2026/01/c6998123-5c0d-4066-9db4-f04d730eaaf4-1024x1024.jpeg',
      audioUrl: 'https://digitalprophets.blog/wp-content/uploads/2026/01/Global-Circus-Blaze.wav',
      downloadUrl: 'https://digitalprophets.blog/wp-content/uploads/2026/01/Global-Circus-Blaze.wav',
      blogUrl: 'https://digitalprophets.blog/global-circus-blaze/',
      headlines: 'The world burns while the circus performs'
    },
    {
      id: 'trumps-oil-heist-hustle',
      title: 'Trump\'s Oil Heist Hustle',
      date: 'January 5, 2026',
      image: 'https://digitalprophets.blog/wp-content/uploads/2026/01/digitalprophets_Generate_a_hyper-detailed_surreal_digital_art_3b675d68-ae38-4758-b4dc-bb8b46e5df0a_2.png',
      audioUrl: 'https://digitalprophets.blog/wp-content/uploads/2026/01/Trumps-Oil-Heist-Hustle.wav',
      downloadUrl: 'https://digitalprophets.blog/wp-content/uploads/2026/01/Trumps-Oil-Heist-Hustle.wav',
      blogUrl: 'https://digitalprophets.blog/trumps-oil-heist-hustle/',
      headlines: 'Oil grab in Venezuela as empire expands'
    },
    {
      id: 'venezuelan-vortex-vibe',
      title: 'Venezuelan Vortex Vibe (Trump\'s Oil Throne)',
      date: 'January 4, 2026',
      image: 'https://digitalprophets.blog/wp-content/uploads/2026/01/grok-video-5ea02003-d879-4912-b119-164b20ee04ed-mp4-image.jpg',
      audioUrl: 'https://digitalprophets.blog/wp-content/uploads/2026/01/Venezuelan-Vortex-Vibe-Trumps-Oil-Throne.wav',
      downloadUrl: 'https://digitalprophets.blog/wp-content/uploads/2026/01/Venezuelan-Vortex-Vibe-Trumps-Oil-Throne.wav',
      blogUrl: 'https://digitalprophets.blog/venezuelan-vortex-vibe/',
      headlines: 'Venezuela oil conquest begins'
    },
    {
      id: 'delta-or-not',
      title: 'Delta or Not',
      date: 'January 3, 2026',
      image: 'https://digitalprophets.blog/wp-content/uploads/2026/01/grok-video-de81df28-8495-4687-8790-1bd8d1476c77-mp4-image.jpg',
      audioUrl: 'https://digitalprophets.blog/wp-content/uploads/2026/01/Delta-or-Not.wav',
      downloadUrl: 'https://digitalprophets.blog/wp-content/uploads/2026/01/Delta-or-Not.wav',
      blogUrl: 'https://digitalprophets.blog/global-gangsta-paradise/',
      headlines: 'New Orleans tragedy shakes the nation'
    },
    {
      id: 'global-gangstas-paradise',
      title: 'Global Gangsta\'s Paradise',
      date: 'January 2, 2026',
      image: 'https://digitalprophets.blog/wp-content/uploads/2026/01/grok-video-de81df28-8495-4687-8790-1bd8d1476c77-mp4-image.jpg',
      audioUrl: 'https://digitalprophets.blog/wp-content/uploads/2026/01/Global-Gangstas-Paradise.wav',
      downloadUrl: 'https://digitalprophets.blog/wp-content/uploads/2026/01/Global-Gangstas-Paradise.wav',
      blogUrl: 'https://digitalprophets.blog/global-gangsta-paradise/',
      headlines: 'Welcome to the global chaos party'
    }
  ];
}
