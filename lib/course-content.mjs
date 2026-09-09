// Shared by the visible curriculum, FAQ and structured data.
export const courseAgenda = [
  {
    tag: 'BLOCO 01', icon: 'Code', className: 'agenda-gpt',
    title: 'Prepare seu ambiente',
    description: 'Conheça as ferramentas do fluxo e organize o ambiente para acompanhar a construção, mesmo sem ser especialista.',
    bullets: ['Acessos e instalações necessárias', 'Organização dos arquivos e ambiente local', 'IA, editor, biblioteca gráfica e modelagem'],
    outcome: 'Ambiente preparado para começar a prática.',
  },
  {
    tag: 'BLOCO 02', icon: 'Brain', className: 'agenda-fable',
    title: 'Da ideia ao prompt',
    description: 'Use GPT 6 e Fable 5.1 no processo de transformar uma ideia em regras, controles e instruções de construção.',
    bullets: ['Conceito, mecânica e estilo visual', 'Prompts com contexto e critérios claros', 'Testes, revisão e correções com IA'],
    outcome: 'Uma especificação que orienta a criação do game.',
  },
  {
    tag: 'BLOCO 03', icon: 'GameController', className: 'agenda-gpt',
    title: 'Crie games 2D',
    description: 'Acompanhe um protótipo ganhar movimento, obstáculos e objetivos. Depois, explore variações da mesma mecânica.',
    bullets: ['Movimento, controles e colisões', 'Pontuação, vitória e derrota', 'Sons, interface e adaptação dos controles'],
    outcome: 'Um protótipo jogável e caminhos para evoluí-lo.',
  },
  {
    tag: 'BLOCO 04', icon: 'Stack', className: 'agenda-fable',
    title: 'Entre no universo 3D',
    description: 'Entenda o papel da cena, da câmera e da iluminação, com uma introdução ao uso de modelos do Blender no navegador.',
    bullets: ['Cena, câmera e iluminação com Three.js', 'Preparação e integração de modelos 3D', 'Teste de carregamento e desempenho'],
    outcome: 'O fluxo de um modelo 3D até um protótipo no navegador.',
  },
  {
    tag: 'BLOCO 05', icon: 'Lightning', className: 'agenda-gpt',
    title: 'Ajuste a jogabilidade',
    description: 'Veja como pequenas mudanças na lógica alteram a experiência. Use a corrida como exemplo de movimento e resposta dos controles.',
    bullets: ['Velocidade, aceleração e frenagem', 'Colisões e regras de movimento simplificadas', 'Leitura de velocidade, tempo e voltas na tela'],
    outcome: 'Comparar o comportamento antes e depois de cada ajuste.',
  },
  {
    tag: 'BLOCO 06', icon: 'GlobeHemisphereWest', className: 'agenda-arcade',
    title: 'Publique seu arcade',
    description: 'Reúna os games em um catálogo visual e acompanhe o caminho para transformar o projeto em um endereço acessível.',
    bullets: ['Cards, catálogo e abertura dos games', 'Navegação e adaptação para celular', 'Domínio, hospedagem e publicação'],
    outcome: 'Um portal organizado e o processo de colocá-lo no ar.',
  },
]

export const courseFaq = [
  { q: 'Quando acontece a imersão?', a: 'No dia 26 de setembro de 2026, online e ao vivo, com início às 08h, no horário de Brasília.' },
  { q: 'Preciso saber programar?', a: 'Você não precisa ser especialista. A construção será guiada passo a passo. Quem já tem alguma familiaridade com lógica ou desenvolvimento tende a avançar mais rápido, mas o foco é mostrar o fluxo completo com IA.' },
  { q: 'O que eu vou construir?', a: 'Você acompanhará a criação de protótipos de games 2D e 3D, os testes e ajustes de jogabilidade e a montagem de um portal visual para reuni-los. A prática combina projetos guiados, variações e demonstrações, sem uma quantidade fixa de games completos prometida.' },
  { q: 'Quais ferramentas e motores de jogo serão abordados?', a: 'O foco é criar protótipos para navegador com apoio de IA. Os exemplos usam tecnologias web, como JavaScript e Canvas no 2D, Three.js para gráficos 3D e Blender na preparação de modelos. Three.js é uma biblioteca gráfica, não uma engine completa. A imersão não é uma formação completa em Unity, Unreal ou Godot e não inclui licenças desses motores.' },
  { q: 'Vou aprender a ajustar aceleração, frenagem e física?', a: 'Sim. Vamos mostrar como alterações em velocidade, aceleração, frenagem e colisões afetam a jogabilidade, usando lógica de movimento simplificada. O objetivo é entender e ajustar o comportamento de um protótipo, não desenvolver uma simulação automotiva validada.' },
  { q: 'O conteúdo inclui telemetria?', a: 'Os exemplos de corrida mostram indicadores na tela, como velocidade, tempo e voltas. Esses indicadores ajudam a observar os ajustes, mas não representam uma plataforma de telemetria com histórico, gráficos, exportação ou integração com simuladores. Esses recursos avançados não fazem parte do conteúdo anunciado.' },
  { q: 'Terá criação de games multiplayer?', a: 'Multiplayer está em avaliação e não integra o conteúdo garantido da imersão neste momento. Os exemplos podem ter adversários controlados pelo computador, o que não equivale a multiplayer online.' },
  { q: 'Ferramentas, domínio e hospedagem estão incluídos?', a: 'A inscrição não inclui planos pagos, créditos de ferramentas de terceiros, domínio ou hospedagem. Alexandre apresentará as opções usadas e o processo de publicação. A contratação desses serviços é separada.' },
  { q: 'A aula ficará gravada?', a: 'Sim. Quem adquirir a imersão poderá assistir à gravação durante 3 meses.' },
  { q: 'Os arquivos dos projetos estão incluídos?', a: 'Não. A inscrição inclui a imersão ao vivo e o acesso à gravação por 3 meses. Os arquivos dos projetos serão oferecidos separadamente como item opcional no checkout.' },
  { q: 'Como recebo o acesso?', a: 'Após a confirmação da compra, as instruções de acesso serão enviadas pelos canais informados no checkout.' },
]

export const courseFaqSchema = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: courseFaq.map(item => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: item.a } })),
}
