# Marcelo Victor Imóveis - Site Imobiliário

Este é um site moderno para corretores de imóveis, construído com Next.js 14, Tailwind CSS e Sanity.io como CMS.

## Funcionalidades

- ✅ Design responsivo e moderno
- ✅ Integração completa com Sanity.io
- ✅ Galeria de imagens para imóveis
- ✅ Vídeos do YouTube incorporados
- ✅ Sistema de depoimentos
- ✅ Formulários de contato
- ✅ SEO otimizado
- ✅ Integração com WhatsApp

## Configuração do Sanity.io

### 1. Criar projeto no Sanity

1. Acesse [sanity.io](https://sanity.io) e crie uma conta
2. Crie um novo projeto
3. Anote o `Project ID` e `Dataset` (geralmente "production")

### 2. Configurar variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

\`\`\`env
NEXT_PUBLIC_SANITY_PROJECT_ID=seu_project_id_aqui
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_TOKEN=seu_token_aqui
\`\`\`

### 3. Instalar dependências

\`\`\`bash
npm install
\`\`\`

### 4. Configurar o Sanity Studio

\`\`\`bash
# Fazer login no Sanity
npx sanity login

# Fazer deploy dos schemas
npx sanity deploy
\`\`\`

### 5. Acessar o Sanity Studio

Após o deploy, você pode acessar o painel administrativo em:
`https://seu-project-id.sanity.studio`

## Estrutura do Conteúdo

### Imóveis (Properties)
- Título, preço, localização
- Área, quartos, banheiros, vagas
- Galeria de imagens
- Vídeo do YouTube (ID do vídeo)
- Descrição detalhada
- Lista de características
- Status (disponível, vendido, alugado)

### Depoimentos (Testimonials)
- Nome e localização do cliente
- Texto do depoimento
- Foto do cliente
- Avaliação (1-5 estrelas)

### Configurações do Site (Site Settings)
- Informações gerais (título, descrição)
- Imagens (logo, hero, sobre)
- Textos personalizáveis
- Informações de contato
- Links de redes sociais

## Como Usar

### Adicionando Imóveis

1. Acesse o Sanity Studio
2. Vá em "Imóvel" → "Create"
3. Preencha todas as informações
4. Para o vídeo do YouTube:
   - Copie apenas o ID do vídeo (ex: se a URL é `https://youtube.com/watch?v=ABC123`, use apenas `ABC123`)
5. Marque como "Imóvel em Destaque" se quiser que apareça na homepage

### Personalizando o Site

1. Vá em "Configurações do Site"
2. Edite textos, imagens e informações de contato
3. As mudanças aparecerão automaticamente no site

### Adicionando Depoimentos

1. Vá em "Depoimento" → "Create"
2. Preencha as informações do cliente
3. Marque como "Depoimento em Destaque" para aparecer na homepage

## Novas Funcionalidades

### Banner Carousel
- Adicione até 6 imagens no Sanity em "Configurações do Site" → "Imagens do Banner"
- As imagens mudam automaticamente a cada 5 segundos
- Redimensionamento automático para qualquer tamanho de imagem

### Botão "Adicionar Imóvel Modelo"
- No Sanity Studio, ao visualizar a lista de imóveis, clique em "Adicionar Imóvel Modelo"
- Cria automaticamente um imóvel com dados fictícios
- Edite todas as informações e adicione suas próprias imagens
- Para remover: clique nos 3 pontos → "Delete"

### Integração com Google Maps
- Adicione o link do Google Maps no campo "Link do Google Maps"
- O mapa será incorporado automaticamente na página do imóvel

### Tour Virtual
- Adicione o link do tour virtual 360° no campo correspondente
- Aparecerá como botão na seção de localização

## Desenvolvimento

\`\`\`bash
# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar Sanity Studio localmente
npm run sanity
\`\`\`

## Deploy

### Vercel (Recomendado)

1. Conecte seu repositório GitHub ao Vercel
2. Configure as variáveis de ambiente no painel da Vercel
3. O deploy será automático a cada push

### Outras plataformas

O projeto é compatível com qualquer plataforma que suporte Next.js.

## Suporte

Para dúvidas sobre configuração ou personalização, consulte a documentação do [Next.js](https://nextjs.org/docs) e [Sanity.io](https://www.sanity.io/docs).
\`\`\`

Pronto! Agora você tem um site completo integrado com Sanity.io que inclui:

1. **Vídeo do YouTube na página do imóvel**: O vídeo aparece junto com as imagens em formato vertical (9:16)
2. **Integração completa com Sanity.io**: Todos os conteúdos podem ser editados facilmente pelo painel
3. **Schemas configurados**: Para imóveis, depoimentos e configurações do site
4. **Sistema de imagens**: Otimização automática via Sanity
5. **Conteúdo dinâmico**: Tudo vem do CMS, incluindo textos, imagens e configurações

Para usar:
1. Configure as variáveis de ambiente do Sanity
2. Faça deploy dos schemas
3. Acesse o painel do Sanity para adicionar conteúdo
4. O site será atualizado automaticamente

O vídeo do YouTube é incorporado usando apenas o ID do vídeo (ex: `dQw4w9WgXcQ`) e aparece em formato vertical ao lado das imagens na página de detalhes do imóvel.
