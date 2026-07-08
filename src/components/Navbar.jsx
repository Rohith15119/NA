import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="navbar">
      <Link to="/" className="navbar-brand">
        <div className="navbar-logo">🎓</div>
        <div>
          <div className="navbar-name">NQT Master</div>
          <div className="navbar-sub">Numerical Ability Practice</div>
        </div>
      </Link>
      <div className="navbar-actions">
        <Link to="/" className="nav-btn">🏠 Home</Link>
        <Link to="/test/overall" className="nav-btn primary">⚡ Mock Test</Link>
      </div>
    </header>
  );
}
