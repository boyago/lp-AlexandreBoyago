// Stack: cards das ferramentas (Claude, Antigravity, GPT-5, Gemini, Claude Design, VPS)
// Layout tipo "package.json": cada ferramenta como um módulo instalado.

function Stack() {
  const tools = [
    { k: 'claude-code', v: '^2.1.0', by: 'anthropic', desc: 'Seu par de programação. Escreve, revisa, refatora e debuga em linguagem natural.', tag: 'CORE', color: '#ff9b5b' },
    { k: 'antigravity', v: '^1.0.0', by: 'google', desc: 'Nova IDE agentic. Constrói aplicações inteiras com supervisão mínima.', tag: 'NEW', color: '#4a9eff' },
    { k: 'gpt-5', v: '^5.0.0', by: 'openai', desc: 'Reasoning model para arquitetura, validação de decisões e lógica de negócio.', tag: 'CORE', color: '#00ff88' },
    { k: 'gemini', v: '^2.5.0', by: 'google', desc: 'Contexto longo, análise de bases inteiras, integração com todo o stack Google.', tag: 'CORE', color: '#c770ff' },
    { k: 'claude-design', v: '^1.0.0', by: 'anthropic', desc: 'Artifacts + Design. Produz UIs, protótipos, landing pages em minutos.', tag: 'UI', color: '#ffd56b' },
    { k: 'vps-deploy', v: '^3.0.0', by: 'self-hosted', desc: 'Do localhost ao domínio. Docker, nginx, SSL, observabilidade. O aluno entrega.', tag: 'OPS', color: '#00ff88' },
  ];

  return (
    <section style={stackStyles.root} data-screen-label="03 Stack">
      <div style={stackStyles.header}>
        <div style={stackStyles.kicker}>// STACK_2026</div>
        <h2 style={stackStyles.title}>
          As ferramentas que <span style={stackStyles.green}>substituíram</span>
          <br/>
          o seu bootcamp de 12 meses.
        </h2>
        <p style={stackStyles.sub}>
          Não é mais uma coleção de tutoriais. É o <span style={stackStyles.white}>stack operacional completo</span>
          &nbsp;para quem quer construir software em 2026, do primeiro prompt ao deploy em produção.
        </p>
      </div>

      <div style={stackStyles.grid}>
        {tools.map((t, i) => (
          <div key={i} style={stackStyles.card}>
            <div style={stackStyles.cardHeader}>
              <span style={stackStyles.cardFileName}>module_{String(i+1).padStart(2, '0')}.ts</span>
              <span style={{...stackStyles.cardTag, color: t.color, borderColor: t.color+'44'}}>{t.tag}</span>
            </div>
            <div style={stackStyles.cardBody}>
              <div style={stackStyles.cardCode}>
                <div><span style={stackStyles.comment}>{'//'} import</span></div>
                <div>
                  <span style={stackStyles.kw}>import</span>{' '}
                  <span style={{color: t.color}}>{t.k.replace(/-/g, '_')}</span>{' '}
                  <span style={stackStyles.kw}>from</span>{' '}
                  <span style={stackStyles.str}>'{t.by}'</span>;
                </div>
                <div style={{marginTop: 8}}>
                  <span style={stackStyles.comment}>// v{t.v}</span>
                </div>
              </div>
              <div style={stackStyles.cardName}>{t.k}</div>
              <div style={stackStyles.cardDesc}>{t.desc}</div>
            </div>
            <div style={stackStyles.cardFooter}>
              <span style={{color: '#00ff88'}}>●</span>
              <span>installed</span>
              <span style={{marginLeft: 'auto', color: '#555'}}>by: {t.by}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const stackStyles = {
  root: {
    background: '#050505',
    padding: '120px 60px',
    borderTop: '1px solid #1a1a1a',
  },
  header: { maxWidth: 1200, margin: '0 auto 64px' },
  kicker: { color: '#666', fontSize: 12, letterSpacing: '0.15em', marginBottom: 20 },
  title: {
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: 'clamp(32px, 4.5vw, 60px)',
    lineHeight: 1.08, letterSpacing: -1.5,
    fontWeight: 700,
    color: '#fff',
    margin: 0,
  },
  green: { color: '#00ff88' },
  sub: {
    fontSize: 18, lineHeight: 1.6,
    color: '#888', marginTop: 24,
    maxWidth: 720,
    fontFamily: '"Inter", sans-serif',
  },
  white: { color: '#fff', fontWeight: 600 },
  grid: {
    maxWidth: 1200, margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
    gap: 16,
  },
  card: {
    border: '1px solid #1f1f1f',
    background: '#0a0a0a',
    transition: 'border-color .2s, transform .2s',
    display: 'flex', flexDirection: 'column',
  },
  cardHeader: {
    padding: '10px 16px',
    borderBottom: '1px solid #1f1f1f',
    fontSize: 11, color: '#666',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    letterSpacing: '0.06em',
  },
  cardFileName: {},
  cardTag: {
    fontSize: 10, padding: '3px 8px',
    border: '1px solid', letterSpacing: '0.15em', fontWeight: 700,
  },
  cardBody: { padding: '20px 22px', flex: 1 },
  cardCode: {
    fontSize: 13, lineHeight: 1.8,
    background: '#050505', padding: '12px 14px',
    border: '1px solid #151515',
    marginBottom: 20,
  },
  comment: { color: '#555' },
  kw: { color: '#c770ff' },
  str: { color: '#ffd56b' },
  cardName: {
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: 22, fontWeight: 700, color: '#fff',
    letterSpacing: -0.5, marginBottom: 8,
  },
  cardDesc: { fontSize: 14, lineHeight: 1.55, color: '#999', fontFamily: '"Inter", sans-serif' },
  cardFooter: {
    borderTop: '1px solid #1f1f1f',
    padding: '10px 16px',
    fontSize: 11, color: '#888',
    display: 'flex', gap: 8, alignItems: 'center',
    letterSpacing: '0.05em',
  },
};

Object.assign(window, { Stack });
