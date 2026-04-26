// Impact dashboard
const ID = window.OURO_DATA;

function Impact() {
  const im = ID.impact;
  const max = Math.max(...im.history.map(h => h.co2));

  return (
    <div>
      <div className="page-hero">
        <div>
          <div className="label">Your impact</div>
          <h1>Six months. Four point two tonnes.</h1>
          <div className="sub">Every listing, purchase, and renovation choice adds up. Share your impact
          report or use it for your sustainability certification.</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span className="chip moss">★ {im.rank}</span>
          <div className="tiny muted" style={{ marginTop: 8 }}>since Nov 2025</div>
        </div>
      </div>

      {/* big stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        {[
          [im.co2Saved, 't', 'CO₂ avoided'],
          [im.wasteDiverted, 't', 'waste diverted'],
          ['€' + im.subsidiesUnlocked.toLocaleString(), '', 'subsidies unlocked'],
          ['€' + im.moneySaved.toLocaleString(), '', 'money saved vs. retail'],
        ].map(([n, u, l], i) => (
          <div key={l} style={{ padding: '32px 24px 32px 0', borderRight: i < 3 ? '1px solid var(--line)' : 'none' }}>
            <div className="serif" style={{ fontSize: 48, lineHeight: 1, letterSpacing: '-0.025em' }}>
              {n}<small style={{ fontSize: 20, color: 'var(--ink-3)', marginLeft: 4 }}>{u}</small>
            </div>
            <div className="small muted" style={{ marginTop: 12 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* chart + activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24, marginTop: 36 }}>
        <div className="card">
          <div className="row between">
            <div className="serif" style={{ fontSize: 22 }}>CO₂ avoided · monthly</div>
            <span className="chip">tonnes</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, height: 220, marginTop: 28, paddingBottom: 28, borderBottom: '1px solid var(--line)' }}>
            {im.history.map(h => (
              <div key={h.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end' }}>
                  <div style={{
                    width: '100%',
                    height: (h.co2 / max * 100) + '%',
                    background: 'var(--moss)',
                    borderRadius: '3px 3px 0 0',
                    position: 'relative',
                  }}>
                    <div className="mono" style={{
                      position: 'absolute', top: -22, left: '50%', transform: 'translateX(-50%)',
                      fontSize: 11, color: 'var(--ink-2)',
                    }}>{h.co2}</div>
                  </div>
                </div>
                <div className="tiny muted">{h.month}</div>
              </div>
            ))}
          </div>
          <div className="tiny muted" style={{ marginTop: 14 }}>
            Equivalent to <b style={{ color: 'var(--ink)' }}>{Math.round(im.co2Saved * 240)} km</b> not driven, or <b style={{ color: 'var(--ink)' }}>{Math.round(im.co2Saved * 50)} trees</b> growing for a year.
          </div>
        </div>

        <div>
          <div className="row between" style={{ marginBottom: 12 }}>
            <div className="label">Recent activity</div>
            <button className="btn ghost tiny" style={{ padding: '4px 10px', fontSize: 11 }}>Export PDF</button>
          </div>
          <div>
            {im.activity.map((a, i) => (
              <div key={i} style={{ padding: '14px 0', borderTop: '1px solid var(--line)' }}>
                <div className="row between">
                  <div className="tiny muted mono">{a.date}</div>
                  <div className="tiny" style={{ color: 'var(--moss-ink)' }}>{a.meta}</div>
                </div>
                <div style={{ fontSize: 13.5, marginTop: 4 }}>{a.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* shareable card */}
      <div className="card" style={{
        marginTop: 36, background: 'var(--ink)', color: 'var(--bg)',
        borderColor: 'var(--ink)', padding: 36,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 32,
      }}>
        <div>
          <div className="label" style={{ color: 'var(--moss-soft)' }}>Shareable impact card</div>
          <div className="serif" style={{ fontSize: 36, marginTop: 8, maxWidth: 540, lineHeight: 1.1 }}>
            "I avoided 4.2 tonnes of CO₂ renovating my home with OuroNova."
          </div>
          <div className="small" style={{ marginTop: 14, opacity: 0.7 }}>Auto-generates for LinkedIn, Instagram, or your sustainability report.</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
          <button className="btn moss">Share on LinkedIn</button>
          <button className="btn ghost" style={{ borderColor: 'var(--ink-3)', color: 'var(--bg)' }}>Download card</button>
        </div>
      </div>
    </div>
  );
}

window.Impact = Impact;
