// Variação C — Editorial Maximalista / Manifesto Punk
// Off-white + preto + vermelho-sangue. Tipografia GIGANTE quebrando o grid.

function HeroManifesto() {
  return (
    <div style={manifestoStyles.root}>
      {/* Top newspaper-style bar */}
      <div style={manifestoStyles.top}>
        <div style={manifestoStyles.topLeft}>
          <span style={manifestoStyles.topEdition}>Nº 001</span>
          <span style={manifestoStyles.topSep}>/</span>
          <span>EDIÇÃO EXTRA</span>
          <span style={manifestoStyles.topSep}>/</span>
          <span>BRASIL</span>
        </div>
        <div style={manifestoStyles.topBrand}>BOYAGO TIMES</div>
        <div style={manifestoStyles.topRight}>
          <span style={manifestoStyles.topRed}>● AO VIVO</span>
          <span style={manifestoStyles.topSep}>/</span>
          <span>DEZ · 2026</span>
        </div>
      </div>

      {/* Red banner */}
      <div style={manifestoStyles.banner}>
        <div style={manifestoStyles.bannerText}>
          ÚLTIMAS · O DEV 360 MORREU PARA QUE O CÓDIGO DO FUTURO NASÇA · ÚLTIMAS · A IA ACABOU DE ENGOLIR O SEU CURSO DE PROGRAMAÇÃO · ÚLTIMAS ·
        </div>
      </div>

      {/* Main grid */}
      <div style={manifestoStyles.main}>
        {/* Giant typography left */}
        <div style={manifestoStyles.leftHuge}>
          <div style={manifestoStyles.kicker}>
            <span style={manifestoStyles.redDot}></span>
            UM MANIFESTO DE ALEXANDRE BOYAGO
          </div>

          <h1 style={manifestoStyles.headline}>
            <span style={manifestoStyles.line1}>NÃO</span>
            <span style={manifestoStyles.line2}>EXISTE</span>
            <span style={manifestoStyles.line3}>
              <span style={manifestoStyles.red}>VOLTA</span>.
            </span>
          </h1>

          <div style={manifestoStyles.subBlock}>
            <div style={manifestoStyles.subLabel}>LEADE</div>
            <p style={manifestoStyles.sub}>
              Nove mil e quinhentos alunos. Uma plataforma EaD. Sete produtos
              no ar. E mesmo assim, <span style={manifestoStyles.underline}>decidi queimar o
              curso antigo</span> — porque a IA já queimou o mercado para quem
              não se atualiza.
            </p>
          </div>
        </div>

        {/* Right column — photo + box */}
        <div style={manifestoStyles.rightCol}>
          <div style={manifestoStyles.photoWrap}>
            <img src="assets/alexandre.png" alt="Alexandre Boyago" style={manifestoStyles.photo} />
            <div style={manifestoStyles.photoStamp}>EXCLUSIVO</div>
            <div style={manifestoStyles.photoCap}>
              Alexandre Boyago, fotografado em seu estúdio. Ao fundo, o
              código que ele acabou de aposentar.
            </div>
          </div>

          <div style={manifestoStyles.ctaBox}>
            <div style={manifestoStyles.ctaLabel}>CHAMADA À AÇÃO</div>
            <div style={manifestoStyles.ctaTitle}>
              CODEX 360<span style={manifestoStyles.red}>.</span>
            </div>
            <div style={manifestoStyles.ctaDesc}>
              Full-Stack na era da IA.<br/>
              Claude · Antigravity · GPT-5 · Gemini · VPS.
            </div>
            <button style={manifestoStyles.ctaBtn}>
              ENTRAR NA LISTA DE ESPERA →
            </button>
          </div>
        </div>
      </div>

      {/* Bottom columns — newspaper style */}
      <div style={manifestoStyles.bottomGrid}>
        <div style={manifestoStyles.bottomCol}>
          <div style={manifestoStyles.bottomNum}>01.</div>
          <div style={manifestoStyles.bottomHead}>FIM DO CÓDIGO</div>
          <div style={manifestoStyles.bottomBody}>
            Ninguém mais vai te pagar para digitar um for-loop. Nem para
            fazer um CRUD. O mercado só paga agora por quem entrega.
          </div>
        </div>
        <div style={manifestoStyles.bottomCol}>
          <div style={manifestoStyles.bottomNum}>02.</div>
          <div style={manifestoStyles.bottomHead}>NOVO STACK</div>
          <div style={manifestoStyles.bottomBody}>
            Claude Code para arquitetar, Antigravity para prototipar,
            GPT-5 para revisar, VPS para entregar. Full-stack em um dia.
          </div>
        </div>
        <div style={manifestoStyles.bottomCol}>
          <div style={manifestoStyles.bottomNum}>03.</div>
          <div style={manifestoStyles.bottomHead}>DIFERENCIAL</div>
          <div style={manifestoStyles.bottomBody}>
            Aprenda não as ferramentas — aprenda o <em>processo</em>.
            Lives diárias. Mentoria ao vivo. Comunidade. Eu, junto.
          </div>
        </div>
        <div style={manifestoStyles.bottomCol}>
          <div style={manifestoStyles.bottomNum}>04.</div>
          <div style={manifestoStyles.bottomHead}>PROVA</div>
          <div style={manifestoStyles.bottomBody}>
            9.500+ alunos. Plataforma EaD própria. 7 produtos no ar — de
            SaaS com IA a ERP. Isso não é um teste — é o próximo padrão.
          </div>
        </div>
      </div>
    </div>
  );
}

