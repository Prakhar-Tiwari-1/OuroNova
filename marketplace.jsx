// Marketplace: Browse + Listing detail + List a material (contractor)
const MD = window.OURO_DATA;

function gradePill(g) {
  const map = { A: ['var(--moss-soft)', 'var(--moss-ink)'], B: ['var(--bg-3)', 'var(--ink-2)'], C: ['var(--warn-soft)', 'var(--warn)'] };
  const [bg, c] = map[g] || map.B;
  return <span className="chip" style={{ background: bg, color: c, borderColor: 'transparent' }}>Grade {g}</span>;
}

function ListingCard({ l, onOpen }) {
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }} onClick={onOpen}>
      <div className={'ph-img ' + l.photo} style={{ height: 180, borderRadius: 0, border: 'none', borderBottom: '1px solid var(--line)' }} />
      <div style={{ padding: 16 }}>
        <div className="row between" style={{ alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <div className="serif" style={{ fontSize: 17, lineHeight: 1.2 }}>{l.title}</div>
            <div className="tiny muted" style={{ marginTop: 4 }}>{l.material} · {l.qty}</div>
          </div>
          {gradePill(l.grade)}
        </div>
        <div className="row between" style={{ marginTop: 14, alignItems: 'baseline' }}>
          <div>
            <div className="serif" style={{ fontSize: 22, lineHeight: 1 }}>€{l.price}</div>
            <div className="tiny muted" style={{ marginTop: 2, textDecoration: 'line-through' }}>€{l.retailEquiv} retail</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="tiny" style={{ color: 'var(--moss-ink)' }}>−{Math.round((1 - l.price/l.retailEquiv) * 100)}%</div>
            <div className="tiny muted">{l.distanceKm} km · {l.city}</div>
          </div>
        </div>
        {l.hazard && (
          <div className="chip warn" style={{ marginTop: 10, fontSize: 10.5 }}>⚠ Pre-1990, testing recommended</div>
        )}
      </div>
    </div>
  );
}

function Browse() {
  const { go } = useRoute();
  const [q, setQ] = useState('');
  const [mat, setMat] = useState('all');
  const [grade, setGrade] = useState('all');
  const [maxKm, setMaxKm] = useState(50);
  const [sort, setSort] = useState('distance');

  const materials = ['all', ...new Set(MD.listings.map(l => l.material))];

  const filtered = useMemo(() => {
    let r = MD.listings;
    if (q) r = r.filter(l => (l.title + l.material + l.tags.join(' ')).toLowerCase().includes(q.toLowerCase()));
    if (mat !== 'all') r = r.filter(l => l.material === mat);
    if (grade !== 'all') r = r.filter(l => l.grade === grade);
    r = r.filter(l => l.distanceKm <= maxKm);
    if (sort === 'distance') r = [...r].sort((a, b) => a.distanceKm - b.distanceKm);
    if (sort === 'price') r = [...r].sort((a, b) => a.price - b.price);
    if (sort === 'co2') r = [...r].sort((a, b) => b.co2Saved - a.co2Saved);
    return r;
  }, [q, mat, grade, maxKm, sort]);

  return (
    <div>
      <div className="page-hero">
        <div>
          <div className="label">Marketplace</div>
          <h1>Reclaimed materials, listed locally.</h1>
          <div className="sub">Verified contractors and homeowners. Quality-graded, distance-aware.
          The carbon cost of pickup is shown upfront, we don't pretend trips are free.</div>
        </div>
        <button className="btn ghost" onClick={() => go('list')}>+ List a material</button>
      </div>

      {/* filters */}
      <div className="card" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr 1fr', gap: 12, alignItems: 'end', padding: 16 }}>
        <div className="field">
          <div className="field-label">Search</div>
          <input className="txt" placeholder="oak, copper, marble…" value={q} onChange={e => setQ(e.target.value)} />
        </div>
        <div className="field">
          <div className="field-label">Material</div>
          <select className="txt" value={mat} onChange={e => setMat(e.target.value)}>
            {materials.map(m => <option key={m} value={m}>{m === 'all' ? 'All materials' : m}</option>)}
          </select>
        </div>
        <div className="field">
          <div className="field-label">Grade</div>
          <select className="txt" value={grade} onChange={e => setGrade(e.target.value)}>
            <option value="all">All grades</option>
            <option value="A">A: Intact</option>
            <option value="B">B: Minor repairs</option>
            <option value="C">C: Raw value</option>
          </select>
        </div>
        <div className="field">
          <div className="field-label">Within {maxKm} km</div>
          <input type="range" min="5" max="100" value={maxKm} onChange={e => setMaxKm(+e.target.value)} style={{ width: '100%' }} />
        </div>
        <div className="field">
          <div className="field-label">Sort</div>
          <select className="txt" value={sort} onChange={e => setSort(e.target.value)}>
            <option value="distance">Nearest</option>
            <option value="price">Cheapest</option>
            <option value="co2">Highest CO₂ saving</option>
          </select>
        </div>
      </div>

      <div className="row between" style={{ margin: '24px 0 12px' }}>
        <div className="small muted">{filtered.length} of {MD.listings.length} listings</div>
        <div className="tiny muted">Avg. distance {Math.round(filtered.reduce((s, l) => s + l.distanceKm, 0) / Math.max(filtered.length, 1))} km · combined CO₂ saved {filtered.reduce((s, l) => s + l.co2Saved, 0)} kg</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {filtered.map(l => (
          <ListingCard key={l.id} l={l} onOpen={() => go('listing:' + l.id)} />
        ))}
        {filtered.length === 0 && (
          <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 48 }}>
            <div className="serif" style={{ fontSize: 22 }}>No matches.</div>
            <div className="muted small" style={{ marginTop: 8 }}>Widen your radius or clear filters.</div>
          </div>
        )}
      </div>
    </div>
  );
}

