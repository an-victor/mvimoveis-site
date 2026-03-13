# PRD - Evolução Marcelo Victor Imóveis (Brownfield)

## 📝 Visão Geral do Projeto
Transformar o site atual de um corretor de imóveis em uma plataforma dinâmica, performática e escalável, preparando o terreno para uma área administrativa (CRM) futura.

- **Status**: Planejamento (Fase 2)
- **Documento de Referência**: `docs/brownfield-architecture.md`
- **Stack**: Next.js 15, Sanity.io, Tailwind CSS.

---

## 🎯 Objetivos de Negócio
1.  **Excelência em SEO**: Garantir que cada imóvel e a marca Marcelo Victor sejam indexados corretamente pelo Google através de metadados dinâmicos vindos do Sanity.
2.  **Conversão de Leads**: Melhorar a experiência de busca com filtros reais, facilitando o encontro do imóvel ideal.
3.  **Performance Superior**: Reduzir redundância de código e melhorar o tempo de carregamento através da refatoração do Layout global.
4.  **Fundação para CRM**: Estabelecer um sistema de autenticação seguro para futuras ferramentas de gestão interna.

---

## 🛠️ Requisitos Funcionais (Escopo da Evolução)

### Épico 1: Refatoração de Core e Layout (Performance)
*   **RF1.1**: Unificar `Header` e `Footer` no `layout.tsx` raiz para evitar renderizações desnecessárias e facilitar a manutenção.
*   **RF1.2**: Implementar variáveis de CSS dinâmicas injetadas a partir das cores (`primaryColor`, `secondaryColor`) configuradas no Sanity.
*   **RF1.3**: Modularizar seções de "Contato" e "Sobre" em componentes reutilizáveis.

### Épico 2: SEO Dinâmico e Meta Tags (Visibilidade)
*   **RF2.1**: Implementar `generateMetadata` no Next.js para consumir título e descrição global do Sanity (`siteSettings`).
*   **RF2.2**: Criar metadados dinâmicos para a página de detalhes de cada imóvel (`/imoveis/[slug]`), gerando títulos e descrições únicas.
*   **RF2.3**: Adicionar suporte a OpenGraph (OG Images) básicas usando imagens dos imóveis ou logo do site.

### Épico 3: Sistema de Filtros Avançados (UX/Busca)
*   **RF3.1**: Sincronizar os filtros de UI (Quartos, Banheiros, Preço, Tipo) com a URL via Search Params.
*   **RF3.2**: Atualizar a query GROQ (`PROPERTIES_QUERY`) para aceitar parâmetros de filtragem dinâmicos vindos do servidor.
*   **RF3.3**: Tornar a barra de busca funcional para pesquisa por título ou localização.

### Épico 4: Autenticação e Preparação de Login (Segurança)
*   **RF4.1**: Setup inicial de autenticação (sugestão: NextAuth.js ou Clerk) com suporte a login social ou e-mail/senha.
*   **RF4.2**: Criação de uma rota protegida de teste (`/admin/dashboard`) para validar a segurança da sessão.
*   **RF4.3**: Preparar o esquema do Sanity para novos campos de "Usuário/Corretor" se necessário.

---

## 🎨 Requisitos Não Funcionais
*   **Performance**: Core Web Vitals (LCP, FID, CLS) em verde.
*   **Acessibilidade**: Seguindo padrões WCAG básicos (contraste, etiquetas de formulário).
*   **Manutenibilidade**: Código modular e tipado com TypeScript.

---

## 📅 Roteiro de Entrega (Milestones)
1.  **M1: Limpeza de Casa**: Refatoração do layout concluída.
2.  **M2: Google Ready**: SEO 100% dinâmico e funcional.
3.  **M3: Smart Search**: Filtros de busca operantes.
4.  **M4: Secure Foundation**: Sistema de login ativo.

---
*Documento gerado por Orion (aiox-master) em 2026-03-13.*
