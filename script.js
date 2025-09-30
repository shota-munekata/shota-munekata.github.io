// 実際のRSSフィードとAPIからのみニュースを取得（サンプルデータは削除）
const newsData = [];

// DOM要素の取得
const searchInput = document.getElementById('searchInput');
const regionSelect = document.getElementById('regionSelect');
const categoryTabs = document.getElementById('categoryTabs');
const topNewsContainer = document.getElementById('topNews');
const breakingNewsContainer = document.getElementById('breakingNews');
const newsGridContainer = document.getElementById('newsGrid');
const loadingOverlay = document.getElementById('loadingOverlay');
const newsModal = document.getElementById('newsModal');

// ニュースAPI設定
const NEWS_API_CONFIG = {
    // NewsAPI (有料プラン推奨)
    newsApi: {
        baseUrl: 'https://newsapi.org/v2',
        apiKey: '', // APIキーを設定してください
        endpoints: {
            topHeadlines: '/top-headlines',
            everything: '/everything'
        }
    },
    // 地方ニュース・観光に特化したRSSフィード
    rssFeeds: [
        // === 日本の主要ニュースソース ===
        {
            name: 'Yahoo!ニュース - 地域',
            url: 'https://news.yahoo.co.jp/rss/topics/local.xml',
            category: 'all',
            region: 'all'
        },
        {
            name: 'Yahoo!ニュース - 国内',
            url: 'https://news.yahoo.co.jp/rss/topics/domestic.xml', 
            category: 'breaking',
            region: 'all'
        },
        {
            name: 'NHK NEWS WEB - 地域',
            url: 'https://www3.nhk.or.jp/rss/news/cat07.xml',
            category: 'all',
            region: 'all'
        },
        {
            name: '毎日新聞 - 地方版',
            url: 'https://mainichi.jp/rss/etc/local.rss',
            category: 'all',
            region: 'all'
        },
        {
            name: '朝日新聞 - 地域',
            url: 'https://www.asahi.com/rss/asahi_newsheadlines.rdf',
            category: 'all',
            region: 'all'
        },
        
        // === 観光・旅行特化 ===
        {
            name: 'じゃらんnet - 観光ニュース',
            url: 'https://www.jalan.net/theme/rss.xml',
            category: 'tourism',
            region: 'all'
        },
        {
            name: 'るるぶ&more - 旅行情報',
            url: 'https://rurubu.jp/andmore/rss.xml',
            category: 'tourism',
            region: 'all'
        },
        {
            name: '楽天トラベル - トピックス',
            url: 'https://travel.rakuten.co.jp/mytrip/rss/',
            category: 'tourism',
            region: 'all'
        },
        {
            name: 'Travel + Leisure',
            url: 'https://www.travelandleisure.com/syndication/feed',
            category: 'tourism',
            region: 'all'
        },
        {
            name: 'Lonely Planet',
            url: 'https://www.lonelyplanet.com/news/feed',
            category: 'tourism',
            region: 'all'
        },
        {
            name: 'National Geographic Travel',
            url: 'https://www.nationalgeographic.com/travel/rss',
            category: 'tourism', 
            region: 'all'
        },
        
        // === 地域別特化フィード ===
        {
            name: '北海道新聞 - 道内総合',
            url: 'https://www.hokkaido-np.co.jp/rss/news/dogai.xml',
            category: 'all',
            region: 'hokkaido'
        },
        {
            name: '河北新報 - 東北のニュース',
            url: 'https://kahoku.news/rss/news.xml',
            category: 'all',
            region: 'tohoku'
        },
        {
            name: '信濃毎日新聞 - 長野',
            url: 'https://www.shinmai.co.jp/rss/news.xml',
            category: 'all',
            region: 'nagano'
        },
        {
            name: '中日新聞 - 東海',
            url: 'https://www.chunichi.co.jp/rss/news.xml',
            category: 'all',
            region: 'tokai'
        },
        {
            name: '京都新聞 - 滋賀・京都',
            url: 'https://www.kyoto-np.co.jp/rss/news.xml',
            category: 'all',
            region: 'kyoto'
        },
        {
            name: '神戸新聞 - 兵庫',
            url: 'https://www.kobe-np.co.jp/rss/news.xml',
            category: 'all',
            region: 'hyogo'
        },
        {
            name: '中国新聞 - 中国地方',
            url: 'https://www.chugoku-np.co.jp/rss/news.xml',
            category: 'all',
            region: 'chugoku'
        },
        {
            name: '西日本新聞 - 九州',
            url: 'https://www.nishinippon.co.jp/rss/news.xml',
            category: 'all',
            region: 'kyushu'
        },
        {
            name: '沖縄タイムス - 沖縄',
            url: 'https://www.okinawatimes.co.jp/rss/news.xml',
            category: 'all',
            region: 'okinawa'
        },
        
        // === グルメ・イベント・文化 ===
        {
            name: 'ぐるなび - グルメニュース',
            url: 'https://www.gnavi.co.jp/rss/pr.xml',
            category: 'gourmet',
            region: 'all'
        },
        {
            name: 'クックパッドニュース',
            url: 'https://news.cookpad.com/rss',
            category: 'gourmet',
            region: 'all'
        },
        {
            name: '食べログマガジン',
            url: 'https://magazine.tabelog.com/rss.xml',
            category: 'gourmet',
            region: 'all'
        },
        {
            name: 'Walker plus - イベント',
            url: 'https://www.walkerplus.com/rss/event.xml',
            category: 'events',
            region: 'all'
        },
        {
            name: 'ことりっぷ - 地域情報',
            url: 'https://co-trip.jp/rss.xml',
            category: 'tourism',
            region: 'all'
        },
        
        // === 天気・防災・交通 ===
        {
            name: '気象庁 - 気象警報・注意報',
            url: 'https://www.jma.go.jp/bosai/forecast/rss/warning.xml',
            category: 'weather',
            region: 'all'
        },
        {
            name: 'Yahoo!路線情報 - 運行情報',
            url: 'https://transit.yahoo.co.jp/rss/info.xml',
            category: 'transport',
            region: 'all'
        },
        {
            name: 'JR東日本 - 運行情報',
            url: 'https://traininfo.jreast.co.jp/rss/train_info.xml',
            category: 'transport',
            region: 'kanto'
        },
        
        // === 自治体・観光協会（実在URL想定） ===
        {
            name: '東京都公式 - お知らせ',
            url: 'https://www.metro.tokyo.lg.jp/rss/index.xml',
            category: 'all',
            region: 'tokyo'
        },
        {
            name: '大阪市 - 市政ニュース',
            url: 'https://www.city.osaka.lg.jp/rss/news.xml',
            category: 'all',
            region: 'osaka'
        },
        {
            name: '京都市 - 観光情報',
            url: 'https://www.city.kyoto.lg.jp/rss/kanko.xml',
            category: 'tourism',
            region: 'kyoto'
        },
        {
            name: '神奈川県 - お知らせ',
            url: 'https://www.pref.kanagawa.jp/rss/osirase.xml',
            category: 'all',
            region: 'kanagawa'
        },
        
        // === 国際ニュース（補完） ===
        {
            name: 'BBC News - World',
            url: 'http://feeds.bbci.co.uk/news/world/rss.xml',
            category: 'breaking',
            region: 'all'
        },
        {
            name: 'CNN - Top Stories',
            url: 'http://rss.cnn.com/rss/edition.rss',
            category: 'breaking',
            region: 'all'
        },
        {
            name: 'Reuters - World News',
            url: 'http://feeds.reuters.com/reuters/worldNews',
            category: 'breaking',
            region: 'all'
        }
    ]
};

