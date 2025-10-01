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
            category: 'regional',
            region: 'all'
        },
        {
            name: 'Yahoo!ニュース - 国内',
            url: 'https://news.yahoo.co.jp/rss/topics/domestic.xml',
            category: 'social',
            region: 'all'
        },
        {
            name: 'NHK NEWS WEB - 地域',
            url: 'https://www3.nhk.or.jp/rss/news/cat07.xml',
            category: 'regional',
            region: 'all'
        },
        {
            name: '毎日新聞 - 地方版',
            url: 'https://mainichi.jp/rss/etc/local.rss',
            category: 'regional',
            region: 'all'
        },
        {
            name: '朝日新聞 - 地域',
            url: 'https://www.asahi.com/rss/asahi_newsheadlines.rdf',
            category: 'social',
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
            name: 'ことりっぷ - 旅行情報',
            url: 'https://co-trip.jp/feed/',
            category: 'tourism',
            region: 'all'
        },
        {
            name: 'まぐまぐニュース - 地域・観光',
            url: 'https://www.mag2.com/p/news/rss',
            category: 'regional',
            region: 'all'
        },
        {
            name: 'NAVITIME Travel - 地域情報',
            url: 'https://travel.navitime.com/ja/area/jp/feed/',
            category: 'tourism',
            region: 'all'
        },
        {
            name: 'おでかけガイド - 地域イベント',
            url: 'https://odekake.info/feed/',
            category: 'event',
            region: 'all'
        },
        
        // === 地域別特化フィード ===
        {
            name: '北海道新聞 - 道内総合',
            url: 'https://www.hokkaido-np.co.jp/rss/news/dogai.xml',
            category: 'regional',
            region: 'hokkaido'
        },
        {
            name: '河北新報 - 東北のニュース',
            url: 'https://kahoku.news/rss/news.xml',
            category: 'regional',
            region: 'tohoku'
        },
        {
            name: '信濃毎日新聞 - 長野',
            url: 'https://www.shinmai.co.jp/rss/news.xml',
            category: 'regional',
            region: 'nagano'
        },
        {
            name: '中日新聞 - 東海',
            url: 'https://www.chunichi.co.jp/rss/news.xml',
            category: 'regional',
            region: 'tokai'
        },
        {
            name: '京都新聞 - 滋賀・京都',
            url: 'https://www.kyoto-np.co.jp/rss/news.xml',
            category: 'regional',
            region: 'kyoto'
        },
        {
            name: '神戸新聞 - 兵庫',
            url: 'https://www.kobe-np.co.jp/rss/news.xml',
            category: 'regional',
            region: 'hyogo'
        },
        {
            name: '中国新聞 - 中国地方',
            url: 'https://www.chugoku-np.co.jp/rss/news.xml',
            category: 'regional',
            region: 'chugoku'
        },
        {
            name: '西日本新聞 - 九州',
            url: 'https://www.nishinippon.co.jp/rss/news.xml',
            category: 'regional',
            region: 'kyushu'
        },
        {
            name: '沖縄タイムス - 沖縄',
            url: 'https://www.okinawatimes.co.jp/rss/news.xml',
            category: 'regional',
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
            category: 'regional',
            region: 'tokyo'
        },
        {
            name: '大阪市 - 市政ニュース',
            url: 'https://www.city.osaka.lg.jp/rss/news.xml',
            category: 'regional',
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
            category: 'regional',
            region: 'kanagawa'
        },
        
        // === 国際ニュース（補完） ===
        {
            name: '地域ドットコム - 全国地域情報',
            url: 'https://chiiki.com/feed/',
            category: 'regional',
            region: 'all'
        },
        {
            name: 'Walkerplus - イベント・グルメ',
            url: 'https://www.walkerplus.com/feed/',
            category: 'event',
            region: 'all'
        },
        {
            name: 'いこーよ - ファミリーお出かけ',
            url: 'https://iko-yo.net/feed',
            category: 'family',
            region: 'all'
        },
        {
            name: 'ローカルニュースネット',
            url: 'https://localnews.jp/feed/',
            category: 'regional',
            region: 'all'
        },
        {
            name: 'ぐるなび - 地域グルメ情報',
            url: 'https://www.gnavi.co.jp/feed/',
            category: 'gourmet',
            region: 'all'
        }
    ]
};

