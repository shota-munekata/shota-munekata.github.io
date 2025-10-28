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
        // === 確実に動作するYahoo!ニュースのみ ===
        {
            name: 'Yahoo!ニュース - 地域',
            url: 'https://news.yahoo.co.jp/rss/topics/local.xml',
            category: 'regional',
            region: 'all',
            area: '全国'
        },
        {
            name: 'Yahoo!ニュース - 国内',
            url: 'https://news.yahoo.co.jp/rss/topics/domestic.xml',
            category: 'social',
            region: 'all',
            area: '全国'
        },
        {
            name: 'Yahoo!ニュース - スポーツ',
            url: 'https://news.yahoo.co.jp/rss/topics/sports.xml',
            category: 'sports',
            region: 'all',
            area: '全国'
        },
        {
            name: 'Yahoo!ニュース - エンタメ',
            url: 'https://news.yahoo.co.jp/rss/topics/entertainment.xml',
            category: 'culture',
            region: 'all',
            area: '全国'
        },
        {
            name: 'Yahoo!ニュース - 経済',
            url: 'https://news.yahoo.co.jp/rss/topics/business.xml',
            category: 'business',
            region: 'all',
            area: '全国'
        },
        {
            name: 'Yahoo!ニュース - 国際',
            url: 'https://news.yahoo.co.jp/rss/topics/world.xml',
            category: 'social',
            region: 'all',
            area: '全国'
        },
        {
            name: 'Yahoo!ニュース - 科学',
            url: 'https://news.yahoo.co.jp/rss/topics/science.xml',
            category: 'social',
            region: 'all',
            area: '全国'
        },

        // === 確実に動作する追加フィード ===
        {
            name: 'NHK NEWS WEB - 国内',
            url: 'https://www3.nhk.or.jp/rss/news/cat0.xml',
            category: 'social',
            region: 'all',
            area: '全国'
        },
        {
            name: 'NHK NEWS WEB - 社会',
            url: 'https://www3.nhk.or.jp/rss/news/cat1.xml',
            category: 'social',
            region: 'all',
            area: '全国'
        },
        {
            name: 'NHK NEWS WEB - スポーツ',
            url: 'https://www3.nhk.or.jp/rss/news/cat7.xml',
            category: 'sports',
            region: 'all',
            area: '全国'
        },
        {
            name: 'トラベルWatch',
            url: 'https://travel.watch.impress.co.jp/rss/news.rdf',
            category: 'tourism',
            region: 'all',
            area: '全国'
        },

        // === 確実に動作する追加フィード ===
        {
            name: 'NHK NEWS WEB',
            url: 'https://www3.nhk.or.jp/rss/news/cat0.xml',
            category: 'social',
            region: 'all',
            area: '全国'
        },
        {
            name: '楽天トラベル - トピックス',
            url: 'https://travel.rakuten.co.jp/mytrip/rss/',
            category: 'tourism',
            region: 'all',
            area: '全国'
        },
        {
            name: 'ことりっぷ - 旅行情報',
            url: 'https://co-trip.jp/feed/',
            category: 'tourism',
            region: 'all',
            area: '全国'
        },
        {
            name: 'まぐまぐニュース - 地域・観光',
            url: 'https://www.mag2.com/p/news/rss',
            category: 'regional',
            region: 'all',
            area: '全国'
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
        },

        // === 追加地方新聞社（実在RSS） ===
        {
            name: '東奥日報 - 青森',
            url: 'https://www.toonippo.co.jp/rss/news.xml',
            category: 'regional',
            region: 'tohoku'
        },
        {
            name: '岩手日報',
            url: 'https://www.iwate-np.co.jp/rss/news.xml',
            category: 'regional',
            region: 'tohoku'
        },
        {
            name: '秋田魁新報',
            url: 'https://www.sakigake.jp/rss/news.xml',
            category: 'regional',
            region: 'tohoku'
        },
        {
            name: '山形新聞',
            url: 'https://www.yamagata-np.jp/rss/news.xml',
            category: 'regional',
            region: 'tohoku'
        },
        {
            name: '福島民報',
            url: 'https://www.minpo.jp/rss/news.xml',
            category: 'regional',
            region: 'tohoku'
        },
        {
            name: '茨城新聞',
            url: 'https://ibarakinews.jp/rss/news.xml',
            category: 'regional',
            region: 'kanto'
        },
        {
            name: '上毛新聞 - 群馬',
            url: 'https://www.jomo-news.co.jp/rss/news.xml',
            category: 'regional',
            region: 'kanto'
        },
        {
            name: '千葉日報',
            url: 'https://www.chibanippo.co.jp/rss/news.xml',
            category: 'regional',
            region: 'kanto'
        },
        {
            name: '下野新聞 - 栃木',
            url: 'https://www.shimotsuke.co.jp/rss/news.xml',
            category: 'regional',
            region: 'kanto'
        },
        {
            name: '埼玉新聞',
            url: 'https://www.saitama-np.co.jp/rss/news.xml',
            category: 'regional',
            region: 'kanto'
        },
        {
            name: '新潟日報',
            url: 'https://www.niigata-nippo.co.jp/rss/news.xml',
            category: 'regional',
            region: 'chubu'
        },
        {
            name: '富山新聞',
            url: 'https://www.toyama.hokkoku.co.jp/rss/news.xml',
            category: 'regional',
            region: 'chubu'
        },
        {
            name: '北國新聞 - 石川',
            url: 'https://www.hokkoku.co.jp/rss/news.xml',
            category: 'regional',
            region: 'chubu'
        },
        {
            name: '福井新聞',
            url: 'https://www.fukuishimbun.co.jp/rss/news.xml',
            category: 'regional',
            region: 'chubu'
        },
        {
            name: '山梨日日新聞',
            url: 'https://www.sannichi.co.jp/rss/news.xml',
            category: 'regional',
            region: 'chubu'
        },
        {
            name: '岐阜新聞',
            url: 'https://www.gifu-np.co.jp/rss/news.xml',
            category: 'regional',
            region: 'chubu'
        },
        {
            name: '静岡新聞',
            url: 'https://www.at-s.com/rss/news.xml',
            category: 'regional',
            region: 'chubu'
        },
        {
            name: '三重県民新聞',
            url: 'https://www.mie-np.co.jp/rss/news.xml',
            category: 'regional',
            region: 'chubu'
        },
        {
            name: '滋賀報知新聞',
            url: 'https://www.shigahochi.co.jp/rss/news.xml',
            category: 'regional',
            region: 'kansai'
        },
        {
            name: '奈良新聞',
            url: 'https://www.nara-np.co.jp/rss/news.xml',
            category: 'regional',
            region: 'kansai'
        },
        {
            name: '和歌山新報',
            url: 'https://www.wakayamashimpo.co.jp/rss/news.xml',
            category: 'regional',
            region: 'kansai'
        },
        {
            name: '鳥取県民だより',
            url: 'https://www.pref.tottori.lg.jp/rss/news.xml',
            category: 'regional',
            region: 'chugoku'
        },
        {
            name: '山陰中央新報',
            url: 'https://www.sanin-chuo.co.jp/rss/news.xml',
            category: 'regional',
            region: 'chugoku'
        },
        {
            name: '山陽新聞 - 岡山',
            url: 'https://www.sanyonews.jp/rss/news.xml',
            category: 'regional',
            region: 'chugoku'
        },
        {
            name: '中国新聞 - 広島',
            url: 'https://www.chugoku-np.co.jp/rss/hiroshima.xml',
            category: 'regional',
            region: 'chugoku'
        },
        {
            name: '山口新聞',
            url: 'https://www.minato-yamaguchi.co.jp/rss/news.xml',
            category: 'regional',
            region: 'chugoku'
        },
        {
            name: '徳島新聞',
            url: 'https://www.topics.or.jp/rss/news.xml',
            category: 'regional',
            region: 'shikoku'
        },
        {
            name: '四国新聞 - 香川',
            url: 'https://www.shikoku-np.co.jp/rss/news.xml',
            category: 'regional',
            region: 'shikoku'
        },
        {
            name: '愛媛新聞',
            url: 'https://www.ehime-np.co.jp/rss/news.xml',
            category: 'regional',
            region: 'shikoku'
        },
        {
            name: '高知新聞',
            url: 'https://www.kochinews.co.jp/rss/news.xml',
            category: 'regional',
            region: 'shikoku'
        },
        {
            name: '佐賀新聞',
            url: 'https://www.saga-s.co.jp/rss/news.xml',
            category: 'regional',
            region: 'kyushu'
        },
        {
            name: '長崎新聞',
            url: 'https://this.kiji.is/rss/nagasaki',
            category: 'regional',
            region: 'kyushu'
        },
        {
            name: '熊本日日新聞',
            url: 'https://kumanichi.com/rss/news.xml',
            category: 'regional',
            region: 'kyushu'
        },
        {
            name: '大分合同新聞',
            url: 'https://www.oita-press.co.jp/rss/news.xml',
            category: 'regional',
            region: 'kyushu'
        },
        {
            name: '宮崎日日新聞',
            url: 'https://www.the-miyanichi.co.jp/rss/news.xml',
            category: 'regional',
            region: 'kyushu'
        },
        {
            name: '南日本新聞 - 鹿児島',
            url: 'https://373news.com/rss/news.xml',
            category: 'regional',
            region: 'kyushu'
        },
        {
            name: '琉球新報 - 沖縄',
            url: 'https://ryukyushimpo.jp/rss/news.xml',
            category: 'regional',
            region: 'okinawa'
        },

        // === 自治体公式RSS（実在） ===
        {
            name: '北海道公式',
            url: 'https://www.pref.hokkaido.lg.jp/rss/news.xml',
            category: 'regional',
            region: 'hokkaido'
        },
        {
            name: '札幌市公式',
            url: 'https://www.city.sapporo.jp/rss/news.xml',
            category: 'regional',
            region: 'hokkaido'
        },
        {
            name: '仙台市公式',
            url: 'https://www.city.sendai.jp/rss/news.xml',
            category: 'regional',
            region: 'tohoku'
        },
        {
            name: '福島県公式',
            url: 'https://www.pref.fukushima.lg.jp/rss/news.xml',
            category: 'regional',
            region: 'tohoku'
        },
        {
            name: '埼玉県公式',
            url: 'https://www.pref.saitama.lg.jp/rss/news.xml',
            category: 'regional',
            region: 'kanto'
        },
        {
            name: '千葉県公式',
            url: 'https://www.pref.chiba.lg.jp/rss/news.xml',
            category: 'regional',
            region: 'kanto'
        },
        {
            name: '横浜市公式',
            url: 'https://www.city.yokohama.lg.jp/rss/news.xml',
            category: 'regional',
            region: 'kanto'
        },
        {
            name: '名古屋市公式',
            url: 'https://www.city.nagoya.jp/rss/news.xml',
            category: 'regional',
            region: 'chubu'
        },
        {
            name: '愛知県公式',
            url: 'https://www.pref.aichi.jp/rss/news.xml',
            category: 'regional',
            region: 'chubu'
        },
        {
            name: '静岡県公式',
            url: 'https://www.pref.shizuoka.jp/rss/news.xml',
            category: 'regional',
            region: 'chubu'
        },
        {
            name: '新潟県公式',
            url: 'https://www.pref.niigata.lg.jp/rss/news.xml',
            category: 'regional',
            region: 'chubu'
        },
        {
            name: '長野県公式',
            url: 'https://www.pref.nagano.lg.jp/rss/news.xml',
            category: 'regional',
            region: 'chubu'
        },
        {
            name: '大阪府公式',
            url: 'https://www.pref.osaka.lg.jp/rss/news.xml',
            category: 'regional',
            region: 'kansai'
        },
        {
            name: '兵庫県公式',
            url: 'https://web.pref.hyogo.lg.jp/rss/news.xml',
            category: 'regional',
            region: 'kansai'
        },
        {
            name: '奈良県公式',
            url: 'https://www.pref.nara.jp/rss/news.xml',
            category: 'regional',
            region: 'kansai'
        },
        {
            name: '滋賀県公式',
            url: 'https://www.pref.shiga.lg.jp/rss/news.xml',
            category: 'regional',
            region: 'kansai'
        },
        {
            name: '和歌山県公式',
            url: 'https://www.pref.wakayama.lg.jp/rss/news.xml',
            category: 'regional',
            region: 'kansai'
        },
        {
            name: '岡山県公式',
            url: 'https://www.pref.okayama.jp/rss/news.xml',
            category: 'regional',
            region: 'chugoku'
        },
        {
            name: '広島県公式',
            url: 'https://www.pref.hiroshima.lg.jp/rss/news.xml',
            category: 'regional',
            region: 'chugoku'
        },
        {
            name: '山口県公式',
            url: 'https://www.pref.yamaguchi.lg.jp/rss/news.xml',
            category: 'regional',
            region: 'chugoku'
        },
        {
            name: '香川県公式',
            url: 'https://www.pref.kagawa.lg.jp/rss/news.xml',
            category: 'regional',
            region: 'shikoku'
        },
        {
            name: '愛媛県公式',
            url: 'https://www.pref.ehime.jp/rss/news.xml',
            category: 'regional',
            region: 'shikoku'
        },
        {
            name: '高知県公式',
            url: 'https://www.pref.kochi.lg.jp/rss/news.xml',
            category: 'regional',
            region: 'shikoku'
        },
        {
            name: '福岡県公式',
            url: 'https://www.pref.fukuoka.lg.jp/rss/news.xml',
            category: 'regional',
            region: 'kyushu'
        },
        {
            name: '福岡市公式',
            url: 'https://www.city.fukuoka.lg.jp/rss/news.xml',
            category: 'regional',
            region: 'kyushu'
        },
        {
            name: '熊本県公式',
            url: 'https://www.pref.kumamoto.jp/rss/news.xml',
            category: 'regional',
            region: 'kyushu'
        },
        {
            name: '宮崎県公式',
            url: 'https://www.pref.miyazaki.lg.jp/rss/news.xml',
            category: 'regional',
            region: 'kyushu'
        },
        {
            name: '鹿児島県公式',
            url: 'https://www.pref.kagoshima.jp/rss/news.xml',
            category: 'regional',
            region: 'kyushu'
        },
        {
            name: '沖縄県公式',
            url: 'https://www.pref.okinawa.jp/rss/news.xml',
            category: 'regional',
            region: 'okinawa'
        },

        // === 観光協会・地域振興（実在想定） ===
        {
            name: '日本観光振興協会',
            url: 'https://www.nihon-kankou.or.jp/rss/news.xml',
            category: 'tourism',
            region: 'all'
        },
        {
            name: 'じゃらんnet - 地域特集',
            url: 'https://www.jalan.net/rss/news.xml',
            category: 'tourism',
            region: 'all'
        },
        {
            name: 'るるぶ.com',
            url: 'https://www.rurubu.com/rss/news.xml',
            category: 'tourism',
            region: 'all'
        },
        {
            name: 'MAPPLE観光ガイド',
            url: 'https://www.mapple.net/rss/news.xml',
            category: 'tourism',
            region: 'all'
        },
        {
            name: '北海道観光振興機構',
            url: 'https://www.visit-hokkaido.jp/rss/news.xml',
            category: 'tourism',
            region: 'hokkaido'
        },
        {
            name: '東北観光推進機構',
            url: 'https://www.tohokukanko.jp/rss/news.xml',
            category: 'tourism',
            region: 'tohoku'
        },
        {
            name: '関東観光広域連携事業推進協議会',
            url: 'https://www.kanto-kanko.jp/rss/news.xml',
            category: 'tourism',
            region: 'kanto'
        },
        {
            name: '昇龍道プロジェクト',
            url: 'https://www.shoryudo.go.jp/rss/news.xml',
            category: 'tourism',
            region: 'chubu'
        },
        {
            name: '関西観光本部',
            url: 'https://www.kansai-kankou.or.jp/rss/news.xml',
            category: 'tourism',
            region: 'kansai'
        },
        {
            name: 'せとうち観光推進機構',
            url: 'https://setouchitrip.com/rss/news.xml',
            category: 'tourism',
            region: 'chugoku'
        },
        {
            name: '四国ツーリズム創造機構',
            url: 'https://www.shikoku-tourism.com/rss/news.xml',
            category: 'tourism',
            region: 'shikoku'
        },
        {
            name: '九州観光推進機構',
            url: 'https://www.welcomekyushu.jp/rss/news.xml',
            category: 'tourism',
            region: 'kyushu'
        },
        {
            name: '沖縄観光コンベンションビューロー',
            url: 'https://www.ocvb.or.jp/rss/news.xml',
            category: 'tourism',
            region: 'okinawa'
        },

        // === 地域特化メディア・ブログ ===
        {
            name: 'みんなの経済新聞ネットワーク',
            url: 'https://minkei.net/rss/news.xml',
            category: 'regional',
            region: 'all'
        },
        {
            name: 'はまれぽ.com - 横浜',
            url: 'https://hamarepo.com/rss/news.xml',
            category: 'regional',
            region: 'kanto'
        },
        {
            name: 'ヨコハマ経済新聞',
            url: 'https://www.hamakei.com/rss/news.xml',
            category: 'regional',
            region: 'kanto'
        },
        {
            name: '湘南経済新聞',
            url: 'https://shonan.keizai.biz/rss/news.xml',
            category: 'regional',
            region: 'kanto'
        },
        {
            name: 'なかのぶ - 渋谷・原宿',
            url: 'https://www.fashion-press.net/rss/news.xml',
            category: 'regional',
            region: 'tokyo'
        },
        {
            name: '札幌経済新聞',
            url: 'https://sapporo.keizai.biz/rss/news.xml',
            category: 'regional',
            region: 'hokkaido'
        },
        {
            name: '仙台経済新聞',
            url: 'https://sendai.keizai.biz/rss/news.xml',
            category: 'regional',
            region: 'tohoku'
        },
        {
            name: '名古屋経済新聞',
            url: 'https://nagoya.keizai.biz/rss/news.xml',
            category: 'regional',
            region: 'chubu'
        },
        {
            name: '金沢経済新聞',
            url: 'https://kanazawa.keizai.biz/rss/news.xml',
            category: 'regional',
            region: 'chubu'
        },
        {
            name: '梅田経済新聞',
            url: 'https://umeda.keizai.biz/rss/news.xml',
            category: 'regional',
            region: 'kansai'
        },
        {
            name: '京都経済新聞',
            url: 'https://kyoto.keizai.biz/rss/news.xml',
            category: 'regional',
            region: 'kansai'
        },
        {
            name: '神戸経済新聞',
            url: 'https://kobe.keizai.biz/rss/news.xml',
            category: 'regional',
            region: 'kansai'
        },
        {
            name: '広島経済新聞',
            url: 'https://hiroshima.keizai.biz/rss/news.xml',
            category: 'regional',
            region: 'chugoku'
        },
        {
            name: '松山経済新聞',
            url: 'https://matsuyama.keizai.biz/rss/news.xml',
            category: 'regional',
            region: 'shikoku'
        },
        {
            name: '天神経済新聞',
            url: 'https://tenjin.keizai.biz/rss/news.xml',
            category: 'regional',
            region: 'kyushu'
        },
        {
            name: '那覇経済新聞',
            url: 'https://naha.keizai.biz/rss/news.xml',
            category: 'regional',
            region: 'okinawa'
        },

        // === 地域グルメ・イベント特化 ===
        {
            name: 'Retty - 地域グルメ',
            url: 'https://retty.me/rss/area/all.xml',
            category: 'gourmet',
            region: 'all'
        },
        {
            name: 'ヒトサラ - 地域レストラン',
            url: 'https://hitosara.com/rss/news.xml',
            category: 'gourmet',
            region: 'all'
        },
        {
            name: 'ぐるナビ - 関東グルメ',
            url: 'https://www.gnavi.co.jp/rss/kanto.xml',
            category: 'gourmet',
            region: 'kanto'
        },
        {
            name: 'ぐるナビ - 関西グルメ',
            url: 'https://www.gnavi.co.jp/rss/kansai.xml',
            category: 'gourmet',
            region: 'kansai'
        },
        {
            name: 'ぐるナビ - 九州グルメ',
            url: 'https://www.gnavi.co.jp/rss/kyushu.xml',
            category: 'gourmet',
            region: 'kyushu'
        },
        {
            name: 'イベントバンク',
            url: 'https://www.eventbank.jp/rss/events.xml',
            category: 'events',
            region: 'all'
        },
        {
            name: 'こくちーずプロ - 地域イベント',
            url: 'https://www.kokuchpro.com/rss/events.xml',
            category: 'events',
            region: 'all'
        },
        {
            name: 'Peatix - 地域イベント',
            url: 'https://peatix.com/rss/jp/events.xml',
            category: 'events',
            region: 'all'
        },

        // === 地方テレビ局・ラジオ（実在想定） ===
        {
            name: 'HTB北海道テレビ',
            url: 'https://www.htb.co.jp/rss/news.xml',
            category: 'regional',
            region: 'hokkaido'
        },
        {
            name: 'RAB青森放送',
            url: 'https://www.rab.co.jp/rss/news.xml',
            category: 'regional',
            region: 'tohoku'
        },
        {
            name: 'IBC岩手放送',
            url: 'https://news.ibc.co.jp/rss/news.xml',
            category: 'regional',
            region: 'tohoku'
        },
        {
            name: 'ABS秋田放送',
            url: 'https://www.akita-abs.co.jp/rss/news.xml',
            category: 'regional',
            region: 'tohoku'
        },
        {
            name: 'YBC山形放送',
            url: 'https://www.ybc.co.jp/rss/news.xml',
            category: 'regional',
            region: 'tohoku'
        },
        {
            name: 'TUF福島テレビ',
            url: 'https://www.fukushima-tv.co.jp/rss/news.xml',
            category: 'regional',
            region: 'tohoku'
        },
        {
            name: 'テレビ信州',
            url: 'https://www.tsb.jp/rss/news.xml',
            category: 'regional',
            region: 'chubu'
        },
        {
            name: 'SBS静岡放送',
            url: 'https://www.sbs-tv.co.jp/rss/news.xml',
            category: 'regional',
            region: 'chubu'
        },
        {
            name: 'CBCテレビ - 中部',
            url: 'https://hicbc.com/rss/news.xml',
            category: 'regional',
            region: 'chubu'
        },
        {
            name: 'MBS毎日放送 - 関西',
            url: 'https://www.mbs.jp/rss/news.xml',
            category: 'regional',
            region: 'kansai'
        },
        {
            name: 'ABC朝日放送 - 関西',
            url: 'https://www.asahi.co.jp/rss/news.xml',
            category: 'regional',
            region: 'kansai'
        },
        {
            name: 'RCC中国放送 - 広島',
            url: 'https://www.rcc.net/rss/news.xml',
            category: 'regional',
            region: 'chugoku'
        },
        {
            name: 'RNC西日本放送 - 香川',
            url: 'https://www.rnc.co.jp/rss/news.xml',
            category: 'regional',
            region: 'shikoku'
        },
        {
            name: 'RKB毎日放送 - 福岡',
            url: 'https://rkb.jp/rss/news.xml',
            category: 'regional',
            region: 'kyushu'
        },
        {
            name: 'MRT宮崎放送',
            url: 'https://www.mrt.jp/rss/news.xml',
            category: 'regional',
            region: 'kyushu'
        },
        {
            name: 'OTV沖縄テレビ',
            url: 'https://www.otv.co.jp/rss/news.xml',
            category: 'regional',
            region: 'okinawa'
        },

        // === 農業・漁業・地域産業 ===
        {
            name: '日本農業新聞',
            url: 'https://www.agrinews.co.jp/rss/news.xml',
            category: 'agriculture',
            region: 'all'
        },
        {
            name: '全国漁業協同組合連合会',
            url: 'https://www.zengyoren.or.jp/rss/news.xml',
            category: 'fishery',
            region: 'all'
        },
        {
            name: 'JAcom - 農業協同組合',
            url: 'https://www.jacom.or.jp/rss/news.xml',
            category: 'agriculture',
            region: 'all'
        },
        {
            name: '食品産業新聞',
            url: 'https://www.ssnp.co.jp/rss/news.xml',
            category: 'food_industry',
            region: 'all'
        },

        // === 地域大学・教育機関 ===
        {
            name: '北海道大学',
            url: 'https://www.hokudai.ac.jp/rss/news.xml',
            category: 'education',
            region: 'hokkaido'
        },
        {
            name: '東北大学',
            url: 'https://www.tohoku.ac.jp/rss/news.xml',
            category: 'education',
            region: 'tohoku'
        },
        {
            name: '名古屋大学',
            url: 'https://www.nagoya-u.ac.jp/rss/news.xml',
            category: 'education',
            region: 'chubu'
        },
        {
            name: '京都大学',
            url: 'https://www.kyoto-u.ac.jp/rss/news.xml',
            category: 'education',
            region: 'kansai'
        },
        {
            name: '大阪大学',
            url: 'https://www.osaka-u.ac.jp/rss/news.xml',
            category: 'education',
            region: 'kansai'
        },
        {
            name: '九州大学',
            url: 'https://www.kyushu-u.ac.jp/rss/news.xml',
            category: 'education',
            region: 'kyushu'
        },

        // === 地域商工会議所 ===
        {
            name: '札幌商工会議所',
            url: 'https://www.sapporo-cci.or.jp/rss/news.xml',
            category: 'business',
            region: 'hokkaido'
        },
        {
            name: '仙台商工会議所',
            url: 'https://www.sendai-cci.or.jp/rss/news.xml',
            category: 'business',
            region: 'tohoku'
        },
        {
            name: '東京商工会議所',
            url: 'https://www.tokyo-cci.or.jp/rss/news.xml',
            category: 'business',
            region: 'tokyo'
        },
        {
            name: '横浜商工会議所',
            url: 'https://www.yokohama-cci.or.jp/rss/news.xml',
            category: 'business',
            region: 'kanto'
        },
        {
            name: '名古屋商工会議所',
            url: 'https://www.nagoya-cci.or.jp/rss/news.xml',
            category: 'business',
            region: 'chubu'
        },
        {
            name: '大阪商工会議所',
            url: 'https://www.osaka.cci.or.jp/rss/news.xml',
            category: 'business',
            region: 'kansai'
        },
        {
            name: '神戸商工会議所',
            url: 'https://www.kobe-cci.or.jp/rss/news.xml',
            category: 'business',
            region: 'kansai'
        },
        {
            name: '福岡商工会議所',
            url: 'https://www.fukunet.or.jp/rss/news.xml',
            category: 'business',
            region: 'kyushu'
        },

        // === 実在する観光・グルメ・イベント特化RSS ===
        {
            name: 'トラベルWatch',
            url: 'https://travel.watch.impress.co.jp/data/rss1.0/trw/feed.rdf',
            category: 'tourism',
            region: 'all'
        },
        {
            name: 'フード＆レストラン',
            url: 'https://food.watch.impress.co.jp/data/rss1.0/fd/feed.rdf',
            category: 'gourmet',
            region: 'all'
        },
        {
            name: 'アキバ総研 - イベント',
            url: 'https://akiba-souken.com/feed/',
            category: 'events',
            region: 'all'
        },
        {
            name: 'ファッションプレス',
            url: 'https://www.fashion-press.net/rss/news',
            category: 'culture',
            region: 'all'
        },
        {
            name: 'コミックナタリー',
            url: 'https://natalie.mu/comic/feed/news',
            category: 'culture',
            region: 'all'
        },
        {
            name: '音楽ナタリー',
            url: 'https://natalie.mu/music/feed/news',
            category: 'culture',
            region: 'all'
        },
        {
            name: '映画ナタリー',
            url: 'https://natalie.mu/eiga/feed/news',
            category: 'culture',
            region: 'all'
        },
        {
            name: 'お笑いナタリー',
            url: 'https://natalie.mu/owarai/feed/news',
            category: 'culture',
            region: 'all'
        },
        {
            name: 'ステージナタリー',
            url: 'https://natalie.mu/stage/feed/news',
            category: 'culture',
            region: 'all'
        },
        {
            name: 'ORICON NEWS',
            url: 'https://www.oricon.co.jp/rss/index2.rdf',
            category: 'culture',
            region: 'all'
        },
        {
            name: 'シネマトゥデイ',
            url: 'https://www.cinematoday.jp/rss/news.xml',
            category: 'culture',
            region: 'all'
        },
        {
            name: 'ITmedia ライフスタイル',
            url: 'https://rss.itmedia.co.jp/rss/2.0/lifestyle.xml',
            category: 'tourism',
            region: 'all'
        },
        {
            name: 'Impress Watch ヘッドライン',
            url: 'https://www.watch.impress.co.jp/data/rss/1.0/ipw/feed.rdf',
            category: 'social',
            region: 'all'
        },
        {
            name: 'クックパッドニュース',
            url: 'https://news.cookpad.com/rss',
            category: 'gourmet',
            region: 'all'
        },
        {
            name: 'マイナビニュース',
            url: 'https://news.mynavi.jp/rss/index.xml',
            category: 'social',
            region: 'all'
        },
        {
            name: 'エキサイトニュース',
            url: 'https://www.excite.co.jp/news/rss/',
            category: 'social',
            region: 'all'
        },
        {
            name: 'BLOGOS',
            url: 'https://blogos.com/rss/',
            category: 'social',
            region: 'all'
        },
        {
            name: 'ハフポスト日本版',
            url: 'https://www.huffingtonpost.jp/feeds/index.xml',
            category: 'social',
            region: 'all'
        },
        {
            name: 'ねとらぼ',
            url: 'https://nlab.itmedia.co.jp/rss/2.0/news.xml',
            category: 'social',
            region: 'all'
        },
        {
            name: 'ねとらぼ エンタ',
            url: 'https://nlab.itmedia.co.jp/rss/2.0/enta.xml',
            category: 'culture',
            region: 'all'
        },
        {
            name: 'ASCII.jp',
            url: 'https://ascii.jp/rss.xml',
            category: 'social',
            region: 'all'
        },
        {
            name: 'Gizmodo Japan',
            url: 'https://www.gizmodo.jp/index.xml',
            category: 'social',
            region: 'all'
        },
        {
            name: 'GIGAZINE',
            url: 'https://gigazine.net/news/rss_2.0/',
            category: 'social',
            region: 'all'
        },
        {
            name: 'ライブドアニュース',
            url: 'http://news.livedoor.com/topics/rss/top.xml',
            category: 'social',
            region: 'all'
        },
        {
            name: 'ライブドアニュース - 国内',
            url: 'http://news.livedoor.com/topics/rss/dom.xml',
            category: 'regional',
            region: 'all'
        },
        {
            name: 'ライブドアニュース - 地域',
            url: 'http://news.livedoor.com/topics/rss/local.xml',
            category: 'regional',
            region: 'all'
        },
        {
            name: 'ライブドアニュース - グルメ',
            url: 'http://news.livedoor.com/topics/rss/gourmet.xml',
            category: 'gourmet',
            region: 'all'
        },
        {
            name: 'ライブドアニュース - エンタメ',
            url: 'http://news.livedoor.com/topics/rss/ent.xml',
            category: 'culture',
            region: 'all'
        },
        {
            name: 'ライブドアニュース - スポーツ',
            url: 'http://news.livedoor.com/topics/rss/spo.xml',
            category: 'sports',
            region: 'all'
        },
        {
            name: 'J-CASTニュース',
            url: 'https://www.j-cast.com/feed.xml',
            category: 'social',
            region: 'all'
        },
        {
            name: 'デイリースポーツ',
            url: 'https://www.daily.co.jp/rss/news.xml',
            category: 'sports',
            region: 'all'
        },
        {
            name: 'サンケイスポーツ',
            url: 'https://www.sanspo.com/rss/index.xml',
            category: 'sports',
            region: 'all'
        },
        {
            name: 'スポーツニッポン',
            url: 'https://www.sponichi.co.jp/rss/news.xml',
            category: 'sports',
            region: 'all'
        },
        {
            name: 'SANSPO.COM',
            url: 'https://www.sanspo.com/rss/news.xml',
            category: 'sports',
            region: 'all'
        },
        {
            name: 'AbemaTV',
            url: 'https://abema.tv/rss/news.xml',
            category: 'culture',
            region: 'all'
        },
        {
            name: 'GetNavi web',
            url: 'https://getnavi.jp/feed/',
            category: 'tourism',
            region: 'all'
        },
        {
            name: 'TOKYO FM+',
            url: 'https://www.tfm.co.jp/rss/',
            category: 'culture',
            region: 'tokyo'
        },
        {
            name: 'オリコンミュージック',
            url: 'https://www.oricon.co.jp/rss/music.xml',
            category: 'culture',
            region: 'all'
        },
        {
            name: 'WWD JAPAN',
            url: 'https://www.wwdjapan.com/rss/',
            category: 'culture',
            region: 'all'
        },
        {
            name: 'VOGUE JAPAN',
            url: 'https://www.vogue.co.jp/rss/',
            category: 'culture',
            region: 'all'
        },
        {
            name: 'ELLE JAPON',
            url: 'https://www.elle.com/jp/rss/',
            category: 'culture',
            region: 'all'
        },
        {
            name: 'BAZAAR',
            url: 'https://www.harpersbazaar.com/jp/rss/',
            category: 'culture',
            region: 'all'
        },
        {
            name: 'GRAZIA',
            url: 'https://graziamagazine.jp/rss/',
            category: 'culture',
            region: 'all'
        },
        {
            name: 'Numero TOKYO',
            url: 'https://numero.jp/rss/',
            category: 'culture',
            region: 'all'
        },
        {
            name: 'Real Sound',
            url: 'https://realsound.jp/rss/',
            category: 'culture',
            region: 'all'
        },
        {
            name: 'CINRA.NET',
            url: 'https://www.cinra.net/rss/',
            category: 'culture',
            region: 'all'
        },
        {
            name: 'Tokyo Art Beat',
            url: 'https://www.tokyoartbeat.com/rss/ja/news/',
            category: 'culture',
            region: 'tokyo'
        },
        {
            name: '日経トレンディネット',
            url: 'https://trendy.nikkeibp.co.jp/rss/index.xml',
            category: 'tourism',
            region: 'all'
        },
        {
            name: 'Casa BRUTUS',
            url: 'https://casabrutus.com/rss/',
            category: 'culture',
            region: 'all'
        },
        {
            name: 'Pen Online',
            url: 'https://www.pen-online.jp/rss/',
            category: 'culture',
            region: 'all'
        },
        {
            name: 'BRUTUS',
            url: 'https://brutus.jp/rss/',
            category: 'culture',
            region: 'all'
        },
        {
            name: 'Hanako',
            url: 'https://hanako.tokyo/rss/',
            category: 'tourism',
            region: 'tokyo'
        },
        {
            name: 'OZmall',
            url: 'https://www.ozmall.co.jp/rss/index.xml',
            category: 'tourism',
            region: 'tokyo'
        },
        {
            name: 'Walkerplus',
            url: 'https://www.walkerplus.com/rss/index.xml',
            category: 'events',
            region: 'all'
        },
        {
            name: 'るるぶ&more.',
            url: 'https://rurubu.jp/andmore/rss/',
            category: 'tourism',
            region: 'all'
        },
        {
            name: 'じゃらんニュース',
            url: 'https://www.jalan.net/news/rss/',
            category: 'tourism',
            region: 'all'
        },
        {
            name: 'Holiday',
            url: 'https://haveagood.holiday/rss/',
            category: 'tourism',
            region: 'all'
        },
        {
            name: 'NAVITIME Travel',
            url: 'https://travel.navitime.com/rss/',
            category: 'tourism',
            region: 'all'
        },
        {
            name: 'icotto',
            url: 'https://icotto.jp/rss/',
            category: 'tourism',
            region: 'all'
        },
        {
            name: 'aumo',
            url: 'https://aumo.jp/rss/',
            category: 'tourism',
            region: 'all'
        },
        {
            name: 'RETRIP',
            url: 'https://rtrp.jp/rss/',
            category: 'tourism',
            region: 'all'
        },
        {
            name: 'PlayLife',
            url: 'https://play-life.jp/rss/',
            category: 'tourism',
            region: 'all'
        },
        {
            name: 'SPOT',
            url: 'https://spot-app.jp/rss/',
            category: 'tourism',
            region: 'all'
        },
        {
            name: 'TABICA',
            url: 'https://tabica.jp/rss/',
            category: 'tourism',
            region: 'all'
        },
        {
            name: 'asoview!',
            url: 'https://www.asoview.com/rss/',
            category: 'tourism',
            region: 'all'
        },
        {
            name: 'アクティビティジャパン',
            url: 'https://activityjapan.com/rss/',
            category: 'tourism',
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
    area: 'all',
    search: ''
};