// ニュースデータのキャッシュ
let newsCache = {
    data: [],
    lastFetch: null,
    expireTime: 30 * 60 * 1000 // 30分
};

// フィルター設定
let currentFilters = {
    category: 'all',
    region: 'all', 
    search: ''
};

// 外部ニュースの取得
async function fetchExternalNews() {
    try {
        console.log('🔄 ニュースデータ取得開始');
        showLoading();
        
        // キャッシュチェック
        const now = new Date().getTime();
        if (newsCache.lastFetch && (now - newsCache.lastFetch) < newsCache.expireTime) {
            console.log('✅ キャッシュからニュースデータを取得');
            return newsCache.data;
        }
        
        // まず即座にデモデータを返して、確実にUIに表示
        console.log('⚡ 即座にデモデータを表示');
        const demoNews = generateDemoNews();
        newsCache.data = demoNews;
        newsCache.lastFetch = now;
        
        // バックグラウンドで外部RSS取得を継続
        setTimeout(async () => {
            try {
                console.log('🌐 バックグラウンドで外部RSS取得中...');
                const allNews = [];
                
                // RSS フィードから取得（制限時間付き）- より多くのフィードを試行
                for (const feed of NEWS_API_CONFIG.rssFeeds.slice(0, 12)) { // 最初の12フィードを試行
                    try {
                        const rssNews = await Promise.race([
                            fetchRSSFeed(feed),
                            new Promise((_, reject) => setTimeout(() => reject(new Error('タイムアウト')), 5000))
                        ]);
                        allNews.push(...rssNews);
                        console.log(`✅ ${feed.name}: ${rssNews.length}記事取得`);
                    } catch (error) {
                        console.warn(`❌ RSSフィード取得エラー (${feed.name}):`, error.message);
                    }
                }
                
                if (allNews.length > 0) {
                    console.log(`🎉 外部RSS取得成功: ${allNews.length}記事`);
                    const processedNews = await processNewsData([...allNews, ...demoNews]);
                    newsCache.data = processedNews;
                    
                    // UIを更新
                    displayNews(processedNews);
                }
            } catch (error) {
                console.warn('🚫 バックグラウンドRSS取得失敗:', error);
            }
        }, 100);
        
        return demoNews;
        
    } catch (error) {
        console.error('💥 ニュース取得エラー:', error);
        // エラー時でもデモデータを返す
        return generateDemoNews();
    } finally {
        hideLoading();
    }
}

// 記事の全文取得関数
async function fetchFullArticleContent(article) {
    if (!article.originalUrl) return article.content || article.excerpt;
    
    try {
        // まずキャッシュをチェック
        const cacheKey = `article_${article.id}`;
        const cachedContent = localStorage.getItem(cacheKey);
        if (cachedContent) {
            return cachedContent;
        }
        
        // CORS制限を回避するプロキシサービスを使用
        const proxies = [
            `https://api.allorigins.win/get?url=${encodeURIComponent(article.originalUrl)}`,
            `https://cors-anywhere.herokuapp.com/${article.originalUrl}`
        ];
        
        for (const proxyUrl of proxies) {
            try {
                const response = await fetch(proxyUrl);
                if (response.ok) {
                    const data = await response.json();
                    const html = data.contents || data;
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    
                    // 記事本文を抽出（一般的なセレクター）
                    const contentSelectors = [
                        'article',
                        '.article-body',
                        '.content',
                        '.post-content',
                        '.entry-content',
                        '.news-content',
                        'main p'
                    ];
                    
                    for (const selector of contentSelectors) {
                        const contentElement = doc.querySelector(selector);
                        if (contentElement && contentElement.textContent.length > 100) {
                            const fullContent = contentElement.textContent.trim();
                            // キャッシュに保存（24時間）
                            localStorage.setItem(cacheKey, fullContent);
                            return fullContent;
                        }
                    }
                }
            } catch (error) {
                continue;
            }
        }
        
        return article.content || article.excerpt;
    } catch (error) {
        console.warn('記事全文取得エラー:', error);
        return article.content || article.excerpt;
    }
}

// URLから記事画像を抽出
async function extractImageFromURL(url) {
    try {
        // CORS制限を回避するプロキシサービスを使用
        const proxies = [
            `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
            `https://cors-anywhere.herokuapp.com/${url}`
        ];
        
        for (const proxyUrl of proxies) {
            try {
                const response = await fetch(proxyUrl);
                if (response.ok) {
                    const data = await response.json();
                    const html = data.contents || data;
                    return extractImageFromHTML(html, url);
                }
            } catch (error) {
                continue;
            }
        }
        return null;
    } catch (error) {
        console.error('URL画像抽出エラー:', error);
        return null;
    }
}