// ニュースデータのキャッシュ
let newsCache = {
    data: [],
    lastFetch: null,
    expireTime: 5 * 60 * 1000 // 5分（テスト用に短縮）
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
        
        // 即座に外部RSS取得を開始
        console.log('🌐 外部RSS取得開始（即座実行）');
        const allNews = [];
        let successCount = 0;
        let errorCount = 0;

        // 全てのRSSフィードを試行（最初の10個のみ高速化）
        const feedsToTry = NEWS_API_CONFIG.rssFeeds.slice(0, 15); // 15個に制限で高速化
        console.log(`📡 ${feedsToTry.length}個のRSSフィードを同時取得中...`);

        // 逐次表示用の処理：取得完了した記事から順次表示
        const fetchPromises = feedsToTry.map(async (feed, index) => {
            try {
                const rssNews = await Promise.race([
                    fetchRSSFeed(feed),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('タイムアウト')), 2000)) // 2秒に短縮
                ]);
                successCount++;
                console.log(`✅ ${feed.name}: ${rssNews.length}記事取得`);

                // 取得完了した記事を即座に追加・表示
                if (rssNews.length > 0) {
                    const newArticles = await processNewsData(rssNews);
                    allNews.push(...newArticles);

                    // newsDataに追加して即座に表示更新
                    newsData.push(...newArticles);
                    newsData.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

                    // UIを即座に更新
                    displayNews(newsData);
                    console.log(`🔄 ${feed.name}の${newArticles.length}記事を表示に追加`);
                }

                return rssNews;
            } catch (error) {
                errorCount++;
                if (error.message !== 'タイムアウト') {
                    console.warn(`❌ ${feed.name}: ${error.message}`);
                }
                return [];
            }
        });

        // バックグラウンドで残りの処理を完了
        Promise.all(fetchPromises).then(() => {
            console.log(`📊 RSS取得完了: 成功 ${successCount}件 / 失敗 ${errorCount}件`);
            newsCache.data = allNews;
            newsCache.lastFetch = now;
            console.log(`🎉 全記事取得完了: ${allNews.length}記事`);
        });

        // 最初の数個の記事が表示されたらローディングを非表示
        await new Promise(resolve => setTimeout(resolve, 800));

        // 少しでも記事が取得できていればローディングを非表示
        if (allNews.length > 0) {
            hideLoading();
        }

        return allNews;
        
    } catch (error) {
        console.error('💥 ニュース取得エラー:', error);
        // エラー時は空配列を返す
        return [];
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
        // 地域・行政ニュース（優先度高）
        regional: ['市長', '知事', '議会', '市議', '県議', '選挙', '市政', '県政', '行政', '自治体', '住民', '地域', '市民', '県民', '市役所', '県庁', '発表', '決定', '条例', '予算'],

        // 経済・ビジネス
        business: ['経済', 'ビジネス', '企業', '会社', '商売', '売上', '業績', '投資', '株価', '市場', '商工会', '産業', '製造', '工場', '開発', '建設', '不動産', '求人', '雇用', '就職'],

        // 社会・事件
        social: ['事故', '事件', '火災', '救急', '警察', '逮捕', '被害', '犯罪', '裁判', '判決', '社会', '問題', '課題', '対策', '改善', '制度', '法律', '規制'],

        // 防災・安全
        disaster: ['台風', '地震', '津波', '豪雨', '洪水', '土砂崩れ', '避難', '警報', '注意報', '防災', '災害', '被災', '復旧', '復興', '安全', '危険', '緊急'],

        // 交通・インフラ
        transport: ['交通', '電車', 'バス', '道路', '高速', '渋滞', '工事', '運休', '遅延', '開通', '新線', '駅', '空港', '港', 'アクセス', '運行', '路線', 'ダイヤ'],

        // 教育・学校
        education: ['学校', '教育', '生徒', '学生', '児童', '授業', '入学', '卒業', '受験', '試験', '大学', '高校', '中学', '小学', '幼稚園', '保育園', '先生', '教師', '校長'],

        // 医療・健康
        health: ['病院', '医療', '健康', '医師', '看護', '治療', '診療', '検診', '予防', '感染', 'ワクチン', '薬', '患者', '介護', '福祉', '高齢者'],

        // スポーツ
        sports: ['スポーツ', '野球', 'サッカー', 'バスケ', 'テニス', 'ゴルフ', '陸上', '水泳', '試合', '大会', '優勝', '選手', 'チーム', '監督'],

        // グルメ・食
        gourmet: ['グルメ', '料理', '食べ物', 'レストラン', '食事', 'カフェ', 'ラーメン', '寿司', '居酒屋', '食堂', '名物', '特産', '地酒', '弁当', '食材', '農産物'],

        // イベント・祭り
        events: ['イベント', 'フェスティバル', 'コンサート', '展示', '祭り', '花火', '桜', '紅葉', 'ライトアップ', '催し', '開催', '参加', '体験'],

        // 文化・芸術
        culture: ['文化', '芸術', '美術館', '博物館', '伝統', '工芸', '歴史', '遺跡', '文化財', '展覧会', 'アート', '芸能', '音楽', '演劇'],

        // 観光（最後に判定）
        tourism: ['観光', '旅行', 'スポット', '名所', '見どころ', 'ホテル', '温泉', '宿泊', '旅館', 'ツアー', '観光客', '訪問']
    };

    // 優先順位に従ってカテゴリを判定
    for (const [category, keywords] of Object.entries(categories)) {
        if (keywords.some(keyword => text.includes(keyword))) {
            return category;
        }
    }

    // どのカテゴリにも該当しない場合は地域・行政にデフォルト設定
    return 'regional';
}

