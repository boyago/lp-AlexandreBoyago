// Variação A: Editorial Executivo
// Preto profundo + azul-marinho + accent dourado, serifa display pesada.
// Tom: Wall Street Journal encontra AI.

function HeroEditorial() {
  return (
    <div style={editorialStyles.root}>
      {/* Top bar */}
      <div style={editorialStyles.topbar}>
        <div style={editorialStyles.brand}>ALEXANDRE BOYAGO</div>
        <div style={editorialStyles.topbarRight}>
          <span style={editorialStyles.topbarItem}>CODEX 360</span>
          <span style={editorialStyles.topbarDot}>·</span>
          <span style={editorialStyles.topbarItem}>EDIÇÃO 2026</span>
          <span style={editorialStyles.topbarDot}>·</span>
          <span style={editorialStyles.topbarItem}>LISTA DE ESPERA ABERTA</span>
        </div>
      </div>

      {/* Thin gold divider */}
      <div style={editorialStyles.divider}>
        <span style={editorialStyles.kicker}>MANIFESTO Nº 01 | A ERA DO CÓDIGO ACABOU</span>
        <span style={editorialStyles.kickerRight}>POR A. BOYAGO</span>
      </div>

      {/* Hero main */}
      <div style={editorialStyles.hero}>
        <div style={editorialStyles.left}>
          <div style={editorialStyles.eyebrow}>
            <span style={editorialStyles.eyebrowDot}></span>
            LANÇAMENTO · DEZEMBRO DE 2026
          </div>

          <h1 style={editorialStyles.headline}>
            O curso que <em style={editorialStyles.em}>te ensinou</em>
            <br />
            a programar <span style={editorialStyles.gold}>não serve mais.</span>
          </h1>

          <p style={editorialStyles.sub}>
            Enquanto 9.500 alunos ainda digitam código linha por linha,
            construí uma nova versão do <strong>Dev 360</strong> para a era em que
            apps inteiros nascem em uma tarde com <span style={editorialStyles.bold}>Claude, Antigravity, GPT-5 e Gemini</span>.
          </p>

          <div style={editorialStyles.ctaRow}>
            <button style={editorialStyles.ctaPrimary}>
              ENTRAR NA LISTA DE ESPERA
              <span style={editorialStyles.ctaArrow}>→</span>
            </button>
            <div style={editorialStyles.ctaNote}>
              <div style={editorialStyles.ctaNoteDot}></div>
              Vagas limitadas · Sem pré-venda pública
            </div>
          </div>

          <div style={editorialStyles.proofRow}>
            <div style={editorialStyles.proofItem}>
              <div style={editorialStyles.proofNum}>9.500+</div>
              <div style={editorialStyles.proofLabel}>Alunos formados</div>
            </div>
            <div style={editorialStyles.proofDivider}></div>
            <div style={editorialStyles.proofItem}>
              <div style={editorialStyles.proofNum}>7</div>
              <div style={editorialStyles.proofLabel}>Produtos criados<br/>no ar, em produção</div>
            </div>
            <div style={editorialStyles.proofDivider}></div>
            <div style={editorialStyles.proofItem}>
              <div style={editorialStyles.proofNum}>EaD</div>
              <div style={editorialStyles.proofLabel}>Plataforma própria<br/>(tipo Hotmart)</div>
            </div>
          </div>
        </div>

        <div style={editorialStyles.right}>
          <div style={editorialStyles.photoFrame}>
            <img src="assets/alexandre.png" alt="Alexandre Boyago" style={editorialStyles.photo} />
            <div style={editorialStyles.photoCaption}>
              <div style={editorialStyles.photoName}>ALEXANDRE BOYAGO</div>
              <div style={editorialStyles.photoRole}>FUNDADOR · DEV 360 · CODEX 360</div>
            </div>
            <div style={editorialStyles.photoNumber}>01</div>
          </div>
        </div>
      </div>

      {/* Bottom ticker */}
      <div style={editorialStyles.ticker}>
        <span style={editorialStyles.tickerItem}>● CLAUDE CODE</span>
        <span style={editorialStyles.tickerItem}>● ANTIGRAVITY</span>
        <span style={editorialStyles.tickerItem}>● GPT-5</span>
        <span style={editorialStyles.tickerItem}>● GEMINI</span>
        <span style={editorialStyles.tickerItem}>● CLAUDE DESIGN</span>
        <span style={editorialStyles.tickerItem}>● VPS · DEPLOY</span>
        <span style={editorialStyles.tickerItem}>● FULL STACK C/ IA</span>
      </div>
    </div>
  );
}