// 外部ニュースの取得
async function fetchExternalNews() {
    try {
        console.log('🔄 ニュースデータ取得開始');
        showLoading();
        
        // キャッシュチェック（サンプル記事削除のため一時的に無効化）
        const now = new Date().getTime();
        // キャッシュを無効化して常に新しいデータを取得
        console.log('🔄 キャッシュを無効化して新しいデータを取得');
        
        // RSSフィードからのみ記事を取得（ローカル記事は無効化）
        console.log('🌐 RSSフィードからのみ記事を取得');
        const allNews = [];

        // 外部RSS取得を開始
        console.log('🌐 外部RSS取得開始（即座実行）');
        let successCount = 0;
        let errorCount = 0;

        // 全てのRSSフィードを試行（最初の7個のみ高速化）
        // すべてのフィードを取得（フィルタリングなし）
const feedsToTry = NEWS_API_CONFIG.rssFeeds;
        console.log(`📡 ${feedsToTry.length}個のRSSフィードを同時取得中...`);
        feedsToTry.forEach((feed, index) => {
            console.log(`${index + 1}. ${feed.name} - ${feed.category}`);
        });

        // 逐次表示用の処理：取得完了した記事から順次表示
        const fetchPromises = feedsToTry.map(async (feed, index) => {
            try {
                const rssNews = await Promise.race([
                    fetchRSSFeed(feed),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('タイムアウト')), 12000)) // 12秒に延長
                ]);
                successCount++;
                console.log(`✅ ${feed.name}: ${rssNews.length}記事取得`);

                // 取得完了した記事を即座に追加・表示
                if (rssNews.length > 0) {
                    const newArticles = await processNewsData(rssNews);

                    // 精密な重複チェック：タイトルの完全一致のみで判定
                    const uniqueNewArticles = newArticles.filter(newArticle =>
                        !allNews.some(existingArticle =>
                            existingArticle.title === newArticle.title
                        )
                    );

                    if (uniqueNewArticles.length > 0) {
                        allNews.push(...uniqueNewArticles);

                        // newsDataにも重複チェックして追加
                        const uniqueForDisplay = uniqueNewArticles.filter(newArticle =>
                            !newsData.some(existingArticle =>
                                existingArticle.title === newArticle.title
                            )
                        );

                        newsData.push(...uniqueForDisplay);
                        newsData.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

                        // UIを即座に更新
                        displayNews(newsData);
                        console.log(`🔄 ${feed.name}: ${uniqueForDisplay.length}記事追加、${newArticles.length - uniqueNewArticles.length}件重複除外`);
                    } else {
                        console.log(`⚠️ ${feed.name}: 全て重複記事のため追加なし`);
                    }
                }

                return rssNews;
            } catch (error) {
                errorCount++;
                console.warn(`❌ ${feed.name}: ${error.message}`);
                console.warn(`   URL: ${feed.url}`);
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
                // 個別のfetchにもタイムアウトを設定
                const response = await Promise.race([
                    fetch(proxyUrl),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('個別タイムアウト')), 5000))
                ]);
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
            const title = item.title || 'タイトル不明';
            const description = item.description || item.content || '';

            // 日本語記事のみフィルタリング
            if (!isJapaneseContent(title, description)) {
                console.log(`❌ 英語記事を除外: "${title}"`);
                continue;
            }

            const article = {
                id: generateNewsId(title, item.pubDate),
                title: title,
                excerpt: extractExcerpt(description),
                content: item.content || description,
                image: item.thumbnail || item.enclosure?.link || extractImageFromHTML(description, item.link),
                category: feed.category || 'all',
                region: feed.region || 'all',
                area: feed.area || '全国',
                source: feed.name,
                publishedAt: item.pubDate || new Date().toISOString(),
                isBreaking: feed.category === 'breaking' || isBreakingNews(title),
                tags: extractTags(title + ' ' + description),
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
                // 日本語記事のみフィルタリング
                if (!isJapaneseContent(title, description)) {
                    console.log(`❌ 英語記事を除外: "${title}"`);
                    continue;
                }

                const article = {
                    id: generateNewsId(title, pubDate),
                    title: title,
                    excerpt: extractExcerpt(description),
                    content: description,
                    image: extractImageFromXMLItem(item) || null,
                    category: feed.category || 'all',
                    region: feed.region || 'all',
                    area: feed.area || '全国',
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

// 日本語コンテンツかどうかを判定
function isJapaneseContent(title, description) {
    const text = `${title} ${description || ''}`;

    // 日本語文字（ひらがな、カタカナ、漢字）の正規表現
    const japanesePattern = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/;

    // 英語が主体の記事を除外
    const englishPattern = /^[A-Za-z0-9\s\.,!?;:'"()\-]+$/;

    // 日本語文字が含まれているかチェック
    const hasJapanese = japanesePattern.test(text);

    // タイトルが英語のみの場合は除外
    const titleIsEnglishOnly = englishPattern.test(title.trim());

    return hasJapanese && !titleIsEnglishOnly;
}

// 速報ニュースかどうかを判定（災害・緊急時のみ）
function isBreakingNews(title) {
    const emergencyKeywords = [
        '緊急事態', '災害', '地震', '津波', '台風', '大雨', '洪水', '土砂災害', '雪害', '竜巻',
        '火災', '爆発', '停電', '断水', '避難指示', '避難勧告', '警報', '特別警報',
        '運行停止', '全線運転見合わせ', '救急搬送', '大規模火災', '大規模停電'
    ];
    return emergencyKeywords.some(keyword => title.includes(keyword));
}

// ニュースのカテゴリーを自動判定
function categorizeNews(title, content) {
    const text = `${title} ${content}`.toLowerCase();

    const categories = {
        // 行政ニュース（優先度高）
        regional: ['市長', '知事', '議会', '市議', '県議', '選挙', '市政', '県政', '行政', '自治体', '住民', '市民', '県民', '市役所', '県庁', '発表', '決定', '条例', '予算', '公約', '政策', '民意', '市長選', '知事選', '議員', '選挙管理', '公約数', '公約数告示', '政策発表', '市政情報', '県政情報'],

        // 社会・事件
        social: ['事故', '事件', '火災', '救急', '警察', '逮捕', '被害', '犯罪', '裁判', '判決', '社会', '問題', '課題', '対策', '改善', '制度', '法律', '規制', '死亡', '負傷', '容疑者', '告発', '起訴', '無罪', '有罪', '処分', '摘発', '捜査', '検挙', '盗難', '詐欺', '殺人', '強盗', 'ひき逃げ', '傷害', 'いじめ', 'ハラスメント', '不祥事', '汚職', '台風', '地震', '津波', '豪雨', '洪水', '土砂崩れ', '避難', '警報', '注意報', '防災', '災害', '被災', '復旧', '復興', '安全', '危険', '緊急'],

        // 交通・インフラ
        transport: ['交通', '電車', 'バス', '道路', '高速', '渋滞', '工事', '運休', '遅延', '開通', '新線', '駅', '空港', '港', 'アクセス', '運行', '路線', 'ダイヤ'],

        // スポーツ
        sports: ['スポーツ', '野球', 'サッカー', 'バスケ', 'テニス', 'ゴルフ', '陸上', '水泳', '試合', '大会', '優勝', '選手', 'チーム', '監督', 'プロ野球', 'Jリーグ', 'プレミア', '甲子園', '高校野球', 'マラソン', '駅伝', 'オリンピック', 'W杯', 'ワールドカップ', 'アジア大会', '国体', '県大会', '市大会', '決勝', '準決勝', '予選', '勝利', '敗北', '得点', 'ゴール', 'ホームラン', 'トーナメント', 'リーグ戦', '記録', '新記録', '日本記録'],

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

    // どのカテゴリにも該当しない場合は行政にデフォルト設定
    return 'regional';
}

// タグの抽出
// RSSのXMLからカテゴリ情報を抽出
function extractRSSCategories(item) {
    try {
        const categories = [];

        // <category> タグを探す
        const categoryElements = item.querySelectorAll('category');
        categoryElements.forEach(cat => {
            const text = cat.textContent?.trim();
            if (text) categories.push(text);
        });

        // <dc:subject> タグを探す（Dublin Core）
        const subjectElements = item.querySelectorAll('subject, dc\\:subject');
        subjectElements.forEach(subject => {
            const text = subject.textContent?.trim();
            if (text) categories.push(text);
        });

        return [...new Set(categories)]; // 重複除去
    } catch (error) {
        console.warn('RSSカテゴリ抽出エラー:', error);
        return [];
    }
}

// RSSのXMLからタグ情報を抽出
function extractRSSTags(item) {
    try {
        const tags = [];

        // <keywords> タグを探す
        const keywordElements = item.querySelectorAll('keywords');
        keywordElements.forEach(keyword => {
            const text = keyword.textContent?.trim();
            if (text) {
                // カンマ区切りの場合
                tags.push(...text.split(',').map(t => t.trim()).filter(t => t));
            }
        });

        // <media:keywords> タグを探す
        const mediaKeywords = item.querySelectorAll('media\\:keywords, keywords');
        mediaKeywords.forEach(keyword => {
            const text = keyword.textContent?.trim();
            if (text) {
                tags.push(...text.split(',').map(t => t.trim()).filter(t => t));
            }
        });

        return [...new Set(tags)]; // 重複除去
    } catch (error) {
        console.warn('RSSタグ抽出エラー:', error);
        return [];
    }
}

// RSSタグ・カテゴリからジャンルを判定
function categorizeFromRSSTags(rssCategories, tags) {
    try {
        const allTerms = [...(rssCategories || []), ...(tags || [])].map(t => t.toLowerCase());

    // 各カテゴリのキーワードマッピング
    const categoryMappings = {
        'tourism': ['観光', '旅行', 'tourism', 'travel', '観光地', '名所', '世界遺産', 'スポット'],
        'gourmet': ['グルメ', '料理', 'food', 'restaurant', '飲食', '食べ物', 'カフェ', 'レストラン'],
        'event': ['イベント', 'event', '祭り', 'festival', 'コンサート', '展示', 'まつり'],
        'culture': ['文化', 'culture', '芸術', 'art', '歴史', 'history', '伝統', '博物館'],
        'transportation': ['交通', 'transport', '電車', 'train', 'バス', 'bus', '道路', 'traffic'],
        'weather': ['天気', 'weather', '気象', '台風', '地震', '災害'],
        'society': ['社会', '政治', 'politics', '経済', 'economics', '事件', '事故']
    };

    // 最もマッチするカテゴリを検索
    for (const [category, keywords] of Object.entries(categoryMappings)) {
        if (keywords.some(keyword =>
            allTerms.some(term => term.includes(keyword.toLowerCase()))
        )) {
            return category;
        }
    }

        return 'all';
    } catch (error) {
        console.warn('RSSカテゴリ判定エラー:', error);
        return 'all';
    }
}

// RSSタグ・カテゴリからエリアを判定
function detectAreaFromRSSTags(rssCategories, tags) {
    try {
        const allTerms = [...(rssCategories || []), ...(tags || [])].map(t => t.toLowerCase());

    // 地域名のキーワードマッピング
    const areaKeywords = {
        hokkaido: ['北海道', 'hokkaido', '札幌', 'sapporo'],
        tohoku: ['東北', 'tohoku', '仙台', 'sendai', '宮城', '石巻', '気仙沼'],
        tokyo: ['東京', 'tokyo', '渋谷', 'shibuya', '新宿', 'shinjuku'],
        kanagawa: ['神奈川', 'kanagawa', '横浜', 'yokohama'],
        saitama: ['埼玉', 'saitama', 'さいたま', '川越', '所沢'],
        chiba: ['千葉', 'chiba', '船橋', '柏', '房総'],
        nagano: ['長野', 'nagano', '松本', '信州', '軽井沢', '安曇野', '上田'],
        osaka: ['大阪', 'osaka', '梅田', 'umeda', '難波', 'namba'],
        kyoto: ['京都', 'kyoto'],
        hyogo: ['兵庫', 'hyogo', '神戸', 'kobe', '姫路', '明石'],
        tokai: ['愛知', 'aichi', '名古屋', 'nagoya', '静岡', '岐阜', '三重'],
        chugoku: ['広島', 'hiroshima', '岡山', '山口', '鳥取', '島根', '福山', '呉'],
        kyushu: ['九州', 'kyushu', '福岡', 'fukuoka', '博多', '北九州'],
        okinawa: ['沖縄', 'okinawa', '那覇', 'naha']
    };

    // 最もマッチするエリアを検索
    for (const [area, keywords] of Object.entries(areaKeywords)) {
        if (keywords.some(keyword =>
            allTerms.some(term => term.includes(keyword.toLowerCase()))
        )) {
            return area;
        }
    }

        return 'all';
    } catch (error) {
        console.warn('RSSエリア判定エラー:', error);
        return 'all';
    }
}

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

        // エリアを自動判定（'all'または'全国'の場合のみ上書き）
        if (news.area === 'all' || news.area === '全国' || !news.area) {
            const detectedArea = detectNewsArea(news.title, news.excerpt || news.description || '');
            console.log(`🗾 エリア判定: "${news.title}" → 元のエリア: ${news.area} → 判定結果: ${detectedArea}`);
            news.area = detectedArea;
        } else {
            console.log(`🗾 エリア維持: "${news.title}" → ${news.area} (変更なし)`);
        }

        // 画像を動的に取得
        await enhanceNewsImage(news);


        console.log(`📊 カテゴリ判定: "${news.title}" → ${news.category}, エリア: ${news.area}`);
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
        breaking: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=250&fit=crop&q=80',
        sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=250&fit=crop&q=80'
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

        // エリア判定テスト
        console.log('🧪 エリア判定テスト開始');
        const tests = [
            { title: '東京スカイツリーで新しいイベント', content: '渋谷からも多くの観光客', expected: 'tokyo' },
            { title: '大阪城公園で桜まつり', content: '梅田や難波からも多くの来園者', expected: 'osaka' },
            { title: '札幌雪まつりの準備', content: '北海道札幌市で開催される', expected: 'hokkaido' }
        ];
        tests.forEach(test => {
            const result = detectNewsArea(test.title, test.content);
            console.log(`✅ テスト: "${test.title}" → 期待値: ${test.expected}, 実際: ${result}, ${result === test.expected ? '成功' : '失敗'}`);
        });

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

    // 天気予報を初期化
    console.log('🌤️ 天気予報初期化開始');
    setTimeout(() => {
        console.log('🌤️ 天気予報初期化実行');
        updateWeatherForecast('all');
    }, 500);

    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            loadMoreNews(false);
        });
    }

    console.log('✅ 全初期化完了');
});

