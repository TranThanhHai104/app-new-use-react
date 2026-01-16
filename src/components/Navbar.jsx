import { Link, useLocation } from 'react-router-dom';
import { vietnamnetFeeds } from '../constants';

const Navbar = () => {
    const location = useLocation();

    return (
        <div id="nav-id">
            <nav className="nav">
                <ul id="nav-list" className="nav-list">
                    <li>
                        <Link
                            to="/"
                            className={location.pathname === "/" ? "active" : ""}
                        >
                            Home
                        </Link>
                    </li>

                    {vietnamnetFeeds.map(feed => {
                        const categoryPath = `/category/${encodeURIComponent(feed.url)}/${encodeURIComponent(feed.title)}`;

                        return (
                            <li key={feed.nid}>
                                <Link
                                    to={categoryPath}
                                    className={location.pathname === categoryPath ? "active" : ""}
                                >
                                    {feed.title}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </div>
    );
};

export default Navbar;