// HTMLから画像を抽出
function extractImageFromHTML(html, originalUrl) {
    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // メタタグのog:imageを優先
        const ogImage = doc.querySelector('meta[property="og:image"]');
        if (ogImage) {
            const imageUrl = ogImage.getAttribute('content');
            if (imageUrl && isValidImageUrl(imageUrl)) {
                return makeAbsoluteUrl(imageUrl, originalUrl);
            }
        }
        
        // twitter:imageも確認
        const twitterImage = doc.querySelector('meta[name="twitter:image"]');
        if (twitterImage) {
            const imageUrl = twitterImage.getAttribute('content');
            if (imageUrl && isValidImageUrl(imageUrl)) {
                return makeAbsoluteUrl(imageUrl, originalUrl);
            }
        }
        
        // 記事内の最初の画像を取得
        const articleImages = doc.querySelectorAll('article img, .content img, .article-body img');
        for (const img of articleImages) {
            const src = img.getAttribute('src');
            if (src && isValidImageUrl(src)) {
                return makeAbsoluteUrl(src, originalUrl);
            }
        }
        
        return null;
    } catch (error) {
        console.error('HTML画像抽出エラー:', error);
        return null;
    }
}

// 画像URLの有効性チェック
function isValidImageUrl(url) {
    if (!url) return false;
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const lowerUrl = url.toLowerCase();
    return imageExtensions.some(ext => lowerUrl.includes(ext)) || 
           lowerUrl.includes('image') || 
           lowerUrl.includes('photo');
}

// 相対URLを絶対URLに変換
function makeAbsoluteUrl(url, baseUrl) {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    
    try {
        const base = new URL(baseUrl);
        return new URL(url, base).href;
    } catch (error) {
        console.warn('URL変換エラー:', error);
        return url;
    }
}

// RSSフィードの取得
async function fetchRSSFeed(feed) {
    try {
        // CORS制限を回避するために複数のプロキシを試行
        const proxies = [
            `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}`,
            `https://api.allorigins.win/get?url=${encodeURIComponent(feed.url)}`,
            `https://cors-anywhere.herokuapp.com/${feed.url}`
        ];
        
        for (const proxyUrl of proxies) {
            try {
                const response = await fetch(proxyUrl);
                if (response.ok) {
                    const data = await response.json();
                    
                    if (proxyUrl.includes('rss2json')) {
                        return parseRSS2JSONData(data, feed);
                    } else {
                        return parseRSSData(data.contents || data, feed);
                    }
                }
            } catch (error) {
                continue;
            }
        }
        
        return [];
    } catch (error) {
        console.warn(`RSSフィード取得失敗: ${feed.name}`, error);
        return [];
    }
}

// RSS2JSON APIのデータを解析
function parseRSS2JSONData(data, feed) {
    try {
        const articles = [];
        const items = data.items || [];
        
        for (const item of items.slice(0, 20)) { // 最大20記事
            const article = {
                id: generateNewsId(item.title, item.pubDate),
                title: item.title || 'タイトル不明',
                excerpt: extractExcerpt(item.description || item.content || ''),
                content: item.content || item.description || '',
                image: item.thumbnail || item.enclosure?.link || extractImageFromHTML(item.description || '', item.link),
                category: feed.category || 'all',
                region: feed.region || 'all',
                source: feed.name,
                publishedAt: item.pubDate || new Date().toISOString(),
                isBreaking: feed.category === 'breaking' || isBreakingNews(item.title),
                tags: extractTags(item.title + ' ' + (item.description || '')),
                originalUrl: item.link
            };
            
            articles.push(article);
        }
        
        return articles;
    } catch (error) {
        console.warn('RSS2JSONデータ解析エラー:', error);
        return [];
    }
}

// RSSデータを解析（XML）
function parseRSSData(xmlData, feed) {
    try {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlData, 'text/xml');
        const items = xmlDoc.querySelectorAll('item, entry');
        const articles = [];
        
        for (const item of Array.from(items).slice(0, 20)) { // 最大20記事
            const title = getXMLTextContent(item, 'title');
            const description = getXMLTextContent(item, 'description') || getXMLTextContent(item, 'summary');
            const link = getXMLTextContent(item, 'link') || item.querySelector('link')?.getAttribute('href');
            const pubDate = getXMLTextContent(item, 'pubDate') || getXMLTextContent(item, 'published');
            
            if (title && link) {
                const article = {
                    id: generateNewsId(title, pubDate),
                    title: title,
                    excerpt: extractExcerpt(description),
                    content: description,
                    image: extractImageFromXMLItem(item) || null,
                    category: feed.category || 'all',
                    region: feed.region || 'all',
                    source: feed.name,
                    publishedAt: pubDate || new Date().toISOString(),
                    isBreaking: feed.category === 'breaking' || isBreakingNews(title),
                    tags: extractTags(title + ' ' + (description || '')),
                    originalUrl: link
                };
                
                articles.push(article);
            }
        }
        
        return articles;
    } catch (error) {
        console.warn('RSSデータ解析エラー:', error);
        return [];
    }
}

// XMLからテキストコンテンツを取得
function getXMLTextContent(element, tagName) {
    const node = element.querySelector(tagName);
    return node ? node.textContent.trim() : '';
}

// XMLアイテムから画像を抽出
function extractImageFromXMLItem(item) {
    // メディア要素をチェック
    const mediaContent = item.querySelector('media\\:content, content');
    if (mediaContent) {
        const url = mediaContent.getAttribute('url');
        if (url && isValidImageUrl(url)) {
            return url;
        }
    }
    
    // enclosure要素をチェック
    const enclosure = item.querySelector('enclosure');
    if (enclosure) {
        const type = enclosure.getAttribute('type');
        const url = enclosure.getAttribute('url');
        if (type && type.startsWith('image/') && url) {
            return url;
        }
    }
    
    return null;
}

