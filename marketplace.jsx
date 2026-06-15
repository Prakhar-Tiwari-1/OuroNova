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
            <div className="tiny" style={{ color: 'var(--moss-ink)' }}>−{Math.round((1 - l.price / l.retailEquiv) * 100)}%</div>
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
            The carbon cost of pickup is shown upfront — we don't pretend trips are free.</div>
        </div>
        <button className="btn ghost" onClick={() => go('list')}>+ List a material</button>
      </div>

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
        <div>
          <div className={'ph-img ' + l.photo} style={{ height: 380, fontSize: 13 }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 8 }}>
            {[1, 2, 3, 4].map(i => (
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

            {/* Embedded Material Card */}
            <div style={{ marginTop: 32 }}>
              <div className="label" style={{ color: 'var(--moss)', marginBottom: 14 }}>OuroNova Material Card</div>
              <div style={{ background: 'var(--moss-deep)', color: 'white', borderRadius: 12, padding: '24px 28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 18, marginBottom: 18, borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
                  <div style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.1)', borderRadius: 8, display: 'grid', placeItems: 'center', fontSize: 18, flexShrink: 0 }}>🗂️</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>Material Card</div>
                    <div style={{ fontSize: 11, color: '#a8c4b3', marginTop: 2 }}>SightCheck verified · Contractor confirmed</div>
                  </div>
                  <span className="chip" style={{ marginLeft: 'auto', background: 'rgba(168,196,179,0.2)', color: '#a8c4b3', borderColor: 'transparent', fontSize: 10 }}>✓ Verified</span>
                </div>
                {[
                  ['Item', l.title],
                  ['Condition', `Grade ${l.grade}`],
                  ['Estimated value', `€${l.price}–€${Math.round(l.price * 1.3)}`],
                  ['Recommended pathway', l.grade === 'A' ? 'Reuse in project' : l.grade === 'B' ? 'Reuse or local resale' : 'Local resale or recovery'],
                  ['Status', 'Contractor confirmed'],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'grid', gridTemplateColumns: '155px 1fr', padding: '10px 0', borderBottom: '1px dotted rgba(255,255,255,0.1)', alignItems: 'center', gap: 12 }}>
                    <div style={{ fontSize: 11.5, color: '#a8c4b3', fontWeight: 500 }}>{k}</div>
                    <div style={{ fontSize: 13.5 }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ position: 'sticky', top: 88, alignSelf: 'flex-start' }}>
          <div className="card">
            <div className="row between">
              <div>
                <div className="serif" style={{ fontSize: 36, lineHeight: 1 }}>€{l.price}</div>
                <div className="tiny muted" style={{ marginTop: 4 }}>retail equiv. €{l.retailEquiv}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="serif" style={{ fontSize: 22, color: 'var(--moss)' }}>−{Math.round((1 - l.price / l.retailEquiv) * 100)}%</div>
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

/* ─────────────────────────────────────────────
   LIST A MATERIAL — full 5-stage contractor flow
   photo → analyzing → questions → card → published
───────────────────────────────────────────── */
function ListMaterial() {
  const { go } = useRoute();
  const [stage, setStage] = useState('photo');
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    decade: '2000s',
    waterDamage: 'None',
    postcode: '75011',
    materialConfirm: 'Solid oak',
  });
  const [draft, setDraft] = useState({
    title: '', material: '', grade: 'B', price: '', qty: '', desc: '',
  });

  const aiSteps = [
    'Recognizing material type and surface finish',
    'Estimating quantity from reference scale',
    'Grading condition — A, B, or C',
    'Checking local resale benchmarks (Île-de-France)',
    'Preparing targeted follow-up questions',
  ];

  useEffect(() => {
    if (stage !== 'analyzing') return;
    if (step >= aiSteps.length) {
      const t = setTimeout(() => setStage('questions'), 450);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStep(s => s + 1), 680);
    return () => clearTimeout(t);
  }, [stage, step]);

  const handleAnswers = () => {
    const grade = answers.waterDamage === 'None' ? 'B' : 'C';
    const basePrice = answers.waterDamage === 'None' ? 340 : 220;
    setDraft({
      title: `${answers.materialConfirm} kitchen cabinets, 4.2m run`,
      material: answers.materialConfirm === 'Solid oak' ? 'Reclaimed Oak' : answers.materialConfirm,
      grade,
      price: String(basePrice),
      qty: '12 units',
      desc: `${answers.materialConfirm} cabinet fronts removed from a Haussmann apartment kitchen renovation. Doors intact, hinges included. Installation decade: ${answers.decade}. Water damage: ${answers.waterDamage.toLowerCase()}. Postcode: ${answers.postcode}. Ready for reuse or refinish.`,
    });
    setStage('card');
  };

  const handlePublish = () => setStage('published');

  const reset = () => {
    setStage('photo');
    setStep(0);
    setDraft({ title: '', material: '', grade: 'B', price: '', qty: '', desc: '' });
    setAnswers({ decade: '2000s', waterDamage: 'None', postcode: '75011', materialConfirm: 'Solid oak' });
  };

  const gradeLabel = { A: 'Intact', B: 'Minor repairs', C: 'Raw value' };
  const pathwayLabel = draft.grade === 'A' ? 'Reuse in project (preferred)' : draft.grade === 'B' ? 'Reuse or local resale' : 'Local resale or recovery';
  const valueMin = draft.price ? Math.round(+draft.price * 0.9) : 120;
  const valueMax = draft.price ? Math.round(+draft.price * 1.3) : 180;

  const FLOW_STEPS = ['Photo', 'AI analysis', 'Questions', 'Material Card', 'Live'];
  const stageIdx = { photo: 0, analyzing: 1, questions: 2, card: 3, published: 4 };
  const curIdx = stageIdx[stage] ?? 0;

  return (
    <div>
      <div className="page-hero">
        <div>
          <div className="label">Contractor flow · SightCheck</div>
          <h1>From site photo to live listing in 60 seconds.</h1>
          <div className="sub">Photograph the demolition. AI assesses condition and pricing. Answer three targeted questions. Your Material Card is live — zero paperwork, zero PEMD diagnostic.</div>
        </div>
      </div>

      {/* ─── FLOW PROGRESS ─── */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 36, padding: '16px 24px', background: 'var(--bg-2)', borderRadius: 10, border: '1px solid var(--line)' }}>
        {FLOW_STEPS.map((label, i) => (
          <React.Fragment key={label}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: i < curIdx ? 'var(--moss)' : i === curIdx ? 'var(--moss-deep)' : 'var(--bg-3)',
                color: i <= curIdx ? 'white' : 'var(--ink-3)',
                display: 'grid', placeItems: 'center',
                fontSize: 12, fontWeight: 700,
                border: i === curIdx ? '2px solid var(--moss-deep)' : '2px solid transparent',
                transition: 'all 0.35s ease',
              }}>{i < curIdx ? '✓' : i + 1}</div>
              <div style={{
                fontSize: 11, whiteSpace: 'nowrap',
                fontWeight: i === curIdx ? 700 : 400,
                color: i <= curIdx ? 'var(--moss-deep)' : 'var(--ink-3)',
                transition: 'color 0.35s',
              }}>{label}</div>
            </div>
            {i < FLOW_STEPS.length - 1 && (
              <div style={{
                flex: 1, height: 2, margin: '0 10px', marginBottom: 18,
                background: i < curIdx ? 'var(--moss)' : 'var(--line)',
                transition: 'background 0.35s ease',
              }} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* ─── STAGE 1: PHOTO ─── */}
      {stage === 'photo' && (
        <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 28 }}>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ position: 'relative' }}>
              <img src="assets/image4.png" alt="Demolition kitchen" style={{ width: '100%', height: 320, objectFit: 'cover', display: 'block' }} />
              <div style={{ position: 'absolute', top: 12, left: 12 }}>
                <span className="chip" style={{ background: 'rgba(0,0,0,0.55)', color: 'white', borderColor: 'transparent', backdropFilter: 'blur(4px)', fontSize: 10.5 }}>
                  Sample · Haussmann kitchen · pre-demolition
                </span>
              </div>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '32px 20px 16px', background: 'linear-gradient(transparent, rgba(0,0,0,0.5))' }}>
                <div style={{ color: 'white', fontSize: 13, lineHeight: 1.5 }}>
                  Solid oak cabinets · marble worktop · stainless sink
                </div>
              </div>
            </div>
            <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 500 }}>3 salvageable material types detected</div>
                <div className="tiny muted" style={{ marginTop: 2 }}>Estimated combined value: €410–€680</div>
              </div>
              <button className="btn" onClick={() => { setStage('analyzing'); setStep(0); }}>Run SightCheck →</button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <div className="label" style={{ marginBottom: 14 }}>What SightCheck reads from one photo</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  ['Material type and surface finish', 'Oak, pine, marble, copper, ceramic, steel'],
                  ['Condition grade A / B / C', 'Visible wear, structural integrity, deformation'],
                  ['Visible defects and hazard flags', 'Pre-1990 materials auto-flagged for asbestos / lead'],
                  ['Local market pricing', 'Benchmarked against comparable listings within 25 km'],
                ].map(([t, b]) => (
                  <div key={t} style={{ paddingLeft: 16, borderLeft: '2px solid var(--moss-soft)' }}>
                    <div style={{ fontSize: 13.5, fontWeight: 500 }}>{t}</div>
                    <div className="tiny muted" style={{ marginTop: 2, lineHeight: 1.5 }}>{b}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding: 20, background: 'var(--moss-mist)', borderRadius: 10, border: '1px solid var(--moss-soft)' }}>
              <div className="label" style={{ color: 'var(--moss)', marginBottom: 8 }}>Earnings forecast · this job</div>
              <div className="serif" style={{ fontSize: 34, fontWeight: 400, color: 'var(--moss-deep)', letterSpacing: '-0.02em' }}>€280–€410</div>
              <div style={{ fontSize: 12, color: 'var(--moss-ink)', marginTop: 6, lineHeight: 1.5 }}>vs. €140–200 disposal cost you currently absorb</div>
            </div>
          </div>
        </div>
      )}

      {/* ─── STAGE 2: ANALYZING ─── */}
      {stage === 'analyzing' && (
        <div className="fade-in card" style={{ display: 'flex', alignItems: 'center', gap: 36, padding: 36 }}>
          <div style={{ width: 220, height: 220, flexShrink: 0, borderRadius: 10, overflow: 'hidden' }}>
            <img src="assets/image4.png" alt="Analyzing" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div className="label">SightCheck · Vision Assessment</div>
            <div className="serif" style={{ fontSize: 30, marginTop: 8, fontWeight: 400, lineHeight: 1.15 }}>
              Reading the site <span className="dot-loader"><span /><span /><span /></span>
            </div>
            <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 11 }}>
              {aiSteps.map((s, i) => (
                <div key={s} className="row" style={{ opacity: i < step ? 1 : i === step ? 0.65 : 0.2, fontSize: 13.5, transition: 'opacity 0.3s', gap: 12 }}>
                  <span style={{ width: 20, color: 'var(--moss)', fontWeight: 700, flexShrink: 0, fontSize: 13 }}>
                    {i < step ? '✓' : i === step ? '◐' : '○'}
                  </span>
                  <span>{s}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 24, padding: '10px 16px', background: 'var(--moss-mist)', borderRadius: 6, fontSize: 12, color: 'var(--moss-ink)', lineHeight: 1.5 }}>
              No PEMD diagnostic required · €8 per assessment · 60 seconds end to end
            </div>
          </div>
        </div>
      )}

      {/* ─── STAGE 3: QUESTIONS ─── */}
      {stage === 'questions' && (
        <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1.05fr', gap: 36 }}>
          <div>
            {/* AI result summary */}
            <div style={{ padding: '16px 20px', background: 'var(--moss-mist)', borderRadius: 10, border: '1px solid var(--moss-soft)', marginBottom: 30 }}>
              <div className="label" style={{ color: 'var(--moss)', marginBottom: 10 }}>SightCheck complete</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span className="chip moss">Material: Solid oak</span>
                <span className="chip moss">Provisional grade: B</span>
                <span className="chip">~12 units detected</span>
                <span className="chip">No hazard flags</span>
              </div>
            </div>

            <div className="label" style={{ marginBottom: 6 }}>3 targeted questions</div>
            <div style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 24, lineHeight: 1.6 }}>
              Only what the camera cannot see. These finalise the grade and value range.
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="field">
                <div className="field-label">Approximate installation decade</div>
                <select className="txt" value={answers.decade} onChange={e => setAnswers({ ...answers, decade: e.target.value })}>
                  {['Before 1960', '1960s', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s'].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="field">
                <div className="field-label">Visible water damage or moisture marks?</div>
                <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                  {['None', 'Minor staining', 'Significant'].map(opt => (
                    <div key={opt} onClick={() => setAnswers({ ...answers, waterDamage: opt })} style={{
                      flex: 1, padding: '11px 10px', borderRadius: 8, cursor: 'pointer', textAlign: 'center',
                      border: answers.waterDamage === opt ? '2px solid var(--moss)' : '1px solid var(--line)',
                      background: answers.waterDamage === opt ? 'var(--moss-mist)' : 'var(--bg)',
                      fontSize: 13, fontWeight: answers.waterDamage === opt ? 600 : 400,
                      color: answers.waterDamage === opt ? 'var(--moss-deep)' : 'var(--ink-2)',
                      transition: 'all 0.15s',
                    }}>{opt}</div>
                  ))}
                </div>
              </div>

              <div className="field">
                <div className="field-label">Site postcode (for local pricing)</div>
                <input className="txt" value={answers.postcode} onChange={e => setAnswers({ ...answers, postcode: e.target.value })} placeholder="e.g. 75011" />
              </div>

              <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
                <button className="btn" onClick={handleAnswers}>Generate Material Card →</button>
                <button className="btn ghost" onClick={() => { setStage('photo'); setStep(0); }}>← Back</button>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="label" style={{ marginBottom: 4 }}>Why these three questions?</div>
            {[
              {
                q: 'Installation decade',
                why: 'Pre-1980 materials trigger a hazard test advisory. The decade also anchors depreciation in the pricing model and affects the recommended pathway.',
                impact: 'Affects: grade, hazard flag, pathway',
              },
              {
                q: 'Water damage',
                why: 'Moisture compromises structural wood integrity. Even minor staining changes Grade B to C, which shifts the pathway from reuse to resale and reduces the price range.',
                impact: 'Affects: final grade, value range',
              },
              {
                q: 'Site postcode',
                why: 'OuroNova benchmarks against comparable listings within a 25 km radius. A Paris 11e listing prices 22% higher than an outer-banlieue equivalent for the same material.',
                impact: 'Affects: local price benchmark',
              },
            ].map(({ q, why, impact }) => (
              <div key={q} style={{ padding: '16px 18px', background: 'var(--bg-2)', borderRadius: 10, border: '1px solid var(--line)' }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)', marginBottom: 8 }}>{q}</div>
                <div style={{ fontSize: 12.5, color: 'var(--ink-3)', lineHeight: 1.65 }}>{why}</div>
                <div style={{ fontSize: 11, color: 'var(--moss)', fontWeight: 600, marginTop: 10 }}>{impact}</div>
              </div>
            ))}
            <div style={{ padding: '14px 18px', background: 'var(--moss-mist)', borderRadius: 10, border: '1px solid var(--moss-soft)' }}>
              <div style={{ fontSize: 12.5, color: 'var(--moss-ink)', lineHeight: 1.65 }}>
                <b>No PEMD diagnostic required.</b> Traditional material assessments cost €500–€8,000 and only apply to buildings above 1,000 m². OuroNova delivers the same intelligence in 60 seconds, for €8.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── STAGE 4: MATERIAL CARD ─── */}
      {stage === 'card' && (
        <div className="fade-in">
          <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 30, padding: '14px 20px', background: 'var(--moss-mist)', borderRadius: 10, border: '1px solid var(--moss-soft)' }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--moss)', display: 'grid', placeItems: 'center', color: 'white', fontSize: 15, flexShrink: 0 }}>✓</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--moss-deep)' }}>Material Card generated</div>
              <div style={{ fontSize: 12.5, color: 'var(--ink-3)', marginTop: 3 }}>
                Review the client-facing report below. Confirm to add it to homeowner proposals and publish to the marketplace instantly.
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 36 }}>

            {/* ─ THE MATERIAL CARD (client-facing report) ─ */}
            <div>
              <div className="label" style={{ color: 'var(--moss)', marginBottom: 16 }}>Material Card · Client-facing report</div>
              <div style={{
                background: 'var(--moss-deep)', color: 'white',
                borderRadius: 14, padding: '32px 36px',
                boxShadow: '0 16px 56px rgba(31,58,46,0.28)',
              }}>
                {/* Card header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingBottom: 24, marginBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
                  <div style={{
                    width: 48, height: 48, background: 'rgba(255,255,255,0.1)',
                    borderRadius: 10, display: 'grid', placeItems: 'center', fontSize: 22, flexShrink: 0,
                  }}>🗂️</div>
                  <div>
                    <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.01em' }}>Material Card</div>
                    <div style={{ fontSize: 11, color: '#a8c4b3', marginTop: 4 }}>
                      OuroNova SightCheck · {new Date().toLocaleDateString('fr-FR')} · {answers.postcode}
                    </div>
                  </div>
                  <div style={{ marginLeft: 'auto', padding: '5px 12px', background: 'rgba(255,255,255,0.1)', borderRadius: 999, fontSize: 11, color: '#a8c4b3' }}>
                    Pending confirmation
                  </div>
                </div>

                {/* Card fields */}
                {[
                  ['Item', draft.title],
                  ['Condition', `Grade ${draft.grade} · ${gradeLabel[draft.grade] || ''}`],
                  ['Visible flags', answers.waterDamage === 'None' ? 'Minor surface wear only' : `Water damage: ${answers.waterDamage.toLowerCase()}`],
                  ['Installation', answers.decade],
                  ['Estimated value', `€${valueMin.toLocaleString()}–€${valueMax.toLocaleString()}`],
                  ['Recommended pathway', pathwayLabel],
                  ['Status', 'Awaiting contractor confirmation'],
                ].map(([k, v]) => (
                  <div key={k} style={{
                    display: 'grid', gridTemplateColumns: '158px 1fr',
                    padding: '13px 0', borderBottom: '1px dotted rgba(255,255,255,0.1)',
                    alignItems: 'center', gap: 12,
                  }}>
                    <div style={{ fontSize: 12, color: '#a8c4b3', fontWeight: 500 }}>{k}</div>
                    <div style={{ fontSize: 14, lineHeight: 1.4 }}>{v}</div>
                  </div>
                ))}

                {/* Action buttons */}
                <div style={{ marginTop: 28, display: 'flex', gap: 10 }}>
                  <button className="btn" style={{
                    flex: 1, background: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.25)',
                    color: 'white', fontWeight: 700, fontSize: 14,
                  }} onClick={handlePublish}>
                    ✓ Confirm & publish listing
                  </button>
                  <button className="btn" style={{
                    background: 'transparent', borderColor: 'rgba(255,255,255,0.15)',
                    color: '#a8c4b3', fontSize: 13,
                  }} onClick={() => setStage('questions')}>
                    ← Edit
                  </button>
                </div>
              </div>

              {/* Proposal pathways */}
              <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {[
                  ['🏠', 'Reuse in project', 'Keep inside the renovation plan'],
                  ['📍', 'Resell locally', 'Reuse channels within 25 km'],
                  ['♻️', 'Recover responsibly', 'Route to appropriate recovery'],
                ].map(([icon, title, body]) => (
                  <div key={title} style={{ padding: 14, border: '1px solid var(--line)', borderRadius: 8, background: 'var(--bg-2)', textAlign: 'center' }}>
                    <div style={{ fontSize: 20, marginBottom: 6 }}>{icon}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--moss-deep)', marginBottom: 4 }}>{title}</div>
                    <div style={{ fontSize: 11, color: 'var(--ink-3)', lineHeight: 1.45 }}>{body}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ─ HOMEOWNER PROPOSAL PREVIEW ─ */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <div className="label" style={{ marginBottom: 14 }}>Homeowner proposal preview</div>
                <div className="card">
                  <div style={{ fontSize: 12.5, color: 'var(--ink-3)', marginBottom: 18, padding: '10px 14px', background: 'var(--bg-2)', borderRadius: 6, lineHeight: 1.6 }}>
                    This Material Card appears in the homeowner's renovation proposal alongside the subsidies they qualify for — rendered in their own room photo.
                  </div>
                  <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', paddingBottom: 18, borderBottom: '1px solid var(--line)' }}>
                    <div className="ph-img oak" style={{ width: 90, height: 90, flexShrink: 0, borderRadius: 6 }} />
                    <div>
                      <div className="serif" style={{ fontSize: 17, lineHeight: 1.2, fontWeight: 400 }}>{draft.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 5 }}>6 km away · Grade {draft.grade} · {draft.qty}</div>
                      <div style={{ display: 'flex', gap: 8, marginTop: 10, alignItems: 'baseline' }}>
                        <span className="serif" style={{ fontSize: 22, fontWeight: 400 }}>€{draft.price}</span>
                        <span style={{ fontSize: 11.5, color: 'var(--ink-3)', textDecoration: 'line-through' }}>€{Math.round(+draft.price * 3.8)} retail</span>
                        <span className="chip moss" style={{ fontSize: 10 }}>−{Math.round((1 - +draft.price / (+draft.price * 3.8)) * 100)}%</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: 14, padding: '12px 14px', background: 'var(--moss-mist)', borderRadius: 6 }}>
                    <div style={{ fontSize: 12.5, color: 'var(--moss-ink)', lineHeight: 1.6 }}>
                      Choosing this saves the homeowner <b>€{Math.round(+draft.price * 2.8).toLocaleString()}</b> vs. new, avoids <b>142 kg CO₂</b>, and qualifies for <b>TVA réduite 5.5%</b>.
                    </div>
                  </div>
                </div>
              </div>

              <div className="card" style={{ background: 'var(--bg-2)' }}>
                <div className="label" style={{ marginBottom: 14 }}>What happens after confirmation</div>
                {[
                  ['Listing goes live instantly', 'Visible to homeowners within 25 km on the marketplace'],
                  ['Room Visualiser renders it', 'Homeowners see your material in their actual room photo'],
                  ['Reservation via platform', 'Escrow-protected · 8% platform fee on completion'],
                  ['You earn instead of paying disposal', `€${draft.price} revenue · €140–200 disposal cost avoided`],
                ].map(([a, b], i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, padding: '11px 0', borderTop: i > 0 ? '1px solid var(--line)' : 'none', alignItems: 'flex-start' }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: '50%', background: 'var(--moss)',
                      color: 'white', display: 'grid', placeItems: 'center',
                      fontSize: 11, fontWeight: 700, flexShrink: 0, marginTop: 1,
                    }}>{i + 1}</div>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 500 }}>{a}</div>
                      <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>{b}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── STAGE 5: PUBLISHED ─── */}
      {stage === 'published' && (
        <div className="fade-in">
          {/* Success banner */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 22, padding: '24px 30px',
            background: 'var(--moss-deep)', color: 'white', borderRadius: 14, marginBottom: 36,
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)', display: 'grid', placeItems: 'center', fontSize: 24, flexShrink: 0,
            }}>✓</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 19, fontWeight: 700 }}>Your listing is live on OuroNova</div>
              <div style={{ fontSize: 13, color: '#a8c4b3', marginTop: 5, lineHeight: 1.5 }}>
                Visible to homeowners within 25 km · Material Card included in renovation proposals · Estimated first inquiry: 3–7 days
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div className="serif" style={{ fontSize: 34, fontWeight: 400 }}>€{draft.price}</div>
              <div style={{ fontSize: 11, color: '#a8c4b3', marginTop: 2 }}>listing price</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 36 }}>

            {/* Confirmed Material Card */}
            <div>
              <div className="label" style={{ color: 'var(--moss)', marginBottom: 16 }}>Confirmed Material Card</div>
              <div style={{
                background: 'var(--moss-deep)', color: 'white',
                borderRadius: 14, padding: '32px 36px',
                boxShadow: '0 16px 56px rgba(31,58,46,0.28)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingBottom: 24, marginBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
                  <div style={{ width: 48, height: 48, background: 'rgba(255,255,255,0.1)', borderRadius: 10, display: 'grid', placeItems: 'center', fontSize: 22, flexShrink: 0 }}>🗂️</div>
                  <div>
                    <div style={{ fontSize: 17, fontWeight: 700 }}>Material Card</div>
                    <div style={{ fontSize: 11, color: '#a8c4b3', marginTop: 4 }}>OuroNova SightCheck · {new Date().toLocaleDateString('fr-FR')}</div>
                  </div>
                  <span className="chip" style={{ marginLeft: 'auto', background: 'rgba(168,196,179,0.22)', color: '#a8c4b3', borderColor: 'transparent', fontSize: 10.5 }}>✓ Published</span>
                </div>

                {[
                  ['Item', draft.title],
                  ['Condition', `Grade ${draft.grade} · ${gradeLabel[draft.grade] || ''}`],
                  ['Visible flags', answers.waterDamage === 'None' ? 'Minor surface wear only' : `Water damage: ${answers.waterDamage.toLowerCase()}`],
                  ['Estimated value', `€${valueMin.toLocaleString()}–€${valueMax.toLocaleString()}`],
                  ['Recommended pathway', pathwayLabel],
                  ['Status', 'Contractor confirmed'],
                ].map(([k, v]) => (
                  <div key={k} style={{
                    display: 'grid', gridTemplateColumns: '158px 1fr',
                    padding: '13px 0', borderBottom: '1px dotted rgba(255,255,255,0.1)',
                    alignItems: 'center', gap: 12,
                  }}>
                    <div style={{ fontSize: 12, color: '#a8c4b3', fontWeight: 500 }}>{k}</div>
                    <div style={{ fontSize: 14 }}>{v}</div>
                  </div>
                ))}

                <div style={{ marginTop: 24, padding: '14px 18px', background: 'rgba(255,255,255,0.06)', borderRadius: 8 }}>
                  <div style={{ fontSize: 12.5, color: '#a8c4b3', lineHeight: 1.65 }}>
                    This card is now included in renovation proposals sent to homeowners matching your location and material type. You'll be notified when someone expresses interest.
                  </div>
                </div>
              </div>
            </div>

            {/* Marketplace listing preview */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <div className="label" style={{ marginBottom: 14 }}>Now live on OuroNova marketplace</div>
                <ListingCard
                  l={{
                    id: 'preview',
                    title: draft.title,
                    material: draft.material,
                    qty: draft.qty,
                    grade: draft.grade,
                    price: +draft.price || 340,
                    retailEquiv: Math.round((+draft.price || 340) * 3.8),
                    city: `Paris ${answers.postcode}`,
                    distanceKm: 6,
                    hazard: false,
                    photo: 'oak',
                    co2Saved: 142,
                    sellerRating: 4.9,
                    sellerJobs: 1,
                    seller: 'You (new listing)',
                  }}
                  onOpen={() => {}}
                />
              </div>

              <div className="card">
                <div className="label" style={{ marginBottom: 14 }}>Impact of this listing</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', paddingTop: 10, borderTop: '1px solid var(--line)' }}>
                  {[
                    ['142 kg', 'CO₂ avoided if sold'],
                    [`€${draft.price || 340}`, 'revenue for you'],
                    ['€140+', 'disposal cost avoided'],
                  ].map(([n, l], i) => (
                    <div key={l} style={{
                      paddingTop: 10, paddingRight: i < 2 ? 16 : 0, paddingLeft: i > 0 ? 16 : 0,
                      borderRight: i < 2 ? '1px solid var(--line)' : 'none',
                    }}>
                      <div className="serif" style={{ fontSize: 22, fontWeight: 400, color: 'var(--moss-deep)', letterSpacing: '-0.01em' }}>{n}</div>
                      <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 4 }}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn moss" onClick={() => go('browse')}>View in marketplace →</button>
                <button className="btn ghost" onClick={reset}>List another material</button>
              </div>
            </div>
          </div>

          {/* Bottom tagline */}
          <div style={{ marginTop: 36, padding: '18px 24px', background: 'var(--moss-mist)', borderRadius: 10, display: 'flex', gap: 16, alignItems: 'center', border: '1px solid var(--moss-soft)' }}>
            <img src="assets/image1.png" alt="OuroNova" style={{ height: 26, opacity: 0.75, flexShrink: 0 }} />
            <div style={{ fontSize: 14, color: 'var(--moss-ink)', fontStyle: 'italic', lineHeight: 1.5 }}>
              "OuroNova turns potential waste into visible, priced, and proposal-ready circular options."
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { Browse, ListingDetail, ListMaterial });
