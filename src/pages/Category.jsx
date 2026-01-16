import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import "../assets/css/category.css";

const Category = () => {
    const { rss, title } = useParams();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategory = async () => {
            setLoading(true);
            try {
                const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rss)}`);
                const data = await res.json();
                if (data.status === 'ok') {
                    setItems(data.items);
                }
            } catch (err) {
                console.error("Lỗi:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCategory();
    }, [rss]);

    return (
        <main className="main-content">
            <div className="container">
                <div className="category-box">
                    <div className="category-header">
                        <h1 id="category-title">{decodeURIComponent(title || 'Tin tức')}</h1>
                        <div className="line"></div>
                    </div>

                    {loading ? (
                        <div id="loader" className="loader">
                            <div className="spinner"></div>
                            <p>Đang lấy tin mới nhất...</p>
                        </div>
                    ) : (
                        <ul id="news-grid" className="news-grid">
                            {items.map((item, index) => {
                                let thumb = 'https://via.placeholder.com/400x250?text=No+Image';

                                if (item.enclosure && item.enclosure.link) {
                                    thumb = item.enclosure.link;
                                } else if (item.thumbnail) {
                                    thumb = item.thumbnail;
                                } else if (item.description && item.description.includes("<img")) {
                                    const match = item.description.match(/<img[^>]+src="([^">]+)"/);
                                    if (match && match[1]) thumb = match[1];
                                }

                                thumb = thumb.replace(/[_-]\d+x\d+(\.\w+)$/, "$1");
                                thumb = thumb.replace(/\/w\d+\//, "/");

                                let shortDesc = "Đang cập nhật nội dung...";
                                if (item.description) {
                                    const textOnly = item.description
                                        .replace(/<[^>]*>/g, "")
                                        .replace(/\s+/g, " ")
                                        .trim();
                                    shortDesc = textOnly.length > 120 ? textOnly.substring(0, 120) + "..." : textOnly;
                                }

                                return (
                                    <li key={index} className="news-item">
                                        <Link to={`/article/${encodeURIComponent(rss)}/${index}`}>
                                            <div className="thumb-container">
                                                <img
                                                    src={thumb}
                                                    alt={item.title}
                                                    loading="lazy"
                                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x250?text=Error'; }}
                                                />
                                            </div>
                                            <div className="news-info">
                                                <h3>{item.title}</h3>
                                                <p className="date">{new Date(item.pubDate).toLocaleString('vi-VN')}</p>
                                                <p className="desc">{shortDesc}</p>
                                            </div>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </div>
        </main>
    );
};

export default Category;