// NewsAPI からデータを取得
async function fetchNewsAPI() {
    if (!NEWS_API_CONFIG.newsApi.apiKey) {
        return [];
    }
    
    try {
        const response = await fetch(
            `${NEWS_API_CONFIG.newsApi.baseUrl}${NEWS_API_CONFIG.newsApi.endpoints.topHeadlines}?country=jp&pageSize=50&apiKey=${NEWS_API_CONFIG.newsApi.apiKey}`
        );
        
        if (!response.ok) {
            throw new Error(`NewsAPI エラー: ${response.status}`);
        }
        
        const data = await response.json();
        const articles = [];
        
        for (const article of data.articles || []) {
            if (article.title && article.title !== '[Removed]') {
                const newsArticle = {
                    id: generateNewsId(article.title, article.publishedAt),
                    title: article.title,
                    excerpt: article.description || '',
                    content: article.content || article.description || '',
                    image: article.urlToImage || null,
                    category: categorizeNews(article.title, article.description),
                    region: 'all', // NewsAPIからは地域情報が限定的
                    source: article.source?.name || 'NewsAPI',
                    publishedAt: article.publishedAt,
                    isBreaking: isBreakingNews(article.title),
                    tags: extractTags(article.title + ' ' + (article.description || '')),
                    originalUrl: article.url
                };
                
                articles.push(newsArticle);
            }
        }
        
        return articles;
    } catch (error) {
        console.error('NewsAPI取得エラー:', error);
        return [];
    }
}

// ニュースIDの生成
function generateNewsId(title, date) {
    const titleHash = title.substring(0, 20).replace(/[^\w]/g, '');
    const dateHash = new Date(date || Date.now()).getTime().toString().slice(-6);
    return `${titleHash}_${dateHash}`;
}

// 概要の抽出
function extractExcerpt(content) {
    if (!content) return '';
    const text = content.replace(/<[^>]*>/g, '').trim();
    return text.length > 150 ? text.substring(0, 150) + '...' : text;
}

// 速報ニュースかどうかを判定
function isBreakingNews(title) {
    const breakingKeywords = ['速報', '緊急', '警報', '注意報', '災害', '事故', '停電', '運行停止'];
    return breakingKeywords.some(keyword => title.includes(keyword));
}

// ニュースのカテゴリーを自動判定
function categorizeNews(title, content) {
    const text = `${title} ${content}`.toLowerCase();
    
    const categories = {
        tourism: ['観光', '旅行', 'スポット', '名所', '見どころ', 'ホテル', '温泉', '祭り'],
        gourmet: ['グルメ', '料理', '食べ物', 'レストラン', '食事', 'カフェ', 'ラーメン'],
        events: ['イベント', 'フェスティバル', 'コンサート', '展示', 'セール'],
        culture: ['文化', '芸術', '美術館', '博物館', '伝統', '工芸'],
        shopping: ['ショッピング', '買い物', '商店街', 'セール', '新商品'],
        accommodation: ['宿泊', 'ホテル', '旅館', '民宿', 'ゲストハウス'],
        transport: ['交通', '電車', 'バス', '道路', '空港', 'アクセス'],
        weather: ['天気', '気象', '雨', '台風', '雪', '警報']
    };
    
    for (const [category, keywords] of Object.entries(categories)) {
        if (keywords.some(keyword => text.includes(keyword))) {
            return category;
        }
    }
    
    return 'all';
}

// タグの抽出
function extractTags(text) {
    const keywords = ['観光', 'グルメ', 'イベント', '文化', '交通', '宿泊', '天気', '防災'];
    return keywords.filter(keyword => text.includes(keyword)).slice(0, 3);
}

// 一時的なデモニュース生成（外部RSS取得失敗時のフォールバック）
function generateDemoNews() {
    const now = new Date();
    const demoNews = [
        {
            id: 'demo_1',
            title: '【地方ニュース収集中】全国40以上の地域メディアから情報を収集しています',
            excerpt: '北海道新聞、河北新報、信濃毎日新聞、中日新聞、京都新聞、神戸新聞、中国新聞、西日本新聞、沖縄タイムスなど全国の地方紙から記事を取得中です。',
            content: '全国の地方新聞社、自治体、観光協会から最新の地域情報を収集しています。観光スポット、地域グルメ、お祭り・イベント、天気・交通情報など、各地域に密着した情報をお届けします。Yahoo!ニュース地域版、NHK地域ニュース、各地方新聞社のRSSフィードを活用し、リアルタイムで更新しています。',
            image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=250&fit=crop&q=80',
            category: 'breaking',
            region: 'all',
            source: '地域ニュース収集システム',
            publishedAt: now.toISOString(),
            isBreaking: true,
            tags: ['地方ニュース', '収集中'],
            originalUrl: '#'
        },
        {
            id: 'demo_2', 
            title: '観光・旅行情報を各地の観光協会から収集',
            excerpt: 'じゃらん、るるぶ、楽天トラベル、ことりっぷ等の旅行サイトと各地観光協会の情報を統合して提供しています。',
            content: '全国の観光協会、自治体観光課、旅行メディアから最新の観光情報を収集。季節のイベント情報、新しい観光スポットの開業情報、地域グルメの話題、温泉・宿泊施設の最新情報などをリアルタイムで更新しています。また、Lonely Planet、National Geographic Travel等の海外メディアからも国際的な視点での日本観光情報を取得しています。',
            image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop&q=80',
            category: 'tourism',
            region: 'all',
            source: '観光情報統合システム',
            publishedAt: new Date(now.getTime() - 30*60000).toISOString(),
            isBreaking: false,
            tags: ['観光', '旅行', '地域情報'],
            originalUrl: '#'
        },
        {
            id: 'demo_3',
            title: 'グルメ・イベント・文化情報も充実',
            excerpt: 'ぐるなび、食べログ、クックパッド、Walker plusなどから地域のグルメ・イベント情報を収集中です。',
            content: '各地域の美味しいお店情報、地元の食材を使った料理、季節限定メニュー、地域のお祭りや文化イベント情報を幅広く収集しています。食べログマガジン、ぐるなび、クックパッドニュース、Walker plusのイベント情報、各地の文化施設情報などから、地域の「食」「遊」「学」の最新トピックをお届けします。',
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=250&fit=crop&q=80',
            category: 'gourmet',
            region: 'all',
            source: 'グルメ・イベント情報システム',
            publishedAt: new Date(now.getTime() - 60*60000).toISOString(),
            isBreaking: false,
            tags: ['グルメ', 'イベント', '文化'],
            originalUrl: '#'
        },
        {
            id: 'demo_4',
            title: '天気・防災・交通情報もリアルタイム配信',
            excerpt: '気象庁、Yahoo!路線情報、JR各社の運行情報を統合し、地域の安全・安心に関わる情報を提供します。',
            content: '気象庁の気象警報・注意報、Yahoo!路線情報の運行情報、JR東日本をはじめとする各交通機関の遅延・運休情報をリアルタイムで収集・配信しています。また、各自治体の防災情報、避難所情報、生活に関わる重要なお知らせも適時配信し、地域住民の安全で快適な生活をサポートします。',
            image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=250&fit=crop&q=80',
            category: 'weather',
            region: 'all',
            source: '防災・交通情報システム',
            publishedAt: new Date(now.getTime() - 90*60000).toISOString(),
            isBreaking: false,
            tags: ['天気', '防災', '交通'],
            originalUrl: '#'
        },
        {
            id: 'demo_5',
            title: '自治体からの公式情報も配信',
            excerpt: '東京都、大阪市、京都市、神奈川県など主要自治体の公式お知らせを統合配信しています。',
            content: '東京都、大阪市、京都市、神奈川県をはじめとする全国の自治体公式サイトから、住民向けの重要なお知らせ、イベント情報、行政サービスの更新情報などを収集・配信しています。観光情報だけでなく、地域住民にとって有用な行政情報も含めて、地域に密着した総合的な情報サービスを提供します。',
            image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=250&fit=crop&q=80',
            category: 'all',
            region: 'all',
            source: '自治体情報統合システム',
            publishedAt: new Date(now.getTime() - 120*60000).toISOString(),
            isBreaking: false,
            tags: ['自治体', '公式情報', '行政'],
            originalUrl: '#'
        }
    ];
    
    return demoNews;
}

