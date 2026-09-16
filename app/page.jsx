'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import {
  ArrowRight,
  Brain,
  CalendarBlank,
  CaretDown,
  Check,
  CheckCircle,
  Code,
  GameController,
  GlobeHemisphereWest,
  Lightning,
  Play,
  RocketLaunch,
  Stack,
  Timer,
  Trophy,
  UserFocus,
  X,
} from '@phosphor-icons/react'
import alexandrePhoto from '../assets/alexandre.png'
import MiniGameHub from '../components/MiniGameHub'
import HeroGameCarousel from '../components/HeroGameCarousel'
import CookiePreferencesButton from '../components/CookiePreferencesButton'
import { courseAgenda as agenda, courseFaq as faqItems, courseFaqSchema as faqSchema } from '../lib/course-content.mjs'

const checkoutUrl = process.env.NEXT_PUBLIC_CHECKOUT_URL || 'https://wizmarket.com.br/checkout/ai-game-lab?offer=imersao-lore1'

const outcomes = [
  { icon: Brain, number: '01', title: 'Dominar os novos modelos', body: 'Entenda, na prática, como pensar e trabalhar com GPT 6 e Fable 5.1, onde cada um brilha e como combiná-los no mesmo fluxo.' },
  { icon: GameController, number: '02', title: 'Criar um game jogável', body: 'Saia da ideia para a mecânica, interface, pontuação e game loop usando IA como parceira de criação e desenvolvimento.' },
  { icon: Stack, number: '03', title: 'Montar seu portal de games', body: 'Construa um catálogo visual inspirado nos grandes portais de jogos, pronto para reunir e apresentar suas criações.' },
  { icon: GlobeHemisphereWest, number: '04', title: 'Colocar o projeto no ar', body: 'Organize a aplicação e entenda o caminho de publicação para transformar o experimento em um endereço acessível de verdade.' },
]

const agendaIcons = { Code, Brain, GameController, Stack, Lightning, GlobeHemisphereWest }

const eventSchema = {
  '@context': 'https://schema.org', '@type': 'EducationEvent',
  name: 'Imersão GPT 6 + Fable 5.1: Games com IA',
  description: 'Imersão online e ao vivo com Alexandre Boyago sobre GPT 6, Fable 5.1, criação de games com IA e construção de um portal de jogos.',
  startDate: '2026-09-26T08:00:00-03:00', eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
  location: { '@type': 'VirtualLocation' }, organizer: { '@type': 'Person', name: 'Alexandre Boyago' },
  performer: { '@type': 'Person', name: 'Alexandre Boyago' },
  offers: { '@type': 'Offer', price: '49.00', priceCurrency: 'BRL', availability: 'https://schema.org/InStock', validFrom: '2026-09-06' },
}

function CheckoutLink({ className = '', children, onUnavailable, label }) {
  const handleClick = (event) => {
    if (!checkoutUrl) { event.preventDefault(); onUnavailable() }
  }
  return <a className={className} href={checkoutUrl || '#oferta'} target={checkoutUrl ? '_blank' : undefined} onClick={handleClick} aria-label={label} data-analytics-event={checkoutUrl ? 'checkout_click' : undefined} data-button-id={className.split(' ')[0]} rel={checkoutUrl ? 'noopener noreferrer' : undefined}>{children}</a>
}

function FAQ() {
  const [open, setOpen] = useState(0)
  return (
    <div className="faq-list">
      {faqItems.map((item, index) => {
        const isOpen = open === index
        return (
          <article className={`faq-item ${isOpen ? 'open' : ''}`} key={item.q}>
            <button type="button" aria-expanded={isOpen} aria-controls={`faq-answer-${index}`} onClick={() => setOpen(isOpen ? -1 : index)}><span>{String(index + 1).padStart(2, '0')}</span><strong>{item.q}</strong><CaretDown weight="bold" /></button>
            <div className="faq-answer" id={`faq-answer-${index}`} aria-hidden={!isOpen}><p>{item.a}</p></div>
          </article>
        )
      })}
    </div>
  )
}

