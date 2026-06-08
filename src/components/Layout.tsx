import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const navItems = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/overzicht', label: 'Overzicht', icon: '📋' },
  { path: '/overhoren', label: 'Overhoren', icon: '🎓' },
  { path: '/statistieken', label: 'Statistieken', icon: '📊' },
];

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="app-layout">
      <header className="site-header">
        <div className="header-inner">
          <Link to="/" className="brand">
            <span className="brand-icon">🏆</span>
            <div>
              <span className="brand-title">Eredivisie Kampioenen</span>
              <span className="brand-subtitle">Sinds 1889</span>
            </div>
          </Link>
          <nav className="main-nav">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="site-main">{children}</main>
      <footer className="site-footer">
        <p>Data gebaseerd op KNVB-historie en RSSSF · {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