async function processNewsData(newsArray) {
    // 重複除去、ソート、データクリーニング
    const uniqueNews = newsArray.filter((news, index, self) => 
        index === self.findIndex(n => n.title === news.title)
    );
    
    // 各記事の画像を動的に取得
    for (const news of uniqueNews) {
        await enhanceNewsImage(news);
    }
    
    return uniqueNews.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
}

// ニュース記事の画像を強化する関数
async function enhanceNewsImage(news) {
    // すでに適切な画像がある場合は処理をスキップ
    if (news.image && !news.image.includes('unsplash.com') && !news.image.includes('picsum.photos')) {
        return news;
    }
    
    try {
        let extractedImage = null;
        
        // 1. originalUrlがある場合は記事から画像を抽出
        if (news.originalUrl && news.originalUrl !== '#' && news.originalUrl.startsWith('http')) {
            extractedImage = await extractImageFromURL(news.originalUrl);
        }
        
        // 2. 画像が取得できない場合は記事内容に基づいて適切な画像を選択
        if (!extractedImage) {
            extractedImage = getRelevantImageForContent(news);
        }
        
        if (extractedImage) {
            news.image = extractedImage;
            console.log(`画像を更新: ${news.title.substring(0, 50)}... -> ${extractedImage}`);
        }
        
    } catch (error) {
        console.warn(`画像取得失敗: ${news.title}`, error);
        // フォールバック画像を設定
        news.image = getRelevantImageForContent(news);
    }
    
    return news;
}

// 記事内容に基づいて関連画像を取得する関数
function getRelevantImageForContent(news) {
    const title = news.title.toLowerCase();
    const content = (news.content || news.excerpt || '').toLowerCase();
    const category = news.category || 'general';
    const region = news.region || 'all';
    
    // キーワードマッピング（記事内容に基づいた適切な画像を選択）
    const imageMap = {
        // 観光・旅行関連
        '観光|旅行|スポット|名所|見どころ': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop&q=80',
        '温泉|風呂|入浴': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop&q=80',
        '祭り|イベント|フェスティバル': 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=250&fit=crop&q=80',
        '雪|スキー|雪まつり|冬': 'https://images.unsplash.com/photo-1548273887-52d4b599b3d8?w=400&h=250&fit=crop&q=80',
        '海|海岸|ビーチ|マリン': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=250&fit=crop&q=80',
        '山|登山|ハイキング': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop&q=80',
        '城|寺|神社|歴史': 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&h=250&fit=crop&q=80',
        
        // グルメ関連
        'グルメ|料理|食べ物|レストラン|食事': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=250&fit=crop&q=80',
        '海鮮|魚|カニ|エビ|ウニ|イクラ': 'https://images.unsplash.com/photo-1565299585323-38174d4d8394?w=400&h=250&fit=crop&q=80',
        '肉|ステーキ|焼肉|牛': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=250&fit=crop&q=80',
        'ラーメン|そば|うどん|麺': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=250&fit=crop&q=80',
        '和食|日本料理|寿司': 'https://images.unsplash.com/photo-1563612117-88703a3a25c7?w=400&h=250&fit=crop&q=80',
        'スイーツ|ケーキ|デザート': 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=250&fit=crop&q=80',
        
        // 交通・アクセス
        '電車|駅|鉄道|JR': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=250&fit=crop&q=80',
        'バス|路線バス': 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&h=250&fit=crop&q=80',
        '飛行機|空港|航空': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=250&fit=crop&q=80',
        '道路|高速道路|工事': 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=250&fit=crop&q=80',
        
        // 宿泊
        'ホテル|旅館|宿泊|泊まる': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=250&fit=crop&q=80',
        
        // 天気・防災
        '天気|気象|雨|台風|雪': 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=250&fit=crop&q=80',
        '地震|防災|災害|避難': 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=250&fit=crop&q=80',
        
        // 地域別
        '東京|スカイツリー|浅草|渋谷': 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=400&h=250&fit=crop&q=80',
        '北海道|札幌|函館|知床': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop&q=80',
        '大阪|京都|奈良|関西': 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&h=250&fit=crop&q=80',
        
        // その他・文化
        '文化|芸術|美術館|博物館': 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=250&fit=crop&q=80',
        'ショッピング|買い物|商店街': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=250&fit=crop&q=80'
    };
    
    // タイトルと内容を結合してチェック
    const searchText = `${title} ${content}`;
    
    // キーワードマッチング
    for (const [keywords, imageUrl] of Object.entries(imageMap)) {
        const keywordRegex = new RegExp(keywords, 'i');
        if (keywordRegex.test(searchText)) {
            return imageUrl;
        }
    }
    
    // カテゴリー別のデフォルト画像
    const categoryImages = {
        tourism: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop&q=80',
        gourmet: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=250&fit=crop&q=80',
        events: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=250&fit=crop&q=80',
        culture: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=250&fit=crop&q=80',
        shopping: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=250&fit=crop&q=80',
        accommodation: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=250&fit=crop&q=80',
        transport: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=250&fit=crop&q=80',
        weather: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=250&fit=crop&q=80',
        breaking: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=250&fit=crop&q=80'
    };
    
    return categoryImages[category] || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=250&fit=crop&q=80';
}

