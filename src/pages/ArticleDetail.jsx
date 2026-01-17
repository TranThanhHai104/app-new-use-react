import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import "../assets/css/article-detail.css";

const ArticleDetail = () => {
    const { rss, id } = useParams();
    const [article, setArticle] = useState(null);
    const [fullContent, setFullContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [audioState, setAudioState] = useState("stopped");

    const audioRef = useRef(new Audio());

    useEffect(() => {
        const fetchArticle = async () => {
            setLoading(true);
            try {
                const rssRes = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rss)}`);
                const rssData = await rssRes.json();

                if (rssData.status !== 'ok') throw new Error("RSS Error");
                const item = rssData.items[id];
                if (!item) throw new Error("Không tìm thấy bài viết");

                setArticle(item);

                const crawlRes = await fetch(`https://app-new-use-react.onrender.com/api/crawl?url=${encodeURIComponent(item.link)}`);
                const crawlData = await crawlRes.json();

                if (crawlData.success) {
                    const highResContent = crawlData.content.replace(/\?width=260/g, '?width=1000');
                    setFullContent(highResContent);
                } else {
                    setFullContent(`Lỗi: ${crawlData.error || "Không thể tải nội dung."}`);
                }
            } catch (err) {
                console.error("Lỗi:", err);
                setFullContent("Lỗi kết nối. Hãy đảm bảo server.js đang chạy.");
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = "";
            }
        };
    }, [rss, id]);

    useEffect(() => {
        if (!loading && article) {
            const renderCusdis = () => {
                const container = document.getElementById('cusdis_thread');
                if (!container) return;

                container.innerHTML = '';

                let script = document.getElementById('cusdis-script');
                if (!script) {
                    script = document.createElement('script');
                    script.id = 'cusdis-script';
                    script.src = 'https://cusdis.com/js/cusdis.es.js';
                    script.async = true;
                    script.defer = true;
                    script.onload = () => {
                        if (window.renderCusdis) window.renderCusdis(container);
                    };
                    document.body.appendChild(script);
                } else if (window.renderCusdis) {
                    window.renderCusdis(container);
                }
            };

            const timer = setTimeout(renderCusdis, 500);
            return () => clearTimeout(timer);
        }
    }, [loading, article]);

    const handleSpeak = async () => {
        if (audioRef.current.src && audioState === "paused") {
            audioRef.current.play();
            setAudioState("playing");
            return;
        }

        if (!article || !fullContent) return;
        setAudioState("loading");

        const title = article.title || "";
        const cleanContent = fullContent.replace(/<[^>]*>?/gm, '');
        const textToRead = (title + ". " + cleanContent)
            .replace(/\s+/g, " ")
            .trim()
            .substring(0, 300);

        try {
            const response = await fetch("https://app-new-use-react.onrender.com/api/tts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: textToRead })
            });
            const data = await response.json();

            if (data.url) {
                audioRef.current.src = data.url;
                audioRef.current.load();
                audioRef.current.oncanplaythrough = () => {
                    const speed = document.getElementById("audio-speed")?.value || 1.0;
                    audioRef.current.playbackRate = parseFloat(speed);
                    audioRef.current.play();
                    setAudioState("playing");
                };
                audioRef.current.onended = () => setAudioState("stopped");
                audioRef.current.onerror = () => setAudioState("stopped");
            } else {
                setAudioState("stopped");
            }
        } catch (error) {
            console.error("Lỗi TTS:", error);
            setAudioState("stopped");
        }
    };

    const handlePause = () => { audioRef.current.pause(); setAudioState("paused"); };
    const handleStop = () => { audioRef.current.pause(); audioRef.current.currentTime = 0; setAudioState("stopped"); };
    const handleResume = () => { audioRef.current.play(); setAudioState("playing"); };

    if (loading) return (
        <div className="loader">
            <div className="spinner"></div>
            <p>Đang tải nội dung...</p>
        </div>
    );

    return (
        <main className="main-content">
            <div className="article-container">
                <h1 id="title">{article?.title}</h1>

                <div className="audio-control">
                    <span className="audio-label"><i className="fas fa-headphones"></i> Nghe đọc tin:</span>
                    <div className="audio-btns">
                        {audioState === "stopped" && (
                            <button className="btn-audio" onClick={handleSpeak}><i className="fas fa-play"></i></button>
                        )}
                        {audioState === "loading" && (
                            <button className="btn-audio"><i className="fas fa-spinner fa-spin"></i></button>
                        )}
                        {audioState === "playing" && (
                            <button className="btn-audio" onClick={handlePause}><i className="fas fa-pause"></i></button>
                        )}
                        {audioState === "paused" && (
                            <button className="btn-audio" onClick={handleResume}><i className="fas fa-play-circle"></i></button>
                        )}
                        {(audioState === "playing" || audioState === "paused") && (
                            <button className="btn-audio" onClick={handleStop}><i className="fas fa-stop"></i></button>
                        )}
                        <select id="audio-speed" className="audio-select" defaultValue="1.0"
                                onChange={(e) => { if(audioRef.current) audioRef.current.playbackRate = parseFloat(e.target.value)}}>
                            <option value="0.8">Chậm</option>
                            <option value="1.0">Bình thường</option>
                            <option value="1.2">Nhanh</option>
                            <option value="1.5">Rất nhanh</option>
                        </select>
                    </div>
                </div>

                <p className="date">{article?.pubDate ? new Date(article.pubDate).toLocaleString('vi-VN') : ""}</p>

                {article?.enclosure?.link && (
                    <img className="thumb" src={article.enclosure.link.replace(/\?width=260/g, '?width=1000')} alt="thumb" />
                )}

                <div className="full-article-content" dangerouslySetInnerHTML={{ __html: fullContent }} />

                <p className="source">
                    Nguồn: <a href={article?.link} target="_blank" rel="noreferrer">Xem bài viết gốc</a>
                </p>

                <hr style={{margin: '40px 0', border: '0', borderTop: '1px solid #eee'}} />

                <div className="comment-section">
                    <h3 className="comment-title">Bình luận</h3>
                    <div
                        id="cusdis_thread"
                        key={article?.link}
                        data-host="https://cusdis.com"
                        data-app-id="0268a669-39d4-47e7-b072-51aa66e56e6c"
                        data-page-id={article ? btoa(article.link).substring(0, 20) : ""}
                        data-page-url={window.location.href}
                        data-page-title={article?.title}
                        data-lang="vi"
                    ></div>
                </div>
            </div>
        </main>
    );
};

export default ArticleDetail;