// 手動記事読み込み機能

class ManualArticleLoader {
    constructor() {
        this.articles = [];
        this.articlesPath = './articles/';
    }

    // 記事フォルダから全記事を読み込み
    async loadAllArticles() {
        try {
            // サーバーから記事一覧を取得
            const response = await fetch('/api/articles');
            if (!response.ok) {
                throw new Error('記事の読み込みに失敗しました');
            }
            
            const articleFiles = await response.json();
            const loadedArticles = [];

            // 各記事ファイルを読み込み
            for (const file of articleFiles) {
                try {
                    const articleResponse = await fetch(`/api/articles/${file}`);
                    if (articleResponse.ok) {
                        const articleData = await articleResponse.json();
                        
                        // 記事データの検証と正規化
                        const article = this.validateAndNormalizeArticle(articleData, file);
                        if (article) {
                            loadedArticles.push(article);
                        }
                    }
                } catch (error) {
                    console.warn(`記事ファイル ${file} の読み込みでエラー:`, error);
                }
            }

            // 日付順でソート（新しい順）
            loadedArticles.sort((a, b) => {
                const dateA = new Date(`${a.date} ${a.time || '00:00'}`);
                const dateB = new Date(`${b.date} ${b.time || '00:00'}`);
                return dateB - dateA;
            });

            this.articles = loadedArticles;
            console.log(`${loadedArticles.length}件の記事を読み込みました`);
            
            return this.articles;
        } catch (error) {
            console.error('記事読み込みエラー:', error);
            return [];
        }
    }

    // 記事データの検証と正規化
    validateAndNormalizeArticle(data, filename) {
        // 必須フィールドのチェック
        if (!data.title || !data.content || !data.date) {
            console.warn(`記事 ${filename} に必須フィールドが不足しています`);
            return null;
        }

        // 記事オブジェクトを正規化
        return {
            id: this.generateId(filename, data.date, data.time),
            title: data.title,
            category: data.category || 'その他',
            location: data.location || '',
            date: data.date,
            time: data.time || '00:00',
            content: data.content,
            source: data.source || '地域ニュース',
            tags: Array.isArray(data.tags) ? data.tags : [],
            priority: data.priority || 'normal',
            image: data.image || null,
            filename: filename,
            isManual: true // 手動記事であることを示すフラグ
        };
    }

    // 記事IDを生成
    generateId(filename, date, time) {
        const cleanFilename = filename.replace(/\.[^/.]+$/, ''); // 拡張子を除去
        return `manual_${date}_${time || '0000'}_${cleanFilename}`.replace(/[^a-zA-Z0-9_-]/g, '_');
    }

    // カテゴリ別記事取得
    getArticlesByCategory(category) {
        return this.articles.filter(article => article.category === category);
    }

    // 地域別記事取得
    getArticlesByLocation(location) {
        return this.articles.filter(article => 
            article.location.includes(location)
        );
    }

    // タグ別記事取得
    getArticlesByTag(tag) {
        return this.articles.filter(article => 
            article.tags.includes(tag)
        );
    }

    // 優先度別記事取得
    getArticlesByPriority(priority) {
        return this.articles.filter(article => article.priority === priority);
    }

    // 記事検索
    searchArticles(query) {
        const lowerQuery = query.toLowerCase();
        return this.articles.filter(article => 
            article.title.toLowerCase().includes(lowerQuery) ||
            article.content.toLowerCase().includes(lowerQuery) ||
            article.location.toLowerCase().includes(lowerQuery) ||
            article.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
        );
    }

    // すべての記事を取得
    getAllArticles() {
        return this.articles;
    }

    // カテゴリ一覧を取得
    getCategories() {
        const categories = [...new Set(this.articles.map(article => article.category))];
        return categories.sort();
    }

    // 地域一覧を取得
    getLocations() {
        const locations = [...new Set(this.articles
            .map(article => article.location)
            .filter(location => location)
        )];
        return locations.sort();
    }

    // タグ一覧を取得
    getTags() {
        const allTags = this.articles.flatMap(article => article.tags);
        const uniqueTags = [...new Set(allTags)];
        return uniqueTags.sort();
    }
}

// グローバルインスタンス
window.manualArticleLoader = new ManualArticleLoader();

// 記事表示用ヘルパー関数
function formatArticleDate(date, time) {
    const articleDate = new Date(`${date} ${time || '00:00'}`);
    const now = new Date();
    const diffTime = now - articleDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
        return '今日';
    } else if (diffDays === 1) {
        return '昨日';
    } else if (diffDays < 7) {
        return `${diffDays}日前`;
    } else {
        return articleDate.toLocaleDateString('ja-JP');
    }
}

function getPriorityBadgeClass(priority) {
    switch (priority) {
        case 'high': return 'badge-priority-high';
        case 'low': return 'badge-priority-low';
        default: return 'badge-priority-normal';
    }
}

// 記事HTMLを生成（既存のニュースカードスタイルに合わせる）
function generateArticleHTML(article) {
    const priorityBadge = article.priority !== 'normal' ? 
        `<div class="priority-badge ${getPriorityBadgeClass(article.priority)}">${article.priority}</div>` : '';
    
    const imageUrl = article.image ? 
        `./articles/${article.image}` : 
        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="250"%3E%3Crect width="100%25" height="100%25" fill="%23f0f0f0"/%3E%3C/svg%3E';
    
    const tagsHTML = article.tags.length > 0 ? 
        `<div class="news-card-tags">${article.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>` : '';
    
    return `
        <div class="news-card manual-article" data-news-id="${article.id}">
            <div class="news-card-image">
                <img class="lazy-image" src="${imageUrl}" alt="${article.title}">
                <div class="news-category-badge">${article.category}</div>
                ${priorityBadge}
            </div>
            <div class="news-card-content">
                <h3 class="news-card-title">${article.title}</h3>
                <p class="news-card-excerpt">${article.content.substring(0, 150)}${article.content.length > 150 ? '...' : ''}</p>
                <div class="news-card-meta">
                    <span class="news-source">${article.source}</span>
                    <span class="news-date">${formatArticleDate(article.date, article.time)}</span>
                    ${article.location ? `<span class="news-location">${article.location}</span>` : ''}
                </div>
                ${tagsHTML}
            </div>
        </div>
    `;
}