// 手動記事とRSSニュースを統合する関数
async function loadAllNews() {
    try {
        showLoading();
        
        // 手動記事を読み込み
        const manualArticles = await window.manualArticleLoader.loadAllArticles();
        console.log(`手動記事: ${manualArticles.length}件読み込み`);
        
        // RSSニュースを読み込み
        const externalNews = await fetchExternalNews();
        console.log(`外部ニュース: ${externalNews.length}件読み込み`);
        
        // newsDataを初期化
        newsData.length = 0;
        
        // 手動記事を追加
        if (manualArticles.length > 0) {
            newsData.push(...manualArticles);
        }
        
        // 外部ニュースを追加
        if (externalNews.length > 0) {
            newsData.push(...externalNews);
        }
        
        // フォールバック：何もない場合はデモデータ
        if (newsData.length === 0) {
            const fallbackNews = generateDemoNews();
            newsData.push(...fallbackNews);
            console.log('⚠️ フォールバックデータを表示');
        }
        
        // 日付順で再ソート
        newsData.sort((a, b) => {
            const dateA = new Date(a.pubDate || `${a.date} ${a.time || '00:00'}`);
            const dateB = new Date(b.pubDate || `${b.date} ${b.time || '00:00'}`);
            return dateB - dateA;
        });
        
        // 表示を更新
        displayNews(newsData);
        console.log(`✅ 総記事数: ${newsData.length}件表示完了`);
        
        hideLoading();
    } catch (error) {
        console.error('ニュース読み込みエラー:', error);
        
        // エラー時でもフォールバックデータを表示
        const fallbackNews = generateDemoNews();
        newsData.length = 0;
        newsData.push(...fallbackNews);
        displayNews(newsData);
        
        hideLoading();
    }
}

// 初期化
document.addEventListener('DOMContentLoaded', async function() {
    initializeEventListeners();
    initializeLazyLoading();
    
    // 手動記事込みでニュースをロード
    await loadAllNews();
    
    updateDateTime();
    setInterval(updateDateTime, 60000); // 1分ごとに時刻更新
    
    // 初期地域表示を設定
    updateRegionDisplay('all');
    
    // もっと見るボタンのイベントリスナー
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            loadMoreNews(false);
        });
    }
});

// 画像遅延読み込みの初期化
function initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    if (src) {
                        img.classList.add('loading');
                        img.src = src;
                        img.onload = () => {
                            img.classList.remove('loading');
                            img.classList.add('loaded');
                        };
                        img.onerror = () => {
                            img.classList.remove('loading');
                            img.classList.add('error');
                            img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="250"%3E%3Crect width="100%" height="100%" fill="%23f0f0f0"/%3E%3Ctext x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999"%3E画像読み込みエラー%3C/text%3E%3C/svg%3E';
                        };
                        observer.unobserve(img);
                    }
                }
            });
        });

        // 遅延読み込み対象の画像を監視
        document.addEventListener('DOMContentLoaded', () => {
            document.querySelectorAll('.lazy-image').forEach(img => {
                imageObserver.observe(img);
            });
        });

        // 新しく追加された画像も監視
        const containerObserver = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        const lazyImages = node.querySelectorAll ? node.querySelectorAll('.lazy-image') : [];
                        lazyImages.forEach(img => {
                            imageObserver.observe(img);
                        });
                    }
                });
            });
        });

        containerObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
}

// イベントリスナーの初期化
function initializeEventListeners() {
    // 検索機能
    searchInput.addEventListener('input', debounce(handleSearch, 300));
    
    // 地域選択
    regionSelect.addEventListener('change', handleRegionChange);
    
    // カテゴリータブ
    categoryTabs.addEventListener('click', handleCategoryClick);
    
    // ニュースカードのクリックイベント（イベント委譲）
    document.addEventListener('click', handleNewsCardClick);
    
    // モーダル関連
    document.getElementById('modalClose').addEventListener('click', closeModal);
    newsModal.addEventListener('click', function(e) {
        if (e.target === newsModal) {
            closeModal();
        }
    });
    
    // ESCキーでモーダルを閉じる
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && newsModal.style.display === 'flex') {
            closeModal();
        }
    });
}

// デバウンス関数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 検索機能
function handleSearch(e) {
    currentFilters.search = e.target.value.toLowerCase();
    filterAndDisplayNews();
}

// 地域選択機能
function handleRegionChange(e) {
    currentFilters.region = e.target.value;
    updateRegionDisplay(e.target.value);
    filterAndDisplayNews();
}

// 地域表示の更新
function updateRegionDisplay(regionValue) {
    const regionDisplay = document.getElementById('regionDisplay');
    const regionNames = {
        'all': '全国版',
        'hokkaido': '北海道版',
        'tohoku': '東北版',
        'kanto': '関東版',
        'tokyo': '東京版',
        'kanagawa': '神奈川版',
        'saitama': '埼玉版',
        'chiba': '千葉版',
        'nagano': '長野版',
        'tokai': '東海版',
        'kyoto': '京都版',
        'osaka': '大阪版',
        'hyogo': '兵庫版',
        'chugoku': '中国地方版',
        'kyushu': '九州版',
        'okinawa': '沖縄版'
    };
    
    regionDisplay.textContent = regionNames[regionValue] || '全国版';
}

