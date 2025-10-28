// クリーンな初期化関数
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

    // 天気予報を初期化
    console.log('🌤️ 天気予報初期化開始');
    if (typeof updateWeatherForecast === 'function') {
        updateWeatherForecast('all');
    } else {
        console.error('❌ updateWeatherForecast関数が見つかりません');
    }

    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            loadMoreNews(false);
        });
    }

    console.log('✅ 全初期化完了');
});