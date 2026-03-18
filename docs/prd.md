# PRD - Evolução Marcelo Victor Imóveis (Brownfield → SaaS)

## 📝 Visão Geral do Projeto
Transformar o site de um corretor de imóveis em uma **plataforma SaaS escalável** — onde cada corretor tem seu próprio site profissional, dashboard de gestão, CRM de leads e ferramentas de compartilhamento e conversão.

- **Status**: Em Desenvolvimento Ativo (Fase 3 — UX + Leads)
- **Documento de Referência**: `docs/brownfield-architecture.md`
- **Stack**: Next.js 15, Sanity.io (CMS), Supabase (Leads + Auth), Vercel (Deploy), Tailwind CSS.
- **Último Update**: 2026-03-18

---

## 🎯 Objetivos de Negócio
1. **Conversão de Leads**: Capturar dados dos interessados antes de direcionar ao WhatsApp.
2. **Experiência Premium**: Galeria fluida, vídeo, tour virtual e mapa em cada imóvel.
3. **Ferramentas para o Corretor**: Compartilhamento rápido, dashboard completo, controle total do site.
4. **Escala SaaS**: Vender o sistema para outros corretores com subdomínio, plano e marca próprios.

---

## 🛠️ Épicos e Requisitos Funcionais

### ✅ Épico 1: Refatoração de Core e Layout (CONCLUÍDO)
- ✅ RF1.1: Layout unificado com Header/Footer no `layout.tsx` raiz
- ✅ RF1.2: Design tokens dinâmicos via Sanity (cores primária/secundária)
- ✅ RF1.3: Componentização de seções reutilizáveis

### ✅ Épico 2: SEO e OpenGraph (CONCLUÍDO)
- ✅ RF2.1: `generateMetadata` com dados globais do Sanity
- ✅ RF2.2: Metadados dinâmicos por imóvel (título, descrição, OG image)
- ✅ RF2.3: OpenGraph com imagem do imóvel para compartilhamentos sociais

### ✅ Épico 5: Dashboard de Gestão (CONCLUÍDO)
- ✅ RF5.1: Formulário completo de cadastro de imóveis (todos os campos do Sanity)
- ✅ RF5.2: Upload de múltiplas fotos
- ✅ RF5.3: Campos de mídia: YouTube, Google Maps, Tour Virtual
- ✅ RF5.4: Configurações do site + Perfil do Corretor com foto

### ✅ Épico 6: UX da Página do Imóvel (CONCLUÍDO)
- ✅ RF6.1: Galeria com lightbox, swipe mobile, teclas de navegação
- ✅ RF6.2: YouTube Facade (thumbnail + play → iframe com autoplay)
- ✅ RF6.3: Abas com ícones e destaque visual (Descrição/Características/Localização)
- ✅ RF6.4: Formatação de texto preservada (quebras de linha do dashboard)
- ✅ RF6.5: Botão WhatsApp com mensagem pré-preenchida (título, local, preço)
- ✅ RF6.6: Botão Compartilhar com modal (foto selecionável, mensagem editável, copiar link)

### ✅ Épico 3: Filtros Avançados na Listagem (CONCLUÍDO)
- ✅ RF3.1: Filtro por tipo de imóvel (Casa, Apto, Terreno, Comercial, Cobertura)
- ✅ RF3.2: Filtro por quartos (1, 2, 3, 4, 5+)
- ✅ RF3.3: Range de preço (min/max price no Sanity)
- ✅ RF3.4: Sincronização com URL via Search Params
- ✅ RF3.5: Busca por texto (título ou localização)

### ✅ Épico 7: Mapa e Tour Virtual na Página (CONCLUÍDO)
- ✅ RF7.1: Aba "Localização" com embed Google Maps via `mapUrl`
- ✅ RF7.2: Aba "Tour Virtual" com embed do link 360° cadastrado
- ✅ RF7.3: Fallback dinâmico (aba de tour só aparece se houver link)

### ✅ Épico 8: Captura de Leads — Supabase (CONCLUÍDO)
- ✅ RF8.1: Modal de captura (Nome + Telefone) antes de abrir WhatsApp
- ✅ RF8.2: Tabela `leads` no Supabase: `id, name, phone, property_slug, property_title, created_at`
- ✅ RF8.3: Seção "Leads Recebidos" no Dashboard com tabela e data/hora
- ✅ RF8.4: Formulário de contato alternativo (e-mail) na página do imóvel
- ✅ RF8.5: Exportar leads para CSV no Dashboard

### 🎯 Épico 9: Módulo de Agendamentos (PRÓXIMO)
- ⬜ RF9.1: Formulário de solicitação de visita com data/hora preferida
- ⬜ RF9.2: Agenda do corretor no Dashboard (visualização semana/dia)
- ⬜ RF9.3: Notificação por e-mail ao corretor quando nova visita solicitada
- ⬜ RF9.4: Status de agendamentos (pendente, confirmado, cancelado)

### 💰 Épico 10: SaaS Multi-Corretor (VISÃO FUTURA)
- ⬜ RF10.1: Autenticação por corretor (Supabase Auth — e-mail/senha)
- ⬜ RF10.2: Isolamento de dados por corretor (Row Level Security no Supabase)
- ⬜ RF10.3: Subdomínio personalizado por corretor
- ⬜ RF10.4: Planos de assinatura (Básico 10 imóveis / Pro ilimitado)
- ⬜ RF10.5: Landing page de vendas do sistema para novos corretores
- ⬜ RF10.6: Analytics por corretor (visitas, leads, imóveis mais acessados)
- ⬜ RF10.7: IA para geração de descrições de imóveis (Gemini/GPT)

---

## 🎨 Requisitos Não Funcionais
- **Performance**: Core Web Vitals em verde, YouTube via facade (não bloqueia carregamento)
- **Acessibilidade**: WCAG básico (contraste, labels, aria-labels na galeria)
- **Manutenibilidade**: Componentes client/server separados, TypeScript estrito
- **Segurança**: CSP para frame-src apenas, sem chaves expostas no client

---

## 📅 Roteiro de Entrega

| Marco | Épico | Status |
|---|---|---|
| M1: Limpeza de Casa | Épico 1 — Layout | ✅ Concluído |
| M2: Google Ready | Épico 2 — SEO | ✅ Concluído |
| M3: Dashboard Completo | Épico 5 — Dashboard | ✅ Concluído |
| M4: UX Premium | Épico 6 — Página Imóvel | ✅ Concluído |
| M5: Smart Search | Épico 3 — Filtros | ✅ Concluído |
| M6: Lead Machine | Épico 8 — Leads | ✅ Concluído |
| M7: Mapa & Tour | Épico 7 — Mídia | ✅ Concluído |
| **M8: Agenda** | **Épico 9 — Agendamentos** | **⬜ Próximo** |
| M9: SaaS v1 | Épico 10 — Multi-Corretor | ⬜ Visão |

---

*Documento originalmente gerado por Orion (aiox-master) em 2026-03-13.*
*Atualizado por Antigravity em 2026-03-18 — Épicos 3, 7 e 8 concluídos. Adicionada segurança anti-inspect e animações Framer.*
