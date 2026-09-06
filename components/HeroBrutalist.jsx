// Variação B: Dark Tech Brutalista
// Preto puro + verde terminal + mono-type. Tom hacker / raw / provocador.

function HeroBrutalist() {
  return (
    <div style={brutalistStyles.root}>
      {/* Terminal top bar */}
      <div style={brutalistStyles.terminalBar}>
        <div style={brutalistStyles.terminalDots}>
          <span style={{...brutalistStyles.dot, background: '#ff5f56'}}></span>
          <span style={{...brutalistStyles.dot, background: '#ffbd2e'}}></span>
          <span style={{...brutalistStyles.dot, background: '#27c93f'}}></span>
        </div>
        <div style={brutalistStyles.terminalPath}>~/alexandre-boyago/codex-360 | bash</div>
        <div style={brutalistStyles.terminalStatus}>● LIVE</div>
      </div>

      <div style={brutalistStyles.body}>
        {/* Left column: terminal text */}
        <div style={brutalistStyles.leftCol}>
          <div style={brutalistStyles.promptLine}>
            <span style={brutalistStyles.promptUser}>alexandre@boyago</span>
            <span style={brutalistStyles.promptSep}>:</span>
            <span style={brutalistStyles.promptPath}>~/dev-360</span>
            <span style={brutalistStyles.promptSep}>$</span>
            <span style={brutalistStyles.promptCmd}> rm -rf ./curso-antigo && git init codex-360</span>
          </div>

          <div style={brutalistStyles.commentBlock}>
            <div style={brutalistStyles.commentLine}>// MANIFESTO.md</div>
            <div style={brutalistStyles.commentLine}>// última atualização: hoje</div>
          </div>

          <h1 style={brutalistStyles.headline}>
            <span style={brutalistStyles.headlineLine}>PARE_DE_CODAR.sh</span>
            <span style={brutalistStyles.headlineLine}>
              <span style={brutalistStyles.arrow}>&gt;</span> <span style={brutalistStyles.green}>START_BUILDING</span>
            </span>
          </h1>

          <div style={brutalistStyles.asciiBox}>
            <div style={brutalistStyles.asciiTitle}>[ DIAGNÓSTICO ]</div>
            <div style={brutalistStyles.asciiRow}>
              <span style={brutalistStyles.red}>✗</span> digitar código linha-por-linha
              <span style={brutalistStyles.redTag}> OBSOLETO</span>
            </div>
            <div style={brutalistStyles.asciiRow}>
              <span style={brutalistStyles.red}>✗</span> bootcamps de 12 meses
              <span style={brutalistStyles.redTag}> OBSOLETO</span>
            </div>
            <div style={brutalistStyles.asciiRow}>
              <span style={brutalistStyles.green2}>✓</span> <span style={brutalistStyles.white}>full-stack c/ Claude + Antigravity + VPS</span>
              <span style={brutalistStyles.greenTag}> 2026</span>
            </div>
          </div>

          <div style={brutalistStyles.ctaBlock}>
            <button style={brutalistStyles.cta}>
              <span style={brutalistStyles.ctaArrow}>{'> '}</span>
              JOIN_WAITLIST.exe
              <span style={brutalistStyles.ctaBlink}>_</span>
            </button>
            <div style={brutalistStyles.ctaMeta}>
              [ proximas_vagas: limitadas ] [ preco: TBA ]
            </div>
          </div>
        </div>

        {/* Right column: photo card */}
        <div style={brutalistStyles.rightCol}>
          <div style={brutalistStyles.photoCard}>
            <div style={brutalistStyles.photoHeader}>
              <span>profile.jpg</span>
              <span>420x520</span>
            </div>
            <div style={brutalistStyles.photoWrap}>
              <img src="assets/alexandre.png" alt="Alexandre Boyago" style={brutalistStyles.photo} />
              <div style={brutalistStyles.photoOverlay}></div>
              <div style={brutalistStyles.photoCorner1}></div>
              <div style={brutalistStyles.photoCorner2}></div>
              <div style={brutalistStyles.photoCorner3}></div>
              <div style={brutalistStyles.photoCorner4}></div>
            </div>
            <div style={brutalistStyles.photoMeta}>
              <div style={brutalistStyles.metaRow}><span style={brutalistStyles.metaKey}>NAME</span><span style={brutalistStyles.metaVal}>ALEXANDRE BOYAGO</span></div>
              <div style={brutalistStyles.metaRow}><span style={brutalistStyles.metaKey}>ROLE</span><span style={brutalistStyles.metaVal}>FOUNDER · DEV_360</span></div>
              <div style={brutalistStyles.metaRow}><span style={brutalistStyles.metaKey}>STUDENTS</span><span style={brutalistStyles.metaVal}>9500+</span></div>
              <div style={brutalistStyles.metaRow}><span style={brutalistStyles.metaKey}>PRODUTOS</span><span style={brutalistStyles.metaVal}>7_NO_AR</span></div>
              <div style={brutalistStyles.metaRow}><span style={brutalistStyles.metaKey}>STATUS</span><span style={{...brutalistStyles.metaVal, color: '#00ff88'}}>●_ACTIVE</span></div>
            </div>
          </div>

          <div style={brutalistStyles.sidebar}>
            <div style={brutalistStyles.sidebarTitle}>// STACK_2026</div>
            {['claude-code', 'antigravity', 'gpt-5', 'gemini', 'claude-design', 'vps'].map((t, i) => (
              <div key={i} style={brutalistStyles.stackItem}>
                <span style={brutalistStyles.stackBullet}>▪</span> {t}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom status bar */}
      <div style={brutalistStyles.statusBar}>
        <span>[NORMAL]</span>
        <span>codex-360.md</span>
        <span>100%</span>
        <span>Ln 1, Col 1</span>
        <span>UTF-8</span>
        <span style={{color: '#00ff88'}}>● FOMO_ON</span>
      </div>
    </div>
  );
}

const brutalistStyles = {
  root: {
    width: '100%', height: '100%',
    background: '#0a0a0a',
    color: '#e0e0e0',
    fontFamily: '"JetBrains Mono", "SF Mono", Menlo, monospace',
    display: 'flex', flexDirection: 'column',
    overflow: 'hidden',
    fontSize: 14,
  },
  terminalBar: {
    display: 'flex', alignItems: 'center',
    background: '#151515',
    borderBottom: '1px solid #222',
    padding: '10px 16px',
    fontSize: 12,
  },
  terminalDots: { display: 'flex', gap: 8 },
  dot: { width: 12, height: 12, borderRadius: '50%', display: 'inline-block' },
  terminalPath: { flex: 1, textAlign: 'center', color: '#888' },
  terminalStatus: { color: '#00ff88', fontSize: 11, letterSpacing: '0.1em' },
  body: {
    flex: 1,
    display: 'grid', gridTemplateColumns: '1.3fr 1fr',
    padding: '36px 40px 20px',
    gap: 48,
  },
  leftCol: { display: 'flex', flexDirection: 'column', gap: 22 },
  promptLine: { fontSize: 13, lineHeight: 1.4 },
  promptUser: { color: '#00ff88' },
  promptSep: { color: '#666' },
  promptPath: { color: '#4a9eff' },
  promptCmd: { color: '#e0e0e0' },
  commentBlock: { fontSize: 13, color: '#555', lineHeight: 1.5 },
  commentLine: {},
  headline: {
    fontFamily: '"JetBrains Mono", monospace',
    fontWeight: 700, fontSize: 64, lineHeight: 1.02,
    letterSpacing: -2,
    margin: 0,
    display: 'flex', flexDirection: 'column', gap: 4,
  },
  headlineLine: { display: 'block' },
  arrow: { color: '#00ff88' },
  green: { color: '#00ff88' },
  red: { color: '#ff4444' },
  green2: { color: '#00ff88' },
  white: { color: '#fff', fontWeight: 600 },
  asciiBox: {
    border: '1px solid #2a2a2a',
    padding: '16px 20px',
    fontSize: 13.5,
    lineHeight: 1.9,
    background: '#0f0f0f',
  },
  asciiTitle: { color: '#888', fontSize: 11, letterSpacing: '0.2em', marginBottom: 10 },
  asciiRow: { display: 'flex', alignItems: 'center', gap: 10 },
  redTag: {
    marginLeft: 'auto',
    color: '#ff4444', fontSize: 10, letterSpacing: '0.15em',
    padding: '2px 6px', border: '1px solid #441414',
  },
  greenTag: {
    marginLeft: 'auto',
    color: '#00ff88', fontSize: 10, letterSpacing: '0.15em',
    padding: '2px 6px', border: '1px solid #144414',
  },
  ctaBlock: { marginTop: 8 },
  cta: {
    background: '#00ff88', color: '#0a0a0a',
    border: 'none', padding: '18px 28px',
    fontSize: 15, fontWeight: 700,
    fontFamily: '"JetBrains Mono", monospace',
    cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', gap: 6,
    letterSpacing: '-0.02em',
  },
  ctaArrow: { fontSize: 15 },
  ctaBlink: { animation: 'blink 1s step-end infinite' },
  ctaMeta: { marginTop: 10, fontSize: 11, color: '#666', letterSpacing: '0.08em' },
  rightCol: { display: 'flex', flexDirection: 'column', gap: 16 },
  photoCard: {
    border: '1px solid #2a2a2a', background: '#0f0f0f',
    display: 'flex', flexDirection: 'column',
  },
  photoHeader: {
    padding: '8px 14px',
    borderBottom: '1px solid #2a2a2a',
    fontSize: 11, color: '#888',
    display: 'flex', justifyContent: 'space-between',
    letterSpacing: '0.05em',
  },
  photoWrap: { position: 'relative', aspectRatio: '1/1.05', overflow: 'hidden' },
  photo: {
    width: '100%', height: '100%', objectFit: 'cover',
    filter: 'contrast(1.1) saturate(0.5) hue-rotate(80deg) brightness(0.85)',
    mixBlendMode: 'screen',
  },
  photoOverlay: {
    position: 'absolute', inset: 0,
    background: 'repeating-linear-gradient(0deg, rgba(0,255,136,0.04) 0px, rgba(0,255,136,0.04) 1px, transparent 1px, transparent 3px)',
    pointerEvents: 'none',
  },
  photoCorner1: { position: 'absolute', top: 8, left: 8, width: 14, height: 14, borderTop: '2px solid #00ff88', borderLeft: '2px solid #00ff88' },
  photoCorner2: { position: 'absolute', top: 8, right: 8, width: 14, height: 14, borderTop: '2px solid #00ff88', borderRight: '2px solid #00ff88' },
  photoCorner3: { position: 'absolute', bottom: 8, left: 8, width: 14, height: 14, borderBottom: '2px solid #00ff88', borderLeft: '2px solid #00ff88' },
  photoCorner4: { position: 'absolute', bottom: 8, right: 8, width: 14, height: 14, borderBottom: '2px solid #00ff88', borderRight: '2px solid #00ff88' },
  photoMeta: {
    padding: '12px 14px', fontSize: 11,
    borderTop: '1px solid #2a2a2a',
    display: 'flex', flexDirection: 'column', gap: 4,
  },
  metaRow: { display: 'flex', gap: 12 },
  metaKey: { color: '#666', width: 78, letterSpacing: '0.06em' },
  metaVal: { color: '#e0e0e0' },
  sidebar: {
    border: '1px solid #2a2a2a',
    padding: '12px 14px',
    background: '#0f0f0f',
    fontSize: 12.5,
    lineHeight: 1.8,
  },
  sidebarTitle: { color: '#555', fontSize: 11, marginBottom: 4 },
  stackItem: { color: '#e0e0e0' },
  stackBullet: { color: '#00ff88', marginRight: 8 },
  statusBar: {
    background: '#00ff88', color: '#0a0a0a',
    padding: '6px 16px',
    fontSize: 11, fontWeight: 600,
    display: 'flex', gap: 20,
    letterSpacing: '0.08em',
  },
};

Object.assign(window, { HeroBrutalist });
