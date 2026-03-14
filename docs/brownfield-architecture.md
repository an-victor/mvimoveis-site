# Marcelo Victor Imóveis - Arquitetura Brownfield

## 📝 Introdução
Este documento captura o estado da arquitetura do projeto Marcelo Victor Imóveis, evoluindo de uma estrutura monolítica para uma arquitetura modular e orientada a tokens (Design System).

### Escopo do Documento
Referência técnica para: Performance, Design System, SEO e Infraestrutura de Dados.

---

## 🏗️ Arquitetura de Alto Nível (Atualizada)

### Stack Tecnológica
| Categoria | Tecnologia | Versão | Notas |
|----------|------------|---------|--------|
| Framework | Next.js | **15.2.6** | Atualizado para correção de segurança (CVE-2025-66478). |
| Estilização | Tailwind CSS | 3.4.17 | **Design Tokens Semânticos** implementados. |
| CMS | Sanity.io | v3 (Fixa) | Gerencia conteúdo e **Tokens de Cor Dinâmicos**. |
| UI Components | Radix / Lucide | - | Componentes atômicos e moleculares. |

### 🎨 Design System & DesignOps
O projeto agora utiliza uma abordagem de **Design Tokens** em três níveis:
1.  **Tokens de CMS (Dinâmicos)**: `primaryColor` e `secondaryColor` definidos no Sanity.
2.  **Variáveis CSS (Ponte)**: Injetadas no `RootLayout` via objeto `style` no `body`.
3.  **Tailwind Semântico**: Cores `brand-primary`, `brand-secondary` e `brand-accent` vinculadas às variáveis CSS.

---

## 🚀 Organização de Componentes (Padrão Atômico)

### Componentes Moleculares
- **PropertyCard**: Centraliza a lógica de exibição de cards de imóveis em todo o site. Reutilizável na Home, Listagem e Similares.

### Layout Global Unificado
- **RootLayout**: Gerencia o `Header` e `Footer` globalmente, eliminando duplicidade de código nas rotas individuais.
- **Header Adaptativo**: Alterna entre transparente (Home) e sólido (Subpáginas) baseado no scroll e rota.

---

## ⚠️ Débito Técnico Resolvido & Pendente

### ✅ Resolvido
- [x] **Duplicidade de Layout**: Header/Footer unificados no `layout.tsx`.
- [x] **Cores Hardcoded**: Removido `orange-500` fixo; agora utiliza `brand-primary`.
- [x] **Consistência de [slug]**: Removido cabeçalhos duplicados na página de detalhes.
- [x] **Segurança**: Patch do Next.js aplicado.

### ⏳ Pendente
- [ ] **SEO Dinâmico**: Implementar `generateMetadata` (Épico 2).
- [ ] **Filtros Reais**: Barra de busca e filtros de URL (Épico 3).
- [ ] **Supabase Transition**: Planejar migração do Sanity para Supabase + PostgreSQL.

---

## 🗺️ Organização do Código
```text
project-root/
├── app/
│   ├── imoveis/         # Rotas de listagem e detalhes
│   ├── globals.css      # Definição de fallback de tokens (:root)
│   └── layout.tsx       # Injetor de tokens dinâmicos e Layout Global
├── components/
│   ├── ui/              # Átomos (Botões, Inputs base)
│   ├── property-card.tsx# Molécula principal de dados
│   └── ...              # Organismos (Header, Footer, Banners)
├── squads/
│   └── design-system-orchestration/ # Metadados e Governança AIOX
└── ...
```

---
*Documento atualizado por Orion (aiox-master) e Gage (devops) em 2026-03-14.*
