const fs = require('fs');
const path = require('path');
const https = require('https');

const API_BASE = "https://api.munajatemaqbool.com";
const BUILD_DIR = path.join(__dirname, '../build');
const TEMPLATE_PATH = path.join(BUILD_DIR, 'index.html');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to fetch JSON from API with retry on 429
function fetchJsonWithRetry(url, retries = 5, delay = 1000) {
    return new Promise((resolve, reject) => {
        const attempt = (remainingRetries, currentDelay) => {
            https.get(url, (res) => {
                let data = '';
                res.on('data', (chunk) => { data += chunk; });
                res.on('end', async () => {
                    if (res.statusCode === 200) {
                        try {
                            resolve(JSON.parse(data));
                        } catch (e) {
                            reject(e);
                        }
                    } else if (res.statusCode === 429 && remainingRetries > 0) {
                        console.warn(`Rate limited (429) for ${url}. Retrying in ${currentDelay}ms... (${remainingRetries} retries left)`);
                        await sleep(currentDelay);
                        attempt(remainingRetries - 1, currentDelay * 2);
                    } else {
                        reject(new Error(`Failed to load URL ${url} with status: ${res.statusCode}`));
                    }
                });
            }).on('error', async (err) => {
                if (remainingRetries > 0) {
                    console.warn(`Request error for ${url}: ${err.message}. Retrying in ${currentDelay}ms...`);
                    await sleep(currentDelay);
                    attempt(remainingRetries - 1, currentDelay * 2);
                } else {
                    reject(err);
                }
            });
        };
        attempt(retries, delay);
    });
}

