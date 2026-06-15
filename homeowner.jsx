// Homeowner: Photo analysis + Cost estimate + Subsidies
const D = window.OURO_DATA;

/* ─── OpenAI utilities ─── */
async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = (e) => resolve(e.target.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function callGPT4oVision(apiKey, imageFile) {
  const base64 = await fileToBase64(imageFile);
  const mime   = imageFile.type || 'image/jpeg';

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method : 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey },
    body   : JSON.stringify({
      model     : 'gpt-4o',
      max_tokens: 1500,
      messages  : [{
        role   : 'user',
        content: [
          { type: 'image_url', image_url: { url: 'data:' + mime + ';base64,' + base64, detail: 'high' } },
          { type: 'text', text:
            'You are a renovation AI assessor for OuroNova, a circular renovation platform in France. ' +
            'Analyze this room photo. Return ONLY valid JSON, no markdown, no explanation:\n' +
            '{"room":"Kitchen","sqm":14,"yearBuilt":1972,"dpe":"F","dpePotential":"B","confidence":0.86,' +
            '"materialEstimate":"Describe salvageable materials and rough value range",' +
            '"detected":[{"item":"item name","condition":"brief condition","salvage":true,"age":"~X yrs"}],' +
            '"upgrades":[{"what":"upgrade","why":"French subsidy context","cost":1850,"co2":0.34,"priority":"high"}],' +
            '"circularMatches":[{"material":"Reclaimed oak cabinets","distance":6,"price":480}],' +
            '"policyMatch":{"stackedTotal":21800,"worksTotal":32500,"outOfPocket":10700,' +
            '"schemes":[{"label":"MaPrimeRenov Parcours Accompagne","amount":14400},' +
            '{"label":"CEE Coup de pouce","amount":3200},{"label":"TVA reduite 5.5%","amount":2640},' +
            '{"label":"Aide Region Ile-de-France","amount":1560}]}}\n' +
            'Include 4-6 detected items, 3-4 upgrades. Use realistic French 2024 subsidy amounts.' }
        ]
      }]
    })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error && err.error.message ? err.error.message : 'GPT-4o error ' + res.status);
  }
  const data  = await res.json();
  const raw   = data.choices[0].message.content.trim();
  const clean = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  return JSON.parse(clean);
}

async function callDALLE3(apiKey, roomType) {
  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method : 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey },
    body   : JSON.stringify({
      model  : 'dall-e-3',
      prompt : 'A beautifully renovated ' + (roomType || 'kitchen') + ' in a Paris Haussmann apartment. ' +
               'Reclaimed solid oak cabinets with natural wood finish, vintage marble countertop, ' +
               'warm pendant lighting, biophilic peace lily plant on the windowsill. ' +
               'Sustainable, warm, elegant. Natural daylight through tall French windows. ' +
               'Professional interior design photography, high quality.',
      size   : '1024x1024',
      quality: 'standard',
      n      : 1,
    })
  });
  if (!res.ok) throw new Error('DALL-E 3 failed: ' + res.status);
  const data = await res.json();
  return (data.data && data.data[0]) ? data.data[0].url : null;
}

