// Schedule — cronograma / mentoria ao vivo / comunidade

function Schedule() {
  return (
    <section style={schedStyles.root} data-screen-label="05 Schedule">
      <div style={schedStyles.inner}>
        <div style={schedStyles.header}>
          <div style={schedStyles.kicker}>// SCHEDULE · LIVE · COMMUNITY</div>
          <h2 style={schedStyles.title}>
            Entrega <span style={schedStyles.green}>ao vivo</span>.<br/>
            Sem gravação reciclada.
          </h2>
          <p style={schedStyles.sub}>
            Nenhum curso gravado em 2026 vai te segurar — o ritmo da IA é semanal.
            Por isso o CODEX 360 é <span style={schedStyles.white}>aulas ao vivo, lives diárias e mentoria em grupo</span>.
            Conteúdo é entregue em tempo real, na mesma velocidade em que as ferramentas evoluem.
          </p>
        </div>

        <div style={schedStyles.grid}>
          {/* Calendar */}
          <div style={schedStyles.calCard}>
            <div style={schedStyles.calHeader}>
              <span>schedule.ics</span>
              <span style={schedStyles.calWeek}>SEMANA TIPO</span>
            </div>
            <div style={schedStyles.calGrid}>
              {['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM'].map((d, i) => (
                <div key={i} style={schedStyles.calDay}>
                  <div style={schedStyles.calDayName}>{d}</div>
                  <div style={schedStyles.calSlots}>
                    {i < 5 && (
                      <div style={{...schedStyles.slot, background: '#00ff88', color: '#000'}}>
                        <div style={schedStyles.slotTime}>20:00</div>
                        <div style={schedStyles.slotLabel}>LIVE</div>
                      </div>
                    )}
                    {(i === 1 || i === 3) && (
                      <div style={{...schedStyles.slot, background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#fff'}}>
                        <div style={schedStyles.slotTime}>21:30</div>
                        <div style={schedStyles.slotLabel}>AULA</div>
                      </div>
                    )}
                    {i === 5 && (
                      <div style={{...schedStyles.slot, background: '#c770ff', color: '#000'}}>
                        <div style={schedStyles.slotTime}>10:00</div>
                        <div style={schedStyles.slotLabel}>MENTORIA</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div style={schedStyles.legend}>
              <span style={schedStyles.legendItem}><span style={{background: '#00ff88'}}></span> Live diária · 45min</span>
              <span style={schedStyles.legendItem}><span style={{background: '#1a1a1a', border: '1px solid #2a2a2a'}}></span> Aula principal · 90min</span>
              <span style={schedStyles.legendItem}><span style={{background: '#c770ff'}}></span> Mentoria em grupo · 2h</span>
            </div>
          </div>

          {/* Side boxes */}
          <div style={schedStyles.sideCol}>
            <div style={schedStyles.sideCard}>
              <div style={schedStyles.sideNum}>250+</div>
              <div style={schedStyles.sideLabel}>lives ao vivo / ano</div>
              <div style={schedStyles.sideDesc}>
                Todo dia útil às 20h. Lives de 45min sobre o que apareceu de novo
                em IA nas últimas 24h. Atualização em tempo real.
              </div>
            </div>
            <div style={schedStyles.sideCard}>
              <div style={schedStyles.sideNum}>2h</div>
              <div style={schedStyles.sideLabel}>mentoria ao vivo / semana</div>
              <div style={schedStyles.sideDesc}>
                Sábados 10h. Q&A técnico, review dos seus projetos,
                desbloqueio de dúvidas. Gravado para sua conveniência.
              </div>
            </div>
            <div style={schedStyles.sideCard}>
              <div style={schedStyles.sideNum}>24/7</div>
              <div style={schedStyles.sideLabel}>comunidade fechada</div>
              <div style={schedStyles.sideDesc}>
                Grupo privado. Alunos ativos da turma + equipe da Dev 360 +
                Alexandre. Resposta rápida, network real, projetos colaborativos.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const schedStyles = {
  root: { background: '#050505', padding: '120px 60px', borderTop: '1px solid #1a1a1a' },
  inner: { maxWidth: 1200, margin: '0 auto' },
  header: { marginBottom: 56, maxWidth: 780 },
  kicker: { color: '#666', fontSize: 12, letterSpacing: '0.12em', marginBottom: 20 },
  title: {
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: 'clamp(32px, 4.5vw, 60px)',
    lineHeight: 1.08, letterSpacing: -1.5,
    fontWeight: 700, color: '#fff', margin: 0,
  },
  green: { color: '#00ff88' },
  sub: { fontSize: 18, lineHeight: 1.6, color: '#888', marginTop: 20, fontFamily: '"Inter", sans-serif' },
  white: { color: '#fff', fontWeight: 600 },
  grid: { display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16 },
  calCard: { background: '#0a0a0a', border: '1px solid #1f1f1f' },
  calHeader: {
    padding: '12px 20px',
    borderBottom: '1px solid #1f1f1f',
    display: 'flex', justifyContent: 'space-between',
    fontSize: 12, color: '#666', letterSpacing: '0.06em',
  },
  calWeek: { color: '#00ff88', fontWeight: 600 },
  calGrid: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', padding: 16, gap: 8 },
  calDay: { display: 'flex', flexDirection: 'column', gap: 8, minHeight: 200 },
  calDayName: {
    fontSize: 11, color: '#666', letterSpacing: '0.12em',
    textAlign: 'center', paddingBottom: 8,
    borderBottom: '1px solid #1a1a1a',
    fontWeight: 600,
  },
  calSlots: { display: 'flex', flexDirection: 'column', gap: 6 },
  slot: { padding: '8px 6px', fontSize: 10, textAlign: 'center' },
  slotTime: { fontWeight: 700, fontFamily: '"JetBrains Mono", monospace' },
  slotLabel: { fontSize: 9, letterSpacing: '0.1em', marginTop: 2, opacity: 0.85 },
  legend: {
    padding: '14px 20px',
    borderTop: '1px solid #1f1f1f',
    display: 'flex', gap: 20, flexWrap: 'wrap',
    fontSize: 12, color: '#888',
  },
  legendItem: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
  },
  sideCol: { display: 'flex', flexDirection: 'column', gap: 16 },
  sideCard: { background: '#0a0a0a', border: '1px solid #1f1f1f', padding: '24px 24px', flex: 1 },
  sideNum: {
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: 42, fontWeight: 700,
    color: '#00ff88', letterSpacing: -2,
    lineHeight: 1,
  },
  sideLabel: {
    color: '#fff', fontSize: 14, fontWeight: 600,
    marginTop: 10, marginBottom: 12, letterSpacing: 0.2,
  },
  sideDesc: {
    fontSize: 13, lineHeight: 1.55,
    color: '#888', fontFamily: '"Inter", sans-serif',
  },
};

Object.assign(window, { Schedule });