// タグの抽出
function extractTags(text) {
    const keywords = ['観光', 'グルメ', 'イベント', '文化', '交通', '宿泊', '天気', '防災'];
    return keywords.filter(keyword => text.includes(keyword)).slice(0, 3);
}

// 一時的なデモニュース生成（外部RSS取得失敗時のフォールバック）

async function processNewsData(newsArray) {
    // 重複除去、ソート、データクリーニング
    const uniqueNews = newsArray.filter((news, index, self) =>
        index === self.findIndex(n => n.title === news.title)
    );

    // 記事内容に基づいてカテゴリを再分類
    for (const news of uniqueNews) {
        // タイトルと説明文から適切なカテゴリを判定
        const contentBasedCategory = categorizeNews(news.title, news.excerpt || news.description || '');

        // 元のカテゴリが 'tourism' または 'all' の場合のみ上書き
        if (news.category === 'tourism' || news.category === 'all' || news.category === 'event') {
            news.category = contentBasedCategory;
        }

        // 画像を動的に取得
        await enhanceNewsImage(news);

        console.log(`📊 カテゴリ判定: "${news.title}" → ${news.category}`);
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
        
        // RSSニュースを読み込み
        const externalNews = await fetchExternalNews();
        console.log(`外部ニュース: ${externalNews.length}件読み込み`);
        
        // newsDataを初期化
        newsData.length = 0;

        // 外部ニュースを追加
        if (externalNews.length > 0) {
            newsData.push(...externalNews);
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
        
        // エラー時は何も表示しない
        console.log('❌ 記事を読み込めませんでした');
        
        hideLoading();
    }
}

// 初期化
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 サイト初期化開始');

    try {
        // 基本的な要素が存在するか確認
        const newsGrid = document.getElementById('newsGrid');
        const topNews = document.getElementById('topNews');
        const breakingNews = document.getElementById('breakingNews');
        const modalElements = {
            newsModal: !!newsModal,
            modalTitle: !!document.getElementById('modalTitle'),
            modalContent: !!document.getElementById('modalContent'),
            modalClose: !!document.getElementById('modalClose')
        };

        console.log('📋 DOM要素確認:', {
            newsGrid: !!newsGrid,
            topNews: !!topNews,
            breakingNews: !!breakingNews,
            modalElements: modalElements
        });

        console.log('✅ DOM初期化完了');
    } catch (error) {
        console.error('DOM初期化エラー:', error);
    }

    // 基本イベントリスナーを設定
    initializeEventListeners();
    initializeLazyLoading();

    // 記事を読み込み
    await loadAllNews();

    // その他の初期化
    updateDateTime();
    setInterval(updateDateTime, 60000);
    updateRegionDisplay('all');

    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            loadMoreNews(false);
        });
    }

    console.log('✅ 全初期化完了');
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
    console.log('🖱️ クリックイベント発生:', e.target);

    // パフォーマンス最適化：特定の要素のみで処理
    if (e.target.tagName === 'A' || e.target.closest('a')) {
        console.log('🔗 リンク要素なのでスキップ');
        return; // リンク要素はそのまま処理
    }

    // より具体的にdata-news-idを持つ要素を探す
    const newsCard = e.target.closest('[data-news-id]');
    console.log('🎯 見つかったカード:', newsCard);

    // より詳細な情報をログ出力
    console.log('🔍 クリック詳細:', {
        target: e.target,
        targetClass: e.target.className,
        targetParent: e.target.parentElement,
        targetParentClass: e.target.parentElement?.className
    });

    if (newsCard) {
        e.preventDefault();
        e.stopPropagation();

        const newsId = newsCard.getAttribute('data-news-id');
        console.log('🆔 ニュースID:', newsId);
        console.log('🔍 モーダル要素確認:', !!newsModal);

        if (newsId) {
            // 高速化：debounce不要、即座に開く
            console.log('📂 モーダル開始前チェック完了');
            openModal(newsId);
        } else {
            console.error('❌ data-news-idが見つかりません');
        }
    } else {
        console.log('📋 対象外の要素がクリックされました');
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
    console.log('🎯 displayNews実行:', {
        newsCount: news.length,
        currentCategory: currentFilters.category,
        newsData: news.slice(0, 3)
    });

    // トップニュースは「すべて」カテゴリーでのみ表示
    if (currentFilters.category === 'all') {
        console.log('📰 トップニュース表示開始');
        displayTopNews(news);
        showTopNewsSection();
    } else {
        hideTopNewsSection();
    }

    // 速報ニュースを表示
    const breakingNews = news.filter(item => item.isBreaking);
    console.log('⚡ 速報ニュース:', breakingNews.length + '件');
    displayBreakingNews(breakingNews);

    // 通常のニュースグリッドを表示
    const regularNews = news.filter(item => !item.isBreaking);
    console.log('📄 通常ニュース:', regularNews.length + '件');
    displayNewsGrid(regularNews);
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
    console.log('⚡ displayBreakingNews開始:', breakingNews.length + '件');
    const container = document.getElementById('breakingNews');
    if (!container) {
        console.error('❌ 速報ニュースコンテナが見つかりません');
        return;
    }

    if (breakingNews.length === 0) {
        console.log('📭 速報ニュースが0件のため、メッセージを表示');
        container.innerHTML = '<p class="no-news">速報記事を準備中です。</p>';
        return;
    }

    const breakingHtml = breakingNews.slice(0, 5).map(item => {
        console.log('⚡ 速報記事HTML生成中:', { id: item.id, title: item.title });
        return `
        <div class="breaking-news-item" data-news-id="${item.id}">
            <div class="breaking-icon">
                <i class="fas fa-bolt"></i>
            </div>
            <div class="breaking-content">
                <h4>${item.title}</h4>
                <span class="breaking-time">${formatTimeAgo(item.publishedAt)}</span>
            </div>
        </div>
        `;
    }).join('');

    console.log('⚡ 速報HTML挿入中...');
    container.innerHTML = breakingHtml;
    console.log('✅ 速報ニュース挿入完了');
}