function cleanHtmlText(text) {
    if (!text) return '';
    return text.replace(/<[^>]*>/g, '').replace(/"/g, '&quot;').trim();
}

function stripHtmlTags(text) {
    if (!text) return '';
    return text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

async function run() {
    if (!fs.existsSync(TEMPLATE_PATH)) {
        console.error("Template not found: " + TEMPLATE_PATH);
        process.exit(1);
    }
    const template = fs.readFileSync(TEMPLATE_PATH, 'utf8');
    const seoRegex = /<title>Munajat E Maqbool<\/title>[\s\S]*?"@type":\s*"Book"[\s\S]*?<\/script>/;

    // 1. Pre-render 196 Duas
    console.log("Pre-rendering Duas 1 to 196...");
    for (let id = 1; id <= 196; id++) {
        try {
            const dua = await fetchJsonWithRetry(`${API_BASE}/dua/${id}`);
            const titleStr = `Dua ${id} (${dua.tags}) - Munajat E Maqbool`;
            const descriptionStr = cleanHtmlText(dua.english || dua.bengali).substring(0, 155) + "...";
            const urlStr = `https://munajatemaqbool.com/dua/${id}/`;
            
            const schemaJson = {
                "@context": "https://schema.org",
                "@type": "WebPage",
                "@id": `${urlStr}#webpage`,
                "url": urlStr,
                "name": titleStr,
                "description": descriptionStr,
                "mainEntity": {
                    "@type": "CreativeWork",
                    "name": `Dua ${id}`,
                    "author": {
                        "@type": "Person",
                        "name": "Maulana Ashraf Ali Thanvi"
                    },
                    "text": stripHtmlTags(dua.arabic),
                    "inLanguage": "ar",
                    "translation": [
                        {
                            "@type": "CreativeWork",
                            "inLanguage": "en",
                            "text": stripHtmlTags(dua.english)
                        },
                        {
                            "@type": "CreativeWork",
                            "inLanguage": "bn",
                            "text": stripHtmlTags(dua.bengali)
                        }
                    ]
                }
            };

            const metaTags = `<!-- SEO-TAGS-START -->
  <title>${titleStr}</title>
  <meta name="description" content="${descriptionStr}">
  <meta name="keywords" content="Dua ${id}, ${dua.tags}, Munajat E Maqbool, Islamic Prayers, Daily Duas, Ashraf Ali Thanvi, Arabic Dua, Dua with English Translation, Bengali Dua">
  <meta name="author" content="Maulana Ashraf Ali Thanvi">
  <link rel="canonical" href="${urlStr}">
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="article">
  <meta property="og:url" content="${urlStr}">
  <meta property="og:title" content="${titleStr}">
  <meta property="og:description" content="${descriptionStr}">
  <!-- Twitter -->
  <meta property="twitter:card" content="summary">
  <meta property="twitter:url" content="${urlStr}">
  <meta property="twitter:title" content="${titleStr}">
  <meta property="twitter:description" content="${descriptionStr}">
  <script type="application/ld+json">
  ${JSON.stringify(schemaJson, null, 2)}
  </script>
  <!-- SEO-TAGS-END -->`;

            const noscriptContent = `
  <noscript>
    <div style="padding: 20px; font-family: sans-serif;">
      <h1>Dua ${id} (${dua.tags})</h1>
      <div class="arabic" style="font-size: 24px; direction: rtl; margin-bottom: 20px;">${dua.arabic}</div>
      <hr>
      <div class="english" style="margin-bottom: 20px;"><h3>English:</h3>${dua.english}</div>
      <div class="bengali"><h3>Bengali:</h3>${dua.bengali}</div>
    </div>
  </noscript>`;

            let pageHtml = template
                .replace(seoRegex, metaTags)
                .replace('<div id="react"></div>', `<div id="react"></div>${noscriptContent}`);

            const dir = path.join(BUILD_DIR, 'dua', String(id));
            fs.mkdirSync(dir, { recursive: true });
            fs.writeFileSync(path.join(dir, 'index.html'), pageHtml);
            
            // Wait 100ms to avoid overloading the API and getting rate limited
            await sleep(100);
        } catch (err) {
            console.error(`Error pre-rendering dua ${id}:`, err.message);
        }
    }

    // 2. Pre-render Static Info Pages: Help, Settings, Bookmarks, Khutbah
    const pages = [
        {
            path: 'help',
            title: 'About & Help - Munajat E Maqbool',
            description: 'About Munajat-e-Maqbool application, compiled by Hakimul Ummah Maulana Ashraf Ali Thanwi. Help on keyboard shortcuts.',
            content: '<h1>About Munajat E Maqbool</h1><p><strong>Compilation:</strong> Compiled by Hakimul Ummah Maulana Ashraf Ali Thanvi (R). Bengali Translation - Allama Shamsul Haque Faridpuri (R) and Allama Azizul Haque (R). English Translation - Maulana Muhammed Mahomedy.</p><h2>Keyboard Shortcuts</h2><ul><li><strong>Next Prayer:</strong> k / &rarr;</li><li><strong>Previous Prayer:</strong> j / &larr;</li><li><strong>Next Day:</strong> l / &uarr;</li><li><strong>Previous Day:</strong> h / &darr;</li><li><strong>Play / Pause Audio:</strong> p</li><li><strong>Stop Audio:</strong> s</li><li><strong>Toggle Bookmark:</strong> b</li><li><strong>Go to Bookmarks:</strong> Ctrl + b</li><li><strong>Next Bookmark:</strong> n</li><li><strong>Previous Bookmark:</strong> v</li><li><strong>Toggle Language:</strong> t</li></ul>'
        },
        {
            path: 'settings',
            title: 'Settings - Munajat E Maqbool',
            description: 'Configure your language preferences (English / Bengali) for reading Munajat-e-Maqbool.',
            content: '<h1>Settings</h1><p>Change preferred translation language between English and Bengali.</p>'
        },
        {
            path: 'bookmarks',
            title: 'Bookmarks - Munajat E Maqbool',
            description: 'Your saved favorite prayers and duas from Munajat-e-Maqbool.',
            content: '<h1>Bookmarks</h1><p>View and read your saved prayers.</p>'
        },
        {
            path: 'khutbah',
            title: 'Khutbah - Munajat E Maqbool',
            description: 'Read the Friday Sermon (Khutbah) and introductory supplications.',
            content: '<h1>Khutbah</h1><p>Supplications recited during Khutbah.</p>'
        }
    ];

    console.log("Pre-rendering Static Pages...");
    for (const page of pages) {
        const urlStr = `https://munajatemaqbool.com/${page.path}/`;
        const metaTags = `<!-- SEO-TAGS-START -->
  <title>${page.title}</title>
  <meta name="description" content="${page.description}">
  <meta name="keywords" content="${page.path}, Munajat E Maqbool, Islamic Prayers, Daily Duas, Ashraf Ali Thanvi">
  <meta name="author" content="Maulana Ashraf Ali Thanvi">
  <link rel="canonical" href="${urlStr}">
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${urlStr}">
  <meta property="og:title" content="${page.title}">
  <meta property="og:description" content="${page.description}">
  <!-- Twitter -->
  <meta property="twitter:card" content="summary">
  <meta property="twitter:url" content="${urlStr}">
  <meta property="twitter:title" content="${page.title}">
  <meta property="twitter:description" content="${page.description}">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "${urlStr}#webpage",
    "url": "${urlStr}",
    "name": "${page.title}",
    "description": "${page.description}"
  }
  </script>
  <!-- SEO-TAGS-END -->`;

        const noscriptContent = `
  <noscript>
    <div style="padding: 20px; font-family: sans-serif;">
      ${page.content}
    </div>
  </noscript>`;

        let pageHtml = template
            .replace(seoRegex, metaTags)
            .replace('<div id="react"></div>', `<div id="react"></div>${noscriptContent}`);

        const dir = path.join(BUILD_DIR, page.path);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, 'index.html'), pageHtml);
    }

    // 3. Generate Sitemap
    console.log("Generating sitemap.xml...");
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://munajatemaqbool.com/</loc>
    <priority>1.00</priority>
    <changefreq>monthly</changefreq>
  </url>
  <url>
    <loc>https://munajatemaqbool.com/khutbah/</loc>
    <priority>0.80</priority>
    <changefreq>monthly</changefreq>
  </url>
  <url>
    <loc>https://munajatemaqbool.com/help/</loc>
    <priority>0.50</priority>
    <changefreq>yearly</changefreq>
  </url>
  <url>
    <loc>https://munajatemaqbool.com/settings/</loc>
    <priority>0.50</priority>
    <changefreq>yearly</changefreq>
  </url>
  <url>
    <loc>https://munajatemaqbool.com/bookmarks/</loc>
    <priority>0.50</priority>
    <changefreq>yearly</changefreq>
  </url>`;

    for (let id = 1; id <= 196; id++) {
        sitemap += `
  <url>
    <loc>https://munajatemaqbool.com/dua/${id}/</loc>
    <priority>0.90</priority>
    <changefreq>monthly</changefreq>
  </url>`;
    }

    sitemap += `
</urlset>`;
    fs.writeFileSync(path.join(BUILD_DIR, 'sitemap.xml'), sitemap);

    // 4. Generate Robots.txt
    console.log("Generating robots.txt...");
    const robots = `User-agent: *
Allow: /

Sitemap: https://munajatemaqbool.com/sitemap.xml
`;
    fs.writeFileSync(path.join(BUILD_DIR, 'robots.txt'), robots);

    console.log("Pre-rendering completed successfully!");
}

run();
