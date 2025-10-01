// 新しい記事データセット - 各ジャンル・地域5記事ずつ

const newNewsData = [
    // === 観光 (tourism) - 各地域5記事 ===
    
    // 北海道 (hokkaido) - 5記事
    {
        id: "tourism_hokkaido_1",
        title: "函館朝市で冬の味覚祭り開始、カニ・ウニ・イクラの三大海鮮が勢揃い",
        excerpt: "函館朝市で冬季限定の味覚祭りがスタート。北海道の三大海鮮であるカニ、ウニ、イクラを使った特別メニューが100店舗以上で提供されます。",
        content: "函館朝市協同組合は12月1日から3月31日まで「冬の味覚祭り」を開催すると発表した。期間中は市場内の約100店舗でタラバガニ、毛ガニ、ズワイガニをはじめ、濃厚なウニ、プチプチのイクラを使った特別メニューが提供される。注目は「海鮮三色丼」（2,800円）で、新鮮なウニ、イクラ、カニの身が贅沢に盛られた逸品。",
        image: "https://images.unsplash.com/photo-1580822184713-8f8839062011?w=400&h=250&fit=crop&q=80",
        category: "tourism",
        region: "hokkaido",
        source: "北海道観光振興機構",
        publishedAt: "2024-09-02T09:15:00",
        isBreaking: false,
        tags: ["海鮮", "グルメ", "函館朝市"],
        originalUrl: "https://example.com/news/hakodate-winter-seafood-festival"
    },
    {
        id: "tourism_hokkaido_2",
        title: "札幌雪まつり2025、過去最大規模の雪像と氷の彫刻コンテスト開催",
        excerpt: "来年2月開催の札幌雪まつりで、過去最大となる高さ15メートルの雪像が制作予定。国際氷彫刻コンテストも同時開催されます。",
        content: "札幌雪まつり実行委員会は、2025年2月4日から11日まで開催される第75回さっぽろ雪まつりの概要を発表した。今回は過去最大規模となる高さ15メートル、幅30メートルの大雪像「北海道開拓の歴史」が大通公園4丁目会場に登場する。制作には自衛隊員約300名が参加し、約5,000トンの雪が使用される予定。",
        image: "https://images.unsplash.com/photo-1548273887-52d4b599b3d8?w=400&h=250&fit=crop&q=80",
        category: "tourism",
        region: "hokkaido",
        source: "札幌市観光文化局",
        publishedAt: "2024-09-02T14:30:00",
        isBreaking: false,
        tags: ["雪まつり", "イベント", "氷彫刻"],
        originalUrl: "https://example.com/news/sapporo-snow-festival-2025"
    },
    {
        id: "tourism_hokkaido_3",
        title: "知床半島で流氷ウォーキングツアー解禁、野生動物との遭遇も",
        excerpt: "世界自然遺産・知床半島で流氷の上を歩く特別ツアーがスタート。アザラシやオジロワシなど野生動物との出会いが期待できます。",
        content: "知床自然ガイド協会は、世界自然遺産である知床半島で「流氷ウォーキングツアー」の受付を開始した。1月15日から3月15日までの期間限定で、厚さ30cm以上の安全な流氷の上を専門ガイドと共に歩く貴重な体験ができる。",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop&q=80",
        category: "tourism",
        region: "hokkaido",
        source: "知床斜里町観光協会",
        publishedAt: "2024-09-01T16:45:00",
        isBreaking: false,
        tags: ["知床", "流氷", "野生動物"],
        originalUrl: "https://example.com/news/shiretoko-drift-ice-walking"
    },
    {
        id: "tourism_hokkaido_4",
        title: "小樽運河で「キャンドルナイト2024」開催、2万本のキャンドルが水面を照らす",
        excerpt: "小樽運河沿いに2万本のキャンドルが灯る幻想的なイベント。雪景色とキャンドルの光が織りなす美しい冬の風物詩です。",
        content: "小樽市は12月23日から25日まで、小樽運河で「小樽雪あかりの路キャンドルナイト2024」を開催する。今年は過去最多となる2万本のキャンドルが運河沿い1.2kmにわたって設置され、雪化粧した石造倉庫群と共に幻想的な景色を演出する。",
        image: "https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?w=400&h=250&fit=crop&q=80",
        category: "tourism",
        region: "hokkaido",
        source: "小樽市観光協会",
        publishedAt: "2024-09-02T11:20:00",
        isBreaking: false,
        tags: ["小樽運河", "キャンドル", "冬イベント"],
        originalUrl: "https://example.com/news/otaru-candle-night-2024"
    },
    {
        id: "tourism_hokkaido_5",
        title: "登別温泉で新たな源泉発見、100年ぶりの新湯「美肌の湯」誕生",
        excerpt: "登別温泉で約100年ぶりに新たな源泉が発見され、美肌効果の高い「美肌の湯」として注目を集めています。",
        content: "登別温泉観光協会は、地獄谷近くで新たな温泉源泉が発見されたと発表した。この新源泉は約100年ぶりの発見で、泉質は含硫黄ナトリウム塩化物泉。特に美肌効果が高いことから「美肌の湯」と命名された。",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop&q=80",
        category: "tourism",
        region: "hokkaido",
        source: "登別市観光振興課",
        publishedAt: "2024-09-01T13:10:00",
        isBreaking: false,
        tags: ["温泉", "新源泉", "美肌効果"],
        originalUrl: "https://example.com/news/noboribetsu-new-hot-spring"
    },

    // 東京 (tokyo) - 5記事
    {
        id: "tourism_tokyo_1",
        title: "東京スカイツリータウンに新展望デッキ「雲上の庭」オープン",
        excerpt: "東京スカイツリーに高さ500メートルの新展望デッキが誕生。360度のパノラマビューと空中庭園が楽しめる新名所です。",
        content: "東京スカイツリータウンは、地上500メートルに位置する新展望デッキ「雲上の庭」を12月15日にオープンすると発表した。これまでの最高展望デッキより50メートル高く、関東平野を一望できる360度のパノラマビューが楽しめる。",
        image: "https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=400&h=250&fit=crop&q=80",
        category: "tourism",
        region: "tokyo",
        source: "東武タワースカイツリー",
        publishedAt: "2024-09-02T10:30:00",
        isBreaking: false,
        tags: ["スカイツリー", "展望デッキ", "新名所"],
        originalUrl: "https://example.com/news/skytree-cloud-garden"
    },
    {
        id: "tourism_tokyo_2",
        title: "浅草に江戸時代の街並み再現「江戸ワンダーランド東京」開業",
        excerpt: "浅草に江戸時代の文化と街並みを完全再現したテーマパークが誕生。忍者ショーや江戸グルメが楽しめる新スポット。",
        content: "浅草に江戸時代の街並みと文化を完全再現したテーマパーク「江戸ワンダーランド東京」が来年3月にオープンする。約2万平方メートルの敷地に、江戸時代の町屋、武家屋敷、寺社を忠実に再現。",
        image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&h=250&fit=crop&q=80",
        category: "tourism",
        region: "tokyo",
        source: "台東区観光課",
        publishedAt: "2024-09-01T15:20:00",
        isBreaking: false,
        tags: ["江戸時代", "テーマパーク", "浅草"],
        originalUrl: "https://example.com/news/edo-wonderland-tokyo"
    },
    {
        id: "tourism_tokyo_3",
        title: "お台場に新アクアリウム「東京オーシャンパーク」来春オープン",
        excerpt: "お台場に世界最大級のアクアリウムが誕生。8,000種の海洋生物と最新映像技術を駆使した海中散歩体験が話題です。",
        content: "お台場に世界最大級のアクアリウム「東京オーシャンパーク」が来年4月にオープンする。総面積3万平方メートルの施設内には、8,000種・100万匹の海洋生物を展示。特に注目は全長100メートルの水中トンネル「オーシャンウォーク」で、頭上を泳ぐジンベエザメやマンタを間近で観察できる。",
        image: "https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=400&h=250&fit=crop&q=80",
        category: "tourism",
        region: "tokyo",
        source: "港区観光協会",
        publishedAt: "2024-09-02T13:45:00",
        isBreaking: false,
        tags: ["アクアリウム", "お台場", "海洋生物"],
        originalUrl: "https://example.com/news/tokyo-ocean-park"
    },
    {
        id: "tourism_tokyo_4",
        title: "上野動物園でシャンシャンの弟妹誕生、双子パンダの愛称募集開始",
        excerpt: "上野動物園でジャイアントパンダの双子が誕生。シャンシャンの弟妹となる2頭の愛称を全国から募集しています。",
        content: "恩賜上野動物園で8月15日に誕生したジャイアントパンダの双子の一般公開が11月から始まることが決定した。雄と雌の双子は順調に成長しており、現在体重は雄が2.8kg、雌が2.5kgまで成長。シンシンとリーリーの第3子、第4子となる2頭の愛称を全国から募集している。",
        image: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=400&h=250&fit=crop&q=80",
        category: "tourism",
        region: "tokyo",
        source: "恩賜上野動物園",
        publishedAt: "2024-09-01T11:30:00",
        isBreaking: false,
        tags: ["パンダ", "上野動物園", "双子誕生"],
        originalUrl: "https://example.com/news/ueno-panda-twins"
    },
    {
        id: "tourism_tokyo_5",
        title: "渋谷スカイ展望台で「星空カフェ」期間限定オープン",
        excerpt: "渋谷スカイの屋上展望台に期間限定の星空カフェが登場。プラネタリウム映像と特製カクテルで都会の夜空を演出します。",
        content: "渋谷スカイの屋上展望台「SKY STAGE」で、期間限定の「星空カフェ」が12月1日から2月29日まで開催される。東京の夜景を一望できる展望台に、360度のプラネタリウム映像を投影し、まるで宇宙空間にいるような体験を提供。",
        image: "https://images.unsplash.com/photo-1492539161849-b2b18e79c85f?w=400&h=250&fit=crop&q=80",
        category: "tourism",
        region: "tokyo",
        source: "渋谷スカイ",
        publishedAt: "2024-09-02T18:00:00",
        isBreaking: false,
        tags: ["渋谷", "夜景", "星空カフェ"],
        originalUrl: "https://example.com/news/shibuya-sky-star-cafe"
    }
];

// この配列をメインのnewsDataに置き換えます