// SocialProof — 9.500 alunos + portfólio de produtos + plataforma EaD
// Estilo: terminal com "query" ao vivo + cards com os dados.

function SocialProof() {
  return (
    <section style={proofStyles.root} data-screen-label="06 Proof">
      <div style={proofStyles.inner}>
        <div style={proofStyles.queryBox}>
          <div style={proofStyles.queryLine}>
            <span style={proofStyles.querySel}>SELECT</span> * <span style={proofStyles.querySel}>FROM</span> credibilidade <span style={proofStyles.querySel}>WHERE</span> autor = <span style={proofStyles.queryStr}>'alexandre_boyago'</span>;
          </div>
          <div style={proofStyles.queryResult}>→ 9 registros retornados em 0.04s</div>
        </div>

        <h2 style={proofStyles.title}>
          Por que você deveria <span style={proofStyles.green}>confiar em mim</span>?
        </h2>

        <div style={proofStyles.grid}>
          <div style={proofStyles.card}>
            <div style={proofStyles.cardId}>#01</div>
            <div style={proofStyles.cardBig}>9.500<span style={proofStyles.plus}>+</span></div>
            <div style={proofStyles.cardLabel}>alunos formados</div>
            <div style={proofStyles.cardDesc}>
              Online e presencial. Do dev júnior ao sênior que virou freelancer.
              Pessoas reais, contratos reais, salário real.
            </div>
          </div>

          <div style={proofStyles.card}>
            <div style={proofStyles.cardId}>#03</div>
            <div style={proofStyles.cardBig}>WizMarket<br/><span style={{fontSize: '0.48em', color: '#00ff88'}}>ex-DrOwl</span></div>
            <div style={proofStyles.cardLabel}>plataforma EaD global</div>
            <div style={proofStyles.cardDesc}>
              Construí uma plataforma focada na economia criadora — hospedagem e
              venda de cursos, pós, e-books, eventos e mentorias. Nasceu como
              DrOwl; hoje sou co-fundador da operação global.
            </div>
          </div>
        </div>

        {/* Portfólio de produtos — card destacado, full width */}
        <div style={proofStyles.featureCard}>
          <div style={proofStyles.featureLeft}>
            <div style={proofStyles.featureTag}>// PORTFOLIO · FUNDADOR & CO-FUNDADOR</div>
            <div style={proofStyles.featureName}>
              PRODUTOS<br/><span style={proofStyles.green}>REAIS</span>
            </div>
            <div style={proofStyles.featureRole}>
              SaaS · ERP · EdTech · IA<br/>
              <span style={{color: '#00ff88'}}>tudo no ar, em produção</span>
            </div>
          </div>
          <div style={proofStyles.featureRight}>
            <div style={proofStyles.featureLabel}>// produtos que criei</div>
            <div style={proofStyles.brandsGrid}>
              {['DROWL', 'WIZMARKET', 'OMNILABS', 'SERVIOS', 'RINGLINGO', 'MENU DASH+', 'LEADCLOSER'].map((b, i) => (
                <div key={i} style={{
                  ...proofStyles.brandChip,
                  ...(b === 'WIZMARKET' ? proofStyles.brandActive : {}),
                }}>{b}</div>
              ))}
            </div>
            <div style={proofStyles.featureStory}>
              <span style={proofStyles.featureStoryPrefix}>{'>'}</span>
              DrOwl virou a WizMarket, onde sou co-fundador. Depois vieram a
              OmniLabs (pack de ferramentas de produção para marketing digital),
              o ServiOS (ERP para empresas de serviços), o RingLingo (app de
              estudos com IA), o Menu Dash+ (sistema para restaurantes) e o
              LeadCloser (SaaS com IA para gestão de leads). Não ensino teoria:
              essa é a stack que eu uso todo dia pra colocar produto no ar.
            </div>
          </div>
        </div>

        <div style={proofStyles.quote}>
          <div style={proofStyles.quoteGlyph}>{'>'}</div>
          <div>
            <p style={proofStyles.quoteText}>
              "Não existe outro lugar onde você vai aprender full-stack com
              IA no ritmo que a própria IA está evoluindo. O CODEX 360 é isso."
            </p>
            <div style={proofStyles.quoteAuthor}>— Alexandre Boyago, sobre seu novo curso</div>
          </div>
        </div>
      </div>
    </section>
  );
}

