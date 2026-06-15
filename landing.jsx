// Landing page - OuroNova v3 · EuroTeQaThon 2026
function Landing() {
  const { go } = useRoute();
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'var(--sans)' }}>

      {/* ─── NAV ─── */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 48px', borderBottom: '1px solid var(--line)',
        position: 'sticky', top: 0,
        background: 'rgba(252,250,245,0.96)', backdropFilter: 'blur(12px)', zIndex: 10,
      }}>
        <img src="assets/ouronova-logo.png" alt="OuroNova" className="brand-logo-full" />
        <nav style={{ display: 'flex', gap: 32, alignItems: 'center', fontSize: 13.5, fontWeight: 500, color: 'var(--ink-2)' }}>
          <a href="#story">Problem</a>
          <a href="#how">Solution</a>
          <a href="#tech">Technology</a>
          <a href="#business">Business</a>
          <a href="#impact">Impact</a>
          <a href="#team">Team</a>
          <button className="btn" onClick={() => go('analyze')}>Try the demo →</button>
        </nav>
      </header>

      {/* ─── HERO ─── */}
      <section style={{ padding: '88px 48px 72px', maxWidth: 1180, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
          <div className="label" style={{ color: 'var(--moss)' }}>OURONOVA · CIRCULAR RENOVATION, ENGINEERED</div>
          <span className="chip moss">EuroTeQaThon 2026 · École Polytechnique</span>
        </div>

        <h1 className="serif" style={{
          fontSize: 'clamp(52px, 8.4vw, 112px)',
          lineHeight: 1.0, maxWidth: 900,
          letterSpacing: '-0.02em', fontWeight: 400, color: 'var(--ink)',
        }}>
          Your next kitchen<br />already exists.
        </h1>

        <p style={{
          fontSize: 20, lineHeight: 1.65, color: 'var(--ink-2)',
          maxWidth: 640, marginTop: 32, fontWeight: 400,
        }}>
          It is in a contractor's skip somewhere in Île-de-France.
          OuroNova assesses it in 60 seconds, renders it in your space,
          covers it with the subsidies you already qualify for,
          and plants a tree when you choose it.
        </p>

        {/* Stats strip */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          marginTop: 48,
          borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)',
        }}>
          {[
            ['227 Mt', 'C&D waste produced in France every year'],
            ['60 sec', 'from one photo to a condition report and listing'],
            ['€1.7B', 'MaPrimeRénov\' disbursements went unclaimed in 2024'],
            ['1 tree', 'planted for every confirmed circular material choice'],
          ].map(([n, l], i) => (
            <div key={l} style={{
              padding: '22px 24px 22px 0',
              borderRight: i < 3 ? '1px solid var(--line)' : 'none',
              paddingLeft: i > 0 ? 24 : 0,
            }}>
              <div className="serif" style={{ fontSize: 28, fontWeight: 400, color: 'var(--moss-deep)', letterSpacing: '-0.015em' }}>{n}</div>
              <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 6, lineHeight: 1.45 }}>{l}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 36 }}>
          <button className="btn lg" onClick={() => go('analyze')}>See your room reclaimed →</button>
          <button className="btn lg secondary" onClick={() => go('browse')}>Browse the marketplace</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12, marginTop: 64, height: 300 }}>
          <div className="ph-img hero" />
          <div className="ph-img craft" />
          <div className="ph-img oak" />
        </div>
      </section>

      {/* ─── 01: THREE BROKEN LINKS ─── */}
      <section id="story" style={{ padding: '100px 48px', background: 'var(--moss-deep)', color: 'var(--bg)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 80, alignItems: 'start' }}>

            <div style={{ position: 'sticky', top: 120 }}>
              <div className="label" style={{ color: 'var(--moss-soft)', marginBottom: 20 }}>01: The problem</div>
              <div className="serif" style={{ fontSize: 'clamp(44px, 5vw, 64px)', lineHeight: 1.05, fontWeight: 400 }}>
                Three broken links<br />in one chain.
              </div>
              <p style={{ marginTop: 28, color: '#a8c4b3', fontSize: 15, lineHeight: 1.7, fontWeight: 400 }}>
                The materials exist. The subsidies exist. The tools to connect them do not.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 52 }}>
              {[
                {
                  who: 'CAMILLE · homeowner · Paris 11e',
                  body: 'She needed a new kitchen. Online, everything was new, virgin, expensive. Two kilometres away, Karim had just stripped oak cabinets from a Haussmann apartment. Grade A, structurally sound, worth €480. She could not see them rendered in her own kitchen. She could not find them. She did not know she qualified for €8,400 in subsidies that would have covered most of the cost. She bought new.',
                  pain: 'No visualisation of reclaimed materials → defaults to new. No subsidy guidance → overpays.',
                },
                {
                  who: 'KARIM · contractor · Lyon',
                  body: 'He photographed the demolition. Oak cabinets, copper pipes, a marble worktop. He knew they were worth more than the disposal fees. But a certified material assessment costs €1,500 to €5,000 and applies only to buildings over 1,000 m². His apartment renovation did not qualify. The salvageable materials defaulted to landfill.',
                  pain: 'No affordable assessment tool → 70% of reusable material landfilled at a cost to him.',
                },
                {
                  who: 'THE SYSTEM · France · 2024',
                  body: 'Over €1.7 billion in MaPrimeRénov\' disbursements went unclaimed. High administrative complexity. A 20% drop in certified contractors in Île-de-France. Eligible homeowners could not navigate a process spanning four ministries. The subsidies existed. Nobody could reach them.',
                  pain: 'Structural inaccessibility → circular renovation stays below 1% of its potential.',
                },
              ].map((s, i) => (
                <div key={i} style={{ borderLeft: '1px solid var(--moss-2)', paddingLeft: 28 }}>
                  <div style={{ fontFamily: 'var(--mono)', color: 'var(--moss-soft)', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 14 }}>{s.who}</div>
                  <p style={{ fontSize: 16, lineHeight: 1.7, color: '#d8e4dd', fontWeight: 400, margin: 0 }}>{s.body}</p>
                  <div style={{ fontSize: 12, color: 'var(--moss-soft)', marginTop: 14, fontWeight: 500 }}>{s.pain}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 96, paddingTop: 56, borderTop: '1px solid var(--moss-2)', textAlign: 'center' }}>
            <div className="serif" style={{ fontSize: 'clamp(32px, 4vw, 56px)', lineHeight: 1.15, maxWidth: 900, margin: '0 auto', fontWeight: 400, color: 'var(--bg)' }}>
              Camille's kitchen and Karim's oak were two kilometres apart.<br />
              The subsidies she was owed would have covered the gap.<br />
              <span style={{ color: '#a8c4b3' }}>OuroNova is the only platform that closes all three failures at once.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── NUMBERS BAND ─── */}
      <section style={{ padding: '80px 48px', background: 'var(--bg-2)', borderTop: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div className="label" style={{ color: 'var(--moss)' }}>The scale of the problem</div>
          <h2 className="serif" style={{ fontSize: 'clamp(36px, 4vw, 52px)', lineHeight: 1.08, marginTop: 16, maxWidth: 800, fontWeight: 400 }}>
            France's renovation economy is broken at every level.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, marginTop: 48 }}>
            {[
              ['227 Mt', 'C&D waste generated in France every year, 70% of all national waste (ADEME, 2021).'],
              ['Below 1%', 'of demolition value is reused at material grade. Almost everything becomes low-grade backfill.'],
              ['€1.7B', 'in MaPrimeRénov\' disbursements went unclaimed in 2024 due to administrative complexity (ANAH, 2025).'],
              ['25%', 'of France\'s national CO₂ emissions come from the building sector, alongside 44% of energy consumption.'],
              ['€500–€8,000 HT', 'cost of a PEMD material assessment. Applies only to buildings above 1,000 m². Smaller renovations have no affordable equivalent.'],
              ['700k', 'DPE-F/G homes must renovate to remain legally rentable by 2028 (Loi Climat et Résilience 2021).'],
            ].map(([n, l], i) => (
              <div key={i} style={{
                padding: '28px 32px 28px 0',
                borderTop: '1px solid var(--moss-2)',
                borderRight: i % 2 === 0 ? '1px solid var(--moss-2)' : 'none',
                paddingLeft: i % 2 === 1 ? 32 : 0,
              }}>
                <div className="serif" style={{ fontSize: 36, lineHeight: 1, color: 'var(--moss-deep)', fontWeight: 400, letterSpacing: '-0.015em' }}>{n}</div>
                <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 10, maxWidth: 440, lineHeight: 1.6 }}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20, fontSize: 11, color: 'var(--ink-3)' }}>
            Sources: ADEME 2021, ANAH 2025, EU Renovation Wave 2024, AGEC 2022, Loi Climat et Résilience 2021.
          </div>
        </div>
      </section>

      {/* ─── 02: HOW IT WORKS ─── */}
      <section id="how" style={{ padding: '100px 48px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div className="label" style={{ color: 'var(--moss)' }}>02: The solution</div>
          <h2 className="serif" style={{ fontSize: 'clamp(36px, 4.5vw, 60px)', lineHeight: 1.08, marginTop: 16, maxWidth: 800, fontWeight: 400 }}>
            One loop. Three steps.
          </h2>
          <p style={{ fontSize: 17, color: 'var(--ink-2)', maxWidth: 560, marginTop: 20, lineHeight: 1.65, fontWeight: 400 }}>
            From a contractor's site photo to a homeowner's confirmed circular choice — in 60 seconds.
          </p>

          {/* ─── 5-STEP CONTRACTOR WORKFLOW ─── */}
          <div style={{ marginTop: 52 }}>
            <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600, color: 'var(--ink-3)', marginBottom: 28 }}>The contractor workflow</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 21, left: '10%', right: '10%', height: 2, background: 'var(--moss-soft)', zIndex: 0 }} />
              {[
                { num: 1, title: 'Photo on-site', body: 'Contractor photographs cabinets, worktops, tiles, pipes and fixtures before demolition.' },
                { num: 2, title: 'AI assessment', body: 'SightCheck identifies material category, condition, visible defects and risk flags.' },
                { num: 3, title: 'Targeted questions', body: 'OuroNova asks only what the camera cannot answer: decade, moisture, postcode.' },
                { num: 4, title: 'Pricing draft', body: 'System estimates reuse or resale value using condition grade and local benchmarks.' },
                { num: 5, title: 'Contractor approval', body: 'Contractor confirms the Material Card. It enters the homeowner proposal and goes live.' },
              ].map(({ num, title, body }) => (
                <div key={num} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, paddingRight: num < 5 ? 16 : 0, position: 'relative', zIndex: 1 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: num === 5 ? 'var(--moss-deep)' : 'var(--moss)',
                    color: 'white', display: 'grid', placeItems: 'center',
                    fontSize: 15, fontWeight: 700,
                    boxShadow: '0 0 0 5px var(--bg)',
                  }}>{num}</div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', lineHeight: 1.3, marginBottom: 5 }}>{title}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--ink-3)', lineHeight: 1.55 }}>{body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ─── MATERIAL CARD PREVIEW ─── */}
          <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 24, alignItems: 'start' }}>
            <div style={{
              background: 'var(--moss-deep)', color: 'white',
              borderRadius: 14, padding: '26px 30px',
              boxShadow: '0 12px 48px rgba(31,58,46,0.22)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 18, marginBottom: 18, borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ width: 38, height: 38, background: 'rgba(255,255,255,0.1)', borderRadius: 8, display: 'grid', placeItems: 'center', fontSize: 18, flexShrink: 0 }}>🗂️</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>Material Card</div>
                  <div style={{ fontSize: 11, color: '#a8c4b3', marginTop: 3 }}>OuroNova SightCheck · Contractor confirmed</div>
                </div>
                <span className="chip" style={{ marginLeft: 'auto', background: 'rgba(168,196,179,0.2)', color: '#a8c4b3', borderColor: 'transparent', fontSize: 10 }}>✓ Published</span>
              </div>
              {[
                ['Item', 'Oak kitchen cabinet'],
                ['Condition', 'Grade B · Minor repairs'],
                ['Visible flags', 'Minor surface wear'],
                ['Estimated value', '€120–€180'],
                ['Recommended pathway', 'Reuse or local resale'],
                ['Status', 'Contractor confirmed'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'grid', gridTemplateColumns: '145px 1fr', padding: '10px 0', borderBottom: '1px dotted rgba(255,255,255,0.1)', alignItems: 'center', gap: 10 }}>
                  <div style={{ fontSize: 11.5, color: '#a8c4b3', fontWeight: 500 }}>{k}</div>
                  <div style={{ fontSize: 13 }}>{v}</div>
                </div>
              ))}
              <button className="btn" style={{ marginTop: 20, width: '100%', background: 'rgba(255,255,255,0.14)', borderColor: 'rgba(255,255,255,0.22)', color: 'white' }} onClick={() => go('list')}>Try the flow → </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="label" style={{ color: 'var(--moss)', marginBottom: 4 }}>Proposal output for homeowner</div>
              {[
                { icon: '🏠', title: 'Reuse in project', body: 'The Material Card enters the renovation proposal. The homeowner keeps suitable materials inside their plan, rendered in their room via the Room Visualiser.' },
                { icon: '📍', title: 'Resell locally', body: 'The listing goes live on the marketplace. Homeowners within 25 km can reserve via the platform. OuroNova takes 8% on completion.' },
                { icon: '♻️', title: 'Recover responsibly', body: 'Lower-grade materials are routed to appropriate recovery or disposal — not landfill by default.' },
              ].map(({ icon, title, body }) => (
                <div key={title} style={{ display: 'flex', gap: 14, padding: '14px 16px', background: 'var(--bg-2)', border: '1px solid var(--line)', borderRadius: 10, alignItems: 'flex-start' }}>
                  <div style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>{icon}</div>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--moss-deep)', marginBottom: 4 }}>{title}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--ink-3)', lineHeight: 1.6 }}>{body}</div>
                  </div>
                </div>
              ))}
              <div style={{ padding: '12px 16px', background: 'var(--moss-mist)', borderRadius: 8, border: '1px solid var(--moss-soft)', fontSize: 13, color: 'var(--moss-ink)', lineHeight: 1.6, fontStyle: 'italic' }}>
                "OuroNova turns potential waste into visible, priced, and proposal-ready circular options."
              </div>
            </div>
          </div>

          <div style={{ marginTop: 72, paddingTop: 40, borderTop: '1px solid var(--line)' }}>
            <div className="label" style={{ color: 'var(--moss)', marginBottom: 8 }}>For homeowners &amp; contractors</div>
            <div className="serif" style={{ fontSize: 'clamp(28px,3vw,40px)', fontWeight: 400, lineHeight: 1.1, marginBottom: 32 }}>Three products. One loop.</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {[
              {
                num: '01',
                product: 'SightCheck',
                role: 'Contractor',
                title: 'Photograph the demolition.',
                body: 'Karim takes one photo. Our vision model returns a Grade A/B/C condition report, hazard flag, and resale listing in 60 seconds. No PEMD diagnostic. No specialist required. Salvageable materials become verified circular inventory.',
                cta: ['Try SightCheck', 'list'],
                img: 'demo',
                note: 'Contractor · €8 per assessment',
              },
              {
                num: '02',
                product: 'Room Visualiser',
                role: 'Homeowner',
                title: 'See it in your own space.',
                body: 'Camille uploads her kitchen photo. She sees it rendered with Karim\'s oak cabinets — her actual room, not a generic template — alongside biophilic plants matched to her room\'s orientation and ventilation. She sees her subsidy stack. She confirms.',
                cta: ['Visualise your room', 'analyze'],
                img: 'kitchen',
                note: 'Homeowner · from €4 per session',
              },
              {
                num: '03',
                product: 'The Loop',
                role: 'Result',
                title: 'A choice that plants a tree.',
                body: 'The materials travel 6 km instead of to landfill. A GPS-trackable tree is planted via Reforest\'Action. The carbon cost of the entire journey is shown upfront. The circular loop closes — for the contractor, the homeowner, and the land.',
                cta: ['Browse the marketplace', 'browse'],
                img: 'craft',
                note: 'Both · 8% transaction fee on sale',
              },
            ].map((c) => (
              <div key={c.num} className="card" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
                <div className={'ph-img ' + c.img} style={{ height: 200, borderRadius: 0, border: 'none' }} />
                <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-3)', letterSpacing: '0.1em' }}>{c.num}</span>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <span className="chip moss" style={{ fontSize: 10.5 }}>{c.product}</span>
                      <span className="chip" style={{ fontSize: 10.5 }}>{c.role}</span>
                    </div>
                  </div>
                  <div className="serif" style={{ fontSize: 26, lineHeight: 1.15, fontWeight: 400, marginTop: 4 }}>{c.title}</div>
                  <div style={{ fontSize: 13.5, color: 'var(--ink-2)', flex: 1, lineHeight: 1.65 }}>{c.body}</div>
                  <button className="btn ghost" style={{ alignSelf: 'flex-start', marginTop: 10 }} onClick={() => go(c.cta[1])}>
                    {c.cta[0]} →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Tree planting callout */}
          <div style={{
            marginTop: 40, padding: '28px 32px',
            background: 'var(--moss-deep)', color: 'var(--bg)',
            borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 40,
          }}>
            <div>
              <div className="label" style={{ color: '#a8c4b3', marginBottom: 10 }}>Reforest'Action partnership</div>
              <div className="serif" style={{ fontSize: 26, fontWeight: 400, lineHeight: 1.2 }}>
                Every confirmed circular choice plants a GPS-trackable tree.
              </div>
            </div>
            <div style={{ flexShrink: 0, textAlign: 'right' }}>
              <div className="serif" style={{ fontSize: 48, fontWeight: 400, color: '#a8c4b3' }}>200</div>
              <div style={{ fontSize: 12, color: '#a8c4b3', marginTop: 4 }}>trees · Year 1 target</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 03: TECHNOLOGY ─── */}
      <section id="tech" style={{ padding: '100px 48px', background: 'var(--bg-2)', borderTop: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div className="label" style={{ color: 'var(--moss)' }}>03: The technology</div>
          <h2 className="serif" style={{ fontSize: 'clamp(36px, 4.5vw, 60px)', lineHeight: 1.08, marginTop: 16, maxWidth: 820, fontWeight: 400 }}>
            Four AI layers. One seamless loop.
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20, marginTop: 52 }}>
            {[
              {
                num: '01',
                name: 'SightCheck Vision Model',
                body: 'Proprietary model for material classification and hazard detection from a single photo. Automatically flags asbestos and lead-paint risk in pre-1990 materials. Returns Grade A/B/C condition, resale price estimate, and a marketplace-ready listing. 60 seconds, end to end.',
                metrics: [['60 sec', 'full report'], ['3 grades', 'A/B/C condition'], ['Auto-flag', 'hazard detection']],
              },
              {
                num: '02',
                name: 'Room Renderer',
                body: 'Stable Diffusion / FLUX img2img pipeline with ControlNet depth-preservation. Reclaimed materials appear in the homeowner\'s actual room — walls, proportions, lighting intact. Biophilic plants are positioned inside the render based on room orientation and VOC load from proposed materials.',
                metrics: [['Img2img', 'depth-preserved'], ['ControlNet', 'edge detection'], ['Live render', 'actual room']],
              },
              {
                num: '03',
                name: 'Biophilic Intelligence',
                body: 'Species database matched against room metadata: orientation, ventilation quality, VOC load from new materials. A peace lily for poorly ventilated spaces. A snake plant for bedrooms. A herb wall for south-facing kitchens. Each plant appears inside the room render and is purchasable directly through the platform.',
                metrics: [['Room-matched', 'species selection'], ['In-render', 'plant placement'], ['Direct purchase', 'vetted vendors']],
              },
              {
                num: '04',
                name: 'Subsidy API (Mes Aides Réno)',
                body: 'Free French government API integrated directly into the renovation scope output. Generates a personalised MaPrimeRénov\' and CEE eligibility summary from the renovation scope detected in the photo analysis. A bureaucratic barrier across four ministries and multiple schemes, turned into a single one-page output.',
                metrics: [['Free gov API', 'Mes Aides Réno'], ['Auto-matched', 'from photo scope'], ['1 page', 'subsidy summary']],
              },
            ].map(({ num, name, body, metrics }) => (
              <div key={num} style={{ background: 'var(--bg)', border: '1px solid var(--line)', borderRadius: 10, padding: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-3)', letterSpacing: '0.1em' }}>{num}</span>
                  <span className="chip moss" style={{ fontSize: 11 }}>{name}</span>
                </div>
                <div style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.7 }}>{body}</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, paddingTop: 16, borderTop: '1px solid var(--line)' }}>
                  {metrics.map(([val, label]) => (
                    <div key={label}>
                      <div style={{ fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 700, color: 'var(--moss-deep)' }}>{val}</div>
                      <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 3 }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 28, padding: '14px 20px', background: 'var(--bg)', border: '1px solid var(--line)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div className="label" style={{ color: 'var(--moss)' }}>Live demo</div>
            {['React 18', 'No build step · fully static', 'Babel standalone', 'JSON demo data'].map(t => (
              <span key={t} className="chip" style={{ fontSize: 11.5 }}>{t}</span>
            ))}
            <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--ink-3)' }}>
              Production: OpenAI Vision · Stable Diffusion/FLUX · Mes Aides Réno API · Stripe · Supabase
            </span>
          </div>
        </div>
      </section>

      {/* ─── 04: MARKET OPPORTUNITY ─── */}
      <section id="market" style={{ padding: '100px 48px', background: 'var(--moss-deep)', color: 'var(--bg)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div className="label" style={{ color: 'var(--moss-soft)' }}>04: The opportunity</div>
          <h2 className="serif" style={{ fontSize: 'clamp(36px, 4.5vw, 60px)', lineHeight: 1.08, marginTop: 16, maxWidth: 900, fontWeight: 400 }}>
            A €38B market with zero circular infrastructure.
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start', marginTop: 64 }}>
            <div>
              <div className="label" style={{ color: 'var(--moss-soft)', marginBottom: 28 }}>Market sizing</div>
              {[
                { label: 'TAM', amount: '€38B', sub: 'French residential renovation market per year', w: '100%' },
                { label: 'SAM', amount: '€8.4B', sub: 'Government-subsidized energy renovation segment', w: '60%' },
                { label: 'SOM', amount: '€160M GMV', sub: 'Year 3 platform target (2% penetration = €12.8M revenue)', w: '26%' },
              ].map(({ label, amount, sub, w }) => (
                <div key={label} style={{ marginBottom: 32 }}>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'baseline', marginBottom: 10 }}>
                    <span style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600, color: 'var(--moss-soft)' }}>{label}</span>
                    <span className="serif" style={{ fontSize: 32, fontWeight: 400 }}>{amount}</span>
                  </div>
                  <div style={{ height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 2, marginBottom: 8 }}>
                    <div style={{ height: '100%', width: w, background: 'rgba(255,255,255,0.45)', borderRadius: 2 }} />
                  </div>
                  <div style={{ fontSize: 12.5, color: '#a8c4b3' }}>{sub}</div>
                </div>
              ))}
            </div>

            <div>
              <div className="label" style={{ color: 'var(--moss-soft)', marginBottom: 28 }}>Three regulatory tailwinds</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
                {[
                  {
                    stat: '700k',
                    label: 'DPE-F/G homes must renovate to remain legally rentable by 2028',
                    src: 'Loi Climat et Résilience 2021',
                  },
                  {
                    stat: '3% / yr',
                    label: 'of European building stock must renovate annually under EU Renovation Wave by 2030',
                    src: 'EU Renovation Wave Directive 2024',
                  },
                  {
                    stat: 'AGEC 2022',
                    label: 'New regulation requires material traceability in demolition, but provides no affordable tool for sub-1,000m² sites',
                    src: 'Anti-Gaspillage pour une Économie Circulaire',
                  },
                ].map(({ stat, label, src }) => (
                  <div key={stat} style={{ borderLeft: '1px solid var(--moss-2)', paddingLeft: 24 }}>
                    <div className="serif" style={{ fontSize: 36, fontWeight: 400 }}>{stat}</div>
                    <div style={{ fontSize: 14, color: '#d8e4dd', marginTop: 8, lineHeight: 1.55 }}>{label}</div>
                    <div style={{ fontSize: 11, color: '#a8c4b3', marginTop: 6, fontWeight: 500 }}>{src}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 05: BUSINESS MODEL ─── */}
      <section id="business" style={{ padding: '100px 48px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div className="label" style={{ color: 'var(--moss)' }}>05: The business</div>
          <h2 className="serif" style={{ fontSize: 'clamp(36px, 4.5vw, 60px)', lineHeight: 1.08, marginTop: 16, maxWidth: 900, fontWeight: 400 }}>
            Pay-per-use, then marketplace.
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 56, marginTop: 56, alignItems: 'start' }}>
            <div>
              {[
                {
                  phase: 'Phase 1', num: '01', stream: 'SightCheck assessment', rate: '€8 per report',
                  desc: 'Contractors pay €8 per condition report, a clear return against the €120+ disposal fees they currently absorb. 200 assessments in Month 1–6 → €1.6k MRR from this stream alone.',
                },
                {
                  phase: 'Phase 1', num: '02', stream: 'Room visualisation + subsidy summary', rate: '€4 per session',
                  desc: 'Homeowners pay €4, a one-off cost for a one-off decision. The subsidy summary and room render are bundled. At 15% conversion to a confirmed circular choice, plant commission adds ~€1k MRR by Month 6.',
                },
                {
                  phase: 'Phase 1', num: '03', stream: 'Green brand partner retainers', rate: 'Contextual referral fees',
                  desc: '3 founding green-brand partners. Referral fees on biophilic plant purchases (20% commission on avg €35 basket). Contextual placement in the room render and subsidy summary.',
                },
                {
                  phase: 'Phase 2', num: '04', stream: 'Circular marketplace', rate: '8% transaction fee',
                  desc: 'Activates at Month 6 with 50 contractors and 200 buyers. Escrow-protected. 8% on each material transaction. Target: €8k–€10k MRR at Month 12. Break-even at Month 18.',
                },
              ].map(({ phase, num, stream, rate, desc }) => (
                <div key={num} style={{ padding: '24px 0', borderTop: '1px solid var(--line)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-3)', letterSpacing: '0.1em' }}>{num}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{stream}</span>
                    <span className="chip" style={{ fontSize: 10.5, marginLeft: 'auto' }}>{phase}</span>
                    <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--moss-deep)', whiteSpace: 'nowrap' }}>{rate}</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.65 }}>{desc}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ background: 'var(--moss-deep)', color: 'var(--bg)', borderRadius: 10, padding: 28 }}>
                <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600, color: '#a8c4b3', marginBottom: 14 }}>MRR growth targets</div>
                {[
                  ['Month 6', 'Phase 1', '€1.5k–€2k MRR'],
                  ['Month 12', 'Phase 2', '€7k–€9k MRR'],
                  ['Month 18', 'Break-even', '€15k+ MRR'],
                ].map(([a, b, c]) => (
                  <div key={a} style={{ padding: '12px 0', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 500 }}>{a}</div>
                      <div style={{ fontSize: 11, color: '#a8c4b3', marginTop: 2 }}>{b}</div>
                    </div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 13, color: '#a8c4b3', fontWeight: 600 }}>{c}</div>
                  </div>
                ))}
                <div style={{ marginTop: 20, padding: 14, background: 'rgba(255,255,255,0.06)', borderRadius: 6 }}>
                  <div style={{ fontSize: 11, color: '#a8c4b3', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Funding ask</div>
                  <div className="serif" style={{ fontSize: 26, fontWeight: 400 }}>€80k – €150k</div>
                  <div style={{ fontSize: 12, color: '#a8c4b3', marginTop: 6, lineHeight: 1.55 }}>
                    Unit economics: €8 price · €2–3 variable cost · <b style={{color:'#d8e4dd'}}>€5–6 contribution margin per assessment</b>. Non-dilutive seed via ADEME, Bpifrance French Tech Seed, EIT Climate-KIC.
                  </div>
                </div>
              </div>

              {/* Next steps */}
              <div style={{ background: 'var(--bg-2)', border: '1px solid var(--line)', borderRadius: 10, padding: 24 }}>
                <div className="label" style={{ color: 'var(--moss)', marginBottom: 14 }}>Immediate next steps</div>
                {[
                  '10-contractor pilot in Île-de-France',
                  '2–3 signed green brand agreements',
                  'Mes Aides Réno subsidy API integration',
                  'Full SightCheck vision model deployment',
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '10px 0', borderTop: i > 0 ? '1px solid var(--line-2)' : 'none' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--moss)', marginTop: 6, flexShrink: 0 }} />
                    <div style={{ fontSize: 13.5, color: 'var(--ink-2)' }}>{item}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Competitive table */}
          <div style={{ marginTop: 64 }}>
            <div className="label" style={{ color: 'var(--moss)', marginBottom: 20 }}>How OuroNova compares</div>
            <div style={{ border: '1px solid var(--line)', borderRadius: 10, overflow: 'hidden' }}>
              <div style={{
                display: 'grid', gridTemplateColumns: '1.6fr repeat(4, 1fr)',
                background: 'var(--bg-2)', borderBottom: '1px solid var(--line)', padding: '12px 20px',
              }}>
                {['', 'AI material assessment', 'Room visualisation', 'Subsidy navigation', 'Circular marketplace'].map((h, i) => (
                  <div key={h} style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.08em', paddingLeft: i > 0 ? 12 : 0 }}>{h}</div>
                ))}
              </div>
              {[
                { name: 'OuroNova', vals: ['✓', '✓', '✓', '✓ Phase 2'], highlight: true },
                { name: 'Backacia / Cycle Up', vals: ['Manual only', 'No', 'No', '✓'] },
                { name: 'Houzz', vals: ['No', '✓ New only', 'No', 'No'] },
                { name: 'ANAH.fr / gov portals', vals: ['No', 'No', 'Partial', 'No'] },
              ].map(({ name, vals, highlight }, ri) => (
                <div key={name} style={{
                  display: 'grid', gridTemplateColumns: '1.6fr repeat(4, 1fr)',
                  padding: '14px 20px', borderBottom: ri < 3 ? '1px solid var(--line-2)' : 'none',
                  background: highlight ? 'var(--moss-mist)' : 'transparent', alignItems: 'center',
                }}>
                  <div style={{ fontSize: 13.5, fontWeight: highlight ? 700 : 400, color: highlight ? 'var(--moss-deep)' : 'var(--ink)' }}>{name}</div>
                  {vals.map((v, j) => (
                    <div key={j} style={{ paddingLeft: 12, fontSize: 13.5, color: v.startsWith('✓') ? 'var(--moss)' : 'var(--ink-3)', fontWeight: v.startsWith('✓') ? 600 : 400 }}>{v}</div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── 06: ROADMAP ─── */}
      <section style={{ padding: '100px 48px', background: 'var(--bg-2)', borderTop: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div className="label" style={{ color: 'var(--moss)' }}>06: The roadmap</div>
          <h2 className="serif" style={{ fontSize: 'clamp(36px, 4.5vw, 60px)', lineHeight: 1.08, marginTop: 16, maxWidth: 800, fontWeight: 400 }}>
            Île-de-France first.<br />Europe by Year 2.
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, marginTop: 60, borderTop: '1px solid var(--moss-2)', paddingTop: 40 }}>
            {[
              {
                phase: 'Phase 1 · M1–M6', label: 'Now',
                title: 'SightCheck + Room Visualiser',
                items: [
                  'SightCheck live in Île-de-France',
                  'Room visualiser with biophilic layer',
                  '200 contractor assessments',
                  '3 founding green brand partners',
                  'Mes Aides Réno subsidy API integrated',
                ],
                active: true,
              },
              {
                phase: 'Phase 2 · M6–M18', label: 'Next',
                title: 'Circular marketplace',
                items: [
                  '50 contractors, 200 active buyers',
                  'Marketplace + 8% transaction fee',
                  '€8k–€10k MRR target',
                  'Lyon, Bordeaux, Marseille expansion',
                  'Seed funding closed',
                ],
              },
              {
                phase: 'Phase 3 · Year 2+', label: 'Vision',
                title: 'European platform',
                items: [
                  'Lyon, Brussels, Berlin launched',
                  'Carbon-credit reporting for municipalities',
                  'Material-flow data licensed to urban planners',
                  'EU EPR regulation equivalent in BE, DE, NL',
                ],
              },
            ].map(({ phase, label, title, items, active }, i) => (
              <div key={phase} style={{
                paddingRight: i < 2 ? 40 : 0,
                paddingLeft: i > 0 ? 40 : 0,
                borderRight: i < 2 ? '1px solid var(--moss-2)' : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-3)', letterSpacing: '0.06em' }}>{phase}</span>
                  <span className="chip" style={{ fontSize: 10, background: active ? 'var(--moss-soft)' : 'var(--bg-3)', color: active ? 'var(--moss-ink)' : 'var(--ink-3)', borderColor: 'transparent' }}>{label}</span>
                </div>
                <div className="serif" style={{ fontSize: 24, fontWeight: 400, lineHeight: 1.2, marginBottom: 20 }}>{title}</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {items.map(item => (
                    <li key={item} style={{ fontSize: 13.5, color: 'var(--ink-2)', paddingLeft: 16, position: 'relative', lineHeight: 1.5 }}>
                      <span style={{ position: 'absolute', left: 0, top: 8, width: 5, height: 5, borderRadius: '50%', background: active ? 'var(--moss)' : 'var(--line)' }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 07: IMPACT + SDGs ─── */}
      <section id="impact" style={{ padding: '100px 48px', background: 'var(--moss-mist)', borderTop: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div className="label" style={{ color: 'var(--moss)' }}>07: Year 1 targets</div>
          <h2 className="serif" style={{ fontSize: 'clamp(36px, 4.5vw, 60px)', lineHeight: 1.08, marginTop: 16, maxWidth: 900, fontWeight: 400 }}>
            Measurable by design.
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, marginTop: 56, borderTop: '1px solid var(--moss)' }}>
            {[
              ['200', '', 'SightCheck contractor assessments'],
              ['500 t', '', 'C&D waste diverted from landfill'],
              ['€1.2M', '', 'in subsidies navigated for homeowners'],
              ['200', 'trees', 'planted via Reforest\'Action'],
            ].map(([n, u, l], i) => (
              <div key={l} style={{ padding: '32px 24px 32px 0', borderRight: i < 3 ? '1px solid var(--moss-2)' : 'none' }}>
                <div className="serif" style={{ fontSize: 56, lineHeight: 1, letterSpacing: '-0.02em', fontWeight: 400, color: 'var(--moss-deep)' }}>
                  {n}
                  {u && <small style={{ fontSize: 20, color: 'var(--moss)', marginLeft: 4, fontWeight: 400 }}>{u}</small>}
                </div>
                <div style={{ marginTop: 12, fontSize: 13, color: 'var(--moss-ink)', lineHeight: 1.5 }}>{l}</div>
              </div>
            ))}
          </div>

          {/* SDG logos */}
          <div style={{ marginTop: 72 }}>
            <div className="label" style={{ color: 'var(--moss)', marginBottom: 24 }}>UN Sustainable Development Goals</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              {[
                {
                  num: 12, logo: 'assets/SDG_12.gif',
                  title: 'Responsible Consumption & Production',
                  body: 'SightCheck targets 200 monthly contractor assessments in Year 1, diverting salvageable materials from landfill into verified resale inventory. Each assessment generates a personalised subsidy path, turning the circular choice into the affordable choice.',
                  target: 'Target 12.5: substantially reduce waste through reuse',
                },
                {
                  num: 11, logo: 'assets/SDG_11.gif',
                  title: 'Sustainable Cities & Communities',
                  body: 'A 25 km default transaction radius keeps material flows hyperlocal, reducing transport emissions and strengthening neighbourhood circular loops. The room visualiser makes the circular choice emotionally real, not abstract.',
                  target: 'Target 11.6: reduce environmental impact of cities',
                },
                {
                  num: 15, logo: 'assets/SDG_12.gif',
                  title: 'Life on Land',
                  body: 'The Biophilic Intelligence layer brings living plants into every renovation — matched to the room and purchasable directly. Every confirmed circular material choice plants a GPS-trackable tree via Reforest\'Action, creating a permanent real-world impact.',
                  target: 'Target 15.2: sustainable forest management and halting deforestation',
                },
              ].map((s) => (
                <div key={s.num} style={{
                  background: 'white', padding: 24, borderRadius: 12,
                  border: '1px solid rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: 14,
                }}>
                  <img src={s.logo} alt={'SDG ' + s.num} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 4 }} />
                  <div style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.25, color: 'var(--moss-deep)' }}>{s.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--ink-3)', flex: 1, lineHeight: 1.65 }}>{s.body}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--moss)', fontWeight: 600 }}>{s.target}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section style={{ padding: '120px 48px', textAlign: 'center', background: 'var(--bg)' }}>
        <div style={{ fontSize: 13, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600, color: 'var(--moss)', marginBottom: 24 }}>
          The loop is live
        </div>
        <h2 className="serif" style={{ fontSize: 'clamp(40px, 6vw, 80px)', lineHeight: 1.05, maxWidth: 820, margin: '0 auto', fontWeight: 400, letterSpacing: '-0.02em' }}>
          Walk through Camille's renovation, end to end.
        </h2>
        <p style={{ maxWidth: 480, margin: '24px auto 40px', fontSize: 16, color: 'var(--ink-3)', lineHeight: 1.65 }}>
          SightCheck, room visualiser, biophilic layer, subsidy summary.
          Three flows. No sign-up required.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button className="btn lg" onClick={() => go('analyze')}>Enter the demo →</button>
          <button className="btn lg secondary" onClick={() => go('browse')}>Browse marketplace</button>
        </div>
      </section>

      {/* ─── TEAM ─── */}
      <section id="team" style={{ padding: '80px 48px', background: 'var(--bg-2)', borderTop: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', textAlign: 'center' }}>
          <div className="label" style={{ color: 'var(--moss)' }}>The team</div>
          <div className="serif" style={{ fontSize: 38, lineHeight: 1.1, marginTop: 16, fontWeight: 400 }}>
            Built at École Polytechnique (l'X)
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 72, marginTop: 52 }}>
            {[
              { name: 'Prakhar Tiwari', role: 'CEO', bio: 'Strategy & product', photo: 'assets/image33.jpeg', pos: 'center top' },
              { name: 'Nai-Maria Naim', role: 'CFO', bio: 'Finance & partnerships', photo: 'assets/image35.jpeg', pos: 'center 20%' },
              { name: 'Ziqi Meng', role: 'CTO', bio: 'Engineering & AI', photo: 'assets/image34.jpeg', pos: 'center 30%' },
            ].map((m) => (
              <div key={m.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                <img src={m.photo} alt={m.name} style={{
                  width: 176, height: 176, borderRadius: '50%', objectFit: 'cover',
                  objectPosition: m.pos,
                  border: '2px solid var(--line)',
                  boxShadow: '0 4px 20px rgba(31,58,46,0.12)',
                }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--ink)' }}>{m.name}</div>
                  <div className="label" style={{ color: 'var(--moss)', marginTop: 5 }}>{m.role}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 4 }}>{m.bio}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 52, fontSize: 12, color: 'var(--ink-3)' }}>
            EuroTeQaThon 2026 · École Polytechnique (l'X) · Theme: Enhance connections: people, technology and nature
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{
        padding: '24px 48px', borderTop: '1px solid var(--line)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontSize: 12, color: 'var(--ink-3)', background: 'var(--bg-2)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <img src="assets/ouronova-logo.png" alt="OuroNova" style={{ height: 22, opacity: 0.65 }} />
          <span>· École Polytechnique (l'X) · EuroTeQaThon 2026</span>
        </div>
        <div>Circular renovation, engineered.</div>
      </footer>
    </div>
  );
}

window.Landing = Landing;