// ニュースグリッド表示
function displayNewsGrid(news) {
    console.log('🗂️ displayNewsGrid開始:', news.length + '件');
    const container = document.getElementById('newsGrid');
    if (!container) {
        console.error('❌ newsGridコンテナが見つかりません');
        return;
    }

    if (news.length === 0) {
        console.log('📭 ニュースが0件のため、メッセージを表示');
        container.innerHTML = '<div class="no-news-message"><p>記事を準備中です。</p></div>';
        return;
    }
    
    const newsHtml = news.map(item => {
        console.log('📝 記事HTMLを生成中:', { id: item.id, title: item.title, isManual: item.isManual });

        // 手動記事の場合は専用のHTMLを生成
        if (item.isManual) {
            const manualHtml = generateArticleHTML(item);
            console.log('🔧 手動記事HTML生成完了:', item.id);
            return manualHtml;
        }

        // 通常のRSSニュース記事のHTML
        const regularHtml = `
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
        console.log('🔧 通常記事HTML生成完了:', item.id);
        return regularHtml;
    }).join('');

    console.log('📋 最終HTML結合完了、DOM挿入中...');
    container.innerHTML = newsHtml;
    console.log('✅ ニュースグリッド挿入完了');
}

// カテゴリー名の取得
function getCategoryName(category) {
    const categoryNames = {
        all: 'すべて',
        regional: '地域・行政',
        business: '経済・ビジネス',
        social: '社会・事件',
        sports: 'スポーツ',
        tourism: '観光スポット',
        gourmet: 'グルメ',
        events: 'イベント・祭り',
        culture: '文化・芸術',
        health: '医療・健康',
        education: '教育・学校',
        transport: '交通・アクセス',
        disaster: '防災・安全'
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
    console.log('🔍 モーダル開始:', newsId);

    // モーダル要素の存在確認
    if (!newsModal) {
        console.error('❌ newsModal要素が見つかりません');
        return;
    }

    try {
        // 即座にモーダルを表示（UI応答性向上）
        console.log('📂 モーダル表示開始');
        newsModal.classList.add('show');

        // モーダルのスタイル状態をログ出力
        console.log('🎨 モーダルスタイル確認:', {
            display: newsModal.style.display,
            visibility: newsModal.style.visibility,
            opacity: newsModal.style.opacity,
            zIndex: newsModal.style.zIndex,
            computedDisplay: window.getComputedStyle(newsModal).display,
            computedVisibility: window.getComputedStyle(newsModal).visibility
        });
        // スクロール位置を保存してからスクロールを無効化
        const scrollY = window.scrollY;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';

        // ローディング表示
        document.getElementById('modalTitle').textContent = '読み込み中...';
        document.getElementById('modalContent').innerHTML = '<div class="loading-content">記事を読み込んでいます...</div>';

        // newsDataから記事を検索（高速）
        console.log('🔍 記事検索中:', { newsId, newsDataLength: newsData.length });
        let news = newsData.find(n => n.id === newsId || n.id == newsId);
        
        // newsDataにない場合はキャッシュから検索
        if (!news && newsCache.data.length > 0) {
            news = newsCache.data.find(n => n.id === newsId || n.id == newsId);
        }
        
        if (!news) {
            console.error('❌ 記事が見つかりません:', newsId);
            document.getElementById('modalTitle').textContent = 'エラー';
            document.getElementById('modalContent').innerHTML = '<p>記事を準備中です。しばらくお待ちください。</p>';
            return;
        }

        console.log('✅ 記事見つかりました:', { id: news.id, title: news.title, isManual: news.isManual });
        
        // コンテンツを即座に表示（フリーズ回避）
        let fullContent;
        if (news.isManual) {
            fullContent = news.content;
        } else {
            // 外部記事の場合は既存のexcerptまたはcontentを使用
            fullContent = news.content || news.excerpt || 'この記事の詳細は元サイトでご確認ください。';
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
        
        // コンテンツ表示（改行を維持）
        const formattedContent = fullContent.replace(/\n/g, '<br>');
        let modalContentHtml = `<div class="article-content">${formattedContent}</div>`;

        // 手動記事の場合は位置情報も表示
        if (news.isManual && news.location) {
            modalContentHtml += `<div class="article-location"><i class="fas fa-map-marker-alt"></i> ${news.location}</div>`;
        }

        // 外部記事の場合は元記事リンクを表示
        if (!news.isManual && news.originalUrl) {
            modalContentHtml += `<div class="article-link">
                <a href="${news.originalUrl}" target="_blank" rel="noopener noreferrer">
                    <i class="fas fa-external-link-alt"></i> 元記事を読む
                </a>
            </div>`;
        }

        document.getElementById('modalContent').innerHTML = modalContentHtml;
        
        // タグ表示
        const modalTags = document.getElementById('modalTags');
        if (news.tags && news.tags.length > 0) {
            modalTags.innerHTML = news.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
        } else {
            modalTags.innerHTML = '';
        }
        
    } catch (error) {
        console.error('💥 モーダル表示エラー:', error);

        // エラー時でもモーダルは正常に表示
        try {
            document.getElementById('modalTitle').textContent = 'エラーが発生しました';
            document.getElementById('modalContent').innerHTML = `
                <div class="error-content">
                    <p>記事の読み込み中にエラーが発生しました。</p>
                    <p>しばらく時間をおいてから再度お試しください。</p>
                    <details>
                        <summary>技術詳細</summary>
                        <pre>${error.message}</pre>
                    </details>
                </div>
            `;
        } catch (e) {
            console.error('💥💥 モーダルエラー表示もできませんでした:', e);
            // 最後の手段：モーダルを閉じる
            closeModal();
        }
    }
}

// モーダルを閉じる
function closeModal() {
    newsModal.classList.remove('show');
    // スクロール位置を復元
    const scrollY = document.body.style.top;
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    document.body.style.overflowY = '';
    document.documentElement.style.overflow = '';

    // スクロール位置を復元
    if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
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