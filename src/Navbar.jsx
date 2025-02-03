import { Link, useLocation } from 'react-router-dom';
import './TopNavbar.css';

const TopNavbar = () => {
    const location = useLocation();

    return (
        <nav className="top-navbar">
            <div className="nav-links">
                <Link 
                    to="/" 
                    className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                >
                    Multiple Ring
                </Link>
                <Link 
                    to="/single" 
                    className={`nav-link ${location.pathname === '/single' ? 'active' : ''}`}
                >
                    Single Ring
                </Link>
            </div>
        </nav>
    );
};

export default TopNavbar;