export default function Home() {
  const [toast, setToast] = useState(false)
  const [daysLeft, setDaysLeft] = useState(null)
  const [selectedGame, setSelectedGame] = useState('frontier')
  const [raceLive, setRaceLive] = useState(false)

  useEffect(() => {
    const target = new Date('2026-09-26T00:00:00-03:00')
    const update = () => setDaysLeft(Math.max(0, Math.ceil((target.getTime() - Date.now()) / 86400000)))
    update(); const timer = window.setInterval(update, 60000)
    return () => window.clearInterval(timer)
  }, [])

  const showCheckoutNotice = () => { setToast(true); window.setTimeout(() => setToast(false), 4200) }

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <header className="topbar">
        <a className="brand" href="#inicio" aria-label="Ir para o início"><span className="brand-mark">AB</span><span>AI GAME LAB</span></a>
        <nav className="desktop-nav" aria-label="Navegação principal"><a href="#imersao">A imersão</a><a href="#conteudo">Grade da imersão</a><a href="#mentor">Mentor</a><a href="#faq">FAQ</a></nav>
        <div className="topbar-meta"><span><CalendarBlank weight="fill" /> 26 SET · 08H · AO VIVO</span><CheckoutLink className="mini-cta" onUnavailable={showCheckoutNotice} label="Garantir vaga na imersão">GARANTIR VAGA <ArrowRight /></CheckoutLink></div>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-noise" aria-hidden="true" />
        <div className="hero-copy">
          <div className="eyebrow"><span className="live-dot" /> IMERSÃO INÉDITA · GPT 6 + FABLE 5.1</div>
          <h1>Do prompt ao <span>game no ar.</span></h1>
          <p className="hero-lead">Descubra as novidades de GPT 6 e Fable 5.1, crie games com IA e construa sua própria página de jogos. Tudo em uma imersão prática, ao vivo.</p>
          <div className="hero-actions">
            <CheckoutLink className="primary-cta hero-primary-cta" onUnavailable={showCheckoutNotice} label="Participar da imersão"><Play weight="fill" /> QUERO PARTICIPAR <ArrowRight weight="bold" /></CheckoutLink>
            <div className="event-note"><strong>SÁBADO · 26/09/2026 · 08H</strong><span>Online e ao vivo com Alexandre Boyago</span></div>
          </div>
          <div className="trust-row" aria-label="Destaques da imersão"><span><CheckCircle weight="fill" /> Demonstrações práticas</span><span><CheckCircle weight="fill" /> Construção ao vivo</span><span><CheckCircle weight="fill" /> Investimento único</span></div>
        </div>
        <HeroGameCarousel onPlay={(gameId) => { setSelectedGame(gameId); setRaceLive(gameId === 'frontier') }} />
      </section>

      <section className="proof-strip" aria-label="Experiência do especialista"><p><strong>26+ anos</strong> criando tecnologia</p><i /><p><strong>9.500+</strong> alunos</p><i /><p><strong>Uma imersão.</strong> Um projeto real no ar.</p></section>

      <section className="outcomes section-light" id="imersao">
        <div className="section-shell">
          <div className="section-intro dark-intro"><span className="section-kicker">// O QUE VOCÊ VAI CRIAR</span><h2>Você não vai só assistir. <br /><em>Vai construir.</em></h2><p>Uma aula concentrada em execução: ver, fazer, testar e publicar enquanto aprende a operar os novos modelos.</p></div>
          <div className="outcome-grid">
            {outcomes.map((item) => { const Icon = item.icon; return <article className="outcome-card" key={item.number}><div className="outcome-top"><span>{item.number}</span><Icon weight="duotone" /></div><h3>{item.title}</h3><p>{item.body}</p></article> })}
          </div>
        </div>
      </section>

      <section className="build-section" aria-labelledby="build-title">
        <div className="section-shell build-shell">
          <div className="build-copy"><span className="section-kicker light-kicker">// BUILD SESSION, NÃO PALESTRA</span><h2 id="build-title">Uma ideia entra. <br /><span>O game ganha vida.</span></h2><p>Você acompanha o raciocínio inteiro, inclusive as escolhas, erros, ajustes e atalhos que transformam uma conversa com IA em software jogável.</p>
            <div className="build-steps"><div><span>00</span><strong>IDEIA</strong><small>conceito + mecânica</small></div><ArrowRight /><div><span>01</span><strong>BUILD</strong><small>game + interface</small></div><ArrowRight /><div><span>02</span><strong>SHIP</strong><small>portal publicado</small></div></div>
          </div>
          <div className="code-card" aria-label="Exemplo visual do fluxo de criação com IA">
            <div className="code-head"><span>game-spec.prompt</span><span>● LIVE BUILD</span></div>
            <div className="code-body"><p><i>01</i><span className="purple">const</span> ideia = <span className="green">&quot;arcade espacial&quot;</span>;</p><p><i>02</i><span className="purple">const</span> engine = <span className="green">&quot;IA + criatividade&quot;</span>;</p><p><i>03</i></p><p><i>04</i><span className="purple">await</span> createGame({'{'}</p><p><i>05</i>&nbsp;&nbsp;mechanic: <span className="green">&quot;one-click&quot;</span>,</p><p><i>06</i>&nbsp;&nbsp;style: <span className="green">&quot;neon retro&quot;</span>,</p><p><i>07</i>&nbsp;&nbsp;fun: <span className="orange">true</span>,</p><p><i>08</i>{'}'});</p><p><i>09</i></p><p className="success"><i>10</i>✓ build finalizado em tempo real_</p></div>
            <div className="code-foot"><span>GPT 6</span><span>+</span><span>FABLE 5.1</span><strong>READY</strong></div>
          </div>
        </div>
      </section>

      <section className="curriculum section-light" id="conteudo" aria-labelledby="curriculum-title">
        <div className="section-shell">
          <div className="section-intro curriculum-head dark-intro"><div><span className="section-kicker">// GRADE DA IMERSÃO</span><h2 id="curriculum-title">Seis etapas. <br /><em>Do ambiente ao game no ar.</em></h2></div><p>Prepare as ferramentas, crie protótipos 2D e 3D, ajuste a jogabilidade e reúna suas criações em um portal. Você acompanha o processo, do primeiro prompt à publicação.</p></div>
          <div className="curriculum-meta"><span><CalendarBlank weight="duotone" /> 26/09/2026 · A partir das 08h de Brasília</span><span><Play weight="fill" /> Online e ao vivo</span><span><Timer weight="duotone" /> Gravação por 3 meses</span></div>
          <div className="agenda-grid" aria-label="Seis blocos da grade da imersão">
            {agenda.map((block) => {
              const Icon = agendaIcons[block.icon]
              return <article className={`agenda-card ${block.className}`} key={block.tag}>
                <div className="agenda-tag"><span>{block.tag}</span><Icon weight="duotone" aria-hidden="true" /></div>
                <h3>{block.title}</h3><p>{block.description}</p>
                <ul>{block.bullets.map((bullet) => <li key={bullet}><Check weight="bold" aria-hidden="true" /> {bullet}</li>)}</ul>
                <div className="agenda-outcome"><span>NA PRÁTICA</span><p>{block.outcome}</p></div>
              </article>
            })}
          </div>
          <div className="curriculum-scope"><strong>O que você acompanha</strong><p>Projetos guiados, variações de mecânica e demonstrações para navegador. Os ajustes de movimento usam lógica simplificada de jogo; multiplayer e telemetria avançada não estão incluídos no conteúdo garantido.</p><p>A inscrição inclui a aula e a gravação por 3 meses. O pacote de arquivos completos dos projetos é um adicional opcional no checkout.</p><a href="#faq">Confira ferramentas, acessos e materiais <ArrowRight weight="bold" /></a></div>
        </div>
      </section>

      <section className="arcade-showcase" id="playground">
        <div className="section-shell">
          <div className="arcade-head"><div><span className="section-kicker light-kicker">// SEU PORTAL DE GAMES COM IA</span><h2>Nove ideias. <br /><span>Todas para jogar agora.</span></h2></div><p>Use os cards para trocar de experiência sem sair da página. Conheça também Canto Azul, uma aventura brasileira sobre exploração, natureza e preservação.</p></div>
          <MiniGameHub selected={selectedGame} onSelect={setSelectedGame} raceLive={raceLive} onRaceLiveChange={setRaceLive} />
        </div>
      </section>

      <section className="mentor mentor-dark" id="mentor">
        <div className="section-shell mentor-shell">
          <div className="mentor-portrait"><div className="portrait-ring" /><Image src={alexandrePhoto} alt="Alexandre Boyago, mentor da imersão GPT 6 e Fable 5.1" priority={false} /><div className="mentor-badge"><span>26+</span> ANOS <br />CRIANDO</div></div>
          <div className="mentor-copy"><span className="section-kicker">// QUEM VAI CONSTRUIR COM VOCÊ</span><h2>Alexandre <br /><em>Boyago.</em></h2><p className="mentor-lead">Dev, designer e construtor de produtos digitais, antes mesmo de “build in public” virar expressão da moda.</p><p>São mais de 26 anos transformando tecnologia em projetos reais e mais de 9.500 alunos acompanhando esse método. Na imersão, Alexandre abre o processo: da tela em branco ao projeto funcionando.</p><div className="mentor-stats"><div><strong>9.500+</strong><span>alunos</span></div><div><strong>7</strong><span>produtos no ar</span></div><div><strong>100%</strong><span>mão na massa</span></div></div></div>
        </div>
      </section>

      <section className="audience">
        <div className="section-shell audience-shell">
          <div className="audience-copy"><span className="section-kicker light-kicker">// PARA QUEM É</span><h2>Se você quer fazer, <br /><span>você é o player&nbsp;1.</span></h2></div>
          <div className="audience-list"><div><UserFocus weight="duotone" /><p><strong>Criadores curiosos</strong><span>que querem transformar ideias em experiências interativas.</span></p></div><div><Code weight="duotone" /><p><strong>Devs e designers</strong><span>que querem acelerar o trabalho e experimentar os novos modelos.</span></p></div><div><RocketLaunch weight="duotone" /><p><strong>Empreendedores digitais</strong><span>que enxergam games e IA como novas superfícies de produto.</span></p></div><div><Lightning weight="duotone" /><p><strong>Quem aprende construindo</strong><span>e não quer esperar “estar pronto” para colocar algo no ar.</span></p></div></div>
        </div>
      </section>

      <section className="offer section-light" id="oferta">
        <div className="section-shell offer-shell">
          <div className="offer-copy dark-intro">
            <div><span className="section-kicker">// SUA VAGA NA IMERSÃO</span><h2>Um sábado para <br /><em>mudar seu jeito de criar.</em></h2></div>
            <div className="offer-summary"><p>Conheça os modelos enquanto acompanha um game sair do prompt, ganhar jogabilidade e chegar ao navegador.</p><div className="countdown-line"><Timer weight="duotone" /><div><strong>{daysLeft === null ? '…' : daysLeft} dias</strong><span>até a imersão, dia 26/09 às 08h</span></div></div></div>
          </div>

          <div className="pricing-lots" aria-label="Lotes de inscrição da imersão">
            <article className="price-card price-card-active">
              <div className="price-head"><span>1º LOTE · LIBERADO</span><span>QUASE ESGOTADO</span></div>
              <div className="lot-progress-copy"><strong>ÚLTIMAS VAGAS DESTE LOTE</strong><span>Próximo valor: R$ 97</span></div>
              <div className="lot-progress" role="progressbar" aria-label="Oitenta e dois por cento do primeiro lote preenchido" aria-valuemin="0" aria-valuemax="100" aria-valuenow="82"><i /></div>
              <h3>GPT 6 + <br />Fable 5.1</h3>
              <ul><li><CheckCircle weight="fill" /> Imersão online e ao vivo às 08h</li><li><CheckCircle weight="fill" /> Games e portal construídos na prática</li><li><CheckCircle weight="fill" /> Gravação disponível por 3 meses</li></ul>
              <div className="price-label">DE <s>R$ 149</s> POR APENAS</div><div className="price"><span>R$</span><strong>49</strong><small>,00</small></div>
              <CheckoutLink className="price-cta" onUnavailable={showCheckoutNotice} label="Garantir minha vaga no primeiro lote por quarenta e nove reais">GARANTIR MINHA VAGA <ArrowRight weight="bold" /></CheckoutLink><p className="secure-note">Pagamento único em ambiente seguro</p>
            </article>

            <article className="price-card price-card-upcoming" aria-label="Segundo lote por noventa e sete reais, ainda não liberado">
              <div className="price-head"><span>2º LOTE</span><span>EM BREVE</span></div><h3>Segundo <br />lote</h3><p>O mesmo acesso completo, liberado após o encerramento do primeiro lote.</p><div className="price-label">VALOR DO PRÓXIMO LOTE</div><div className="price"><span>R$</span><strong>97</strong><small>,00</small></div><span className="lot-locked">AINDA NÃO LIBERADO</span>
            </article>

            <article className="price-card price-card-upcoming" aria-label="Terceiro lote por cento e quarenta e nove reais, ainda não liberado">
              <div className="price-head"><span>3º LOTE</span><span>VALOR FINAL</span></div><h3>Terceiro <br />lote</h3><p>Última etapa de inscrições antes do fechamento das vagas para a imersão.</p><div className="price-label">VALOR FINAL</div><div className="price"><span>R$</span><strong>149</strong><small>,00</small></div><span className="lot-locked">AINDA NÃO LIBERADO</span>
            </article>
          </div>
        </div>
      </section>

      <section className="faq-section" id="faq"><div className="section-shell faq-shell"><div className="faq-head"><span className="section-kicker light-kicker">// FAQ</span><h2>Perguntas <br /><span>frequentes.</span></h2><p>O essencial para você decidir se esta imersão é o próximo passo certo.</p></div><FAQ /></div></section>

      <section className="final-cta"><div className="final-glow" /><div className="section-shell final-shell"><GameController weight="duotone" /><span className="section-kicker light-kicker">26 DE SETEMBRO · 08H · ONLINE E AO VIVO</span><h2>Seu próximo game não <br />precisa ficar no prompt.</h2><p>Venha criar, testar e publicar com GPT 6 e Fable 5.1.</p><CheckoutLink className="primary-cta final-button" onUnavailable={showCheckoutNotice} label="Quero criar meu game com inteligência artificial"><Trophy weight="fill" /> QUERO CRIAR MEU GAME <ArrowRight weight="bold" /></CheckoutLink></div></section>

      <footer><div className="footer-shell"><a className="brand footer-brand" href="#inicio"><span className="brand-mark">AB</span><span>AI GAME LAB</span></a><p>Imersão GPT 6 + Fable 5.1 <br />com Alexandre Boyago.</p><nav aria-label="Navegação do rodapé"><a href="#imersao">A imersão</a><a href="#conteudo">Grade da imersão</a><a href="#mentor">Mentor</a><a href="#faq">FAQ</a></nav><span className="footer-legal"><span>© 2026 Alexandre Boyago</span><CookiePreferencesButton /></span></div></footer>

      <div className={`checkout-toast ${toast ? 'show' : ''}`} role="status" aria-live="polite"><div><strong>Inscrições quase abertas.</strong><span>O link do checkout será conectado aqui em seguida.</span></div><button type="button" onClick={() => setToast(false)} aria-label="Fechar aviso"><X weight="bold" /></button></div>
      <div className="mobile-buy-bar"><div><span>1º LOTE · QUASE ESGOTADO</span><strong>R$ 49</strong></div><CheckoutLink onUnavailable={showCheckoutNotice} label="Garantir vaga na imersão">GARANTIR VAGA <ArrowRight weight="bold" /></CheckoutLink></div>
    </main>
  )
}