function ListingDetail({ id }) {
  const { go } = useRoute();
  const l = MD.listings.find(x => x.id === id) || MD.listings[0];
  const [msg, setMsg] = useState(`Hi ${l.seller}, I'm interested in the ${l.material.toLowerCase()}. Is it still available for pickup this weekend?`);
  const [sent, setSent] = useState(false);

  return (
    <div>
      <button className="btn ghost tiny" onClick={() => go('browse')} style={{ marginBottom: 16, padding: '6px 12px' }}>← Back to marketplace</button>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 28 }}>
        {/* left: photos + details */}
        <div>
          <div className={'ph-img ' + l.photo} style={{ height: 380, fontSize: 13 }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 8 }}>
            {[1,2,3,4].map(i => (
              <div key={i} className={'ph-img ' + l.photo} style={{ height: 78, fontSize: 10, opacity: 0.9 - i * 0.05 }} />
            ))}
          </div>

          <div style={{ marginTop: 32 }}>
            <div className="row" style={{ gap: 8, marginBottom: 12 }}>
              <span className="chip moss">{l.material}</span>
              {gradePill(l.grade)}
              <span className="chip">Yr {l.year}</span>
              {l.hazard && <span className="chip warn">⚠ Pre-1990 hazard test</span>}
            </div>
            <h1 className="serif" style={{ fontSize: 36, lineHeight: 1.05 }}>{l.title}</h1>
            <p style={{ marginTop: 14, color: 'var(--ink-2)', maxWidth: 620 }}>{l.desc}</p>

            <div style={{ marginTop: 28, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, paddingTop: 20, borderTop: '1px solid var(--line)' }}>
              {[
                ['Quantity', l.qty],
                ['Location', `${l.city} · ${l.distanceKm} km`],
                ['CO₂ saved if reused', `${l.co2Saved} kg`],
                ['Pickup carbon', `~${(l.distanceKm * 0.18).toFixed(1)} kg`],
              ].map(([k, v]) => (
                <div key={k}>
                  <div className="tiny muted">{k}</div>
                  <div style={{ fontSize: 14, marginTop: 4 }}>{v}</div>
                </div>
              ))}
            </div>

            {l.hazard && l.hazardNote && (
              <div className="card" style={{ marginTop: 20, background: 'var(--warn-soft)', borderColor: 'transparent', padding: 16 }}>
                <div style={{ fontWeight: 500, color: 'var(--warn)' }}>Safety advisory</div>
                <div className="small" style={{ marginTop: 4 }}>{l.hazardNote}</div>
              </div>
            )}

            <div style={{ marginTop: 24 }}>
              <div className="label">Pickup</div>
              <div className="small" style={{ marginTop: 6 }}>{l.pickup}</div>
            </div>
          </div>
        </div>

        {/* right: price + seller + contact */}
        <div style={{ position: 'sticky', top: 88, alignSelf: 'flex-start' }}>
          <div className="card">
            <div className="row between">
              <div>
                <div className="serif" style={{ fontSize: 36, lineHeight: 1 }}>€{l.price}</div>
                <div className="tiny muted" style={{ marginTop: 4 }}>retail equiv. €{l.retailEquiv}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="serif" style={{ fontSize: 22, color: 'var(--moss)' }}>−{Math.round((1 - l.price/l.retailEquiv) * 100)}%</div>
                <div className="tiny muted">vs. new</div>
              </div>
            </div>
            <div className="hr-dot" style={{ margin: '18px 0' }}></div>
            <div className="row between">
              <div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{l.seller}</div>
                <div className="tiny muted">★ {l.sellerRating} · {l.sellerJobs} completed pickups</div>
              </div>
              <span className="chip moss" style={{ fontSize: 10.5 }}>Verified</span>
            </div>
            <div className="hr-dot" style={{ margin: '18px 0' }}></div>
            <div className="field">
              <div className="field-label">Message {l.seller.split(' ')[0]}</div>
              <textarea className="txt" rows="4" value={msg} onChange={e => setMsg(e.target.value)} />
            </div>
            <button className="btn moss" style={{ width: '100%', marginTop: 12 }} onClick={() => setSent(true)} disabled={sent}>
              {sent ? '✓ Message sent' : 'Send message'}
            </button>
            <button className="btn ghost" style={{ width: '100%', marginTop: 8 }}>Reserve · €25 hold</button>
            <div className="tiny muted" style={{ textAlign: 'center', marginTop: 12 }}>
              Escrow protected · 8% platform fee on completion
            </div>
          </div>

          <div className="card" style={{ marginTop: 12, background: 'var(--bg-2)' }}>
            <div className="label">Why this matters</div>
            <div className="small" style={{ marginTop: 8 }}>
              By choosing this listing instead of new, you avoid <b>{l.co2Saved} kg CO₂</b> and contribute to
              the {Math.round(l.co2Saved / 4)} m² of forest equivalent saved this month across OuroNova.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ListMaterial() {
  const { go } = useRoute();
  const [stage, setStage] = useState('photo'); // photo | analyzing | review
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState({
    title: '', material: '', grade: 'A', price: '', qty: '', desc: '',
  });

  const aiSteps = [
    'Recognizing material type',
    'Estimating quantity from reference scale',
    'Suggesting grade & condition',
    'Pulling pricing from comparable listings',
    'Drafting description',
  ];

  useEffect(() => {
    if (stage !== 'analyzing') return;
    if (step >= aiSteps.length) {
      const t = setTimeout(() => {
        setDraft({
          title: 'Reclaimed pine flooring planks, ~22 m²',
          material: 'Reclaimed Pine',
          grade: 'B',
          price: '340',
          qty: '~22 m²',
          desc: 'Original 1970s pine planks lifted from a Lyon apartment. Some nail holes and minor scuffs; planks straight, no rot. Sold as full lot, ready for sanding and refinish.',
        });
        setStage('review');
      }, 400);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStep(step + 1), 600);
    return () => clearTimeout(t);
  }, [stage, step]);

  return (
    <div>
      <div className="page-hero">
        <div>
          <div className="label">Contractor flow</div>
          <h1>Turn demolition cost into revenue.</h1>
          <div className="sub">Photograph the pile. AI drafts the listing. You confirm and publish.
          Average residential renovation: <b>€200–800</b> recovered instead of <b>€200–450</b> in disposal fees.</div>
        </div>
      </div>

      {stage === 'photo' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 28 }}>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="ph-img pine" style={{ height: 320, borderRadius: 0, border: 'none' }} />
            <div style={{ padding: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="small muted">Use the sample photo to see the AI listing flow.</div>
              <button className="btn" onClick={() => { setStage('analyzing'); setStep(0); }}>Use sample →</button>
            </div>
          </div>
          <div>
            <div className="label">Tips for best AI results</div>
            <ul style={{ paddingLeft: 18, marginTop: 12, lineHeight: 1.8, color: 'var(--ink-2)', fontSize: 13.5 }}>
              <li>Include a known-size object (broom, ruler) for scale.</li>
              <li>Daylight, no flash, neutral background if possible.</li>
              <li>One material per listing, separate piles get separate listings.</li>
              <li>Capture any defects close-up, buyers prefer transparency.</li>
            </ul>
            <div className="card" style={{ marginTop: 20, background: 'var(--moss-soft)', borderColor: 'transparent' }}>
              <div className="label" style={{ color: 'var(--moss-ink)' }}>Earnings forecast</div>
              <div className="serif" style={{ fontSize: 28, marginTop: 4 }}>€280 – €410</div>
              <div className="tiny" style={{ color: 'var(--moss-ink)', marginTop: 2 }}>Based on 14 similar pine listings within 50 km</div>
            </div>
          </div>
        </div>
      )}

      {stage === 'analyzing' && (
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <div className="ph-img pine" style={{ width: 200, height: 200, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div className="label">AI listing</div>
            <div className="serif" style={{ fontSize: 26, marginTop: 6 }}>
              Drafting your listing <span className="dot-loader"><span/><span/><span/></span>
            </div>
            <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {aiSteps.map((s, i) => (
                <div key={s} className="row" style={{ opacity: i < step ? 1 : i === step ? 0.6 : 0.25, fontSize: 13.5 }}>
                  <span style={{ width: 14, color: 'var(--moss)' }}>{i < step ? '✓' : i === step ? '◐' : '○'}</span>
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {stage === 'review' && (
        <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div>
            <div className="label">AI draft: review & edit</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 12 }}>
              <div className="field">
                <div className="field-label">Title</div>
                <input className="txt" value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="field">
                  <div className="field-label">Material</div>
                  <input className="txt" value={draft.material} onChange={e => setDraft({ ...draft, material: e.target.value })} />
                </div>
                <div className="field">
                  <div className="field-label">Grade</div>
                  <select className="txt" value={draft.grade} onChange={e => setDraft({ ...draft, grade: e.target.value })}>
                    <option>A</option><option>B</option><option>C</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="field">
                  <div className="field-label">Price (€)</div>
                  <input className="txt" value={draft.price} onChange={e => setDraft({ ...draft, price: e.target.value })} />
                </div>
                <div className="field">
                  <div className="field-label">Quantity</div>
                  <input className="txt" value={draft.qty} onChange={e => setDraft({ ...draft, qty: e.target.value })} />
                </div>
              </div>
              <div className="field">
                <div className="field-label">Description</div>
                <textarea className="txt" rows="5" value={draft.desc} onChange={e => setDraft({ ...draft, desc: e.target.value })} />
              </div>
              <div className="row" style={{ gap: 10, marginTop: 8 }}>
                <button className="btn moss" onClick={() => go('browse')}>Publish listing →</button>
                <button className="btn ghost" onClick={() => { setStage('photo'); setStep(0); }}>Start over</button>
              </div>
            </div>
          </div>

          <div>
            <div className="label">Live preview</div>
            <div style={{ marginTop: 12 }}>
              <ListingCard
                l={{
                  id: 'preview',
                  title: draft.title,
                  material: draft.material,
                  qty: draft.qty,
                  grade: draft.grade,
                  price: +draft.price || 0,
                  retailEquiv: Math.round((+draft.price || 0) * 2.6),
                  city: 'Lyon 7e',
                  distanceKm: 12,
                  hazard: false,
                  photo: 'pine',
                }}
                onOpen={() => {}}
              />
            </div>
            <div className="card" style={{ marginTop: 16, background: 'var(--bg-2)' }}>
              <div className="label">Why list it?</div>
              <div className="small" style={{ marginTop: 8, color: 'var(--ink-2)' }}>
                Estimated <b>14 days to sale</b>, <b>€{draft.price || 0}</b> revenue, <b>1.1 t CO₂</b> avoided
                vs. landfill. Avoids <b>€140 disposal cost</b>.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { Browse, ListingDetail, ListMaterial });
