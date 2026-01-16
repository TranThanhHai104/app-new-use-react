import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';

import "./App.css"
import "./assets/css/modules/footer.css";
import "./assets/css/modules/header.css";
import "./assets/css/modules/auth-modal.css";
import "./assets/css/modules/nav.css";

import Header from "./components/Header.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Category from "./pages/Category.jsx";
import Search from "./pages/Search.jsx";
import ArticleDetail from "./pages/ArticleDetail.jsx";
import Auth from './Auth.jsx';

function App() {
    const [showAuth, setShowAuth] = useState(false);
    const isAuth = !!localStorage.getItem('user_nickname');

    return (
        <Router>
            <Header onOpenAuth={() => setShowAuth(true)} />
            <Navbar />

            {showAuth && <Auth onClose={() => setShowAuth(false)} />}

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/category/:rss/:title" element={<Category />} />

                <Route path="/article/:rss/:id" element={<ArticleDetail />} />

                <Route
                    path="/admin-dashboard"
                    element={isAuth ? <div style={{padding:'100px'}}>Admin Panel</div> : <Navigate to="/" replace />}
                />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            <Footer />
        </Router>
    );
}

export default App;