const proofStyles = {
  root: { background: '#0a0a0a', padding: '120px 60px', borderTop: '1px solid #1a1a1a' },
  inner: { maxWidth: 1200, margin: '0 auto' },
  queryBox: {
    background: '#050505', border: '1px solid #1f1f1f',
    padding: '18px 24px', marginBottom: 32,
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: 14,
  },
  queryLine: { color: '#e0e0e0' },
  querySel: { color: '#c770ff' },
  queryStr: { color: '#ffd56b' },
  queryResult: { color: '#666', fontSize: 12, marginTop: 8 },
  title: {
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: 'clamp(32px, 4.5vw, 56px)',
    lineHeight: 1.08, letterSpacing: -1.2,
    fontWeight: 700, color: '#fff', margin: '0 0 56px',
  },
  green: { color: '#00ff88' },
  grid: {
    display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16,
    marginBottom: 16,
  },
  card: {
    background: '#0f0f0f', border: '1px solid #1f1f1f',
    padding: '28px 28px', position: 'relative',
    display: 'flex', flexDirection: 'column',
  },
  cardId: {
    fontSize: 11, letterSpacing: '0.15em', color: '#555',
    position: 'absolute', top: 16, right: 20,
    fontWeight: 700,
  },
  cardBig: {
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: 60, fontWeight: 800,
    color: '#fff', letterSpacing: -3,
    lineHeight: 0.95, marginBottom: 16,
  },
  plus: { color: '#00ff88' },
  cardLabel: {
    fontSize: 12, letterSpacing: '0.12em',
    color: '#00ff88', textTransform: 'uppercase',
    fontWeight: 700, marginBottom: 16,
  },
  cardDesc: {
    fontSize: 14, lineHeight: 1.55,
    color: '#999', fontFamily: '"Inter", sans-serif',
  },
  featureCard: {
    background: '#0f1a0f',
    border: '1px solid #144414',
    borderLeft: '3px solid #00ff88',
    padding: '36px 40px',
    marginBottom: 48,
    display: 'grid', gridTemplateColumns: '340px 1fr', gap: 40,
    alignItems: 'flex-start',
  },
  featureLeft: {
    display: 'flex', flexDirection: 'column', gap: 16,
    borderRight: '1px solid #144414',
    paddingRight: 40,
    alignSelf: 'stretch',
  },
  featureTag: {
    fontSize: 11, letterSpacing: '0.15em', color: '#00ff88',
    fontWeight: 700,
  },
  featureName: {
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: 52, fontWeight: 800,
    color: '#fff', letterSpacing: -2,
    lineHeight: 0.95,
  },
  featureRole: {
    fontSize: 13, lineHeight: 1.6,
    color: '#888', fontFamily: '"Inter", sans-serif',
  },
  featureRight: { display: 'flex', flexDirection: 'column', gap: 20 },
  featureLabel: { fontSize: 11, letterSpacing: '0.15em', color: '#666' },
  brandsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
    gap: 8,
  },
  brandChip: {
    border: '1px solid #2a2a2a',
    background: '#050505',
    padding: '10px 12px',
    fontSize: 11, letterSpacing: '0.1em',
    color: '#bbb', fontWeight: 600,
    textAlign: 'center',
    fontFamily: '"JetBrains Mono", monospace',
  },
  brandActive: {
    background: '#00ff88', color: '#000',
    borderColor: '#00ff88',
  },
  featureStory: {
    fontSize: 14.5, lineHeight: 1.6,
    color: '#b8b8b8', fontFamily: '"Inter", sans-serif',
    display: 'flex', gap: 12,
    paddingTop: 8,
    borderTop: '1px dashed #144414',
  },
  featureStoryPrefix: { color: '#00ff88', fontFamily: '"JetBrains Mono", monospace' },
  quote: {
    background: '#0f0f0f', border: '1px solid #1f1f1f', borderLeft: '3px solid #00ff88',
    padding: '28px 36px',
    display: 'flex', gap: 20, alignItems: 'flex-start',
  },
  quoteGlyph: {
    color: '#00ff88', fontSize: 32, lineHeight: 1,
    fontFamily: '"JetBrains Mono", monospace',
  },
  quoteText: {
    fontSize: 19, lineHeight: 1.5,
    color: '#d0d0d0', margin: 0,
    fontFamily: '"Inter", sans-serif',
    fontStyle: 'italic',
  },
  quoteAuthor: { color: '#666', fontSize: 13, marginTop: 12, letterSpacing: '0.05em' },
};

Object.assign(window, { SocialProof });