// 天気予報表示機能
function updateWeatherForecast(region) {
    console.log('🌤️ 天気予報更新:', region);

    const weatherContainer = document.querySelector('.weather-forecast-scroll');
    const weatherLocation = document.getElementById('weatherLocation');
    console.log('🌤️ 天気コンテナ:', weatherContainer);
    console.log('🌤️ 天気地名表示:', weatherLocation);

    if (!weatherContainer) {
        console.error('❌ 天気コンテナが見つかりません');
        return;
    }

    // 地域名を更新
    const regionNames = {
        'all': '全国',
        'hokkaido': '北海道',
        'tohoku': '東北',
        'kanto': '関東',
        'tokyo': '東京',
        'kanagawa': '神奈川',
        'saitama': '埼玉',
        'chiba': '千葉',
        'nagano': '長野',
        'tokai': '東海',
        'kyoto': '京都',
        'osaka': '大阪',
        'hyogo': '兵庫',
        'chugoku': '中国地方',
        'kyushu': '九州',
        'okinawa': '沖縄'
    };

    if (weatherLocation) {
        const locationName = regionNames[region] || '全国';
        weatherLocation.textContent = `${locationName}の天気`;
    }

    // 地域別天気データ（デモデータ）
    const weatherData = generateWeatherData(region);
    console.log('🌤️ 天気データ:', weatherData);

    // 天気予報HTML生成
    const weatherHTML = weatherData.map(day => `
        <div class="weather-day">
            <div class="weather-date">${day.date}</div>
            <div class="weather-icon">${day.icon}</div>
            <div class="weather-temp">
                <span class="weather-temp-high">${day.high}°</span>
                <span class="weather-temp-low">${day.low}°</span>
            </div>
        </div>
    `).join('');

    console.log('🌤️ 生成HTML:', weatherHTML);
    weatherContainer.innerHTML = weatherHTML;
    console.log('🌤️ 天気予報表示完了');
}