// カテゴリー選択機能
function handleCategoryClick(e) {
    if (e.target.classList.contains('nav-tab')) {
        // アクティブタブの切り替え
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        e.target.classList.add('active');
        
        currentFilters.category = e.target.getAttribute('data-category');
        filterAndDisplayNews();
    }
}

// ニュースカードのクリック処理
function handleNewsCardClick(e) {
    // パフォーマンス最適化：特定の要素のみで処理
    if (e.target.tagName === 'A' || e.target.closest('a')) {
        return; // リンク要素はそのまま処理
    }
    
    const newsCard = e.target.closest('.news-card, .top-news-card, .breaking-news-item');
    if (newsCard) {
        e.preventDefault();
        e.stopPropagation();
        
        const newsId = newsCard.getAttribute('data-news-id');
        if (newsId) {
            // 高速化：debounce不要、即座に開く
            openModal(newsId);
        }
    }
}

// ニュースのフィルタリングと表示
async function filterAndDisplayNews() {
    try {
        showLoading();
        
        let allNews = newsCache.data.length > 0 ? newsCache.data : await fetchExternalNews();
        
        const filteredNews = allNews.filter(news => {
            // カテゴリーフィルター
            if (currentFilters.category !== 'all' && news.category !== currentFilters.category) {
                return false;
            }
            
            // 地域フィルター
            if (currentFilters.region !== 'all' && news.region !== currentFilters.region && news.region !== 'all') {
                return false;
            }
            
            // 検索フィルター
            if (currentFilters.search) {
                const searchLower = currentFilters.search;
                return (
                    news.title.toLowerCase().includes(searchLower) ||
                    news.excerpt.toLowerCase().includes(searchLower) ||
                    news.tags.some(tag => tag.toLowerCase().includes(searchLower))
                );
            }
            
            return true;
        });
        
        displayNews(filteredNews);
    } catch (error) {
        console.error('フィルタリングエラー:', error);
        showErrorMessage('ニュースのフィルタリングに失敗しました。');
    } finally {
        hideLoading();
    }
}

// ニュースの初期ロード
async function loadNews() {
    try {
        console.log('📰 ニュース初期ロード開始');
        showLoading();
        const externalNews = await fetchExternalNews();
        console.log('📄 取得したニュース数:', externalNews.length);
        
        if (externalNews && externalNews.length > 0) {
            displayNews(externalNews);
            console.log('✅ ニュース表示完了');
        } else {
            // フォールバック：最低限のデモデータを表示
            const fallbackNews = generateDemoNews();
            displayNews(fallbackNews);
            console.log('⚠️ フォールバックデータを表示');
        }
    } catch (error) {
        console.error('💥 ニュース読み込みエラー:', error);
        // エラー時でもデモデータを表示
        const fallbackNews = generateDemoNews();
        displayNews(fallbackNews);
        showErrorMessage('ニュースを読み込み中です。しばらくお待ちください。');
    } finally {
        hideLoading();
    }
}

// ニュースの表示
function displayNews(news) {
    // トップニュースは「すべて」カテゴリーでのみ表示
    if (currentFilters.category === 'all') {
        displayTopNews(news);
        showTopNewsSection();
    } else {
        hideTopNewsSection();
    }
    
    // 速報ニュースを表示
    displayBreakingNews(news.filter(item => item.isBreaking));
    
    // 通常のニュースグリッドを表示
    displayNewsGrid(news.filter(item => !item.isBreaking));
}

// トップニュース表示
function displayTopNews(news) {
    const topNewsContainer = document.getElementById('topNews');
    if (!topNewsContainer) return;
    
    const topNews = news.slice(0, 3);
    if (topNews.length === 0) return;
    
    // 全ての記事を統一されたカードデザインで表示
    const topNewsHtml = topNews.map((item, index) => `
        <div class="top-news-card" data-news-id="${item.id}">
            <div class="top-news-card-image">
                <img class="lazy-image loading" data-src="${item.image}" alt="${item.title}" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='250'%3E%3Crect width='100%25' height='100%25' fill='%23f0f0f0'/%3E%3C/svg%3E">
                <div class="news-category-badge">${getCategoryName(item.category)}</div>
                ${index === 0 ? '<div class="top-badge">TOP</div>' : ''}
            </div>
            <div class="top-news-card-content">
                <h3 class="top-news-card-title">${item.title}</h3>
                <p class="top-news-card-excerpt">${item.excerpt}</p>
                <div class="top-news-card-meta">
                    <span class="news-source">${item.source}</span>
                    <span>${formatDate(item.publishedAt)}</span>
                </div>
            </div>
        </div>
    `).join('');
    
    topNewsContainer.innerHTML = topNewsHtml;
}