const manifestoStyles = {
  root: {
    width: '100%', height: '100%',
    background: '#f2ede3',
    color: '#0a0a0a',
    fontFamily: '"Inter", sans-serif',
    display: 'flex', flexDirection: 'column',
    overflow: 'hidden',
    position: 'relative',
  },
  top: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '12px 36px',
    borderBottom: '2px solid #0a0a0a',
    fontSize: 11, letterSpacing: '0.12em', fontWeight: 600,
  },
  topLeft: { display: 'flex', gap: 10, alignItems: 'center' },
  topRight: { display: 'flex', gap: 10, alignItems: 'center' },
  topSep: { opacity: 0.4 },
  topEdition: { fontWeight: 800 },
  topBrand: {
    fontFamily: '"Playfair Display", "Times New Roman", serif',
    fontSize: 24, letterSpacing: '0.05em', fontWeight: 900,
    fontStyle: 'italic',
  },
  topRed: { color: '#d21f1f', fontWeight: 700 },
  banner: {
    background: '#d21f1f',
    color: '#f2ede3',
    padding: '8px 0',
    fontSize: 11, letterSpacing: '0.15em', fontWeight: 700,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  bannerText: { paddingLeft: 20 },
  main: {
    flex: 1,
    display: 'grid', gridTemplateColumns: '1.4fr 1fr',
    gap: 32,
    padding: '28px 36px 20px',
    borderBottom: '1px solid #0a0a0a',
  },
  leftHuge: { display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
  kicker: {
    fontSize: 11, letterSpacing: '0.25em', fontWeight: 700,
    display: 'flex', alignItems: 'center', gap: 10,
    textTransform: 'uppercase',
  },
  redDot: { width: 10, height: 10, background: '#d21f1f', borderRadius: '50%' },
  headline: {
    fontFamily: '"Playfair Display", "Times New Roman", serif',
    fontWeight: 900, margin: '16px 0',
    fontSize: 180, lineHeight: 0.82,
    letterSpacing: -6,
    display: 'flex', flexDirection: 'column',
  },
  line1: {},
  line2: { fontStyle: 'italic', fontWeight: 400, color: '#0a0a0a' },
  line3: {},
  red: { color: '#d21f1f' },
  subBlock: {
    display: 'grid', gridTemplateColumns: '80px 1fr', gap: 16,
    borderTop: '1px solid #0a0a0a',
    paddingTop: 16,
  },
  subLabel: {
    fontSize: 10, letterSpacing: '0.2em', fontWeight: 700,
    color: '#666',
  },
  sub: {
    fontSize: 16, lineHeight: 1.45, margin: 0,
    fontWeight: 400, color: '#2a2a2a',
    maxWidth: 480,
  },
  underline: {
    background: '#d21f1f', color: '#f2ede3',
    padding: '0 4px', fontWeight: 600,
  },
  rightCol: { display: 'flex', flexDirection: 'column', gap: 14 },
  photoWrap: {
    position: 'relative',
    flex: 1,
    background: '#0a0a0a',
    border: '2px solid #0a0a0a',
    overflow: 'hidden',
  },
  photo: {
    width: '100%', height: '100%', objectFit: 'cover',
    filter: 'grayscale(1) contrast(1.15)',
  },
  photoStamp: {
    position: 'absolute', top: 14, left: 14,
    background: '#d21f1f', color: '#f2ede3',
    padding: '4px 10px',
    fontSize: 10, letterSpacing: '0.2em', fontWeight: 800,
    transform: 'rotate(-4deg)',
  },
  photoCap: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    background: '#f2ede3',
    padding: '8px 12px',
    fontSize: 11, lineHeight: 1.35,
    fontStyle: 'italic',
    borderTop: '2px solid #0a0a0a',
  },
  ctaBox: {
    background: '#0a0a0a', color: '#f2ede3',
    padding: '18px 20px',
  },
  ctaLabel: {
    fontSize: 10, letterSpacing: '0.25em', fontWeight: 700,
    color: '#d21f1f',
  },
  ctaTitle: {
    fontFamily: '"Playfair Display", serif',
    fontSize: 36, fontWeight: 900, letterSpacing: -1,
    lineHeight: 1,
    margin: '6px 0 10px',
  },
  ctaDesc: {
    fontSize: 12, lineHeight: 1.5, color: 'rgba(242,237,227,0.7)',
    marginBottom: 14,
  },
  ctaBtn: {
    background: '#d21f1f', color: '#f2ede3',
    border: 'none', padding: '12px 18px',
    fontSize: 12, fontWeight: 700, letterSpacing: '0.1em',
    cursor: 'pointer', width: '100%',
    fontFamily: 'inherit',
  },
  bottomGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
    padding: '14px 36px',
  },
  bottomCol: {
    padding: '0 14px',
    borderRight: '1px solid rgba(10,10,10,0.2)',
  },
  bottomNum: {
    fontFamily: '"Playfair Display", serif',
    fontSize: 22, fontWeight: 900, color: '#d21f1f',
  },
  bottomHead: {
    fontSize: 11, letterSpacing: '0.18em', fontWeight: 800,
    margin: '4px 0 6px',
  },
  bottomBody: {
    fontSize: 11.5, lineHeight: 1.45, color: '#2a2a2a',
  },
};

Object.assign(window, { HeroManifesto });
