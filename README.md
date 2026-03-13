# Marcelo Victor Imóveis - Site Imobiliário

Site moderno para corretor de imóveis construído com Next.js 15, Tailwind CSS e Sanity.io como CMS.

## 🚀 Funcionalidades

- ✅ Design responsivo e moderno
- ✅ Integração completa com Sanity.io
- ✅ Carousel automático de banner (6 imagens, 5s cada)
- ✅ Galeria de imagens para imóveis
- ✅ Vídeos do YouTube incorporados
- ✅ Sistema de depoimentos
- ✅ Formulários de contato
- ✅ SEO otimizado
- ✅ Integração com WhatsApp
- ✅ Google Maps integrado
- ✅ Tours virtuais 360°
- ✅ Cores personalizáveis via Sanity

## 📋 Variáveis de Ambiente Necessárias

Configure as seguintes variáveis de ambiente no seu projeto:

\`\`\`env
NEXT_PUBLIC_SANITY_PROJECT_ID=98pdr6kx
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
\`\`\`

**Nota:** Não é necessário token de API para dados públicos.

## 🛠️ Instalação e Configuração

### 1. Instalar dependências com pnpm

\`\`\`bash
pnpm install
\`\`\`

### 2. Configurar variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

\`\`\`env
NEXT_PUBLIC_SANITY_PROJECT_ID=98pdr6kx
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
\`\`\`

### 3. Executar o projeto

\`\`\`bash
# Desenvolvimento
pnpm dev

# Build para produção
pnpm build

# Executar Sanity Studio
pnpm sanity
\`\`\`

## 📁 Estrutura de Rotas

- `/` - Página inicial
- `/imoveis` - Listagem de todos os imóveis
- `/imoveis/[slug]` - Página de detalhes do imóvel

**Importante:** Utilizamos apenas `[slug]` para evitar conflitos de rotas dinâmicas.

## 🎨 Configuração do Sanity Studio

### Schemas Disponíveis:

1. **Configurações do Site** (Singleton)
   - Título e descrição do site
   - Logo e imagens do banner (até 6)
   - Textos do hero e seção sobre
   - Informações de contato
   - Links de redes sociais
   - Cores primária e secundária

2. **Imóveis**
   - Informações básicas (título, preço, localização)
   - Detalhes (área, quartos, banheiros, vagas)
   - Galeria de imagens
   - Vídeo do YouTube (ID)
   - Link do Google Maps
   - Tour virtual
   - Descrição e características
   - Status (disponível, vendido, alugado)

3. **Depoimentos**
   - Nome e localização do cliente
   - Texto do depoimento
   - Foto do cliente
   - Avaliação (1-5 estrelas)

## 🎯 Como Usar

### Configurações Iniciais no Sanity:

1. Acesse o Sanity Studio em: `https://98pdr6kx.sanity.studio`
2. Vá em "⚙️ Configurações do Site"
3. Preencha todas as informações básicas
4. Adicione até 6 imagens para o banner carousel
5. Configure as cores do tema

### Adicionando Imóveis:

1. Vá em "🏠 Imóveis" → "Create"
2. Preencha todas as informações
3. Para vídeo do YouTube: use apenas o ID (ex: `dQw4w9WgXcQ`)
4. Para Google Maps: cole o link completo do Maps
5. Marque como "Imóvel em Destaque" se necessário

### Adicionando Depoimentos:

1. Vá em "💬 Depoimentos" → "Create"
2. Preencha as informações do cliente
3. Marque como "Depoimento em Destaque" para aparecer na homepage

## 🎨 Personalização de Cores

As cores podem ser configuradas diretamente no Sanity:

- **Cor Primária**: Cor principal do site (padrão: #f97316 - laranja)
- **Cor Secundária**: Cor secundária (padrão: #1e293b - azul escuro)

Use formato hexadecimal (#RRGGBB).

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório GitHub ao Vercel
2. Configure as variáveis de ambiente no painel da Vercel
3. O deploy será automático a cada push

### Outras Plataformas

O projeto é compatível com qualquer plataforma que suporte Next.js.

## 📱 Funcionalidades Especiais

### Banner Carousel
- Até 6 imagens configuráveis
- Mudança automática a cada 5 segundos
- Redimensionamento automático com crop inteligente

### Integração com Google Maps
- Incorporação automática do mapa
- Link direto para o Google Maps
- Suporte a tours virtuais 360°

### Otimização de Imagens
- Redimensionamento automático via Sanity
- Formatos modernos (WebP)
- Lazy loading nativo

## 🔧 Tecnologias Utilizadas

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **CMS**: Sanity.io
- **Gerenciador**: pnpm
- **Deploy**: Vercel

## 📞 Suporte

Para dúvidas sobre configuração ou personalização:
- [Documentação do Next.js](https://nextjs.org/docs)
- [Documentação do Sanity.io](https://www.sanity.io/docs)

---

**Projeto configurado para usar seu Sanity existente (ID: 98pdr6kx, Dataset: production)**