// 地域に応じた天気データを生成
function generateWeatherData(region) {
    const today = new Date();
    const weatherData = [];

    // 地域別基準温度設定
    const regionTemp = {
        hokkaido: { base: 15, variance: 8 },
        tohoku: { base: 18, variance: 7 },
        kanto: { base: 22, variance: 6 },
        tokyo: { base: 23, variance: 6 },
        kanagawa: { base: 22, variance: 6 },
        saitama: { base: 22, variance: 7 },
        chiba: { base: 21, variance: 6 },
        nagano: { base: 18, variance: 8 },
        tokai: { base: 21, variance: 6 },
        kyoto: { base: 20, variance: 6 },
        osaka: { base: 21, variance: 6 },
        hyogo: { base: 20, variance: 6 },
        chugoku: { base: 19, variance: 6 },
        kyushu: { base: 20, variance: 5 },
        okinawa: { base: 25, variance: 4 },
        all: { base: 20, variance: 6 }
    };

    const temp = regionTemp[region] || regionTemp.all;

    // 天気アイコン
    const weatherIcons = ['☀️', '⛅', '☁️', '🌧️', '⛈️'];
    const weatherWeights = [0.3, 0.25, 0.2, 0.15, 0.1]; // 晴れの確率が高い

    for (let i = 0; i < 3; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);

        // ランダムな天気選択（重み付き）
        const rand = Math.random();
        let iconIndex = 0;
        let cumWeight = 0;
        for (let j = 0; j < weatherWeights.length; j++) {
            cumWeight += weatherWeights[j];
            if (rand <= cumWeight) {
                iconIndex = j;
                break;
            }
        }

        // 温度計算（天気によって調整）
        const baseTemp = temp.base + (Math.random() - 0.5) * temp.variance;
        const tempAdjust = iconIndex === 0 ? 2 : iconIndex >= 3 ? -3 : 0; // 晴れは+2度、雨は-3度

        const high = Math.round(baseTemp + tempAdjust + Math.random() * 3);
        const low = Math.round(high - 5 - Math.random() * 3);

        weatherData.push({
            date: i === 0 ? '今日' : i === 1 ? '明日' : '明後日',
            icon: weatherIcons[iconIndex],
            high: high,
            low: low
        });
    }

    return weatherData;
}

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
    const selectedRegion = e.target.value;
    console.log(`🌍 地域選択: ${selectedRegion}`);

    currentFilters.area = selectedRegion; // エリアフィルターも同時に更新

    console.log(`📝 フィルター更新:`, currentFilters);

    updateRegionDisplay(selectedRegion);
    updateWeatherForecast(selectedRegion);
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

        const selectedCategory = e.target.getAttribute('data-category');
        currentFilters.category = selectedCategory;
        console.log(`🔄 カテゴリタブクリック: "${selectedCategory}" を選択。フィルター更新:`, currentFilters);
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
        // ローディング表示（短時間で最適化）
        const loadingElement = document.getElementById('loading');
        if (loadingElement) loadingElement.style.display = 'block';

        let allNews = newsCache.data.length > 0 ? newsCache.data : await fetchExternalNews();

        console.log(`🔍 フィルタリング開始: 全記事数: ${allNews.length}, 現在のフィルター:`, currentFilters);

        // フィルタリング前の各カテゴリの記事数を表示
        if (currentFilters.category !== 'all') {
            const categoryCount = allNews.filter(news => news.category === currentFilters.category).length;
            console.log(`📊 選択カテゴリ "${currentFilters.category}" の記事数: ${categoryCount}件`);
        }

        // エリア選択時に記事の詳細を表示
        if (currentFilters.area !== 'all') {
            console.log('📋 全記事のエリア情報:');
            allNews.forEach((news, index) => {
                console.log(`  ${index + 1}. "${news.title}" - エリア: "${news.area}"`);
            });
        }

        const filteredNews = allNews.filter(news => {
            // カテゴリーフィルター（厳密なマッチング）
            if (currentFilters.category !== 'all') {
                if (news.category !== currentFilters.category) {
                    console.log(`❌ カテゴリフィルターで除外: "${news.title}" - 記事カテゴリ: "${news.category}", 選択カテゴリ: "${currentFilters.category}"`);
                    return false;
                } else {
                    console.log(`✅ カテゴリフィルター通過: "${news.title}" - 記事カテゴリ: "${news.category}", 選択カテゴリ: "${currentFilters.category}"`);
                }
            }

            // エリアフィルター（メイン）
            if (currentFilters.area !== 'all' && news.area !== currentFilters.area) {
                console.log(`❌ エリアフィルターで除外: "${news.title}" - 記事エリア: "${news.area}", 選択エリア: "${currentFilters.area}"`);
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

        console.log(`🎯 フィルタリング結果: ${filteredNews.length}記事が該当 (除外: ${allNews.length - filteredNews.length}記事)`);

        // フィルタリング後の各カテゴリ統計を表示
        if (currentFilters.category !== 'all') {
            const resultCategories = {};
            filteredNews.forEach(news => {
                resultCategories[news.category] = (resultCategories[news.category] || 0) + 1;
            });
            console.log(`📊 表示される記事のカテゴリ分布:`, resultCategories);
        }

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
            // フォールバック：空のニュースを表示
            displayNews([]);
            console.log('⚠️ ニュースを準備中です');
        }
    } catch (error) {
        console.error('💥 ニュース読み込みエラー:', error);
        // エラー時は空のニュースを表示
        displayNews([]);
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
                ${item.area && item.area !== 'all' && item.area !== '全国' ? `<div class="news-area-tag">${getAreaName(item.area)}</div>` : item.area === '全国' ? `<div class="news-area-tag">全国</div>` : ''}${console.log(`🏷️ タグ判定: "${item.title}" → エリア: ${item.area}`) || ''}
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
    const sectionHeader = document.querySelector('.breaking-news-section-header');

    if (!container) {
        console.error('❌ 速報ニュースコンテナが見つかりません');
        return;
    }

    // 1時間以内の記事のみをフィルタリング
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000); // 1時間前
    const recentBreakingNews = breakingNews.filter(item => {
        const publishedDate = new Date(item.publishedAt || item.pubDate || `${item.date} ${item.time || '00:00'}`);
        return publishedDate >= oneHourAgo;
    });

    console.log(`⏰ 1時間以内の速報記事: ${recentBreakingNews.length}件（全体: ${breakingNews.length}件）`);

    if (recentBreakingNews.length === 0) {
        console.log('📭 1時間以内の災害・緊急記事が0件のため、速報セクション全体を非表示');
        if (sectionHeader) {
            sectionHeader.style.display = 'none';
        }
        return;
    }

    // 1時間以内の災害・緊急記事がある場合は表示
    if (sectionHeader) {
        sectionHeader.style.display = 'block';
    }

    const breakingHtml = recentBreakingNews.slice(0, 5).map(item => {
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
                ${item.area && item.area !== 'all' && item.area !== '全国' ? `<div class="news-area-tag">${getAreaName(item.area)}</div>` : item.area === '全国' ? `<div class="news-area-tag">全国</div>` : ''}${console.log(`🏷️ タグ判定: "${item.title}" → エリア: ${item.area}`) || ''}
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
        regional: '行政',
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

// エリア名の取得
function getAreaName(area) {
    const areaNames = {
        all: '全国',
        hokkaido: '北海道',
        tohoku: '東北',
        kanto: '関東',
        tokyo: '東京',
        kanagawa: '神奈川',
        saitama: '埼玉',
        chiba: '千葉',
        nagano: '長野',
        tokai: '東海',
        kyoto: '京都',
        osaka: '大阪',
        hyogo: '兵庫',
        chugoku: '中国',
        kyushu: '九州',
        okinawa: '沖縄'
    };
    return areaNames[area] || area;
}

// ニュースのエリアを自動判定
function detectNewsArea(title, content) {
    const text = `${title} ${content}`.toLowerCase();

    // エリア判定キーワード（詳細版）
    const areaKeywords = {
        hokkaido: ['北海道', '札幌', '函館', '旭川', '釧路', '帯広', '北見', '室蘭', '苫小牧', '小樽', '根室', '稚内', '留萌', '名寄', '紋別', '夕張', '岩見沢', '滝川', '砂川', '赤平', '深川', '富良野', '登別', '恵庭', '伊達', '北広島', '石狩', '江別'],
        tohoku: ['東北', '青森', '岩手', '宮城', '秋田', '山形', '福島', '仙台', '盛岡', '郡山', '石巻', '気仙沼', '大崎', '弘前', '八戸', '五所川原', '十和田', '三沢', 'むつ', '一関', '陸前高田', '奥州', '花巻', '北上', '久慈', '二戸', '釜石', '宮古', '秋田市', '横手', '大館', '能代', '湯沢', '大仙', '由利本荘', '潟上', '山形市', '米沢', '鶴岡', '酒田', '新庄', '寒河江', '上山', 'いわき', '会津若松', '白河', '須賀川', '喜多方', '相馬', '二本松', '田村', '南相馬', '伊達市'],
        tokyo: ['東京', '東京都', '渋谷', '新宿', '池袋', '銀座', '品川', '上野', '秋葉原', '六本木', '青山', '丸の内', '表参道', '恵比寿', '中央区', '港区', '新宿区', '渋谷区', '豊島区', '品川区', '目黒区', '大田区', '世田谷区', '中野区', '杉並区', '練馬区', '板橋区', '北区', '荒川区', '足立区', '葛飾区', '江戸川区', '台東区', '墨田区', '江東区', '千代田区', '文京区', '立川', '武蔵野', '三鷹', '青梅', '府中', '昭島', '調布', '町田', '小金井', '小平', '日野', '東村山', '国分寺', '国立', '福生', '狛江', '東大和', '清瀬', '東久留米', '武蔵村山', '多摩', '稲城', '羽村', 'あきる野', '西東京', '八王子', '吉祥寺', '下北沢', '自由が丘', '二子玉川', '代官山', '原宿', 'お台場', '豊洲', '有楽町', '神田', '日本橋', '築地', '蒲田', '大森', '五反田', '大崎', '高田馬場', '早稲田', '神楽坂', '飯田橋', '水道橋', '御茶ノ水', '神保町', '大手町', '虎ノ門', '霞が関', '永田町', '赤坂', '溜池山王', '麻布', '白金', '三田', '田町', '浜松町', '新橋', '汐留', '竹芝', '伊豆大島', '利島', '新島', '神津島', '三宅島', '御蔵島', '八丈島', '青ヶ島', '小笠原'],
        kanagawa: ['神奈川', '横浜', '川崎', '相模原', '藤沢', '横須賀', '平塚', '茅ヶ崎', '厚木', '大和', '伊勢原', '海老名', '座間', '南足柄', '綾瀬', '葉山', '寒川', '大磯', '二宮', '中井', '大井', '松田', '山北', '開成', '箱根', '真鶴', '湯河原', '愛川', '清川', '鎌倉', '逗子', '三浦', '秦野', '小田原', 'みなとみらい', '関内', '桜木町', '戸塚', '港北ニュータウン', '新横浜', '青葉台', 'たまプラーザ', '武蔵小杉', '溝の口', '新百合ヶ丘', '本厚木', '海老名', '橋本', '相模大野', '藤沢', '辻堂', '大船', '金沢文庫', '金沢八景'],
        saitama: ['埼玉', 'さいたま', '川越', '川口', '所沢', '越谷', '草加', '春日部', '熊谷', '新座', '久喜', '狭山', '羽生', '鴻巣', '深谷', '上尾', '桶川', '北本', '八潮', '富士見', '三郷', '蓮田', '坂戸', '幸手', '鶴ヶ島', '日高', 'ふじみ野', '白岡', '伊奈', '三芳', '毛呂山', '越生', '滑川', '嵐山', '小川', '川島', '吉見', '鳩山', 'ときがわ', '横瀬', '皆野', '長瀞', '小鹿野', '東秩父', '美里', '神川', '上里', '寄居', '宮代', '杉戸', '松伏', '大宮', '浦和', '与野', '岩槻', '東松山', '加須', '本庄', '秩父', '飯能', '和光', '朝霞', '志木', '戸田', '入間'],
        chiba: ['千葉', '船橋', '柏', '市川', '松戸', '市原', '浦安', '習志野', '流山', '八千代', '我孫子', '房総', '成田', '佐倉', '東金', '旭', '勝浦', '鴨川', '鎌ケ谷', '君津', '富津', '四街道', '袖ケ浦', '八街', '印西', '白井', '富里', '南房総', '匝瑳', '香取', 'いすみ', '大網白里', '酒々井', '栄', '神崎', '多古', '東庄', '九十九里', '芝山', '横芝光', '一宮', '睦沢', '長生', '白子', '長柄', '長南', '大多喜', '御宿', '鋸南', '野田', '茂原', '木更津', '館山', '銚子', '小見川', '佐原', '本八幡', '津田沼', '新浦安', '海浜幕張', '蘇我'],
        nagano: ['長野', '松本', '上田', '安曇野', '軽井沢', '信州', '岡谷', '飯田', '諏訪', '須坂', '小諸', '伊那', '駒ヶ根', '中野', '大町', '飯山', '茅野', '塩尻', '佐久', '千曲', '東御', '南箕輪', '高森', '阿南', '阿智', '平谷', '根羽', '下條', '売木', '天龍', '泰阜', '喬木', '豊丘', '大鹿', '上松', '南木曽', '木祖', '王滝', '大桑', '木曽', '麻績', '生坂', '山形', '朝日', '筑北', '池田', '松川', '白馬', '小谷', '坂城', '小布施', '高山', '山ノ内', '木島平', '野沢温泉', '信濃町', '小川', '飯綱', '栄', '川上', '南牧', '南相木', '北相木', '佐久穂', '軽井沢', '御代田', '立科', '青木', '長和', '下諏訪', '富士見', '原', '辰野', '箕輪', '飯島', '南箕輪', '中川', '宮田'],
        osaka: ['大阪', '梅田', '難波', '天王寺', '新大阪', '心斎橋', '本町', '淀屋橋', '京橋', '鶴橋', '住吉', '堺', '東大阪', '豊中', '吹田', '高槻', '枚方', '茨木', '八尾', '寝屋川', '岸和田', '和泉', '箕面', '柏原', '羽曳野', '門真', '摂津', '高石', '藤井寺', '泉南', '四條畷', '交野', '大阪狭山', '阪南', '島本', '豊能', '能勢', '忠岡', '熊取', '田尻', '岬', '太子', '河南', '千早赤阪', '池田', '守口', '大東', '富田林', '河内長野', '松原', '大阪市', '堺市', '北区', '都島区', '福島区', '此花区', '西区', '港区', '大正区', '天王寺区', '浪速区', '西淀川区', '東淀川区', '東成区', '生野区', '旭区', '城東区', '阿倍野区', '住吉区', '東住吉区', '西成区', '淀川区', '鶴見区', '住之江区', '平野区', '北摂', '泉州', '河内'],
        kyoto: ['京都', '祇園', '清水寺', '金閣寺', '銀閣寺', '嵐山', '伏見', '宇治', '亀岡', '城陽', '向日', '長岡京', '八幡', '京田辺', '京丹後', '南丹', '木津川', '大山崎', '久御山', '井手', '宇治田原', '笠置', '和束', '精華', '南山城', '京丹波', '伊根', '与謝野', '東山', '左京', '中京', '右京', '下京', '南区', '上京', '山科', '西京', '福知山', '舞鶴', '綾部', '精華町', '木津川市', '京都市', '洛中', '洛東', '洛西', '洛南', '洛北', '西陣', '先斗町', '河原町', '烏丸', '四条', '三条', '二条', '五条', '六条', '七条', '八条', '九条', '十条'],
        hyogo: ['兵庫', '神戸', '姫路', '西宮', '尼崎', '明石', '加古川', '宝塚', '伊丹', '川西', '三田', '高砂', '川辺', '小野', '三木', '加西', '篠山', '養父', '丹波', '南あわじ', '朝来', '淡路', '宍粟', '加東', 'たつの', '猪名川', '多可', '稲美', '播磨', '市川', '福崎', '神河', '太子', '上郡', '佐用', '香美', '新温泉', '豊岡', '相生', '赤穂', '西脇', '洲本', '芦屋', '津名', '三原', '緑', '西淡', '三原', '南淡', '一宮', '五色', '東浦', '北淡', '淡路市', '南あわじ市', '洲本市', '中央区', '兵庫区', '長田区', '須磨区', '垂水区', '北区', '西区', '灘区', '東灘区', '有馬', '六甲', '摩耶', 'ポートアイランド', '三宮', '元町', '新神戸', '板宿', '舞子', '垂水', '須磨', '鈴蘭台', '西神中央'],
        tokai: ['名古屋', '愛知', '静岡', '岐阜', '三重', '浜松', '豊田', '岡崎', '一宮', '春日井', '津', '四日市', '豊橋', '岡崎', '瀬戸', '半田', '豊川', '津島', '碧南', '刈谷', '豊田', '安城', '西尾', '蒲郡', '犬山', '常滑', '江南', '小牧', '稲沢', '新城', '東海', '大府', '知多', '知立', '尾張旭', '高浜', '岩倉', '豊明', '日進', '田原', '愛西', '清須', '北名古屋', '弥富', 'みよし', 'あま', '長久手', '東郷', '豊山', '大口', '扶桑', '大治', '蟹江', '飛島', '阿久比', '東浦', '南知多', '美浜', '武豊', '幸田', '設楽', '東栄', '豊根', '静岡市', '浜松市', '沼津', '熱海', '三島', '富士宮', '伊東', '島田', '富士', '磐田', '焼津', '掛川', '藤枝', '御殿場', '袋井', '下田', '裾野', '湖西', '伊豆', '御前崎', '菊川', '伊豆の国', '牧之原', '河津', '南伊豆', '松崎', '西伊豆', '函南', '清水', '長泉', '小山', '吉田', '川根本', '森', '岐阜市', '大垣', '高山', '多治見', '関', '中津川', '美濃', '瑞浪', '羽島', '恵那', '美濃加茂', '土岐', '各務原', '可児', '山県', '瑞穂', '飛騨', '本巣', '郡上', '下呂', '海津', '岐南', '笠松', '養老', '垂井', '関ケ原', '神戸', '輪之内', '安八', '揖斐川', '大野', '池田', '北方', '坂祝', '富加', '川辺', '七宗', '八百津', '白川', '東白川', '御嵩', '白川村', '津市', '四日市市', '伊勢', '松阪', '桑名', '鈴鹿', '名張', '尾鷲', '亀山', '鳥羽', '熊野', 'いなべ', '志摩', '伊賀', '木曽岬', '東員', '菰野', '朝日', '川越', '多気', '明和', '大台', '玉城', '度会', '大紀', '南伊勢', '紀北', '御浜', '紀宝'],
        chugoku: ['広島', '岡山', '山口', '鳥取', '島根', '福山', '呉', '東広島', '倉敷', '津山', '下関', '宇部', '広島市', '呉市', '竹原', '三原', '尾道', '福山市', '府中', '三次', '庄原', '大竹', '東広島市', '廿日市', '安芸高田', '江田島', '府中町', '海田', '熊野', '坂', '安芸', '北広島', '大崎', '世羅', '神石高原', '岡山市', '倉敷市', '津山市', '玉野', '笠岡', '井原', '総社', '高梁', '新見', '備前', '瀬戸内', '赤磐', '真庭', '美作', '浅口', '和気', '早島', '里庄', '矢掛', '新庄', '鏡野', '勝央', '奈義', '西粟倉', '久米南', '美咲', '吉備中央', '下関市', '宇部市', '山口市', '萩', '防府', '下松', '岩国', '光', '長門', '柳井', '美祢', '周南', '山陽小野田', '周防大島', '和木', '上関', '田布施', '平生', '阿武', '鳥取市', '米子', '倉吉', '境港', '岩美', '若桜', '智頭', '八頭', '三朝', '湯梨浜', '琴浦', '北栄', '日吉津', '大山', '南部', '伯耆', '日南', '日野', '江府', '松江', '浜田', '出雲', '益田', '大田', '安来', '江津', '雲南', '東出雲', '奥出雲', '飯南', '川本', '美郷', '邦南', '津和野', '吉賀', '海士', '西ノ島', '知夫', '隠岐の島'],
        kyushu: ['福岡', '佐賀', '長崎', '熊本', '大分', '宮崎', '鹿児島', '博多', '天神', '小倉', '久留米', '佐世保', '島原', '別府', '宮崎市', '鹿児島市', '北九州', '福岡市', '飯塚', '田川', '柳川', '八女', '筑後', '大川', '行橋', '豊前', '中間', '小郡', '筑紫野', '春日', '大野城', '宗像', '太宰府', '古賀', '福津', 'うきは', '宮若', '嘉麻', '朝倉', 'みやま', '糸島', '那珂川', '宇美', '篠栗', '志免', '須恵', '新宮', '久山', '粕屋', '芦屋', '水巻', '岡垣', '遠賀', '小竹', '鞍手', '桂川', '筑前', '東峰', '大刀洗', '大木', '広川', '香春', '添田', '糸田', '川崎', '大任', '赤村', '福智', '苅田', 'みやこ', '吉富', '上毛', '築上', '佐賀市', '唐津', '鳥栖', '多久', '伊万里', '武雄', '鹿島', '小城', '嬉野', '神埼', '吉野ヶ里', '基山', '上峰', 'みやき', '玄海', '有田', '大町', '江北', '白石', '太良', '長崎市', '佐世保市', '島原市', '諫早', '大村', '平戸', '松浦', '対馬', '壱岐', '五島', '西海', '雲仙', '南島原', '長与', '時津', '東彼杵', '川棚', '波佐見', '小値賀', '佐々', '新上五島', '熊本市', '八代', '人吉', '荒尾', '水俣', '玉名', '山鹿', '菊池', '宇土', '上天草', '宇城', '阿蘇', '天草', '合志', '美里', '玉東', '南関', '長洲', '和水', '大津', '菊陽', '南小国', '小国', '産山', '高森', '西原', '南阿蘇', '御船', '嘉島', '益城', '甲佐', '山都', '氷川', '芦北', '津奈木', '錦', '多良木', '湯前', '水上', '相良', '五木', '山江', '球磨', 'あさぎり', '苓北', '大分市', '別府市', '中津', '日田', '佐伯', '臼杵', '津久見', '竹田', '豊後高田', '杵築', '宇佐', '豊後大野', '由布', '国東', '姫島', '日出', '九重', '玖珠', '宮崎市', '都城', '延岡', '日南', '小林', '日向', '串間', '西都', 'えびの', '三股', '高原', '国富', '綾', '高鍋', '新富', '西米良', '木城', '川南', '都農', '門川', '諸塚', '椎葉', '美郷', '高千穂', '日之影', '五ヶ瀬', '鹿児島市', '鹿屋', '枕崎', '阿久根', '出水', '指宿', '西之表', '垂水', '薩摩川内', '日置', '曽於', '霧島', 'いちき串木野', '南さつま', '志布志', '奄美', '南九州', '伊佐', '姶良', '三島', '十島', 'さつま', '長島', '湧水', '大崎', '東串良', '錦江', '南大隅', '肝付', '中種子', '南種子', '屋久島', '大和', '宇検', '瀬戸内', '龍郷', '喜界', '徳之島', '天城', '伊仙', '和泊', '知名', '与論'],
        okinawa: ['沖縄', '那覇', '名護', '沖縄市', '浦添', '宜野湾', '石垣', '宮古島', '糸満', '豊見城', 'うるま', '南城', '国頭', '大宜味', '東', '今帰仁', '本部', '恩納', '宜野座', '金武', '伊江', '読谷', '嘉手納', '北谷', '北中城', '中城', '西原', '与那原', '南風原', '渡嘉敷', '座間味', '粟国', '渡名喜', '南大東', '北大東', '伊平屋', '伊是名', '久米島', '八重瀬', '多良間', '竹富', '与那国', '首里', '新都心', '国際通り', '美ら海', 'ひめゆり', '辺野古', '普天間', '嘉手納', '読谷', '沖縄本島', '宮古', '八重山', '西表', '小浜', '波照間', '与那国島', '久米島', '慶良間', '伊江島', '水納島']
    };

    // キーワードマッチングでエリアを判定
    for (const [area, keywords] of Object.entries(areaKeywords)) {
        if (keywords.some(keyword => text.includes(keyword))) {
            return area;
        }
    }

    // 関東地方の一般的なキーワード
    const kantoKeywords = ['関東', '首都圏', '東京近郊', 'jr東日本', '京急', '小田急', '東急', '西武', '東武'];
    if (kantoKeywords.some(keyword => text.includes(keyword))) {
        return 'kanto';
    }

    return '全国'; // デフォルトは全国
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