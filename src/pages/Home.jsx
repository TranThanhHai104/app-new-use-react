import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { vietnamnetFeeds } from '../constants';
import "../assets/css/style.css"

const Home = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('vi-VN');
    };

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
        const fetchData = async () => {
            let allItems = [];
            try {
                const requests = vietnamnetFeeds.map(feed =>
                    fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}`)
                        .then(res => res.json())
                        .then(data => {
                            if (data.status === "ok" && data.items) {
                                data.items.forEach((item, idx) => {
                                    allItems.push({ ...item, _rssUrl: feed.url, _index: idx });
                                });
                            }
                        })
                );

                await Promise.all(requests);

                allItems.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

                setNews(allItems.slice(0, 12));
            } catch (err) {
                console.error("Lỗi kết nối dữ liệu:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <main id="news-container">
            <div className="category-box">
                <h2 className="category-title">Tin mới nhất</h2>

                <ul id="news-grid" className="news-grid">
                    {!loading && news.map((item, idx) => (
                        <li key={idx} className="news-item">
                            <Link to={`/article/${encodeURIComponent(item._rssUrl)}/${item._index}`}>
                                <div className="thumb-container">
                                    <img
                                        src={getThumb(item)}
                                        loading="lazy"
                                        alt={item.title}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://via.placeholder.com/400x250?text=Error';
                                        }}
                                    />
                                </div>
                                <div className="news-info">
                                    <h3>{item.title}</h3>
                                    <p className="date">{formatDate(item.pubDate)}</p>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>

                {loading && (
                    <div id="home-loader" className="loader">
                        Đang tải tin...
                    </div>
                )}

                {error && <div className="loader">Lỗi kết nối dữ liệu.</div>}
            </div>
        </main>
    );
};

export default Home;