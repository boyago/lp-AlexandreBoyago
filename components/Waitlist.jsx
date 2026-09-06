// Waitlist: CTA final forte + formulário de lista de espera.

function Waitlist() {
  const [submitted, setSubmitted] = React.useState(false);
  const [email, setEmail] = React.useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <section id="waitlist" style={wStyles.root} data-screen-label="08 Waitlist">
      <div style={wStyles.grid}>
        <div style={wStyles.glowBg}></div>

        <div style={wStyles.inner}>
          <div style={wStyles.kicker}>
            <span style={wStyles.pulse}></span>
            // WAITLIST.sh: lista de espera aberta
          </div>

          <h2 style={wStyles.title}>
            Próxima turma:<br/>
            <span style={wStyles.green}>CODEX 360 · 2026</span>
          </h2>

          <p style={wStyles.sub}>
            Turmas fechadas. Sem pré-venda pública. A lista de espera é o único jeito
            de entrar. Quem está dentro recebe primeiro o valor, os bônus e o link antes de todo mundo.
          </p>

          <div style={wStyles.bonusRow}>
            <div style={wStyles.bonus}>
              <div style={wStyles.bonusIcon}>◆</div>
              <div>
                <div style={wStyles.bonusT}>Acesso antecipado</div>
                <div style={wStyles.bonusD}>Você entra antes da fila pública abrir.</div>
              </div>
            </div>
            <div style={wStyles.bonus}>
              <div style={wStyles.bonusIcon}>◆</div>
              <div>
                <div style={wStyles.bonusT}>Preço de lançamento</div>
                <div style={wStyles.bonusD}>Só quem está na lista garante o menor valor.</div>
              </div>
            </div>
            <div style={wStyles.bonus}>
              <div style={wStyles.bonusIcon}>◆</div>
              <div>
                <div style={wStyles.bonusT}>Lives diárias grátis</div>
                <div style={wStyles.bonusD}>Conteúdo de aquecimento direto no seu email.</div>
              </div>
            </div>
          </div>

          {!submitted ? (
            <form onSubmit={submit} style={wStyles.form}>
              <div style={wStyles.promptPrefix}>
                <span style={wStyles.promptGreen}>$</span>
                <span style={wStyles.promptCmd}>subscribe --email</span>
              </div>
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={wStyles.input}
                required
              />
              <button type="submit" style={wStyles.cta}>
                JOIN_WAITLIST
                <span>→</span>
              </button>
            </form>
          ) : (
            <div style={wStyles.success}>
              <div style={wStyles.successIcon}>✓</div>
              <div>
                <div style={wStyles.successT}>Você está dentro.</div>
                <div style={wStyles.successD}>
                  → check seu email ({email}). Enviei os próximos passos e o link das lives diárias.
                </div>
              </div>
            </div>
          )}

          <div style={wStyles.meta}>
            [ sem spam ] [ cancelar a qualquer momento ] [ prioridade garantida ]
          </div>
        </div>
      </div>
    </section>
  );
}

const wStyles = {
  root: {
    background: '#050505',
    borderTop: '1px solid #1a1a1a',
    position: 'relative',
    overflow: 'hidden',
  },
  grid: { position: 'relative', padding: '140px 60px' },
  glowBg: {
    position: 'absolute', inset: 0,
    background: 'radial-gradient(ellipse at 50% 50%, rgba(0,255,136,0.12) 0%, transparent 60%)',
    pointerEvents: 'none',
  },
  inner: { maxWidth: 900, margin: '0 auto', position: 'relative' },
  kicker: {
    color: '#00ff88', fontSize: 13, letterSpacing: '0.12em',
    display: 'flex', alignItems: 'center', gap: 10,
    marginBottom: 28,
  },
  pulse: {
    width: 10, height: 10, borderRadius: '50%', background: '#00ff88',
    boxShadow: '0 0 0 0 rgba(0,255,136,0.8)',
    animation: 'pulse 2s infinite',
  },
  title: {
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: 'clamp(42px, 6vw, 84px)',
    lineHeight: 1.02, letterSpacing: -2.5,
    fontWeight: 700, color: '#fff', margin: '0 0 28px',
  },
  green: { color: '#00ff88' },
  sub: {
    fontSize: 18, lineHeight: 1.6,
    color: '#a0a0a0', fontFamily: '"Inter", sans-serif',
    margin: '0 0 40px', maxWidth: 720,
  },
  bonusRow: {
    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16,
    marginBottom: 40,
  },
  bonus: {
    background: '#0a0a0a', border: '1px solid #1f1f1f',
    padding: '18px 20px',
    display: 'flex', gap: 14, alignItems: 'flex-start',
  },
  bonusIcon: { color: '#00ff88', fontSize: 18, lineHeight: 1 },
  bonusT: { color: '#fff', fontSize: 14, fontWeight: 600, marginBottom: 4 },
  bonusD: { color: '#888', fontSize: 13, lineHeight: 1.5, fontFamily: '"Inter", sans-serif' },
  form: {
    display: 'flex', gap: 0,
    background: '#0a0a0a', border: '1px solid #2a2a2a',
    padding: 4,
    alignItems: 'stretch',
  },
  promptPrefix: {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '0 14px',
    fontFamily: '"JetBrains Mono", monospace', fontSize: 14,
    borderRight: '1px solid #1f1f1f',
  },
  promptGreen: { color: '#00ff88' },
  promptCmd: { color: '#888' },
  input: {
    flex: 1,
    background: 'transparent', border: 'none',
    padding: '18px 20px',
    fontSize: 16, color: '#fff',
    fontFamily: '"JetBrains Mono", monospace',
    outline: 'none',
  },
  cta: {
    background: '#00ff88', color: '#000',
    border: 'none', padding: '0 28px',
    fontSize: 15, fontWeight: 700,
    letterSpacing: '0.05em',
    fontFamily: '"JetBrains Mono", monospace',
    cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: 10,
  },
  success: {
    background: '#0f1a0f', border: '1px solid #144414',
    padding: '24px 28px',
    display: 'flex', gap: 20, alignItems: 'flex-start',
  },
  successIcon: {
    fontSize: 28, color: '#00ff88',
    width: 40, height: 40, borderRadius: '50%',
    border: '2px solid #00ff88',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  successT: { color: '#fff', fontSize: 18, fontWeight: 700, marginBottom: 4, fontFamily: '"JetBrains Mono", monospace' },
  successD: { color: '#aaa', fontSize: 14, lineHeight: 1.5, fontFamily: '"Inter", sans-serif' },
  meta: { marginTop: 20, fontSize: 12, color: '#555', letterSpacing: '0.08em' },
};

Object.assign(window, { Waitlist });
