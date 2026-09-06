// FAQ + Footer

function FAQ() {
  const [open, setOpen] = React.useState(0);
  const qs = [
    {
      q: 'Preciso saber programar pra entrar?',
      a: 'Sim, pelo menos o básico. Você precisa entender o que é uma função, uma requisição HTTP e um git commit. O CODEX 360 multiplica quem já programa, mas não ensina do zero absoluto. Se você é total iniciante, fale comigo antes.',
    },
    {
      q: 'Quanto tempo dura o curso?',
      a: '26 semanas de aulas ao vivo + lives diárias enquanto o programa durar. Mas você sai entregando projetos desde a semana 2. Não é um curso que você "termina e começa a fazer".',
    },
    {
      q: 'E se eu já for aluno do Dev 360 antigo?',
      a: 'Ainda estou decidindo a política exata de upgrade. Entrando na lista de espera, você recebe primeiro essa informação, provavelmente com condição especial de aluno legado.',
    },
    {
      q: 'Qual o investimento?',
      a: 'Estou montando a oferta nas lives diárias com o público da lista. Quem está na waitlist recebe o preço de lançamento antes de qualquer outra pessoa.',
    },
    {
      q: 'As ferramentas (Claude, GPT-5, etc.) têm custo?',
      a: 'Sim, são pagas. Vou te ensinar a escolher os planos certos e ter ROI rápido. A economia em tempo paga as assinaturas no primeiro projeto real.',
    },
    {
      q: 'Tem certificado?',
      a: 'Tem, mas foco zero nisso. O que vale no mercado de 2026 é seu portfólio no ar, não um PDF. O CODEX 360 te dá projetos reais pra mostrar, não um selo.',
    },
  ];

  return (
    <section style={faqStyles.root} data-screen-label="09 FAQ">
      <div style={faqStyles.inner}>
        <div style={faqStyles.kicker}>// FAQ.md</div>
        <h2 style={faqStyles.title}>
          Perguntas <span style={faqStyles.green}>frequentes</span>.
        </h2>

        <div style={faqStyles.list}>
          {qs.map((item, i) => (
            <div key={i} style={{
              ...faqStyles.item,
              borderColor: open === i ? '#00ff88' : '#1f1f1f',
            }}>
              <button style={faqStyles.q} onClick={() => setOpen(open === i ? -1 : i)}>
                <span style={{...faqStyles.qArrow, color: open === i ? '#00ff88' : '#555'}}>
                  {open === i ? '▾' : '▸'}
                </span>
                <span style={{flex: 1}}>{item.q}</span>
                <span style={faqStyles.qNum}>Q.{String(i+1).padStart(2, '0')}</span>
              </button>
              {open === i && (
                <div style={faqStyles.a}>
                  <span style={faqStyles.aPrefix}>→</span>
                  <span>{item.a}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={footStyles.root} data-screen-label="10 Footer">
      <div style={footStyles.inner}>
        <div style={footStyles.left}>
          <div style={footStyles.brand}>CODEX 360</div>
          <div style={footStyles.tag}>// full-stack na era da IA</div>
          <div style={footStyles.sub}>um produto de Alexandre Boyago · sucessor do Dev 360 · 2026</div>
        </div>
        <div style={footStyles.right}>
          <div style={footStyles.col}>
            <div style={footStyles.colTitle}>produto</div>
            <a style={footStyles.link} href="#waitlist">Lista de espera</a>
            <a style={footStyles.link} href="#">Cronograma</a>
            <a style={footStyles.link} href="#">Módulos</a>
          </div>
          <div style={footStyles.col}>
            <div style={footStyles.colTitle}>alexandre</div>
            <a style={footStyles.link} href="#">Instagram</a>
            <a style={footStyles.link} href="#">YouTube</a>
            <a style={footStyles.link} href="#">LinkedIn</a>
          </div>
          <div style={footStyles.col}>
            <div style={footStyles.colTitle}>legal</div>
            <a style={footStyles.link} href="#">Termos</a>
            <a style={footStyles.link} href="#">Privacidade</a>
            <a style={footStyles.link} href="#">Contato</a>
          </div>
        </div>
      </div>
      <div style={footStyles.bottom}>
        <span>© 2026 Alexandre Boyago · CODEX 360 · all rights reserved</span>
        <span style={{color: '#00ff88'}}>●_LIVE</span>
      </div>
    </footer>
  );
}

const faqStyles = {
  root: { background: '#0a0a0a', padding: '120px 60px', borderTop: '1px solid #1a1a1a' },
  inner: { maxWidth: 900, margin: '0 auto' },
  kicker: { color: '#666', fontSize: 12, letterSpacing: '0.12em', marginBottom: 20 },
  title: {
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: 'clamp(32px, 4.5vw, 56px)',
    lineHeight: 1.08, letterSpacing: -1.2,
    fontWeight: 700, color: '#fff', margin: '0 0 40px',
  },
  green: { color: '#00ff88' },
  list: { display: 'flex', flexDirection: 'column', gap: 8 },
  item: { border: '1px solid #1f1f1f', background: '#0f0f0f', transition: 'border-color .2s' },
  q: {
    width: '100%', padding: '20px 24px',
    background: 'transparent', border: 'none',
    color: '#fff', cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: 16,
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: 16, textAlign: 'left',
    fontWeight: 500,
  },
  qArrow: { fontSize: 14 },
  qNum: { color: '#555', fontSize: 11, letterSpacing: '0.15em' },
  a: {
    padding: '0 24px 22px 56px',
    fontSize: 15, lineHeight: 1.65,
    color: '#a0a0a0', fontFamily: '"Inter", sans-serif',
    display: 'flex', gap: 12,
  },
  aPrefix: { color: '#00ff88' },
};

const footStyles = {
  root: { background: '#050505', padding: '80px 60px 30px', borderTop: '1px solid #1a1a1a' },
  inner: { maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 60 },
  left: {},
  brand: {
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: -1,
  },
  tag: { color: '#00ff88', fontSize: 13, margin: '8px 0 16px', letterSpacing: '0.08em' },
  sub: { color: '#666', fontSize: 13, lineHeight: 1.6 },
  right: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40 },
  col: { display: 'flex', flexDirection: 'column', gap: 10 },
  colTitle: {
    fontSize: 11, letterSpacing: '0.15em', color: '#fff',
    fontWeight: 700, marginBottom: 6, textTransform: 'uppercase',
  },
  link: { color: '#888', fontSize: 14, textDecoration: 'none', fontFamily: '"Inter", sans-serif' },
  bottom: {
    maxWidth: 1200, margin: '0 auto',
    borderTop: '1px solid #1a1a1a', paddingTop: 24, marginTop: 60,
    display: 'flex', justifyContent: 'space-between',
    fontSize: 11, color: '#555', letterSpacing: '0.08em',
  },
};

Object.assign(window, { FAQ, Footer });
