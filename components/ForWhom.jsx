// ForWhom — "para quem é / para quem não é"

function ForWhom() {
  const yes = [
    'Você já programa (mesmo que básico) e quer multiplicar sua produção com IA',
    'Você quer construir e lançar produtos digitais sozinho — SaaS, app, MVP',
    'Você é freelancer e quer cobrar o dobro entregando em metade do tempo',
    'Você sente que está ficando pra trás e quer se atualizar RÁPIDO',
    'Você quer parar de só estudar e começar a entregar software real em VPS',
  ];
  const no = [
    'Você quer "ganhar dinheiro fácil" sem trabalhar',
    'Você acha que IA é bolha e prefere continuar com o stack de 2019',
    'Você não está disposto a aparecer nas lives e interagir com a comunidade',
    'Você quer uma certificação pra colar em LinkedIn e parar por aí',
  ];

  return (
    <section style={fwStyles.root} data-screen-label="07 For Whom">
      <div style={fwStyles.inner}>
        <div style={fwStyles.kicker}>// QUALIFIER · leia antes de entrar na lista</div>
        <h2 style={fwStyles.title}>
          Isso <span style={fwStyles.green}>não é pra todo mundo</span>.
        </h2>

        <div style={fwStyles.grid}>
          <div style={fwStyles.col}>
            <div style={fwStyles.colHeader}>
              <span style={fwStyles.check}>✓</span>
              <span>ENTRE_SE</span>
            </div>
            <ul style={fwStyles.list}>
              {yes.map((x, i) => (
                <li key={i} style={fwStyles.itemYes}>
                  <span style={fwStyles.bulletYes}>▸</span>{x}
                </li>
              ))}
            </ul>
          </div>
          <div style={fwStyles.col}>
            <div style={{...fwStyles.colHeader, color: '#ff4444'}}>
              <span style={fwStyles.cross}>✗</span>
              <span>NÃO_ENTRE_SE</span>
            </div>
            <ul style={fwStyles.list}>
              {no.map((x, i) => (
                <li key={i} style={fwStyles.itemNo}>
                  <span style={fwStyles.bulletNo}>▸</span>{x}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

const fwStyles = {
  root: { background: '#050505', padding: '120px 60px', borderTop: '1px solid #1a1a1a' },
  inner: { maxWidth: 1200, margin: '0 auto' },
  kicker: { color: '#666', fontSize: 12, letterSpacing: '0.12em', marginBottom: 20 },
  title: {
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: 'clamp(32px, 4.5vw, 56px)',
    lineHeight: 1.08, letterSpacing: -1.2,
    fontWeight: 700, color: '#fff', margin: '0 0 56px',
  },
  green: { color: '#00ff88' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  col: { border: '1px solid #1f1f1f', background: '#0a0a0a', padding: '28px 32px' },
  colHeader: {
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: 14, letterSpacing: '0.15em', fontWeight: 700,
    color: '#00ff88',
    display: 'flex', gap: 12, alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottom: '1px solid #1a1a1a',
  },
  check: { fontSize: 20, color: '#00ff88' },
  cross: { fontSize: 20, color: '#ff4444' },
  list: { margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 14 },
  itemYes: {
    fontSize: 15, lineHeight: 1.5, color: '#ddd',
    fontFamily: '"Inter", sans-serif',
    display: 'flex', gap: 12,
  },
  itemNo: {
    fontSize: 15, lineHeight: 1.5, color: '#777',
    fontFamily: '"Inter", sans-serif',
    display: 'flex', gap: 12, textDecoration: 'line-through',
  },
  bulletYes: { color: '#00ff88', flexShrink: 0 },
  bulletNo: { color: '#ff4444', flexShrink: 0 },
};

Object.assign(window, { ForWhom });
