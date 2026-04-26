// App shell — sidebar nav + topbar + page router
const { useState, useEffect, useMemo, useCallback, createContext, useContext } = React;

const RouteCtx = React.createContext({ route: 'landing', go: () => {} });
const useRoute = () => React.useContext(RouteCtx);

function RouterProvider({ children }) {
  const [route, setRoute] = useState(() => {
    const h = window.location.hash.replace('#', '');
    return h || 'landing';
  });
  useEffect(() => {
    const onHash = () => setRoute(window.location.hash.replace('#', '') || 'landing');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  const go = useCallback((next) => {
    window.location.hash = next;
    window.scrollTo({ top: 0 });
  }, []);
  return (
    <RouteCtx.Provider value={{ route, go }}>
      {children}
    </RouteCtx.Provider>
  );
}

function BrandMark({ size = 28 }) {
  return (
    <div className="brand-mark" style={{ width: size, height: size }} />
  );
}

function Sidebar() {
  const { route, go } = useRoute();
  const items = [
    { section: 'Homeowner' },
    { id: 'analyze', label: 'Photo analysis' },
    { id: 'estimate', label: 'Cost estimate' },
    { id: 'subsidies', label: 'Subsidies' },
    { section: 'Marketplace' },
    { id: 'browse', label: 'Browse materials' },
    { id: 'list', label: 'List a material' },
    { section: 'You' },
    { id: 'impact', label: 'Impact' },
  ];
  return (
    <aside className="sidebar">
      <div className="brand" onClick={() => go('landing')} style={{ cursor: 'pointer' }}>
        <img src="assets/ouronova-logo.png" alt="OuroNova" className="sidebar-logo" />
      </div>
      {items.map((it, i) =>
        it.section ? (
          <div key={i} className="nav-section">{it.section}</div>
        ) : (
          <div
            key={it.id}
            className={'nav-item' + (route === it.id ? ' active' : '')}
            onClick={() => go(it.id)}
          >
            <span className="nav-dot" />
            {it.label}
          </div>
        )
      )}
      <div className="sidebar-foot">
        <div>OuroNova MVP · v0.1</div>
        <div style={{ marginTop: 4 }}>EuroTeQaThon 2025 · École Polytechnique</div>
      </div>
    </aside>
  );
}

const ROUTE_LABELS = {
  landing: ['Welcome'],
  analyze: ['Homeowner', 'Photo analysis'],
  estimate: ['Homeowner', 'Cost estimate'],
  subsidies: ['Homeowner', 'Subsidies'],
  browse: ['Marketplace', 'Browse'],
  listing: ['Marketplace', 'Listing'],
  list: ['Marketplace', 'List a material'],
  impact: ['You', 'Impact'],
};

function Topbar() {
  const { route } = useRoute();
  const baseRoute = route.split(':')[0];
  const crumbs = ROUTE_LABELS[baseRoute] || ['Welcome'];
  return (
    <div className="topbar">
      <div className="topbar-crumb">
        {crumbs.map((c, i) => (
          <span key={i}>
            {i > 0 && <span style={{ margin: '0 8px', color: 'var(--line)' }}>/</span>}
            {i === crumbs.length - 1 ? <b>{c}</b> : c}
          </span>
        ))}
      </div>
      <div className="topbar-right">
        <span className="chip moss">● France · Paris</span>
        <span className="muted small">Camille D.</span>
        <div className="avatar">CD</div>
      </div>
    </div>
  );
}

function Shell({ children }) {
  const { route } = useRoute();
  if (route === 'landing') return <>{children}</>;
  return (
    <div className="app">
      <Sidebar />
      <div className="main">
        <Topbar />
        <div className="page fade-in" key={route}>{children}</div>
      </div>
    </div>
  );
}

Object.assign(window, { RouterProvider, useRoute, Shell, BrandMark });
