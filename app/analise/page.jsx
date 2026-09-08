import { GA_ID, SECTION_NAMES } from '../../lib/analytics.mjs'
import { analyticsReportUrl } from '../../lib/analytics-report.mjs'
import styles from './analysis.module.css'

export const metadata = {
  title: 'Análise da página | AI Game Lab',
  description: 'Acompanhamento de visitas e interações da landing page AI Game Lab.',
  robots: { index: false, follow: false, googleBot: { index: false, follow: false, nosnippet: true } },
  referrer: 'no-referrer',
  alternates: { canonical: '/analise/' },
  openGraph: { title: 'Análise | AI Game Lab', description: 'Acompanhamento da landing page.', url: '/analise/', images: [] },
  twitter: { title: 'Análise | AI Game Lab', description: 'Acompanhamento da landing page.', images: [] },
}

const events = [
  ['page_view', 'Visitas às páginas', 'Abertura da LP ou da página de obrigado. Não representa uma compra.'],
  ['section_view', 'Seções visualizadas', 'Pelo menos metade da seção ou da altura da tela visível por 2 segundos. Uma vez por visita à página.'],
  ['game_select', 'Games escolhidos', 'Clique em um card do catálogo. Não confirma que uma partida começou.'],
  ['game_open', 'Aberturas do Era Racing', 'Clique para abrir o jogo pelo destaque inicial ou pelo catálogo.'],
  ['checkout_click', 'Idas para o checkout', 'Clique em um botão de inscrição. O pagamento é confirmado na Wizmarket.'],
  ['whatsapp_click', 'Cliques para o grupo', 'Abertura do convite. Não confirma a entrada no grupo.'],
]

export default function AnalysisPage() {
  // Embedding does not add authentication. Google must enforce restricted sharing.
  // Require explicit deployment confirmation before rendering any report.
  const reportUrl = process.env.ANALYTICS_PRIVATE_REPORT_CONFIRMED === 'true'
    ? analyticsReportUrl(process.env.ANALYTICS_REPORT_EMBED_URL) : null

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <a className="brand" href="/" aria-label="Voltar à landing page"><span className="brand-mark">AB</span><span>AI GAME LAB</span></a>
        <a className={styles.textLink} href="/">Ver landing page ↗</a>
      </header>
      <div className={styles.titleRow}>
        <div><span className={styles.eyebrow}>ACOMPANHAMENTO DA LANDING PAGE</span><h1>Análise de visitas e interesse.</h1><p>Entenda quais áreas despertam interesse e quais ações levam ao checkout.</p></div>
        <div className={styles.tag}><span>ID GA4 CONFIGURADO</span><code>{GA_ID}</code></div>
      </div>

      <section className={styles.report} aria-labelledby="report-title">
        <div className={styles.reportHeader}><h2 id="report-title">Relatórios</h2><span className={reportUrl ? styles.connected : styles.pending}>{reportUrl ? 'ACESSO PELO GOOGLE' : 'FONTE NÃO CONECTADA'}</span></div>
        {reportUrl ? (
          <>
            <p className={styles.reportHelp}>Use sua conta Google autorizada para visualizar. Período e filtros ficam dentro do relatório. Se ele não abrir, confira a permissão da conta ou abra em uma nova aba.</p>
            <a className={styles.textLink} href={reportUrl} target="_blank" rel="noopener noreferrer">Abrir relatório no Google ↗</a>
            <iframe className={styles.frame} src={reportUrl} title="Relatórios privados de visitas e interações do AI Game Lab" allowFullScreen referrerPolicy="no-referrer" />
          </>
        ) : (
          <div className={styles.empty}>
            <span className={styles.emptyIcon} aria-hidden="true">↗</span>
            <div><h3>Falta conectar os seus relatórios.</h3><p>A medição está configurada no site, mas esta página ainda não tem acesso aos resultados do GA4. Nenhum número é mostrado até a conexão com uma fonte real.</p><p>O ID de medição envia eventos; ele não autoriza a leitura dos relatórios.</p>
              <div className={styles.actions}><a className={styles.primary} href="https://analytics.google.com/analytics/web/" target="_blank" rel="noopener noreferrer">Abrir Google Analytics ↗</a><a className={styles.secondary} href="https://lookerstudio.google.com/" target="_blank" rel="noopener noreferrer">Configurar relatório privado ↗</a></div>
            </div>
          </div>
        )}
      </section>

      <div className={styles.groups}>
        <section><span>01</span><h2>Visitas e origem</h2><p>Visitantes estimados, sessões, páginas vistas, origem do tráfego e tipo de dispositivo.</p></section>
        <section><span>02</span><h2>Interesse por área</h2><p>Compare as visualizações de conteúdo, jogos, mentor e oferta para identificar onde a atenção diminui.</p></section>
        <section><span>03</span><h2>Jogos e ações</h2><p>Compare games escolhidos e cliques no checkout. Clique não é compra e escolha de jogo não é partida iniciada.</p></section>
      </div>

      <section className={styles.section} aria-labelledby="events-title">
        <h2 id="events-title">O que estamos medindo</h2>
        <p>Eventos preparados no código, enviados somente após aceitar cookies. O recebimento deve ser conferido no GA4.</p>
        <div className={styles.tableWrap}><table><thead><tr><th scope="col">Indicador</th><th scope="col">Evento</th><th scope="col">Como interpretar</th></tr></thead><tbody>{events.map(([name, label, explanation]) => <tr key={name}><th scope="row">{label}</th><td><code>{name}</code></td><td>{explanation}</td></tr>)}</tbody></table></div>
        <div className={styles.sections}><strong>Áreas acompanhadas:</strong> {Object.values(SECTION_NAMES).join(' · ')}</div>
      </section>

      <section className={styles.security}>
        <h2>Dados reais, acesso controlado</h2>
        <p>Esta página não aparece no menu nem no sitemap e pede aos buscadores para não indexá-la. Isso não é uma senha: o relatório deve ser compartilhado apenas com sua conta Google, nunca publicamente.</p>
        <p>Recusas de cookies e bloqueadores reduzem a coleta. Os dados começam após a instalação; não reconstruímos visitas anteriores. Esta área de análise não envia eventos de visita para o GA4 ou o Meta Pixel.</p>
      </section>
    </main>
  )
}
