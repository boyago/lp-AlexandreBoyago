'use client'

import { useEffect, useState } from 'react'
import { ArrowUpRight, WhatsappLogo, Check } from '@phosphor-icons/react'
import { INVITE_PROGRESS_LIMIT, inviteProgressAt } from '../../lib/whatsapp.mjs'
import styles from './thank-you.module.css'
import CookiePreferencesButton from '../../components/CookiePreferencesButton'

export default function ThankYou({ groupUrl }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!groupUrl) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setProgress(INVITE_PROGRESS_LIMIT)
      return
    }
    const started = performance.now()
    let frame
    function animate(now) {
      const next = inviteProgressAt(now - started)
      setProgress(next)
      if (next < INVITE_PROGRESS_LIMIT) frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [groupUrl])

  return (
    <main className={styles.page}>
      <a className={`brand ${styles.brand}`} href="/" aria-label="AI Game Lab, voltar ao início"><span className="brand-mark">AB</span><span>AI GAME LAB</span></a>
      <section className={styles.card} aria-labelledby="thanks-title">
        <span className={styles.kicker}>PRÓXIMO PASSO · NOS ENCONTRAMOS NO GRUPO</span>
        <h1 id="thanks-title">Obrigado por escolher<br /><em>criar com a gente.</em></h1>
        <p className={styles.intro}>Entre no grupo da imersão no WhatsApp para acompanhar os avisos e as orientações da aula com Alexandre Boyago.</p>
        <div className={styles.date}><Check weight="bold" aria-hidden="true" /><span>26 de setembro de 2026 · 08h<br /><small>Online e ao vivo · Horário de Brasília</small></span></div>
        <div className={styles.access}>
          <WhatsappLogo size={36} aria-hidden="true" />
          <h2>Falta pouco para você estar com a turma!</h2>
          {groupUrl ? (
            <>
              <p>O último passo é seu: clique no botão abaixo para abrir o convite e entrar no grupo da imersão.</p>
              <div className={styles.progressLabel}><span>{progress === INVITE_PROGRESS_LIMIT ? 'Falta só você entrar no grupo!' : 'Falta pouco…'}</span><strong>{progress}%</strong></div>
              <div className={styles.progressTrack} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} aria-label="Etapas para participar do grupo" aria-valuetext={`${progress} por cento. A etapa final é clicar para entrar no grupo.`}>
                <span className={styles.progressFill} style={{ width: `${progress}%` }} />
              </div>
              <a className={styles.join} href={groupUrl} rel="noopener noreferrer nofollow" referrerPolicy="no-referrer" data-analytics-event="whatsapp_click" data-button-id="thank-you-group">ENTRAR NO GRUPO DA IMERSÃO <ArrowUpRight size={22} aria-hidden="true" /></a>
              <p className={styles.manual}>Sem redirecionamento automático. Você entra quando quiser.</p>
            </>
          ) : (
            <p className={styles.pending}>O convite do grupo estará disponível em breve. Consulte também as orientações de acesso enviadas pela Wizmarket.</p>
          )}
        </div>
        <p className={styles.note}>A confirmação do pagamento e o acesso à gravação são enviados pela Wizmarket. Confira seu e-mail, inclusive a caixa de spam. Ao entrar no grupo, seu número poderá ficar visível aos demais participantes.</p>
      </section>
      <footer className={styles.footer}><a className={styles.back} href="/">Voltar para a página da imersão</a><CookiePreferencesButton /></footer>
    </main>
  )
}