const editorialStyles = {
  root: {
    width: '100%', height: '100%',
    background: 'linear-gradient(180deg, #0a1220 0%, #050913 100%)',
    color: '#f5f1e8',
    fontFamily: '"Inter", system-ui, sans-serif',
    display: 'flex', flexDirection: 'column',
    overflow: 'hidden',
    position: 'relative',
  },
  topbar: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '20px 48px',
    borderBottom: '1px solid rgba(200,160,80,0.15)',
    fontSize: 11, letterSpacing: '0.18em',
  },
  brand: {
    fontFamily: '"Playfair Display", Georgia, serif',
    fontSize: 17, letterSpacing: '0.12em', fontWeight: 700,
    color: '#f5f1e8',
  },
  topbarRight: { display: 'flex', gap: 14, alignItems: 'center', color: 'rgba(245,241,232,0.55)' },
  topbarItem: {},
  topbarDot: { opacity: 0.4 },
  divider: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '10px 48px',
    background: '#c9a34a',
    color: '#0a1220',
    fontSize: 10.5, letterSpacing: '0.22em', fontWeight: 700,
    fontFamily: '"Inter", sans-serif',
  },
  kicker: {},
  kickerRight: { opacity: 0.7 },
  hero: {
    flex: 1, display: 'grid', gridTemplateColumns: '1.15fr 1fr',
    padding: '56px 48px 40px',
    gap: 56, alignItems: 'center',
  },
  left: { display: 'flex', flexDirection: 'column', gap: 28 },
  eyebrow: {
    display: 'inline-flex', alignItems: 'center', gap: 10,
    fontSize: 11, letterSpacing: '0.25em', color: '#c9a34a', fontWeight: 600,
  },
  eyebrowDot: {
    width: 8, height: 8, borderRadius: '50%', background: '#c9a34a',
    boxShadow: '0 0 12px #c9a34a',
  },
  headline: {
    fontFamily: '"Playfair Display", "Times New Roman", serif',
    fontSize: 76, lineHeight: 0.96, fontWeight: 800,
    letterSpacing: -1.5, margin: 0,
    color: '#f5f1e8',
  },
  em: { fontStyle: 'italic', fontWeight: 400, color: 'rgba(245,241,232,0.65)' },
  gold: { color: '#c9a34a', fontStyle: 'italic', fontWeight: 400 },
  sub: {
    fontSize: 17, lineHeight: 1.55, color: 'rgba(245,241,232,0.72)',
    maxWidth: 540, margin: 0, fontWeight: 400,
  },
  bold: { color: '#f5f1e8', fontWeight: 600 },
  ctaRow: { display: 'flex', alignItems: 'center', gap: 24, marginTop: 8 },
  ctaPrimary: {
    background: '#c9a34a', color: '#0a1220',
    border: 'none', padding: '18px 32px',
    fontSize: 13, letterSpacing: '0.18em', fontWeight: 700,
    cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 12,
    fontFamily: '"Inter", sans-serif',
  },
  ctaArrow: { fontSize: 18 },
  ctaNote: {
    fontSize: 12, color: 'rgba(245,241,232,0.5)',
    display: 'flex', alignItems: 'center', gap: 8,
    letterSpacing: '0.06em',
  },
  ctaNoteDot: { width: 6, height: 6, borderRadius: '50%', background: '#e04e4e' },
  proofRow: {
    display: 'flex', gap: 28, alignItems: 'center',
    paddingTop: 28, borderTop: '1px solid rgba(245,241,232,0.1)',
    marginTop: 8,
  },
  proofItem: { display: 'flex', flexDirection: 'column', gap: 4 },
  proofNum: {
    fontFamily: '"Playfair Display", serif',
    fontSize: 36, fontWeight: 700, color: '#c9a34a', lineHeight: 1,
  },
  proofLabel: {
    fontSize: 11, letterSpacing: '0.12em', color: 'rgba(245,241,232,0.55)',
    textTransform: 'uppercase', lineHeight: 1.4,
  },
  proofDivider: { width: 1, height: 40, background: 'rgba(245,241,232,0.15)' },
  right: {
    position: 'relative', height: '100%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  photoFrame: {
    position: 'relative',
    width: 420, height: 520,
    background: 'linear-gradient(180deg, #1a2340 0%, #0a1220 100%)',
    border: '1px solid rgba(201,163,74,0.3)',
    overflow: 'hidden',
  },
  photo: {
    width: '100%', height: '100%', objectFit: 'cover',
    filter: 'contrast(1.05) saturate(0.95)',
  },
  photoCaption: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: '20px 24px',
    background: 'linear-gradient(180deg, rgba(10,18,32,0) 0%, rgba(10,18,32,0.95) 60%)',
    color: '#f5f1e8',
  },
  photoName: {
    fontFamily: '"Playfair Display", serif',
    fontSize: 18, fontWeight: 700, letterSpacing: '0.08em',
  },
  photoRole: {
    fontSize: 10, letterSpacing: '0.22em', color: '#c9a34a',
    marginTop: 4, fontWeight: 600,
  },
  photoNumber: {
    position: 'absolute', top: 20, right: 24,
    fontFamily: '"Playfair Display", serif',
    fontSize: 56, fontWeight: 800, color: '#c9a34a',
    lineHeight: 1, opacity: 0.9,
  },
  ticker: {
    padding: '16px 48px',
    borderTop: '1px solid rgba(245,241,232,0.1)',
    display: 'flex', gap: 32,
    fontSize: 11, letterSpacing: '0.2em', fontWeight: 600,
    color: 'rgba(201,163,74,0.8)',
    overflow: 'hidden',
  },
  tickerItem: { flexShrink: 0 },
};

Object.assign(window, { HeroEditorial });
