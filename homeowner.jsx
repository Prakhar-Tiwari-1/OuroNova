// Homeowner: Photo analysis + Cost estimate + Subsidies
const D = window.OURO_DATA;

function PhotoAnalyze() {
  const { go } = useRoute();
  const [stage, setStage] = useState('upload'); // upload | analyzing | done
  const [step, setStep] = useState(0);

  const steps = [
    'Reading EXIF + dimensions',
    'Detecting room type and surfaces',
    'Identifying materials and condition',
    'Estimating salvage value',
    'Matching subsidies',
  ];

  useEffect(() => {
    if (stage !== 'analyzing') return;
    if (step >= steps.length) {
      const t = setTimeout(() => setStage('done'), 400);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStep(step + 1), 700);
    return () => clearTimeout(t);
  }, [stage, step]);

  const startAnalyze = () => { setStage('analyzing'); setStep(0); };

  return (
    <div>
      <div className="page-hero">
        <div>
          <div className="label">Step 1 of 3 — Homeowner</div>
          <h1>Photograph the room you want to renovate.</h1>
          <div className="sub">Our AI reads the space, identifies salvageable materials, and prepares
          tiered cost estimates with sustainable alternatives. No upload required for the demo —
          we'll use a sample kitchen.</div>
        </div>
      </div>

      {stage === 'upload' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 28 }}>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="ph-img kitchen" style={{
              height: 380, borderRadius: 0, border: 'none', borderBottom: '1px solid var(--line)',
            }} />
            <div style={{ padding: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>kitchen-rue-de-charonne.jpg</div>
                <div className="tiny muted">3024 × 4032 · 2.4 MB · taken Apr 18, 2026</div>
              </div>
              <button className="btn" onClick={startAnalyze}>Run analysis →</button>
            </div>
          </div>

          <div>
            <div className="label">What we'll detect</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '12px 0 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                ['Room type & dimensions', 'Bath, kitchen, living — estimated m²'],
                ['Surface materials', 'Tile, wood, laminate, paint condition'],
                ['Salvageable items', 'What\'s worth listing on the marketplace'],
                ['Subsidy fit', 'Match scope to MaPrimeRénov\' eligibility'],
              ].map(([t, b]) => (
                <li key={t} style={{ paddingLeft: 14, position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, top: 8, width: 6, height: 6, borderRadius: '50%', background: 'var(--moss)' }} />
                  <div style={{ fontSize: 14 }}>{t}</div>
                  <div className="tiny muted">{b}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {stage === 'analyzing' && (
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 32, padding: 32 }}>
          <div className="ph-img kitchen" style={{ width: 200, height: 200, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div className="label">Analyzing</div>
            <div className="serif" style={{ fontSize: 28, marginTop: 6 }}>
              Reading your space <span className="dot-loader"><span/><span/><span/></span>
            </div>
            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {steps.map((s, i) => (
                <div key={s} className="row" style={{ opacity: i < step ? 1 : i === step ? 0.6 : 0.25, fontSize: 13.5 }}>
                  <span style={{ width: 14, color: 'var(--moss)' }}>{i < step ? '✓' : i === step ? '◐' : '○'}</span>
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {stage === 'done' && (
        <div className="fade-in">
          {/* Top hero strip with DPE rating */}
          <div className="card" style={{ display: 'grid', gridTemplateColumns: '280px 1fr auto', gap: 24, alignItems: 'center', padding: 20, marginBottom: 24 }}>
            <div className="ph-img kitchen" style={{ height: 160, borderRadius: 6 }} />
            <div>
              <div className="row" style={{ gap: 8, marginBottom: 8 }}>
                <span className="chip moss">{D.photoAnalysis.room}</span>
                <span className="chip">~{D.photoAnalysis.sqm} m²</span>
                <span className="chip">Built {D.photoAnalysis.yearBuilt}</span>
              </div>
              <div className="serif" style={{ fontSize: 26, lineHeight: 1.15, fontWeight: 500 }}>
                Your kitchen scored <span style={{ color: '#c0392b' }}>{D.photoAnalysis.dpe}</span>.
              </div>
              <div className="small muted" style={{ marginTop: 6 }}>
                With the right works, it can reach class <b style={{ color: 'var(--moss)' }}>{D.photoAnalysis.dpePotential}</b> — and unlock <b style={{ color: 'var(--moss)' }}>€{D.photoAnalysis.policyMatch.stackedTotal.toLocaleString()}</b> in stackable French aid.
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
              <div className="tiny muted">Confidence</div>
              <div className="serif" style={{ fontSize: 28, fontWeight: 500 }}>{Math.round(D.photoAnalysis.confidence * 100)}%</div>
            </div>
          </div>

          {/* Three columns: detected · upgrades · policies */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1.2fr', gap: 20 }}>

            {/* Detected items */}
            <div className="card">
              <div className="label" style={{ color: 'var(--moss)' }}>① What we see</div>
              <div className="serif" style={{ fontSize: 19, marginTop: 6, marginBottom: 12, fontWeight: 500 }}>Detected items</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {D.photoAnalysis.detected.map((d, i) => (
                  <div key={i} className="row between" style={{ padding: '10px 0', borderTop: '1px solid var(--line)', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13 }}>{d.item}</div>
                      <div className="tiny muted" style={{ marginTop: 2 }}>{d.condition} · {d.age}</div>
                    </div>
                    {d.salvage ? <span className="chip moss" style={{ fontSize: 10 }}>Salvage</span> : <span className="chip" style={{ fontSize: 10 }}>Replace</span>}
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 14, padding: 12, background: 'var(--moss-mist)', borderRadius: 6 }}>
                <div className="tiny" style={{ color: 'var(--moss-deep)' }}>{D.photoAnalysis.materialEstimate}</div>
              </div>
            </div>

            {/* Upgrade plan */}
            <div className="card">
              <div className="label" style={{ color: 'var(--moss)' }}>② What to upgrade</div>
              <div className="serif" style={{ fontSize: 19, marginTop: 6, marginBottom: 12, fontWeight: 500 }}>Recommended works + circular materials</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {D.photoAnalysis.upgrades.map((u, i) => (
                  <div key={i} style={{ padding: 12, border: '1px solid var(--line)', borderRadius: 6, borderLeft: u.priority === 'high' ? '3px solid var(--moss)' : '1px solid var(--line)' }}>
                    <div className="row between">
                      <div style={{ fontSize: 13, fontWeight: 500, flex: 1 }}>{u.what}</div>
                      <span className="mono tiny" style={{ color: 'var(--moss-deep)' }}>€{u.cost.toLocaleString()}</span>
                    </div>
                    <div className="tiny muted" style={{ marginTop: 4, lineHeight: 1.5 }}>{u.why}</div>
                    <div className="tiny" style={{ marginTop: 6, color: 'var(--moss)' }}>−{u.co2}t CO₂</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 14, padding: 12, background: 'var(--bg-2)', borderRadius: 6 }}>
                <div className="tiny muted" style={{ marginBottom: 6 }}>Circular matches near you ({D.photoAnalysis.circularMatches.length})</div>
                {D.photoAnalysis.circularMatches.map((c, i) => (
                  <div key={i} className="row between" style={{ padding: '4px 0', fontSize: 12 }}>
                    <span>{c.material}</span>
                    <span className="mono" style={{ color: 'var(--moss)' }}>€{c.price} · {c.distance}km</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Policy match */}
            <div className="card" style={{ background: 'var(--moss-deep)', color: 'var(--bg)', borderColor: 'var(--moss-deep)' }}>
              <div className="label" style={{ color: '#a8c4b3' }}>③ What the State pays</div>
              <div className="serif" style={{ fontSize: 19, marginTop: 6, marginBottom: 4, fontWeight: 500 }}>French policy match</div>
              <div className="tiny" style={{ color: '#a8c4b3', marginBottom: 14 }}>Stackable schemes — pre-filled from your photo + profile.</div>

              <div style={{ padding: '14px 0', borderTop: '1px solid var(--moss-2)', borderBottom: '1px solid var(--moss-2)' }}>
                <div className="tiny" style={{ color: '#a8c4b3' }}>Total works</div>
                <div className="serif" style={{ fontSize: 22, fontWeight: 500 }}>€{D.photoAnalysis.policyMatch.worksTotal.toLocaleString()}</div>
                <div className="row between" style={{ marginTop: 10 }}>
                  <span className="tiny" style={{ color: '#a8c4b3' }}>Aid stack</span>
                  <span className="serif" style={{ fontSize: 18, color: '#a8c4b3' }}>−€{D.photoAnalysis.policyMatch.stackedTotal.toLocaleString()}</span>
                </div>
                <div className="row between" style={{ marginTop: 6, paddingTop: 6, borderTop: '1px dashed var(--moss-2)' }}>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>Out-of-pocket</span>
                  <span className="serif" style={{ fontSize: 22, fontWeight: 500 }}>€{D.photoAnalysis.policyMatch.outOfPocket.toLocaleString()}</span>
                </div>
              </div>

              <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {D.photoAnalysis.policyMatch.schemes.map((s, i) => (
                  <div key={i} className="row between" style={{ fontSize: 12 }}>
                    <span style={{ color: '#d8e4dd' }}>{s.label}</span>
                    <span className="mono">€{s.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="tiny" style={{ marginTop: 14, color: '#a8c4b3', fontStyle: 'italic' }}>
                68% of eligible French homeowners never claim these. You won't be one of them.
              </div>
            </div>
          </div>

          <div style={{ marginTop: 28, display: 'flex', gap: 10 }}>
            <button className="btn" onClick={() => go('estimate')}>See cost estimate →</button>
            <button className="btn secondary" onClick={() => go('subsidies')}>View all 6 subsidies →</button>
            <button className="btn ghost" onClick={() => { setStage('upload'); setStep(0); }}>Re-analyze</button>
          </div>
        </div>
      )}
    </div>
  );
}

function CostEstimate() {
  const { go } = useRoute();
  const [picked, setPicked] = useState('mid');
  const tier = D.costTiers.find(t => t.key === picked);
  const total = tier.breakdown.reduce((s, b) => s + b.cost, 0);

  return (
    <div>
      <div className="page-hero">
        <div>
          <div className="label">Step 2 of 3 — Homeowner</div>
          <h1>Three ways to renovate, fully costed.</h1>
          <div className="sub">Pick the tier that fits your budget. We'll show what's reclaimed,
          embodied carbon, and which subsidies apply.</div>
        </div>
        <div className="tiny muted">Sample: kitchen · 14 m² · Paris 11e</div>
      </div>

      {/* tier cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {D.costTiers.map(t => (
          <div
            key={t.key}
            onClick={() => setPicked(t.key)}
            className="card"
            style={{
              cursor: 'pointer',
              border: picked === t.key ? '1.5px solid var(--ink)' : '1px solid var(--line)',
              background: picked === t.key ? 'var(--bg)' : 'var(--bg-2)',
              transition: 'all 0.15s',
            }}
          >
            <div className="row between">
              <div className="label">{t.label}</div>
              {picked === t.key && <span className="chip moss">Selected</span>}
            </div>
            <div className="serif" style={{ fontSize: 32, marginTop: 8, lineHeight: 1 }}>
              €{t.range[0].toLocaleString()}<span style={{ color: 'var(--ink-3)' }}>–</span>{t.range[1].toLocaleString()}
            </div>
            <div className="small muted" style={{ marginTop: 10, minHeight: 40 }}>{t.desc}</div>
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--line)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <div className="tiny muted">Reclaimed</div>
                <div style={{ fontSize: 16, marginTop: 2 }}>{t.recycledPct}%</div>
              </div>
              <div>
                <div className="tiny muted">CO₂</div>
                <div style={{ fontSize: 16, marginTop: 2 }}>{t.co2}t</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24, marginTop: 32 }}>
        <div className="card">
          <div className="row between">
            <div className="serif" style={{ fontSize: 22 }}>{tier.label} breakdown</div>
            <div className="tiny muted">Estimated subtotal</div>
          </div>
          <div style={{ marginTop: 14 }}>
            {tier.breakdown.map((b, i) => (
              <div key={i} className="row between" style={{ padding: '12px 0', borderTop: i === 0 ? '1px solid var(--line)' : '1px solid var(--line-2)' }}>
                <div className="row" style={{ gap: 10 }}>
                  {b.recycled && <span className="chip moss" style={{ fontSize: 10 }}>RECLAIMED</span>}
                  <span style={{ fontSize: 13.5 }}>{b.item}</span>
                </div>
                <div className="mono">€{b.cost.toLocaleString()}</div>
              </div>
            ))}
            <div className="row between" style={{ padding: '14px 0 0', borderTop: '1px solid var(--ink)', marginTop: 4 }}>
              <div style={{ fontWeight: 500 }}>Subtotal</div>
              <div className="serif" style={{ fontSize: 22 }}>€{total.toLocaleString()}</div>
            </div>
            <div className="row between" style={{ padding: '6px 0', color: 'var(--moss)' }}>
              <div>Subsidies applied</div>
              <div className="mono">−€{tier.subsidies.toLocaleString()}</div>
            </div>
            <div className="row between" style={{ padding: '8px 0 0', borderTop: '1px solid var(--line-2)', marginTop: 8 }}>
              <div style={{ fontWeight: 500 }}>Net cost</div>
              <div className="serif" style={{ fontSize: 26 }}>€{(total - tier.subsidies).toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div className="card" style={{ background: 'var(--bg-2)' }}>
          <div className="label">Sustainability</div>
          <div className="serif" style={{ fontSize: 22, marginTop: 6 }}>Your impact, this scenario.</div>
          <div style={{ marginTop: 20 }}>
            <div className="tiny muted">Reclaimed materials</div>
            <div className="bar" style={{ marginTop: 6 }}>
              <span style={{ width: tier.recycledPct + '%' }} />
            </div>
            <div className="row between" style={{ marginTop: 4 }}>
              <span className="tiny muted">{tier.recycledPct}% by value</span>
              <span className="tiny muted">target 60%+</span>
            </div>
          </div>

          <div style={{ marginTop: 22, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <div className="tiny muted">Embodied CO₂</div>
              <div className="stat-num" style={{ fontSize: 28 }}>{tier.co2}<small>t</small></div>
            </div>
            <div>
              <div className="tiny muted">Subsidies</div>
              <div className="stat-num" style={{ fontSize: 28 }}>€{(tier.subsidies/1000).toFixed(1)}<small>k</small></div>
            </div>
          </div>

          <button className="btn moss" style={{ marginTop: 24, width: '100%' }} onClick={() => go('subsidies')}>
            Find your subsidies →
          </button>
        </div>
      </div>
    </div>
  );
}

function Subsidies() {
  const { go } = useRoute();
  const [income, setIncome] = useState('blue');
  const [year, setYear] = useState('1985');

  const totalMatched = D.subsidies.reduce((s, x) => s + Math.round(x.typical * x.match), 0);

  return (
    <div>
      <div className="page-hero">
        <div>
          <div className="label">Step 3 of 3 — Homeowner</div>
          <h1>Stop leaving money on the table.</h1>
          <div className="sub">68% of eligible French homeowners never claim subsidies they qualify for.
          We pre-fill the eligibility checks based on your photo analysis.</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 24 }}>
        {/* eligibility form */}
        <div className="card">
          <div className="label">Your situation</div>
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="field">
              <div className="field-label">Property type</div>
              <select className="txt" defaultValue="primary">
                <option value="primary">Primary residence</option>
                <option value="secondary">Secondary residence</option>
                <option value="rental">Rental property</option>
              </select>
            </div>
            <div className="field">
              <div className="field-label">Year built</div>
              <input className="txt" value={year} onChange={e => setYear(e.target.value)} />
            </div>
            <div className="field">
              <div className="field-label">Annual household income</div>
              <select className="txt" value={income} onChange={e => setIncome(e.target.value)}>
                <option value="blue">≤ €40,000 — Bleu</option>
                <option value="yellow">€40k – €60k — Jaune</option>
                <option value="purple">€60k – €80k — Violet</option>
                <option value="pink">≥ €80,000 — Rose</option>
              </select>
            </div>
            <div className="field">
              <div className="field-label">Household size</div>
              <input className="txt" defaultValue="3" />
            </div>
            <div className="field">
              <div className="field-label">Region</div>
              <select className="txt" defaultValue="idf">
                <option value="idf">Île-de-France</option>
                <option value="ara">Auvergne-Rhône-Alpes</option>
                <option value="paca">Provence-Alpes-Côte d'Azur</option>
                <option value="naq">Nouvelle-Aquitaine</option>
              </select>
            </div>
          </div>
          <div className="hr-dot" style={{ margin: '20px 0' }}></div>
          <div className="tiny muted">
            Pre-filled from your kitchen photo analysis. Edit any field — matches update live.
          </div>
        </div>

        {/* matched subsidies */}
        <div>
          <div className="row between" style={{ marginBottom: 14 }}>
            <div className="label">Matched · {D.subsidies.length} programs</div>
            <div className="serif" style={{ fontSize: 22 }}>
              Up to €{totalMatched.toLocaleString()}<span className="muted small" style={{ marginLeft: 6 }}>combined</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {D.subsidies.map(s => (
              <div key={s.id} className="card" style={{ padding: 18 }}>
                <div className="row between" style={{ alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div className="row" style={{ gap: 8 }}>
                      <span className="serif" style={{ fontSize: 19 }}>{s.name}</span>
                      <span className="chip moss">{Math.round(s.match * 100)}% fit</span>
                    </div>
                    <div className="row" style={{ gap: 16, marginTop: 8 }}>
                      <span className="tiny muted">Typical: <b style={{ color: 'var(--ink)' }}>€{s.typical.toLocaleString()}</b></span>
                      <span className="tiny muted">Max: €{s.max.toLocaleString()}</span>
                      <span className="tiny muted">{s.timeline}</span>
                    </div>
                    <div className="row" style={{ gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
                      {s.eligibility.map(e => <span key={e} className="chip" style={{ fontSize: 10.5 }}>{e}</span>)}
                    </div>
                  </div>
                  <div style={{ marginLeft: 16, textAlign: 'right' }}>
                    <div className="bar" style={{ width: 120 }}>
                      <span style={{ width: (s.match * 100) + '%' }} />
                    </div>
                    <button className="btn ghost tiny" style={{ marginTop: 10, padding: '6px 10px', fontSize: 12 }}>Apply →</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 24, display: 'flex', gap: 10 }}>
            <button className="btn moss" onClick={() => go('browse')}>See materials marketplace →</button>
            <button className="btn ghost" onClick={() => go('estimate')}>← Back to estimate</button>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { PhotoAnalyze, CostEstimate, Subsidies });
