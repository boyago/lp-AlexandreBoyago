// Modules — o que o aluno vai construir / módulos do curso
// Layout tipo estrutura de pastas (file tree) à esquerda + descrição à direita.

function Modules() {
  const modules = [
    {
      n: '01', name: 'fundamentos-ia.module',
      title: 'Fundamentos da era IA',
      body: 'Prompt engineering sério. Como pensar em sistemas com Claude, GPT-5 e Gemini. Escolher a IA certa para cada tarefa. Setup do ambiente completo.',
      items: ['prompts-sistema.md', 'escolha-de-modelo.md', 'setup-dev.sh'],
    },
    {
      n: '02', name: 'claude-code.module',
      title: 'Claude Code em produção',
      body: 'Do zero ao pair-programming avançado. Como fazer o Claude escrever, refatorar e testar projetos reais — não demos de YouTube.',
      items: ['primeiro-projeto.tsx', 'refactor-agent.py', 'testes-automatizados.md'],
    },
    {
      n: '03', name: 'antigravity.module',
      title: 'Antigravity & agentes',
      body: 'A nova IDE do Google. Como construir aplicações inteiras com um agente supervisionando. Fluxos de trabalho multi-agente.',
      items: ['primeiro-agente.ag', 'multi-step-build.ag', 'handoff-humano.md'],
    },
    {
      n: '04', name: 'frontend-ia.module',
      title: 'Frontend com IA',
      body: 'Claude Design, Artifacts, V0. Do wireframe à landing page funcional em uma tarde. UX que converte.',
      items: ['landing-10min.tsx', 'components-ai.tsx', 'design-system.md'],
    },
    {
      n: '05', name: 'backend-ia.module',
      title: 'Backend & APIs',
      body: 'Arquiteturas modernas com IA. Autenticação, database, filas, webhooks. Integração com modelos de IA em produção.',
      items: ['api-rest.ts', 'auth-moderna.ts', 'llm-endpoints.ts'],
    },
    {
      n: '06', name: 'mobile-apps.module',
      title: 'APPs com IA',
      body: 'React Native, Expo. Como construir apps multiplataforma com IA assistindo todo o ciclo. Publicar nas stores.',
      items: ['app-expo.tsx', 'publish-store.md', 'push-notifications.ts'],
    },
    {
      n: '07', name: 'vps-deploy.module',
      title: 'VPS & entrega',
      body: 'Do localhost ao domínio público. Docker, nginx, SSL, CI/CD. Observabilidade e custos. Você entrega software real.',
      items: ['docker-compose.yml', 'nginx.conf', 'deploy-script.sh'],
    },
    {
      n: '08', name: 'business.module',
      title: 'Do código ao faturamento',
      body: 'Freelance, SaaS, produto. Como precificar, vender e entregar. A camada que 99% dos cursos esquece.',
      items: ['primeiro-cliente.md', 'saas-mvp.md', 'precificacao.md'],
    },
  ];

  const [active, setActive] = React.useState(0);
  const m = modules[active];

  return (
    <section style={modulesStyles.root} data-screen-label="04 Modules">
      <div style={modulesStyles.inner}>
        <div style={modulesStyles.header}>
          <div style={modulesStyles.kicker}>// CURRICULUM_2026 · 8 módulos · 26 semanas</div>
          <h2 style={modulesStyles.title}>
            O que você <span style={modulesStyles.green}>vai construir</span>.
          </h2>
          <p style={modulesStyles.sub}>
            Não é teoria. Cada módulo termina com um projeto real no ar —
            commitado no seu Git, rodando na sua VPS, acessível por URL pública.
          </p>
        </div>

        <div style={modulesStyles.grid}>
          {/* Left: file tree */}
          <div style={modulesStyles.tree}>
            <div style={modulesStyles.treeHeader}>
              <span style={modulesStyles.folderIcon}>▾</span>
              <span>codex-360/</span>
            </div>
            {modules.map((mod, i) => (
              <button key={i} onClick={() => setActive(i)} style={{
                ...modulesStyles.treeItem,
                background: i === active ? '#1a1a1a' : 'transparent',
                borderLeftColor: i === active ? '#00ff88' : 'transparent',
                color: i === active ? '#fff' : '#999',
              }}>
                <span style={modulesStyles.treeNum}>{mod.n}</span>
                <span style={{flex: 1, textAlign: 'left'}}>{mod.name}</span>
                {i === active && <span style={{color: '#00ff88'}}>●</span>}
              </button>
            ))}
          </div>

          {/* Right: content */}
          <div style={modulesStyles.detail}>
            <div style={modulesStyles.detailHeader}>
              <span style={modulesStyles.detailPath}>codex-360/{m.name}</span>
              <span style={modulesStyles.detailModule}>MÓDULO {m.n} / 08</span>
            </div>
            <div style={modulesStyles.detailBody}>
              <h3 style={modulesStyles.detailTitle}>{m.title}</h3>
              <p style={modulesStyles.detailDesc}>{m.body}</p>

              <div style={modulesStyles.detailFilesTitle}>// arquivos do módulo</div>
              <div style={modulesStyles.detailFiles}>
                {m.items.map((f, i) => (
                  <div key={i} style={modulesStyles.detailFile}>
                    <span style={modulesStyles.fileGlyph}>└─</span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const modulesStyles = {
  root: {
    background: '#0a0a0a',
    padding: '120px 60px',
    borderTop: '1px solid #1a1a1a',
  },
  inner: { maxWidth: 1200, margin: '0 auto' },
  header: { marginBottom: 56 },
  kicker: { color: '#666', fontSize: 12, letterSpacing: '0.12em', marginBottom: 20 },
  title: {
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: 'clamp(32px, 4.5vw, 60px)',
    lineHeight: 1.08, letterSpacing: -1.5,
    fontWeight: 700, color: '#fff', margin: 0,
  },
  green: { color: '#00ff88' },
  sub: { fontSize: 18, lineHeight: 1.6, color: '#888', marginTop: 20, maxWidth: 720, fontFamily: '"Inter", sans-serif' },
  grid: {
    display: 'grid',
    gridTemplateColumns: '320px 1fr',
    gap: 2,
    border: '1px solid #1f1f1f',
    background: '#1f1f1f',
  },
  tree: { background: '#0a0a0a', padding: '16px 0' },
  treeHeader: {
    padding: '10px 20px',
    fontSize: 13, color: '#999',
    display: 'flex', gap: 8, alignItems: 'center',
    fontFamily: '"JetBrains Mono", monospace',
    marginBottom: 8,
  },
  folderIcon: { color: '#00ff88' },
  treeItem: {
    width: '100%',
    padding: '10px 20px 10px 32px',
    fontSize: 13.5,
    fontFamily: '"JetBrains Mono", monospace',
    background: 'transparent', border: 'none',
    borderLeft: '2px solid transparent',
    cursor: 'pointer',
    display: 'flex', gap: 10, alignItems: 'center',
    transition: 'all .15s',
    color: '#999',
  },
  treeNum: { color: '#555', fontSize: 11 },
  detail: { background: '#0f0f0f', padding: 0, display: 'flex', flexDirection: 'column' },
  detailHeader: {
    padding: '10px 24px',
    borderBottom: '1px solid #1f1f1f',
    fontSize: 12, color: '#666',
    display: 'flex', justifyContent: 'space-between',
    letterSpacing: '0.05em',
  },
  detailPath: {},
  detailModule: { color: '#00ff88', fontWeight: 600 },
  detailBody: { padding: '32px 40px' },
  detailTitle: {
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: 32, fontWeight: 700,
    color: '#fff', margin: '0 0 16px',
    letterSpacing: -0.8,
  },
  detailDesc: {
    fontSize: 16, lineHeight: 1.65,
    color: '#a0a0a0', fontFamily: '"Inter", sans-serif',
    margin: '0 0 32px',
  },
  detailFilesTitle: { color: '#666', fontSize: 12, letterSpacing: '0.1em', marginBottom: 12 },
  detailFiles: {
    background: '#050505',
    border: '1px solid #151515',
    padding: '14px 18px',
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: 13, lineHeight: 1.9,
  },
  detailFile: { color: '#ddd', display: 'flex', gap: 10 },
  fileGlyph: { color: '#444' },
};

Object.assign(window, { Modules });
