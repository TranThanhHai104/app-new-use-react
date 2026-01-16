import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { vietnamnetFeeds } from '../constants';
import "../assets/css/searh.css";

const Search = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || "";
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const getThumb = (item) => {
        let thumb = 'https://via.placeholder.com/400x250?text=No+Image';
        if (item.enclosure?.link) {
            thumb = item.enclosure.link;
        } else if (item.thumbnail) {
            thumb = item.thumbnail;
        } else if (item.description && item.description.includes("<img")) {
            const m = item.description.match(/<img[^>]+src="([^">]+)"/);
            if (m && m[1]) thumb = m[1];
        }
        return thumb;
    };

    useEffect(() => {
        if (!query) return;

        const fetchSearch = async () => {
            setLoading(true);
            try {
                const requests = vietnamnetFeeds.map(feed =>
                    fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}`)
                        .then(res => res.json())
                );
                const allData = await Promise.all(requests);
                let allItems = [];
                allData.forEach((data, i) => {
                    if (data.status === 'ok') {
                        data.items.forEach((item, idx) => {
                            allItems.push({ ...item, _rssUrl: vietnamnetFeeds[i].url, _index: idx });
                        });
                    }
                });

                const filtered = allItems.filter(item =>
                    item.title.toLowerCase().includes(query.toLowerCase())
                ).sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

                setResults(filtered);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchSearch();
    }, [query]);

    return (
        <main className="container">
            <div className="search-results-wrapper">
                <p className="search-info">
                    Tìm thấy (<span>{results.length}</span>) kết quả cho: "<b>{query}</b>"
                </p>

                {loading && <div className="loader">Đang lục tìm dữ liệu...</div>}

                <div className="articles-list">
                    {results.map((item, idx) => {
                        const detailLink = `/article/${encodeURIComponent(item._rssUrl)}/${item._index}`;
                        const thumb = getThumb(item);
                        const cleanDesc = item.description.replace(/<[^>]*>?/gm, '').substring(0, 160);

                        return (
                            <div key={idx} className="article-item">
                                <div className="article-thumb">
                                    <Link to={detailLink}>
                                        <img
                                            src={thumb}
                                            alt="thumb"
                                            onError={(e) => e.target.src='https://via.placeholder.com/400x250'}
                                        />
                                    </Link>
                                </div>
                                <div className="article-info">
                                    <h3>
                                        <Link to={detailLink}>{item.title}</Link>
                                    </h3>
                                    <p>{cleanDesc}...</p>
                                    <span className="date">{new Date(item.pubDate).toLocaleString('vi-VN')}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {!loading && results.length === 0 && query && (
                    <div className="no-results">Không tìm thấy bài viết nào phù hợp.</div>
                )}
            </div>
        </main>
    );
};

export default Search;