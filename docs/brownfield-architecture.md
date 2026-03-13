# Marcelo Victor Imóveis - Arquitetura Brownfield

## 📝 Introdução
Este documento captura o ESTADO ATUAL do projeto Marcelo Victor Imóveis. Ele serve como referência para as rodadas de refatoração, melhoria de SEO e implementação de novas funcionalidades (Login/CRM).

### Escopo do Documento
Análise abrangente focada em: Performance, SEO, Filtros Avançados e Preparação para Área Logada.

---

## 🚀 Referência Rápida - Arquivos Críticos

### Pontos de Entrada e Layout
- **Layout Raiz**: `app/layout.tsx` (Contém metadados estáticos e ThemeProvider).
- **Página Inicial**: `app/page.tsx` (Página principal com Server Side Rendering).
- **Listagem de Imóveis**: `app/imoveis/page.tsx` (Concentra lógica de busca e filtros).

### Lógica de Dados (Sanity)
- **Queries**: `sanity/lib/queries.ts` (Definições GROQ para busca de dados).
- **Schemas**: `sanity/schemas/` (`property.ts`, `siteSettings.ts`, `testimonial.ts`).
- **Cliente**: `sanity/lib/client.ts`.

---

## 🏗️ Arquitetura de Alto Nível

### Stack Tecnológica Atual
| Categoria | Tecnologia | Versão | Notas |
|----------|------------|---------|--------|
| Framework | Next.js | 15.2.4 | Usando App Router. |
| Estilização | Tailwind CSS | 3.4.17 | Cores primárias/secundárias no Sanity mas não integradas ao CSS/Tailwind. |
| CMS | Sanity.io | Latest | Centraliza conteúdo e configurações. |
| UI Components | Radix UI / Lucide | - | Base para componentes shadcn/ui. |

---

## ⚠️ Débito Técnico e Pontos de Melhoria

### 1. Performance e Estrutura
- **Repetição de Código**: O `Header` e o `Footer` estão duplicados dentro de `app/page.tsx` e `app/imoveis/page.tsx`. Devem ser movidos para o `layout.tsx`.
- **Componentes Gigantes**: Páginas principais contêm centenas de linhas de JSX que deveriam ser componentes menores (ex: Seção de Contato, Call to Action).
- **Hydration Warnings**: Detectado `suppressHydrationWarning` no `html`, indicando possíveis inconsistências entre Server/Client rendering.

### 2. SEO e Meta Tags
- **Metadados Estáticos**: O `title` e `description` estão fixos no `layout.tsx`. Precisam ser dinâmicos, buscando as informações do `siteSettings` do Sanity.
- **Falta de Tags OpenGraph**: Não há implementação de imagens de compartilhamento (OG Images) dinâmicas.

### 3. Filtros e Busca
- **Filtros Estáticos**: Os componentes de filtro em `app/imoveis/page.tsx` são majoritariamente visuais e não filtram os dados via GROQ/URL Params.
- **Busca**: A barra de busca atual não está funcional no servidor.

### 4. Área de Login e CRM (Novas Funcionalidades)
- **Inexistente**: Não há sistema de autenticação (sugestão: NextAuth.js ou Clerk).
- **Dashboard**: Necessário criar uma rota `/admin` ou `/dashboard` para o corretor gerenciar leads e imóveis.

---

## 🗺️ Organização do Código (Realidade)
```text
project-root/
├── app/
│   ├── imoveis/         # Rotas de listagem e detalhes (slug)
│   ├── globals.css      # Estilos globais (precisa integrar cores do Sanity)
│   └── layout.tsx       # Layout raiz (precisa de limpeza)
├── components/
│   ├── ui/              # Componentes base (shadcn)
│   └── (diversos)       # Componentes de negócio (alguns não utilizados)
├── sanity/
│   ├── schemas/         # Definições de dados (precisa de campos de SEO)
│   └── lib/             # Configurações de cliente e imagem
└── lib/                 # Utilitários (formatadores, etc)
```

---

## 🎯 Plano de Ação Imediato

1.  **Refatoração de Layout**: Mover Header/Footer para `layout.tsx` e unificar a navegação.
2.  **SEO Dinâmico**: Implementar a função `generateMetadata` no Next.js consumindo dados do Sanity.
3.  **Filtros Reais**: Implementar lógica de busca baseada em URL (`?priceMin=...&bedrooms=...`).
4.  **Sistema de Cores**: Integrar `primaryColor` e `secondaryColor` do Sanity com variáveis CSS para controle total do tema via CMS.
5.  **Área de Login**: Iniciar setup de autenticação.

---
*Documento gerado por Orion (aiox-master) em 2026-03-13.*
