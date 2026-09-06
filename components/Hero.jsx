// Hero: versão refinada da direção B para a landing completa.
// Foto nova (eu.png) tem fundo branco+glow verde → integra PERFEITAMENTE
// com o tema terminal-hacker. Removi os filtros hue-rotate/mix-blend.

function Hero() {
  const [cmd, setCmd] = React.useState('');
  const full = 'rm -rf ./curso-antigo && git init codex-360';
  React.useEffect(() => {
    let i = 0;
    let timer;
    const tick = () => {
      if (i < full.length) {
        i++;
        setCmd(full.slice(0, i));
        timer = setTimeout(tick, 55 + Math.random() * 50);
      }
    };
    tick();
    return () => clearTimeout(timer);
  }, []);

  return (
    <section style={heroStyles.root} data-screen-label="01 Hero">
      {/* Terminal top bar */}
      <div style={heroStyles.terminalBar}>
        <div style={heroStyles.terminalDots}>
          <span style={{...heroStyles.dot, background: '#ff5f56'}}></span>
          <span style={{...heroStyles.dot, background: '#ffbd2e'}}></span>
          <span style={{...heroStyles.dot, background: '#27c93f'}}></span>
        </div>
        <div style={heroStyles.terminalPath}>~/alexandre-boyago/codex-360 | bash | 160×48</div>
        <div style={heroStyles.terminalStatus}>● LIVE · LISTA ABERTA</div>
      </div>

      <div style={heroStyles.body}>
        <div style={heroStyles.leftCol}>
          <div style={heroStyles.promptLine}>
            <span style={heroStyles.promptUser}>alexandre@boyago</span>
            <span style={heroStyles.promptSep}>:</span>
            <span style={heroStyles.promptPath}>~/dev-360</span>
            <span style={heroStyles.promptSep}>$</span>
            <span style={heroStyles.promptCmd}> {cmd}<span style={heroStyles.blink}>▊</span></span>
          </div>

          <div style={heroStyles.commentBlock}>
            <div>// MANIFESTO.md | edição 2026</div>
            <div>// autor: alexandre boyago · 9.500+ alunos · 7 produtos no ar</div>
          </div>

          <h1 style={heroStyles.headline}>
            <span style={heroStyles.headlineLine}>PARE_DE_CODAR.sh</span>
            <span style={heroStyles.headlineLine}>
              <span style={heroStyles.arrow}>&gt;</span>&nbsp;<span style={heroStyles.green}>START_BUILDING</span>
            </span>
          </h1>

          <ClaudeMascot />

          <p style={heroStyles.subcopy}>
            9.500 alunos me pagaram pra ensinar a <span style={heroStyles.strike}>programar linha por linha</span>.
            <br/>
            Em 2026, isso virou obsoleto. Então <span style={heroStyles.white}>queimei o curso antigo</span>
            &nbsp;e construí o <span style={heroStyles.green}>CODEX 360</span>,
            full-stack com <span style={heroStyles.white}>Claude, Antigravity, GPT-5, Gemini e VPS.</span>
          </p>

          <div style={heroStyles.asciiBox}>
            <div style={heroStyles.asciiTitle}>[ DIAGNÓSTICO ]</div>
            <div style={heroStyles.asciiRow}>
              <span style={heroStyles.red}>✗</span> digitar código linha-por-linha
              <span style={heroStyles.redTag}>OBSOLETO</span>
            </div>
            <div style={heroStyles.asciiRow}>
              <span style={heroStyles.red}>✗</span> bootcamps de 12 meses
              <span style={heroStyles.redTag}>OBSOLETO</span>
            </div>
            <div style={heroStyles.asciiRow}>
              <span style={heroStyles.green2}>✓</span>&nbsp;<span style={heroStyles.white}>full-stack c/ IA em semanas</span>
              <span style={heroStyles.greenTag}>2026</span>
            </div>
          </div>

          <div style={heroStyles.ctaBlock}>
            <button style={heroStyles.cta} onClick={() => document.getElementById('waitlist')?.scrollIntoView({behavior:'smooth'})}>
              <span style={heroStyles.ctaArrow}>{'> '}</span>
              JOIN_WAITLIST.exe
              <span style={heroStyles.blink}>_</span>
            </button>
            <div style={heroStyles.ctaMeta}>
              [ vagas: limitadas ] [ formato: turma fechada ] [ lives: diárias ]
            </div>
          </div>
        </div>

        {/* Right column: photo card */}
        <div style={heroStyles.rightCol}>
          <div style={heroStyles.photoCard}>
            <div style={heroStyles.photoHeader}>
              <span>boyago.jpg</span>
              <span>640x640 · 2026</span>
            </div>
            <div style={heroStyles.photoWrap}>
              <img src="assets/alexandre.png" alt="Alexandre Boyago" style={heroStyles.photo} />
              <div style={heroStyles.photoOverlay}></div>
              <div style={heroStyles.photoCorner1}></div>
              <div style={heroStyles.photoCorner2}></div>
              <div style={heroStyles.photoCorner3}></div>
              <div style={heroStyles.photoCorner4}></div>
            </div>
            <div style={heroStyles.photoMeta}>
              <div style={heroStyles.metaRow}><span style={heroStyles.metaKey}>NAME</span><span style={heroStyles.metaVal}>ALEXANDRE BOYAGO</span></div>
              <div style={heroStyles.metaRow}><span style={heroStyles.metaKey}>ROLE</span><span style={heroStyles.metaVal}>FOUNDER · DEV_360</span></div>
              <div style={heroStyles.metaRow}><span style={heroStyles.metaKey}>STUDENTS</span><span style={heroStyles.metaVal}>9500+</span></div>
              <div style={heroStyles.metaRow}><span style={heroStyles.metaKey}>PRODUTOS</span><span style={heroStyles.metaVal}>7_NO_AR</span></div>
              <div style={heroStyles.metaRow}><span style={heroStyles.metaKey}>STATUS</span><span style={{...heroStyles.metaVal, color: '#00ff88'}}>●_ACTIVE</span></div>
            </div>
          </div>

          <div style={heroStyles.sidebar}>
            <div style={heroStyles.sidebarTitle}>// STACK_2026.json</div>
            {[
              ['claude-code', 'v2.1'],
              ['antigravity', 'google'],
              ['gpt-5', 'openai'],
              ['gemini', 'google'],
              ['claude-design', 'artifacts'],
              ['vps-deploy', 'self-hosted'],
            ].map(([k, v], i) => (
              <div key={i} style={heroStyles.stackItem}>
                <span style={heroStyles.stackBullet}>▪</span>
                <span style={{flex: 1}}>{k}</span>
                <span style={{color: '#666', fontSize: 11}}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const heroStyles = {
  root: {
    minHeight: '100vh',
    background: '#0a0a0a',
    color: '#e0e0e0',
    display: 'flex', flexDirection: 'column',
  },
  terminalBar: {
    display: 'flex', alignItems: 'center',
    background: '#151515',
    borderBottom: '1px solid #222',
    padding: '12px 20px',
    fontSize: 12,
    position: 'sticky', top: 0, zIndex: 50,
  },
  terminalDots: { display: 'flex', gap: 8 },
  dot: { width: 12, height: 12, borderRadius: '50%', display: 'inline-block' },
  terminalPath: { flex: 1, textAlign: 'center', color: '#888' },
  terminalStatus: { color: '#00ff88', fontSize: 11, letterSpacing: '0.1em' },
  body: {
    flex: 1,
    display: 'grid', gridTemplateColumns: '1.3fr 1fr',
    padding: '56px 60px 80px',
    gap: 64,
    maxWidth: 1440, margin: '0 auto', width: '100%',
    boxSizing: 'border-box',
  },
  leftCol: { display: 'flex', flexDirection: 'column', gap: 28 },
  promptLine: { fontSize: 14, lineHeight: 1.4 },
  promptUser: { color: '#00ff88' },
  promptSep: { color: '#666' },
  promptPath: { color: '#4a9eff' },
  promptCmd: { color: '#e0e0e0' },
  blink: { animation: 'blink 1s step-end infinite' },
  commentBlock: { fontSize: 13, color: '#555', lineHeight: 1.6 },
  headline: {
    fontFamily: '"JetBrains Mono", monospace',
    fontWeight: 700, fontSize: 'clamp(44px, 6vw, 88px)', lineHeight: 1.02,
    letterSpacing: -2.5,
    margin: 0,
    display: 'flex', flexDirection: 'column', gap: 4,
  },
  headlineLine: { display: 'block' },
  arrow: { color: '#00ff88' },
  green: { color: '#00ff88' },
  green2: { color: '#00ff88' },
  red: { color: '#ff4444' },
  strike: { textDecoration: 'line-through', color: '#666' },
  white: { color: '#fff', fontWeight: 600 },
  subcopy: {
    fontSize: 19, lineHeight: 1.65, color: '#a0a0a0',
    maxWidth: 'none', margin: 0,
  },
  asciiBox: {
    border: '1px solid #2a2a2a',
    padding: '18px 22px',
    fontSize: 14,
    lineHeight: 2,
    background: '#0f0f0f',
  },
  asciiTitle: { color: '#888', fontSize: 11, letterSpacing: '0.2em', marginBottom: 10 },
  asciiRow: { display: 'flex', alignItems: 'center', gap: 10 },
  redTag: {
    marginLeft: 'auto',
    color: '#ff4444', fontSize: 10, letterSpacing: '0.15em',
    padding: '2px 8px', border: '1px solid #441414',
  },
  greenTag: {
    marginLeft: 'auto',
    color: '#00ff88', fontSize: 10, letterSpacing: '0.15em',
    padding: '2px 8px', border: '1px solid #144414',
  },
  ctaBlock: { marginTop: 8 },
  cta: {
    background: '#00ff88', color: '#0a0a0a',
    border: 'none', padding: '20px 32px',
    fontSize: 16, fontWeight: 700,
    fontFamily: '"JetBrains Mono", monospace',
    cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', gap: 6,
    letterSpacing: '-0.02em',
    transition: 'transform .15s, box-shadow .15s',
    boxShadow: '0 0 30px rgba(0,255,136,0.3)',
  },
  ctaArrow: { fontSize: 16 },
  ctaMeta: { marginTop: 12, fontSize: 12, color: '#666', letterSpacing: '0.06em' },
  rightCol: { display: 'flex', flexDirection: 'column', gap: 16 },
  photoCard: {
    border: '1px solid #2a2a2a', background: '#0f0f0f',
    display: 'flex', flexDirection: 'column',
    position: 'relative',
  },
  photoHeader: {
    padding: '10px 16px',
    borderBottom: '1px solid #2a2a2a',
    fontSize: 11, color: '#888',
    display: 'flex', justifyContent: 'space-between',
    letterSpacing: '0.05em',
  },
  photoWrap: {
    position: 'relative',
    aspectRatio: '1/1',
    overflow: 'hidden',
    background: '#000',
  },
  photo: {
    width: '100%', height: '100%', objectFit: 'cover',
  },
  photoOverlay: {
    position: 'absolute', inset: 0,
    background: 'repeating-linear-gradient(0deg, rgba(0,255,136,0.05) 0px, rgba(0,255,136,0.05) 1px, transparent 1px, transparent 3px)',
    pointerEvents: 'none',
  },
  photoCorner1: { position: 'absolute', top: 10, left: 10, width: 16, height: 16, borderTop: '2px solid #00ff88', borderLeft: '2px solid #00ff88' },
  photoCorner2: { position: 'absolute', top: 10, right: 10, width: 16, height: 16, borderTop: '2px solid #00ff88', borderRight: '2px solid #00ff88' },
  photoCorner3: { position: 'absolute', bottom: 10, left: 10, width: 16, height: 16, borderBottom: '2px solid #00ff88', borderLeft: '2px solid #00ff88' },
  photoCorner4: { position: 'absolute', bottom: 10, right: 10, width: 16, height: 16, borderBottom: '2px solid #00ff88', borderRight: '2px solid #00ff88' },
  photoMeta: {
    padding: '14px 16px', fontSize: 11,
    borderTop: '1px solid #2a2a2a',
    display: 'flex', flexDirection: 'column', gap: 5,
  },
  metaRow: { display: 'flex', gap: 12 },
  metaKey: { color: '#666', width: 82, letterSpacing: '0.06em' },
  metaVal: { color: '#e0e0e0' },
  sidebar: {
    border: '1px solid #2a2a2a',
    padding: '14px 16px',
    background: '#0f0f0f',
    fontSize: 13,
    lineHeight: 2,
  },
  sidebarTitle: { color: '#555', fontSize: 11, marginBottom: 6 },
  stackItem: { color: '#e0e0e0', display: 'flex', gap: 8, alignItems: 'center' },
  stackBullet: { color: '#00ff88' },
};

Object.assign(window, { Hero });
