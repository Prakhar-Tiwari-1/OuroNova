// Landing page — public hero
function Landing() {
  const { go } = useRoute();
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* nav */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 48px', borderBottom: '1px solid var(--line)',
        position: 'sticky', top: 0, background: 'rgba(252,250,245,0.92)', backdropFilter: 'blur(10px)', zIndex: 10,
      }}>
        <img src="assets/ouronova-logo.png" alt="OuroNova" className="brand-logo-full" />
        <nav style={{ display: 'flex', gap: 28, alignItems: 'center', fontSize: 13.5, color: 'var(--ink-2)' }}>
          <a href="#story">The story</a>
          <a href="#how">How it works</a>
          <a href="#impact">Impact</a>
          <a href="#team">Team</a>
          <button className="btn" onClick={() => go('analyze')}>Try the demo →</button>
        </nav>
      </header>

      {/* HERO — circular economy slogan */}
      <section style={{ padding: '88px 48px 80px', maxWidth: 1180, margin: '0 auto' }}>
        <div className="label" style={{ color: 'var(--moss)', marginBottom: 18 }}>OURONOVA · CIRCULAR RENOVATION, ENGINEERED</div>
        <h1 className="serif" style={{
          fontSize: 'clamp(54px, 8.6vw, 108px)',
          lineHeight: 0.96,
          maxWidth: 1080,
          letterSpacing: '-0.02em',
          fontWeight: 500,
        }}>
          Renovate once.<br/>
          Reuse forever.<br/>
          <em style={{ color: 'var(--moss)', fontStyle: 'italic', fontWeight: 500 }}>Close the loop.</em>
        </h1>
        <p style={{
          fontSize: 20, lineHeight: 1.5, color: 'var(--ink-2)',
          maxWidth: 660, marginTop: 36, fontFamily: 'var(--serif)', fontWeight: 400, fontStyle: 'italic',
        }}>
          OuroNova powers the circular economy of home renovation in France — turning yesterday's
          demolition into tomorrow's raw material, while unlocking the €21,800 average in stackable
          public aid that 68% of eligible homeowners never claim.
        </p>
        <div style={{ display: 'flex', gap: 12, marginTop: 40 }}>
          <button className="btn lg" onClick={() => go('analyze')}>
            Analyze your room →
          </button>
          <button className="btn lg secondary" onClick={() => go('browse')}>
            Browse the marketplace
          </button>
        </div>

        {/* hero image strip */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12, marginTop: 64, height: 320 }}>
          <div className="ph-img hero" />
          <div className="ph-img craft" />
          <div className="ph-img oak" />
        </div>

        {/* numbers strip — circular economy + France-specific */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0,
          marginTop: 56, paddingTop: 36, borderTop: '1px solid var(--line)',
        }}>
          {[
            ['46M t', "France's annual construction & demolition waste"],
            ['€70k', "max MaPrimeRénov' Parcours Accompagné per home"],
            ['68%', 'of eligible French homeowners never claim aid'],
            ['×4', 'reuse multiplier for resource-efficient renovations'],
          ].map(([n, l]) => (
            <div key={l} style={{ paddingRight: 16 }}>
              <div className="serif" style={{ fontSize: 42, lineHeight: 1, letterSpacing: '-0.015em', color: 'var(--moss-deep)', fontWeight: 500 }}>{n}</div>
              <div className="small muted" style={{ marginTop: 10, maxWidth: 200 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* STORY section */}
      <section id="story" style={{ padding: '100px 48px', background: 'var(--moss-deep)', color: 'var(--bg)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 80, alignItems: 'start' }}>
            <div style={{ position: 'sticky', top: 120 }}>
              <div className="label" style={{ color: 'var(--moss-soft)', marginBottom: 16 }}>The Loop</div>
              <div className="serif" style={{ fontSize: 64, lineHeight: 1, letterSpacing: '-0.015em', fontWeight: 500 }}>
                Three<br/>broken<br/>links<br/>in one chain.
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 56 }}>
              {[
                {
                  who: 'CAMILLE — homeowner, Paris 11e',
                  body: "She owns a 1972 apartment rated DPE F. She qualifies for €21,800 in stacked aid (MaPrimeRénov' + CEE + Éco-PTZ + TVA 5,5%) — but the application paths are fragmented across four ministries. So she hires a contractor, claims nothing, and overpays.",
                  pain: 'Information asymmetry → misses €21,800 in stackable French aid.',
                },
                {
                  who: 'KARIM — contractor, Lyon',
                  body: "He pays €120 per tonne to dump renovation debris. The copper piping alone is worth €220, but listing it elsewhere means tire-kickers and zero trust framework. So it goes in the skip — and out of the circular economy.",
                  pain: 'Disposal cost → revenue loss → 70% of reusable material landfilled.',
                },
                {
                  who: 'ÉLODIE — furniture maker, Marseille',
                  body: "She drives 60 km every Saturday hoping to find reclaimed oak. Half the time she leaves empty-handed and buys virgin wood at €5/kg. The waste oak exists — it's just locked outside the loop.",
                  pain: 'Fragmented supply → buys virgin at 2–3× the price.',
                },
              ].map((s, i) => (
                <div key={i} style={{ borderLeft: '1px solid var(--moss-2)', paddingLeft: 28 }}>
                  <div className="mono" style={{ color: 'var(--moss-soft)', fontSize: 11, letterSpacing: '0.12em' }}>{s.who}</div>
                  <p className="serif" style={{ fontSize: 24, lineHeight: 1.3, marginTop: 12, fontStyle: 'italic', fontWeight: 400 }}>
                    "{s.body}"
                  </p>
                  <div className="small" style={{ marginTop: 16, color: 'var(--moss-soft)', opacity: 0.85 }}>
                    {s.pain}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 96, paddingTop: 56, borderTop: '1px solid var(--moss-2)', textAlign: 'center' }}>
            <div className="serif" style={{ fontSize: 'clamp(40px, 5vw, 64px)', lineHeight: 1.1, maxWidth: 940, margin: '0 auto', fontWeight: 500 }}>
              Camille's waste is Élodie's raw material.<br/>
              Karim's disposal cost is everyone's revenue.<br/>
              <em style={{ color: '#a8c4b3' }}>OuroNova closes the loop.</em>
            </div>
          </div>
        </div>
      </section>

      {/* CIRCULAR ECONOMY STATS BAND */}
      <section style={{ padding: '80px 48px', background: 'var(--bg-2)', borderTop: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div className="label" style={{ color: 'var(--moss)' }}>The numbers</div>
          <h2 className="serif" style={{ fontSize: 56, lineHeight: 1.02, marginTop: 14, maxWidth: 900, fontWeight: 500, letterSpacing: '-0.015em' }}>
            Why the circular economy<br/>can't wait.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, marginTop: 56 }}>
            {[
              ['46 M tonnes', 'France generates more construction & demolition waste annually than all household waste combined.'],
              ['78%', "share of construction waste currently downcycled or landfilled — only 1% is reused at material grade."],
              ['€21,800', "average stackable aid a French DPE-F homeowner can claim across MaPrimeRénov' + CEE + TVA 5,5% + local schemes."],
              ['×4', 'EU circular economy targets call for quadrupling material reuse rates by 2030 (Renovation Wave directive).'],
              ['68%', 'of eligible French homeowners never claim a single euro of renovation aid — paperwork friction is the #1 reason cited.'],
              ['40–80%', 'lower embodied carbon when reclaimed materials replace virgin steel, copper, oak, or marble.'],
            ].map(([n, l], i) => (
              <div key={i} style={{
                padding: '28px 32px 28px 0',
                borderTop: '1px solid var(--moss-2)',
                borderRight: i % 2 === 0 ? '1px solid var(--moss-2)' : 'none',
                paddingLeft: i % 2 === 1 ? 32 : 0,
              }}>
                <div className="serif" style={{ fontSize: 40, lineHeight: 1, color: 'var(--moss-deep)', fontWeight: 500, letterSpacing: '-0.015em' }}>{n}</div>
                <div className="small muted" style={{ marginTop: 12, maxWidth: 460, lineHeight: 1.5 }}>{l}</div>
              </div>
            ))}
          </div>
          <div className="tiny muted" style={{ marginTop: 24, fontStyle: 'italic' }}>
            Sources: ADEME 2024, ANAH annual report, Service-Public.fr, EU Renovation Wave 2024.
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={{ padding: '100px 48px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div className="label" style={{ color: 'var(--moss)' }}>01 — How the loop closes</div>
          <h2 className="serif" style={{ fontSize: 64, lineHeight: 1.02, marginTop: 14, maxWidth: 800, fontWeight: 500, letterSpacing: '-0.015em' }}>
            Three sides of<br/>the same circle.
          </h2>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginTop: 64,
          }}>
            {[
              {
                num: '01',
                role: 'Homeowner',
                title: 'Photograph the room.',
                body: "AI identifies what to upgrade, which reclaimed materials fit, and exactly which French aid you qualify for — MaPrimeRénov', CEE, Éco-PTZ, TVA 5,5%, regional bonuses — stacked into one number.",
                cta: ['Try photo analysis', 'analyze'],
                img: 'kitchen',
              },
              {
                num: '02',
                role: 'Contractor',
                title: 'List the demolition.',
                body: 'AI generates the listing from one photo. Quality grading, pickup logistics, trust scores. Stop paying €120/tonne to dump revenue into a landfill.',
                cta: ['Try a listing', 'list'],
                img: 'demo',
              },
              {
                num: '03',
                role: 'Buyer',
                title: 'Source reclaimed locally.',
                body: 'Find oak, copper, marble within 25 km. Verified sellers, transparent pricing, the carbon cost of pickup shown upfront — no greenwashing.',
                cta: ['Browse marketplace', 'browse'],
                img: 'craft',
              },
            ].map((c) => (
              <div key={c.num} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 0, overflow: 'hidden' }}>
                <div className={'ph-img ' + c.img} style={{ height: 200, borderRadius: 0, border: 'none' }} />
                <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
                  <div className="row between">
                    <span className="mono muted">{c.num}</span>
                    <span className="chip moss">{c.role}</span>
                  </div>
                  <div className="serif" style={{ fontSize: 30, lineHeight: 1.1, marginTop: 4, fontWeight: 500, letterSpacing: '-0.01em' }}>{c.title}</div>
                  <div className="small muted" style={{ flex: 1, lineHeight: 1.55 }}>{c.body}</div>
                  <button
                    className="btn ghost"
                    style={{ alignSelf: 'flex-start', marginTop: 8 }}
                    onClick={() => go(c.cta[1])}
                  >
                    {c.cta[0]} →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IMPACT + SDG */}
      <section id="impact" style={{ padding: '100px 48px', background: 'var(--moss-mist)', borderTop: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div className="label" style={{ color: 'var(--moss)' }}>02 — Year 1 targets</div>
          <h2 className="serif" style={{ fontSize: 64, lineHeight: 1.02, marginTop: 14, maxWidth: 900, fontWeight: 500, letterSpacing: '-0.015em' }}>
            Measurable<br/>by design.
          </h2>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0,
            marginTop: 64, borderTop: '1px solid var(--moss)',
          }}>
            {[
              ['500', 't', 'CO₂ avoided'],
              ['100', 't', 'waste diverted from landfills'],
              ['€150k', '', 'subsidies unlocked for homeowners'],
              ['1,000+', '', 'sustainable renovation decisions'],
            ].map(([n, u, l], i) => (
              <div key={l} style={{
                padding: '36px 24px 36px 0',
                borderRight: i < 3 ? '1px solid var(--moss-2)' : 'none',
                opacity: 0.95,
              }}>
                <div className="serif" style={{ fontSize: 64, lineHeight: 1, letterSpacing: '-0.02em', fontWeight: 500, color: 'var(--moss-deep)' }}>
                  {n}<small style={{ fontSize: 22, color: 'var(--moss)', marginLeft: 4 }}>{u}</small>
                </div>
                <div className="small" style={{ marginTop: 14, color: 'var(--moss-ink)' }}>{l}</div>
              </div>
            ))}
          </div>

          {/* SDG logos */}
          <div style={{ marginTop: 80 }}>
            <div className="label" style={{ color: 'var(--moss)', marginBottom: 24 }}>UN Sustainable Development Goals</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              {[
                {
                  num: 12,
                  color: '#BF8B2E',
                  title: 'Responsible Consumption & Production',
                  body: 'Marketplace diverts reusable materials from landfills. AI nudges homeowners toward 40% lower-carbon reclaimed alternatives.',
                  target: 'Target 12.5 — substantially reduce waste through reuse',
                },
                {
                  num: 11,
                  color: '#F99D26',
                  title: 'Sustainable Cities & Communities',
                  body: 'Targets residential urban renovations within 25 km radius — connecting local contractors, homeowners, craftspeople.',
                  target: 'Target 11.6 — reduce environmental impact of cities',
                },
                {
                  num: 9,
                  color: '#FD6925',
                  title: 'Industry, Innovation & Infrastructure',
                  body: 'Digital infrastructure for circular construction. Gives contractors economic incentive to salvage instead of dump.',
                  target: 'Target 9.4 — sustainable, resource-efficient infrastructure',
                },
              ].map((s) => (
                <div key={s.num} style={{
                  background: 'white', padding: 24, borderRadius: 12,
                  border: '1px solid rgba(0,0,0,0.06)',
                  display: 'flex', flexDirection: 'column', gap: 14,
                }}>
                  <div style={{
                    width: 80, height: 80,
                    background: s.color,
                    color: 'white',
                    display: 'flex', flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: 4,
                    fontFamily: 'var(--sans)',
                    fontWeight: 700,
                  }}>
                    <div style={{ fontSize: 11, letterSpacing: '0.04em' }}>SDG</div>
                    <div style={{ fontSize: 38, lineHeight: 0.9 }}>{s.num}</div>
                  </div>
                  <div className="serif" style={{ fontSize: 22, fontWeight: 500, lineHeight: 1.15, color: 'var(--moss-deep)' }}>{s.title}</div>
                  <div className="small muted" style={{ flex: 1 }}>{s.body}</div>
                  <div className="tiny" style={{ color: 'var(--moss)', fontWeight: 500 }}>{s.target}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '120px 48px', textAlign: 'center', background: 'var(--bg)' }}>
        <div className="serif" style={{ fontStyle: 'italic', color: 'var(--moss)', fontSize: 18, marginBottom: 20 }}>
          The loop is live.
        </div>
        <h2 className="serif" style={{ fontSize: 'clamp(48px, 7vw, 88px)', lineHeight: 0.98, maxWidth: 940, margin: '0 auto', letterSpacing: '-0.02em', fontWeight: 500 }}>
          Walk through Camille's<br/>renovation, end to end.
        </h2>
        <p className="muted" style={{ maxWidth: 540, margin: '24px auto 40px', fontSize: 17, fontFamily: 'var(--serif)', fontStyle: 'italic' }}>
          Three flows, eight screens, hand-crafted demo data. No sign-up.
        </p>
        <button className="btn lg" onClick={() => go('analyze')}>
          Enter the demo →
        </button>
      </section>

      {/* footer */}
      <footer id="team" style={{
        padding: '40px 48px', borderTop: '1px solid var(--line)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontSize: 12, color: 'var(--ink-3)', background: 'var(--bg-2)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <img src="assets/ouronova-logo.png" alt="OuroNova" style={{ height: 24, opacity: 0.7 }} />
          <span>· École Polytechnique (l'X) · EuroTeQaThon 2025</span>
        </div>
        <div>Theme: Enhance connections — people, technology and nature</div>
      </footer>
    </div>
  );
}

window.Landing = Landing;
