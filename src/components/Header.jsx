import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Header = ({ onOpenAuth }) => {
    const [search, setSearch] = useState("");
    const [isDark, setIsDark] = useState(localStorage.getItem("theme") === "dark");
    const navigate = useNavigate();

    const userNickname = localStorage.getItem('user_nickname');

    useEffect(() => {
        document.body.classList.toggle("dark-mode", isDark);
        localStorage.setItem("theme", isDark ? "dark" : "light");
    }, [isDark]);

    const handleSearch = () => {
        if (search.trim()) navigate(`/search?q=${encodeURIComponent(search.trim())}`);
    };

    const handleAuthClick = () => {
        if (userNickname) {
            if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
                localStorage.removeItem('user_nickname');
                window.location.reload();
            }
        } else {
            onOpenAuth();
        }
    };

    return (
        <header className="vnn-header">
            <div className="container header-simple">
                <div className="header-left">
                    <h1 className="header__logo">
                        <Link to="/" title="vietnamnet">
                            <img width="140" src="https://static.vnncdn.net/v1/logo/logoVietnamNet.svg" alt="VietNamNet" />
                        </Link>
                    </h1>
                </div>

                <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="search-box">
                        <input
                            type="text"
                            id="search-input"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            placeholder="Tìm kiếm..."
                        />
                        <button className="search-btn" id="search-submit" onClick={handleSearch}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </button>
                    </div>

                    <button id="theme-toggle" className="theme-btn" onClick={() => setIsDark(!isDark)}>
                        <span id="theme-icon">{isDark ? "Tối" : "Sáng"}</span>
                    </button>

                    <button
                        className="vnn__login-btn"
                        id={userNickname ? "btn-logout" : "btn-login"}
                        onClick={handleAuthClick}
                        style={{ border: '1px solid black' }}
                    >
                        <span className="vnnclientid-login-text">
                            {userNickname ? "Đăng xuất" : "Đăng nhập"}
                        </span>
                        <img
                            className="vnnclientid-login-logo"
                            src="https://static.vnncdn.net/v1/icon/login.svg"
                            alt="login"
                        />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;