/* ─── PhotoAnalyze ─── */
function PhotoAnalyze() {
  const { go } = useRoute();
  const [stage, setStage]               = useState('upload');
  const [step,  setStep]                = useState(0);
  const [apiKey, setApiKey]             = useState(() => localStorage.getItem('ouro_openai_key') || '');
  const [keyInput, setKeyInput]         = useState('');
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedPreview, setUploadedPreview] = useState(null);
  const [usingSample, setUsingSample]   = useState(false);
  const [aiData, setAiData]             = useState(null);
  const [renderedRoom, setRenderedRoom] = useState(null);
  const [aiError, setAiError]           = useState(null);
  const [generating, setGenerating]     = useState(false);

  const aiConnected = !!apiKey;
  const display     = aiData || D.photoAnalysis;

  const steps = [
    'Reading image dimensions and metadata',
    'Detecting room type and surfaces',
    'Identifying materials and condition',
    'Estimating salvage and resale value',
    'Matching French subsidy schemes',
  ];

  useEffect(() => {
    if (stage !== 'analyzing') return;
    if (step >= steps.length) {
      const t = setTimeout(() => setStage('done'), 400);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStep(s => s + 1), 700);
    return () => clearTimeout(t);
  }, [stage, step]);

  const saveKey = () => {
    const k = keyInput.trim();
    if (!k) return;
    setApiKey(k);
    localStorage.setItem('ouro_openai_key', k);
    setShowKeyModal(false);
    setKeyInput('');
  };

  const handleFile = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setUploadedFile(file);
    setUploadedPreview(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (!file || !file.type.startsWith('image/')) return;
    setUploadedFile(file);
    setUploadedPreview(URL.createObjectURL(file));
  };

  const startAnalyze = async (sample) => {
    setAiData(null);
    setRenderedRoom(null);
    setAiError(null);
    setUsingSample(sample);
    setStage('analyzing');
    setStep(0);

    if (apiKey && !sample && uploadedFile) {
      try {
        const analysis = await callGPT4oVision(apiKey, uploadedFile);
        setAiData(analysis);
        // Generate room render after analysis resolves
        try {
          const imgUrl = await callDALLE3(apiKey, analysis.room);
          if (imgUrl) setRenderedRoom(imgUrl);
        } catch (_) { /* render optional */ }
      } catch (err) {
        setAiError(err.message || 'AI analysis failed');
        // Falls back to demo data via display = aiData || D.photoAnalysis
      }
    }
  };

  const reset = () => { setStage('upload'); setStep(0); setAiData(null); setRenderedRoom(null); setAiError(null); setUploadedFile(null); setUploadedPreview(null); };

  return (
    <div>

      {/* API key modal */}
      {showKeyModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" style={{ width: 420, padding: 32, boxShadow: '0 8px 40px rgba(0,0,0,0.2)' }}>
            <div className="serif" style={{ fontSize: 26, fontWeight: 400, marginBottom: 8 }}>Connect OpenAI</div>
            <div style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 20, lineHeight: 1.65 }}>
              Your key is stored in your browser only and never sent to OuroNova servers.
              It powers real GPT-4o SightCheck analysis and DALL-E 3 Room Visualiser renders.
            </div>
            <div className="field">
              <div className="field-label">OpenAI API Key</div>
              <input
                className="txt" type="password" placeholder="sk-..."
                value={keyInput} onChange={e => setKeyInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && saveKey()} autoFocus
              />
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button className="btn" onClick={saveKey}>Connect</button>
              <button className="btn ghost" onClick={() => setShowKeyModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Page header */}
      <div className="page-hero">
        <div>
          <div className="label">SightCheck + Room Visualiser</div>
          <h1>Photograph the room you want to renovate.</h1>
          <div className="sub">
            {aiConnected
              ? 'Upload your own photo for a live GPT-4o analysis and DALL-E 3 Room Visualiser render.'
              : 'AI reads the space, identifies salvageable materials, and stacks every subsidy you qualify for. Connect your OpenAI key for a live demo.'}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end', flexShrink: 0 }}>
          <button className={aiConnected ? 'btn moss' : 'btn secondary'} onClick={() => setShowKeyModal(true)}>
            {aiConnected ? '✓ AI Connected' : 'Connect OpenAI →'}
          </button>
          {aiConnected && (
            <button className="btn ghost" style={{ fontSize: 11, padding: '4px 8px' }}
              onClick={() => { setApiKey(''); localStorage.removeItem('ouro_openai_key'); }}>
              Disconnect
            </button>
          )}
        </div>
      </div>

      {/* ─── UPLOAD ─── */}
      {stage === 'upload' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 28 }}>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {/* Drop zone */}
            <div
              onDragOver={e => e.preventDefault()} onDrop={handleDrop}
              onClick={() => !uploadedPreview && document.getElementById('file-upload').click()}
              style={{
                height: 320, position: 'relative', overflow: 'hidden',
                background: uploadedPreview ? 'var(--bg)' : 'var(--moss-mist)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: uploadedPreview ? 'default' : 'pointer',
                borderBottom: '1px solid var(--line)',
              }}
            >
              {uploadedPreview ? (
                <img src={uploadedPreview} alt="Room" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ textAlign: 'center', padding: 40 }}>
                  <div style={{ fontSize: 40, color: 'var(--moss)', opacity: 0.35, lineHeight: 1, marginBottom: 14 }}>+</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink-2)' }}>Drop your room photo here</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 6 }}>or click to browse · JPG, PNG, WEBP</div>
                  {!aiConnected && (
                    <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 16, padding: '8px 12px', background: 'var(--bg-3)', borderRadius: 6 }}>
                      Connect OpenAI above to use your own photo
                    </div>
                  )}
                </div>
              )}
            </div>
            <input id="file-upload" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />

            <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
              {uploadedPreview ? (
                <>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 500 }}>{(uploadedFile && uploadedFile.name) || 'room-photo.jpg'}</div>
                    <div className="tiny muted">
                      {uploadedFile ? ((uploadedFile.size / 1024 / 1024).toFixed(1) + ' MB') : ''}
                      {aiConnected ? ' · AI analysis ready' : ''}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn" onClick={() => startAnalyze(false)}>
                      {aiConnected ? 'Run AI analysis →' : 'Run analysis →'}
                    </button>
                    <button className="btn ghost" onClick={reset}>Clear</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="small muted">Or try the sample kitchen below.</div>
                  <button className="btn secondary" onClick={() => startAnalyze(true)}>Use sample →</button>
                </>
              )}
            </div>

            {!uploadedPreview && (
              <div style={{ padding: '0 20px 20px' }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 12, background: 'var(--bg-2)', borderRadius: 8 }}>
                  <div className="ph-img kitchen" style={{ width: 80, height: 60, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 500 }}>kitchen-rue-de-charonne.jpg</div>
                    <div className="tiny muted">3024 x 4032 · 2.4 MB · sample photo</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="label">What we detect</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '14px 0 0', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                ['Room type and dimensions',   'Kitchen, bathroom, living: estimated m²'],
                ['Surface materials',          'Tile, wood, laminate, paint condition'],
                ['Salvageable items',          'What is worth listing on the marketplace'],
                ['Subsidy eligibility',        "MaPrimeRenov', CEE, Eco-PTZ, TVA 5.5%"],
              ].map(([t, b]) => (
                <li key={t} style={{ paddingLeft: 14, position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, top: 8, width: 6, height: 6, borderRadius: '50%', background: 'var(--moss)' }} />
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{t}</div>
                  <div className="tiny muted" style={{ marginTop: 2 }}>{b}</div>
                </li>
              ))}
            </ul>

            {aiConnected && (
              <div className="card" style={{ marginTop: 24, background: 'var(--moss-mist)', borderColor: 'transparent', padding: 18 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--moss)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>AI Connected</div>
                <div style={{ fontSize: 13, color: 'var(--moss-ink)', lineHeight: 1.65 }}>
                  Upload your own photo for a real GPT-4o SightCheck analysis. After analysis, DALL-E 3 will generate a Room Visualiser render showing your space with reclaimed materials and biophilic plants.
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── ANALYZING ─── */}
      {stage === 'analyzing' && (
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 32, padding: 32 }}>
          <div style={{ width: 200, height: 200, flexShrink: 0, borderRadius: 8, overflow: 'hidden', background: 'var(--bg-2)' }}>
            {uploadedPreview && !usingSample
              ? <img src={uploadedPreview} alt="Analyzing" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <div className="ph-img kitchen" style={{ width: '100%', height: '100%', borderRadius: 0, border: 'none' }} />}
          </div>
          <div style={{ flex: 1 }}>
            <div className="label">{(apiKey && !usingSample) ? 'SightCheck · GPT-4o Vision' : 'Analyzing'}</div>
            <div className="serif" style={{ fontSize: 28, marginTop: 6, fontWeight: 400 }}>
              Reading your space <span className="dot-loader"><span /><span /><span /></span>
            </div>
            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {steps.map((s, i) => (
                <div key={s} className="row" style={{ opacity: i < step ? 1 : i === step ? 0.6 : 0.22, fontSize: 13.5 }}>
                  <span style={{ width: 14, color: 'var(--moss)' }}>{i < step ? '✓' : i === step ? '◐' : '○'}</span>
                  <span>{s}</span>
                </div>
              ))}
            </div>
            {aiError && (
              <div style={{ marginTop: 16, padding: 12, background: 'var(--warn-soft)', borderRadius: 6, fontSize: 12, color: 'var(--warn)', lineHeight: 1.5 }}>
                AI note: {aiError}. Showing demo results instead.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── RESULTS ─── */}
      {stage === 'done' && (
        <div className="fade-in">
          {aiData && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16 }}>
              <span className="chip moss">GPT-4o analysis</span>
              {renderedRoom && <span className="chip moss">DALL-E 3 render</span>}
              <span className="tiny muted" style={{ marginLeft: 4 }}>Live AI output from your uploaded photo</span>
            </div>
          )}

          {/* Hero strip */}
          <div className="card" style={{ display: 'grid', gridTemplateColumns: '180px 1fr' + (renderedRoom ? ' 200px' : ' auto'), gap: 20, alignItems: 'center', padding: 20, marginBottom: 24 }}>
            <div style={{ height: 140, borderRadius: 6, overflow: 'hidden', background: 'var(--bg-2)' }}>
              {uploadedPreview && !usingSample
                ? <img src={uploadedPreview} alt="Your room" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <div className="ph-img kitchen" style={{ height: '100%', borderRadius: 0, border: 'none' }} />}
            </div>
            <div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
                <span className="chip moss">{display.room}</span>
                <span className="chip">~{display.sqm} m²</span>
                <span className="chip">Built {display.yearBuilt}</span>
              </div>
              <div className="serif" style={{ fontSize: 22, lineHeight: 1.2, fontWeight: 400 }}>
                Your {(display.room || 'room').toLowerCase()} scored{' '}
                <span style={{ color: '#c0392b' }}>{(display.dpe || 'F').split(':')[0]}</span>.
              </div>
              <div style={{ fontSize: 13, color: 'var(--ink-2)', marginTop: 8, lineHeight: 1.55 }}>
                With the right works, it can reach class{' '}
                <b style={{ color: 'var(--moss)' }}>{display.dpePotential}</b> and unlock{' '}
                <b style={{ color: 'var(--moss)' }}>€{(display.policyMatch && display.policyMatch.stackedTotal || 0).toLocaleString()}</b> in stackable aid.
              </div>
            </div>
            {renderedRoom ? (
              <div style={{ height: 140, borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
                <img src={renderedRoom} alt="Room Visualiser" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', bottom: 6, left: 6 }}>
                  <span className="chip moss" style={{ fontSize: 10 }}>Room Visualiser</span>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'right' }}>
                <div className="tiny muted">Confidence</div>
                <div className="serif" style={{ fontSize: 28, fontWeight: 400, marginTop: 4 }}>{Math.round((display.confidence || 0.86) * 100)}%</div>
              </div>
            )}
          </div>

          {/* Three analysis columns */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1.2fr', gap: 20 }}>

            {/* Detected items */}
            <div className="card">
              <div className="label" style={{ color: 'var(--moss)' }}>What we see</div>
              <div style={{ fontSize: 16, fontWeight: 600, marginTop: 6, marginBottom: 12 }}>Detected items</div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {(display.detected || []).map((d, i) => (
                  <div key={i} className="row between" style={{ padding: '10px 0', borderTop: '1px solid var(--line)', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13 }}>{d.item}</div>
                      <div className="tiny muted" style={{ marginTop: 2 }}>{d.condition} · {d.age}</div>
                    </div>
                    {d.salvage
                      ? <span className="chip moss" style={{ fontSize: 10 }}>Salvage</span>
                      : <span className="chip" style={{ fontSize: 10 }}>Replace</span>}
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 14, padding: 12, background: 'var(--moss-mist)', borderRadius: 6 }}>
                <div style={{ fontSize: 11, color: 'var(--moss-deep)', lineHeight: 1.5 }}>{display.materialEstimate}</div>
              </div>
            </div>

            {/* Upgrades */}
            <div className="card">
              <div className="label" style={{ color: 'var(--moss)' }}>What to upgrade</div>
              <div style={{ fontSize: 16, fontWeight: 600, marginTop: 6, marginBottom: 12 }}>Recommended works</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {(display.upgrades || []).map((u, i) => (
                  <div key={i} style={{
                    padding: 12, border: '1px solid var(--line)', borderRadius: 6,
                    borderLeft: u.priority === 'high' ? '3px solid var(--moss)' : '1px solid var(--line)',
                  }}>
                    <div className="row between">
                      <div style={{ fontSize: 13, fontWeight: 500, flex: 1 }}>{u.what}</div>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--moss-deep)' }}>€{(u.cost || 0).toLocaleString()}</span>
                    </div>
                    <div className="tiny muted" style={{ marginTop: 4, lineHeight: 1.5 }}>{u.why}</div>
                    <div className="tiny" style={{ marginTop: 6, color: 'var(--moss)' }}>-{u.co2}t CO2</div>
                  </div>
                ))}
              </div>
              {(display.circularMatches || []).length > 0 && (
                <div style={{ marginTop: 14, padding: 12, background: 'var(--bg-2)', borderRadius: 6 }}>
                  <div className="tiny muted" style={{ marginBottom: 6 }}>Circular matches near you ({(display.circularMatches || []).length})</div>
                  {(display.circularMatches || []).map((c, i) => (
                    <div key={i} className="row between" style={{ padding: '4px 0', fontSize: 12 }}>
                      <span>{c.material}</span>
                      <span style={{ fontFamily: 'var(--mono)', color: 'var(--moss)' }}>€{c.price} · {c.distance}km</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Subsidies */}
            <div className="card" style={{ background: 'var(--moss-deep)', color: 'var(--bg)', borderColor: 'var(--moss-deep)' }}>
              <div className="label" style={{ color: '#a8c4b3' }}>What the State pays</div>
              <div style={{ fontSize: 16, fontWeight: 600, marginTop: 6, marginBottom: 4 }}>French subsidy match</div>
              <div style={{ fontSize: 11, color: '#a8c4b3', marginBottom: 14 }}>Stackable schemes, pre-filled from your photo.</div>
              <div style={{ padding: '14px 0', borderTop: '1px solid var(--moss-2)', borderBottom: '1px solid var(--moss-2)' }}>
                <div className="tiny" style={{ color: '#a8c4b3' }}>Total works</div>
                <div className="serif" style={{ fontSize: 22, fontWeight: 400 }}>€{(display.policyMatch && display.policyMatch.worksTotal || 0).toLocaleString()}</div>
                <div className="row between" style={{ marginTop: 10 }}>
                  <span className="tiny" style={{ color: '#a8c4b3' }}>Aid stack</span>
                  <span className="serif" style={{ fontSize: 18, color: '#a8c4b3', fontWeight: 400 }}>-€{(display.policyMatch && display.policyMatch.stackedTotal || 0).toLocaleString()}</span>
                </div>
                <div className="row between" style={{ marginTop: 6, paddingTop: 6, borderTop: '1px dashed var(--moss-2)' }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>Out-of-pocket</span>
                  <span className="serif" style={{ fontSize: 22, fontWeight: 400 }}>€{(display.policyMatch && display.policyMatch.outOfPocket || 0).toLocaleString()}</span>
                </div>
              </div>
              <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {(display.policyMatch && display.policyMatch.schemes || []).map((s, i) => (
                  <div key={i} className="row between" style={{ fontSize: 12 }}>
                    <span style={{ color: '#d8e4dd' }}>{s.label}</span>
                    <span style={{ fontFamily: 'var(--mono)' }}>€{(s.amount || 0).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 11, marginTop: 14, color: '#a8c4b3', lineHeight: 1.5 }}>
                68% of eligible French homeowners never claim these. You will not be one of them.
              </div>
            </div>
          </div>

          <div style={{ marginTop: 28, display: 'flex', gap: 10 }}>
            <button className="btn" onClick={() => go('estimate')}>See cost estimate →</button>
            <button className="btn secondary" onClick={() => go('subsidies')}>View all subsidies →</button>
            <button className="btn ghost" onClick={reset}>Re-analyze</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── CostEstimate ─── */
function CostEstimate() {
  const { go } = useRoute();
  const [picked, setPicked] = useState('mid');
  const tier  = D.costTiers.find(t => t.key === picked);
  const total = tier.breakdown.reduce((s, b) => s + b.cost, 0);

  return (
    <div>
      <div className="page-hero">
        <div>
          <div className="label">Step 2 of 3: Homeowner</div>
          <h1>Three ways to renovate, fully costed.</h1>
          <div className="sub">Pick the tier that fits your budget. We show what is reclaimed, embodied carbon, and which subsidies apply.</div>
        </div>
        <div className="tiny muted">Sample: kitchen · 14 m² · Paris 11e</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {D.costTiers.map(t => (
          <div key={t.key} onClick={() => setPicked(t.key)} className="card" style={{
            cursor: 'pointer',
            border: picked === t.key ? '1.5px solid var(--ink)' : '1px solid var(--line)',
            background: picked === t.key ? 'var(--bg)' : 'var(--bg-2)',
            transition: 'all 0.15s',
          }}>
            <div className="row between">
              <div className="label">{t.label}</div>
              {picked === t.key && <span className="chip moss">Selected</span>}
            </div>
            <div className="serif" style={{ fontSize: 30, marginTop: 8, lineHeight: 1, fontWeight: 400 }}>
              €{t.range[0].toLocaleString()}<span style={{ color: 'var(--ink-3)' }}>-</span>{t.range[1].toLocaleString()}
            </div>
            <div className="small muted" style={{ marginTop: 10, minHeight: 40 }}>{t.desc}</div>
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--line)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <div className="tiny muted">Reclaimed</div>
                <div style={{ fontSize: 16, marginTop: 2 }}>{t.recycledPct}%</div>
              </div>
              <div>
                <div className="tiny muted">CO2</div>
                <div style={{ fontSize: 16, marginTop: 2 }}>{t.co2}t</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24, marginTop: 32 }}>
        <div className="card">
          <div className="row between">
            <div className="serif" style={{ fontSize: 22, fontWeight: 400 }}>{tier.label} breakdown</div>
            <div className="tiny muted">Estimated subtotal</div>
          </div>
          <div style={{ marginTop: 14 }}>
            {tier.breakdown.map((b, i) => (
              <div key={i} className="row between" style={{ padding: '12px 0', borderTop: '1px solid var(--line)' }}>
                <div className="row" style={{ gap: 10 }}>
                  {b.recycled && <span className="chip moss" style={{ fontSize: 10 }}>RECLAIMED</span>}
                  <span style={{ fontSize: 13.5 }}>{b.item}</span>
                </div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 13 }}>€{b.cost.toLocaleString()}</div>
              </div>
            ))}
            <div className="row between" style={{ padding: '14px 0 0', borderTop: '1px solid var(--ink)', marginTop: 4 }}>
              <div style={{ fontWeight: 600 }}>Subtotal</div>
              <div className="serif" style={{ fontSize: 22, fontWeight: 400 }}>€{total.toLocaleString()}</div>
            </div>
            <div className="row between" style={{ padding: '6px 0', color: 'var(--moss)' }}>
              <div>Subsidies applied</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 13 }}>-€{tier.subsidies.toLocaleString()}</div>
            </div>
            <div className="row between" style={{ padding: '8px 0 0', borderTop: '1px solid var(--line-2)', marginTop: 8 }}>
              <div style={{ fontWeight: 600 }}>Net cost</div>
              <div className="serif" style={{ fontSize: 26, fontWeight: 400 }}>€{(total - tier.subsidies).toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div className="card" style={{ background: 'var(--bg-2)' }}>
          <div className="label">Sustainability</div>
          <div className="serif" style={{ fontSize: 22, marginTop: 6, fontWeight: 400 }}>Your impact, this scenario.</div>
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
              <div className="tiny muted">Embodied CO2</div>
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

/* ─── Subsidies ─── */
function Subsidies() {
  const { go } = useRoute();
  const [income, setIncome] = useState('blue');
  const [year,   setYear]   = useState('1985');

  const totalMatched = D.subsidies.reduce((s, x) => s + Math.round(x.typical * x.match), 0);

  return (
    <div>
      <div className="page-hero">
        <div>
          <div className="label">Step 3 of 3: Homeowner</div>
          <h1>Stop leaving money on the table.</h1>
          <div className="sub">68% of eligible French homeowners never claim subsidies they qualify for. We pre-fill the eligibility checks from your photo analysis.</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 24 }}>
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
                <option value="blue">40,000 or less, Bleu</option>
                <option value="yellow">€40k - €60k, Jaune</option>
                <option value="purple">€60k - €80k, Violet</option>
                <option value="pink">80,000 or more, Rose</option>
              </select>
            </div>
            <div className="field">
              <div className="field-label">Household size</div>
              <input className="txt" defaultValue="3" />
            </div>
            <div className="field">
              <div className="field-label">Region</div>
              <select className="txt" defaultValue="idf">
                <option value="idf">Ile-de-France</option>
                <option value="ara">Auvergne-Rhone-Alpes</option>
                <option value="paca">Provence-Alpes-Cote d'Azur</option>
                <option value="naq">Nouvelle-Aquitaine</option>
              </select>
            </div>
          </div>
          <div style={{ height: 1, background: 'var(--line)', margin: '20px 0' }} />
          <div className="tiny muted">Pre-filled from your kitchen photo analysis. Edit any field, matches update live.</div>
        </div>

        <div>
          <div className="row between" style={{ marginBottom: 14 }}>
            <div className="label">Matched · {D.subsidies.length} programs</div>
            <div className="serif" style={{ fontSize: 22, fontWeight: 400 }}>
              Up to €{totalMatched.toLocaleString()}<span className="muted small" style={{ marginLeft: 6 }}>combined</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {D.subsidies.map(s => (
              <div key={s.id} className="card" style={{ padding: 18 }}>
                <div className="row between" style={{ alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div className="row" style={{ gap: 8 }}>
                      <span style={{ fontSize: 17, fontWeight: 600 }}>{s.name}</span>
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
            <button className="btn ghost" onClick={() => go('estimate')}>Back to estimate</button>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { PhotoAnalyze, CostEstimate, Subsidies });
