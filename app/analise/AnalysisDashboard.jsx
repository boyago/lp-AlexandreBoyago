'use client'

import { useEffect, useState } from 'react'
import { GA_ID } from '../../lib/analytics.mjs'
import styles from './dashboard.module.css'

export default function AnalysisDashboard() {
  const [auth, setAuth] = useState(null), [ready, setReady] = useState(true)
  const [password, setPassword] = useState(''), [days, setDays] = useState(7)
  const [report, setReport] = useState(null), [error, setError] = useState(''), [busy, setBusy] = useState(false)
  useEffect(() => {
    fetch('/api/metrics/auth/', { cache: 'no-store' }).then(r => { if (!r.ok) throw new Error(); return r.json() }).then(data => { setAuth(data.authenticated); setReady(data.configured) }).catch(() => { setAuth(false); setError('Não foi possível conectar ao servidor de métricas.') })
  }, [])
  async function load(signal) {
    setBusy(true); setError(''); setReport(null)
    try {
      const response = await fetch(`/api/metrics/report/?days=${days}`, { cache: 'no-store', signal })
      const data = await response.json()
      if (response.status === 401) setAuth(false)
      if (!response.ok) throw new Error(data.error)
      setReport(data)
    } catch (e) { if (e.name !== 'AbortError') setError(e.message || 'Falha ao carregar.') }
    finally { if (!signal?.aborted) setBusy(false) }
  }
  useEffect(() => { if (!auth) return; const controller = new AbortController(); void load(controller.signal); return () => controller.abort() }, [auth, days])
  async function login(event) {
    event.preventDefault(); setBusy(true); setError('')
    try {
      const response = await fetch('/api/metrics/auth/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      setPassword(''); setAuth(true)
    } catch (e) { setError(e.message || 'Falha ao entrar.') } finally { setBusy(false) }
  }
  async function logout() {
    try { const response = await fetch('/api/metrics/auth/', { method: 'DELETE' }); if (!response.ok) throw new Error(); setAuth(false); setReport(null) }
    catch { setError('Não foi possível sair. Tente novamente.') }
  }
  const number = value => value.toLocaleString('pt-BR')
  function reachTable(title, rows) {
    return <section className={styles.panel}><h2>{title}</h2><p>Sessões da LP que alcançaram cada ponto no período.</p>{rows.map(row => {
      const percent = report.landingSessions ? Math.round(row.count / report.landingSessions * 100) : 0
      return <div className={styles.reach} key={row.label}><div><span>{row.label}</span><strong>{number(row.count)} <small>({percent}%)</small></strong></div><div className={styles.track}><span style={{ width: `${percent}%` }} /></div></div>
    })}</section>
  }
  return <main className={styles.page}>
    <header><a href="/">AB <span>AI GAME LAB</span></a>{auth && <button onClick={logout}>Sair do painel</button>}</header>
    <div className={styles.heading}><span>PAINEL PRIVADO · DADOS PRÓPRIOS</span><h1>Da visita ao clique.</h1><p>Acompanhe o interesse na sua página sem depender dos relatórios do Google.</p></div>
    {error && <p role="alert" className={styles.error}>{error}</p>}
    {auth === null ? <p role="status">Verificando acesso…</p> : !auth ? <section className={`${styles.panel} ${styles.login}`}><h2>Acesso do administrador</h2>{!ready ? <p>O painel está preparado, mas falta configurar o MySQL, o endereço do site e as credenciais no servidor. Nenhum número de demonstração é exibido.</p> : <form onSubmit={login}><label htmlFor="metrics-password">Senha do painel</label><input id="metrics-password" type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" required maxLength={256} /><button disabled={busy} type="submit">{busy ? 'Entrando…' : 'Entrar com segurança'}</button></form>}</section> : <>
      <div className={styles.toolbar}><label>Período <select value={days} onChange={e => setDays(Number(e.target.value))}>{[1,7,30,90].map(d => <option key={d} value={d}>{d === 1 ? 'Últimas 24 horas' : `Últimos ${d} dias`}</option>)}</select></label><button onClick={() => load()} disabled={busy}>{busy ? 'Carregando…' : 'Atualizar dados'}</button><a href="https://analytics.google.com/analytics/web/" target="_blank" rel="noopener noreferrer">Comparar no GA4 ↗</a></div>
      {report && <>
        <p className={styles.caption}>Atualizado em {new Date(report.until).toLocaleString('pt-BR')} · {report.storage === 'development' ? 'BASE LOCAL DE DESENVOLVIMENTO, não representa o domínio publicado' : 'Banco MySQL do site'}</p>
        {!report.pageViews && <p className={styles.empty}>Nenhuma visualização registrada neste período. A coleta começa após a ativação e o aceite dos cookies.</p>}
        <div className={styles.stats}>{[['Visitantes estimados',report.visitors],['Sessões registradas',report.sessions],['Visualizações de página',report.pageViews],['Cliques no checkout',report.checkout],['Visitas ao obrigado',report.thankYou],['Cliques no WhatsApp',report.whatsapp]].map(([label,value]) => <article key={label}><span>{label}</span><strong>{number(value)}</strong></article>)}</div>
        <section className={styles.panel}><h2>Da LP para o checkout</h2><p><strong>{number(report.checkoutSessions)} de {number(report.landingSessions)} sessões</strong> da landing page tiveram clique de inscrição ({report.landingSessions ? (report.checkoutSessions / report.landingSessions * 100).toFixed(1) : '0'}%).</p><p>Cliques não confirmam pagamento. A página de obrigado pode ser aberta diretamente. O clique no convite não confirma entrada no grupo.</p></section>
        <div className={styles.columns}>{reachTable('Até onde viram as seções', report.sections)}{reachTable('Profundidade da página', report.scroll)}</div>
        <div className={styles.columns}><section className={styles.panel}><h2>Interesse nos games</h2><div className={styles.table}><table><thead><tr><th>Game</th><th>Card clicado</th><th>Abrir jogo*</th></tr></thead><tbody>{report.games.map(row => <tr key={row.label}><th>{row.label}</th><td>{row.count}</td><td>{row.opens}</td></tr>)}</tbody></table></div><p>*Abertura instrumentada para o Era Racing. Não mede partidas iniciadas ou concluídas.</p></section><section className={styles.panel}><h2>Botões de inscrição</h2>{report.buttons.length ? report.buttons.map(row => <div className={styles.buttonRow} key={row.label}><code>{row.label}</code><strong>{row.count} cliques</strong></div>) : <p>Ainda não há cliques registrados no período.</p>}</section></div>
      </>}
    </>}
    <footer>Somente navegação com consentimento. Cookies diferentes, bloqueadores e recusas causam diferenças entre o contador, o GA4 ({GA_ID}) e o Meta. Visitantes são estimativas por navegador, não pessoas identificadas. O painel não consulta os resultados do Meta nem reconstrói visitas anteriores.</footer>
  </main>
}
