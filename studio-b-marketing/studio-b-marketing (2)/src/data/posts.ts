export interface Post {
  id: string;
  category: string;
  title: string;
  description: string;
  content: string;
  author: string;
  date: string;
  time: string;
  image?: string;
  tags: string[];
}

export const blogPosts: Post[] = [
  {
    id: "marketing-digital-telecom",
    category: "MARKETING DIGITAL",
    title: "Como o marketing digital transforma empresas de Telecom",
    description: "Descubra as estratégias que utilizamos para escalar marcas no setor de telecomunicações através de canais digitais.",
    content: `
      <p>No cenário atual, as empresas de telecomunicações enfrentam desafios únicos. A concorrência é acirrada e a fidelidade do cliente é difícil de manter. É aqui que o marketing digital entra como um divisor de águas.</p>
      
      <h2>1. Segmentação Precisa</h2>
      <p>Diferente do marketing tradicional, o digital permite que você fale diretamente com quem precisa do seu serviço. Se alguém está procurando por "internet fibra óptica em São Paulo", sua empresa deve estar lá.</p>
      
      <h2>2. Conteúdo de Valor</h2>
      <p>Não venda apenas planos. Venda conexão, entretenimento e produtividade. Criar conteúdos que ajudem o usuário a melhorar o sinal do Wi-Fi ou entender a diferença entre tecnologias cria autoridade.</p>
      
      <h2>3. Atendimento Omnichannel</h2>
      <p>O cliente de telecom quer agilidade. Integrar suas redes sociais com o atendimento via WhatsApp é fundamental para converter leads em clientes satisfeitos.</p>
      
      <p>Na Studio B, desenvolvemos metodologias específicas para o setor de Telecom, focando em ROI e redução de churn.</p>
    `,
    author: "Studio B",
    date: "15 Mar 2026",
    time: "5 min",
    image: "https://picsum.photos/seed/telecom/800/600",
    tags: ["Marketing Digital", "Telecom", "Estratégia"]
  },
  {
    id: "branding-identidade-visual",
    category: "BRANDING",
    title: "Muito Além do Logo: Por Que Sua Empresa Precisa de Uma Identidade Visual Forte",
    description: "Mais do que um símbolo, a identidade visual é o que comunica quem você é, no que acredita e por que sua marca existe.",
    content: `
      <p>Você reconhece a Coca-Cola antes mesmo de ler o nome. Um copo da Starbucks é quase um item fashion. E se vir uma maçã mordida, sabe que é Apple — simples assim.</p>
      
      <p>Essa é a força de uma identidade visual bem construída.</p>
      
      <p>Se você ainda acha que identidade visual é só escolher “um logo bonitinho”, temos uma conversa séria pra ter.</p>

      <h2>Identidade visual é percepção. E percepção é poder.</h2>
      <p>Em segundos, um potencial cliente decide se confia ou não na sua marca baseado no que ele vê. Cores, tipografia e iconografia comunicam valores sem dizer uma única palavra.</p>
      
      <h2>O que uma identidade visual forte comunica?</h2>
      <p>Profissionalismo, clareza e autoridade. Quando todos os pontos de contato da sua empresa transmitem a mesma mensagem estética e estratégica, seu valor percebido dispara no mercado.</p>

      <h2>Não é só sobre design. É sobre estratégia.</h2>
      <p>A identidade visual não existe no vácuo. Ela deve estar alinhada aos objetivos do seu negócio, ao perfil dos seus clientes ideais e ao seu posicionamento competitivo.</p>

      <h2>Quando é hora de repensar sua identidade visual?</h2>
      <p>Se sua empresa mudou de porte, expandiu os serviços, quer atrair clientes de maior ticket ou simplesmente sente que sua imagem não condiz mais com a qualidade do seu trabalho.</p>

      <h2>Sua marca merece mais do que um logo.</h2>
      <p>Investir em branding e identidade visual autoral não é um custo — é a construção de um ativo duradouro que valoriza sua empresa em todas as interações.</p>
    `,
    author: "Studio B Marketing",
    date: "12 Mar 2026",
    time: "6 min",
    image: "https://picsum.photos/seed/branding/800/600",
    tags: ["Branding", "Design", "Identidade Visual"]
  },
  {
    id: "trafego-pago-iniciantes",
    category: "TRÁFEGO PAGO",
    title: "Tráfego pago: guia completo para iniciantes",
    description: "Google Ads, Meta Ads e muito mais. Aprenda como investir de forma inteligente para gerar resultados rápidos.",
    content: `
      <p>O tráfego pago é a maneira mais rápida de colocar sua oferta na frente das pessoas certas. Mas sem estratégia, pode se tornar um ralo de dinheiro.</p>
      
      <h2>Google Ads vs Meta Ads</h2>
      <p>No Google, capturamos a <strong>intenção</strong>. O usuário está buscando ativamente por algo. No Meta (Facebook/Instagram), trabalhamos com a <strong>atenção</strong> e o interesse.</p>
      
      <h2>A Importância do Pixel</h2>
      <p>Não comece a anunciar sem configurar suas ferramentas de rastreio. O Pixel do Meta e a Tag do Google permitem que você saiba exatamente quem comprou e quem apenas visitou o site.</p>
      
      <p>Comece com pouco, teste diferentes criativos e escale o que está funcionando. O segredo do tráfego pago é a análise constante de dados.</p>
    `,
    author: "Studio B",
    date: "10 Mar 2026",
    time: "7 min",
    image: "https://picsum.photos/seed/ads/800/600",
    tags: ["Tráfego Pago", "Google Ads", "Meta Ads"]
  },
  {
    id: "design-websites-conversao",
    category: "WEB DESIGN",
    title: "Design de websites que convertem: as melhores práticas",
    description: "Um site bonito não basta. Ele precisa converter. Veja nossas dicas para criar landing pages de alta performance.",
    content: `
      <p>Ter um site é obrigatório, mas ter um site que vende é o que separa os grandes players do resto do mercado.</p>
      
      <h2>Hierarquia Visual</h2>
      <p>O que é a coisa mais importante na sua página? O botão de compra? O formulário de contato? Use o design para guiar o olho do usuário até lá.</p>
      
      <h2>Velocidade de Carregamento</h2>
      <p>Cada segundo de demora no carregamento custa dinheiro. Sites lentos aumentam a taxa de rejeição e prejudicam seu SEO.</p>
      
      <h2>Mobile First</h2>
      <p>Mais de 70% dos acessos hoje vêm de dispositivos móveis. Seu site deve ser perfeito no celular antes de ser perfeito no desktop.</p>
    `,
    author: "Studio B",
    date: "08 Mar 2026",
    time: "6 min",
    image: "https://picsum.photos/seed/webdesign/800/600",
    tags: ["Web Design", "UX/UI", "Conversão"]
  },
  {
    id: "redes-sociais-telecom-2026",
    category: "SOCIAL MEDIA",
    title: "Redes sociais para Telecom: o que funciona em 2026",
    description: "O setor de telecom tem particularidades. Veja quais conteúdos performam melhor e como engajar sua audiência.",
    content: `
      <p>As redes sociais mudaram. Em 2026, o conteúdo puramente institucional morreu. As pessoas querem conexão e entretenimento.</p>
      
      <h2>Vídeos Curtos e Dinâmicos</h2>
      <p>Mostre os bastidores da sua equipe instalando fibra, explique tecnologias complexas de forma simples em 30 segundos. O Reels e o TikTok são ferramentas poderosas de alcance.</p>
      
      <h2>Prova Social</h2>
      <p>Nada vende mais do que um cliente satisfeito falando bem da sua internet. Use depoimentos reais e cases de sucesso no seu feed.</p>
      
      <p>Interaja com sua comunidade. Responda comentários, tire dúvidas e humanize sua marca de Telecom.</p>
    `,
    author: "Studio B",
    date: "05 Mar 2026",
    time: "5 min",
    image: "https://picsum.photos/seed/social/800/600",
    tags: ["Social Media", "Telecom", "Conteúdo"]
  },
  {
    id: "importancia-seo-b2b",
    category: "MARKETING DIGITAL",
    title: "A importância do SEO para empresas B2B",
    description: "SEO não é só para e-commerce. Empresas B2B podem (e devem) investir em busca orgânica para reduzir o CAC.",
    content: `
      <p>No mercado B2B, a jornada de compra é mais longa e racional. O SEO desempenha um papel crucial em todas as etapas do funil.</p>
      
      <h2>Autoridade de Domínio</h2>
      <p>Quando um tomador de decisão busca por uma solução e encontra seu blog educando sobre o tema, você ganha autoridade imediata.</p>
      
      <h2>Palavras-chave de Cauda Longa</h2>
      <p>Foque em termos específicos do seu nicho. Em vez de apenas "software", foque em "software de gestão para empresas de logística". Menos volume, mas muito mais qualificado.</p>
      
      <p>O SEO é um investimento de longo prazo que reduz drasticamente o seu custo de aquisição de clientes (CAC) ao longo do tempo.</p>
    `,
    author: "Studio B",
    date: "02 Mar 2026",
    time: "4 min",
    image: "https://picsum.photos/seed/seo/800/600",
    tags: ["Marketing Digital", "SEO", "B2B"]
  }
];
