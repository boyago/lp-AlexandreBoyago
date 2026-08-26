// Manifesto — "Por que destruí meu próprio curso"
// Carta aberta em primeira pessoa, tipografia limpa, pausa após o Hero.

function Manifesto() {
  return (
    <section style={manifestoStyles.root} data-screen-label="02 Manifesto">
      <div style={manifestoStyles.inner}>
        <div style={manifestoStyles.kicker}>
          <span style={manifestoStyles.kickerDot}></span>
          // MANIFESTO.md · carta aberta · 2026
        </div>

        <h2 style={manifestoStyles.title}>
          Destruí meu <span style={manifestoStyles.green}>curso com mais de 9.500 alunos</span>.
          <br/>
          E agora vou fazê-lo de novo, <span style={manifestoStyles.green}>do ZERO</span>.
        </h2>

        <div style={manifestoStyles.body}>
          <p style={manifestoStyles.p}>
            Sou <strong style={manifestoStyles.white}>Alexandre Boyago</strong> — 26+ anos como dev e designer,
            formado e pós-graduado em TI. Criei sites, softwares e apps para inúmeros clientes,
            e hoje vivo do jeito que sempre quis: trabalhando de qualquer lugar do mundo,
            ganhando bem, sem sacrificar minha liberdade criativa.
          </p>

          <p style={manifestoStyles.p}>
            Criei uma das plataformas de EaD mais reconhecidas do Brasil, dedicada ao ensino
            de criação e venda de sites. Já formei <strong style={manifestoStyles.white}>mais de 6.000 alunos no presencial</strong> e
            &nbsp;<strong style={manifestoStyles.white}>mais de 3.000 no online</strong>. Sou professor universitário desde 2008,
            coordenador de curso há mais de 10 anos na ETEC. Essa plataforma nasceu como DrOwl
            e hoje é a <strong style={manifestoStyles.white}>WizMarket</strong>, da qual sou co-fundador.
            Além dela, criei <strong style={manifestoStyles.white}>OmniLabs, ServiOS, RingLingo,
            Menu Dash+ e LeadCloser</strong> — produtos reais, no ar, em produção.
          </p>

          <p style={manifestoStyles.p}>
            Só que em 2025 algo mudou. <strong style={manifestoStyles.white}>Claude, Antigravity, GPT-5, Gemini.</strong>
            &nbsp;Em seis meses, aquilo que eu ensinava em seis meses começou a ser entregue em uma tarde.
            E eu estava, literalmente, ensinando a <em>datilografar código</em> numa era onde ninguém
            mais precisa disso.
          </p>

          <p style={manifestoStyles.pQuote}>
            <span style={manifestoStyles.quoteMark}>"</span>
            Eu podia continuar faturando com o curso antigo e fingir que não vi.
            Ou podia queimar tudo e recomeçar.
            <span style={manifestoStyles.quoteMark}>"</span>
          </p>

          <p style={manifestoStyles.p}>
            Escolhi queimar. Passei <strong style={manifestoStyles.white}>11 meses reescrevendo o curso do zero</strong>
            &nbsp;com as ferramentas que realmente importam em 2026. O resultado é o
            &nbsp;<span style={manifestoStyles.green}>CODEX 360</span> — full-stack com IA, do primeiro commit
            à VPS em produção.
          </p>

          <p style={manifestoStyles.p}>
            Se você está aqui, é porque sabe que o jogo mudou. A pergunta é:
            &nbsp;<strong style={manifestoStyles.white}>você vai continuar estudando o que morreu ontem,
            ou aprender o que paga amanhã?</strong>
          </p>

          <div style={manifestoStyles.signature}>
            <div style={manifestoStyles.sigName}>— Alexandre Boyago</div>
            <div style={manifestoStyles.sigRole}>fundador · dev 360 · codex 360</div>
          </div>
        </div>
      </div>
    </section>
  );
}

const manifestoStyles = {
  root: {
    background: '#0a0a0a',
    color: '#d0d0d0',
    padding: '120px 60px',
    borderTop: '1px solid #1a1a1a',
    borderBottom: '1px solid #1a1a1a',
  },
  inner: { maxWidth: 820, margin: '0 auto' },
  kicker: {
    fontSize: 12, letterSpacing: '0.12em',
    color: '#666',
    display: 'flex', alignItems: 'center', gap: 10,
    marginBottom: 32,
  },
  kickerDot: { width: 8, height: 8, borderRadius: '50%', background: '#00ff88', boxShadow: '0 0 10px #00ff88' },
  title: {
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: 'clamp(36px, 4.5vw, 64px)',
    lineHeight: 1.1, letterSpacing: -1.5,
    fontWeight: 700,
    color: '#fff',
    margin: '0 0 56px',
  },
  green: { color: '#00ff88' },
  body: { display: 'flex', flexDirection: 'column', gap: 24 },
  p: {
    fontFamily: '"Inter", sans-serif',
    fontSize: 19, lineHeight: 1.7,
    color: '#a8a8a8', margin: 0,
  },
  white: { color: '#fff', fontWeight: 600 },
  pQuote: {
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: 22, lineHeight: 1.5,
    color: '#00ff88',
    borderLeft: '3px solid #00ff88',
    padding: '8px 0 8px 28px',
    margin: '16px 0',
    fontWeight: 500,
  },
  quoteMark: { opacity: 0.4 },
  signature: { marginTop: 40, paddingTop: 28, borderTop: '1px solid #222' },
  sigName: { fontSize: 18, color: '#fff', fontWeight: 600 },
  sigRole: { fontSize: 13, color: '#666', letterSpacing: '0.08em', marginTop: 4 },
};

Object.assign(window, { Manifesto });