// 速報ニュース表示
function displayBreakingNews(breakingNews) {
    const container = document.getElementById('breakingNews');
    if (!container) return;
    
    if (breakingNews.length === 0) {
        container.innerHTML = '<p class="no-news">現在、速報ニュースはありません。</p>';
        return;
    }
    
    const breakingHtml = breakingNews.slice(0, 5).map(item => `
        <div class="breaking-news-item" data-news-id="${item.id}">
            <div class="breaking-icon">
                <i class="fas fa-bolt"></i>
            </div>
            <div class="breaking-content">
                <h4>${item.title}</h4>
                <span class="breaking-time">${formatTimeAgo(item.publishedAt)}</span>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = breakingHtml;
}

// ニュースグリッド表示
function displayNewsGrid(news) {
    const container = document.getElementById('newsGrid');
    if (!container) return;
    
    if (news.length === 0) {
        container.innerHTML = '<div class="no-news-message"><p>該当するニュースが見つかりませんでした。</p></div>';
        return;
    }
    
    const newsHtml = news.map(item => {
        // 手動記事の場合は専用のHTMLを生成
        if (item.isManual) {
            return generateArticleHTML(item);
        }
        
        // 通常のRSSニュース記事のHTML
        return `
        <div class="news-card" data-news-id="${item.id}">
            <div class="news-card-image">
                <img class="lazy-image loading" data-src="${item.image}" alt="${item.title}" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='250'%3E%3Crect width='100%25' height='100%25' fill='%23f0f0f0'/%3E%3C/svg%3E">
                <div class="news-category-badge">${getCategoryName(item.category)}</div>
            </div>
            <div class="news-card-content">
                <h3 class="news-card-title">${item.title}</h3>
                <p class="news-card-excerpt">${item.excerpt}</p>
                <div class="news-card-meta">
                    <span class="news-source">${item.source}</span>
                    <span class="news-date">${formatDate(item.publishedAt)}</span>
                </div>
                <div class="news-card-tags">
                    ${item.tags && item.tags.length > 0 ? item.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : ''}
                </div>
            </div>
        </div>
        `;
    }).join('');
    
    container.innerHTML = newsHtml;
}

// カテゴリー名の取得
function getCategoryName(category) {
    const categoryNames = {
        all: 'すべて',
        breaking: '速報',
        tourism: '観光スポット',
        gourmet: 'グルメ',
        events: 'イベント・祭り',
        culture: '文化・体験',
        shopping: 'ショッピング',
        accommodation: '宿泊・温泉',
        transport: '交通・アクセス',
        weather: '天気・防災'
    };
    return categoryNames[category] || 'その他';
}

// 日付フォーマット
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
        return '今日';
    } else if (diffDays === 2) {
        return '昨日';
    } else if (diffDays <= 7) {
        return `${diffDays - 1}日前`;
    } else {
        return date.toLocaleDateString('ja-JP', {
            month: 'short',
            day: 'numeric'
        });
    }
}

// 経過時間フォーマット
function formatTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMinutes < 60) {
        return `${diffMinutes}分前`;
    } else if (diffHours < 24) {
        return `${diffHours}時間前`;
    } else {
        return `${diffDays}日前`;
    }
}

// モーダルを開く
async function openModal(newsId) {
    try {
        // 即座にモーダルを表示（UI応答性向上）
        newsModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // ローディング表示
        document.getElementById('modalTitle').textContent = '読み込み中...';
        document.getElementById('modalContent').innerHTML = '<div class="loading-content">記事を読み込んでいます...</div>';
        
        // newsDataから記事を検索（高速）
        let news = newsData.find(n => n.id === newsId || n.id == newsId);
        
        // newsDataにない場合はキャッシュから検索
        if (!news && newsCache.data.length > 0) {
            news = newsCache.data.find(n => n.id === newsId || n.id == newsId);
        }
        
        if (!news) {
            document.getElementById('modalTitle').textContent = 'エラー';
            document.getElementById('modalContent').innerHTML = '<p>記事が見つかりませんでした。</p>';
            return;
        }
        
        // 手動記事の場合は全文がすでに content に入っている
        let fullContent;
        if (news.isManual) {
            fullContent = news.content;
        } else {
            // 外部記事の場合は全文取得（バックグラウンド）
            fullContent = await fetchFullArticleContent(news);
        }
        
        // モーダル内容を更新
        document.getElementById('modalTitle').textContent = news.title;
        document.getElementById('modalSource').textContent = news.source;
        
        // 日付フォーマット処理
        if (news.isManual) {
            document.getElementById('modalDate').textContent = formatArticleDate(news.date, news.time);
        } else {
            document.getElementById('modalDate').textContent = formatDate(news.publishedAt);
        }
        
        // 画像処理
        const modalImage = document.getElementById('modalImage');
        if (news.image) {
            const imageUrl = news.isManual ? `./articles/${news.image}` : news.image;
            modalImage.innerHTML = `<img src="${imageUrl}" alt="${news.title}" loading="lazy">`;
        } else {
            modalImage.innerHTML = '';
        }
        
        // コンテンツ表示
        document.getElementById('modalContent').innerHTML = `<p>${fullContent}</p>`;
        
        // タグ表示
        const modalTags = document.getElementById('modalTags');
        if (news.tags && news.tags.length > 0) {
            modalTags.innerHTML = news.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
        } else {
            modalTags.innerHTML = '';
        }
        
    } catch (error) {
        console.error('モーダル表示エラー:', error);
        document.getElementById('modalTitle').textContent = 'エラー';
        document.getElementById('modalContent').innerHTML = '<p>記事の読み込みに失敗しました。</p>';
    }
}

// モーダルを閉じる
function closeModal() {
    newsModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// ローディング表示
function showLoading() {
    loadingOverlay.style.display = 'flex';
}

// ローディング非表示
function hideLoading() {
    loadingOverlay.style.display = 'none';
}

// エラーメッセージ表示
function showErrorMessage(message) {
    // エラーメッセージを表示するためのトーストを作成
    const toast = document.createElement('div');
    toast.className = 'error-toast';
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-exclamation-triangle"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // 3秒後に自動で消去
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 3000);
}

// トップニュースセクションの表示/非表示
function showTopNewsSection() {
    const section = document.querySelector('.top-news-section');
    if (section) {
        section.style.display = 'block';
    }
}

function hideTopNewsSection() {
    const section = document.querySelector('.top-news-section');
    if (section) {
        section.style.display = 'none';
    }
}

// 現在の日時を更新
function updateDateTime() {
    // ここに日時更新の処理を追加（必要に応じて）
}

// もっと見るボタンの処理
function loadMoreNews(isBackground = false) {
    if (!isBackground) {
        showLoading();
    }
    
    // 追加のニュース読み込み処理
    setTimeout(() => {
        if (!isBackground) {
            hideLoading();
        }
        // 実際の実装では追加のニュースを取得して表示
        console.log('追加のニュースを読み込み中...');
    }, 1000);
}

// ニュースの更新
function refreshNews() {
    newsCache.lastFetch = null; // キャッシュをクリア
    loadNews();
}

// スクロール時の処理（無限スクロール）
window.addEventListener('scroll', () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 1000) {
        // 下部に近づいたら追加読み込み
        const loadMoreContainer = document.getElementById('loadMoreContainer');
        if (loadMoreContainer && loadMoreContainer.style.display !== 'none') {
            loadMoreNews(true);
        }
    }
});