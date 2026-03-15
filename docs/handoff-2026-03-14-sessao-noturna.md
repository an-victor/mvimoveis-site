# Handoff - 2026-03-14 (Sessão Noturna) — Orion & Antigravity

## 📌 Status Atual
- **Site Online:** Deploy ativo no Vercel. Último push: `fix: CSP simplificada`.
- **Dashboard:** `/dashboard` funcional — acesso direto sem login.
- **CMS:** Sanity Studio em `/studio` com todos os campos configurados.
- **Commits hoje:** 9 pushes para `main`.

---

## 🛠️ Mudanças Críticas Realizadas Hoje

### Bugs Corrigidos
1. **Erro "Algo deu errado"** ao clicar em imóvel → `getImageUrl` não pode ser passado como prop de Server→Client Component no Next.js. Corrigido importando dentro do cliente.
2. **Banner cinza** após CSP → `default-src 'self'` bloqueava Sanity CDN. CSP simplificada para apenas `frame-src`.
3. **Vídeo YouTube preto** → Sem CSP para `frame-src` + ID potencialmente em formato de URL completa.
4. **Galeria sem navegação / fotos pretas** → Tipo `SanityImage` incompatível + Dialog sem foco automático.
5. **Formulário com campos faltando** → `youtubeVideo`, `mapUrl`, `virtualTour`, `condoFee`, `tax`, `featured` nunca adicionados.

### Features Entregues
1. ✅ **Card clicável** + botão "Ver Detalhes →"
2. ✅ **Botão WhatsApp** com mensagem pré-preenchida (título, local, preço)
3. ✅ **Formulário Dashboard completo** (YouTube, Maps, Tour, IPTU, Condomínio, Destaque na Home)
4. ✅ **Descrição formatada** (quebras de linha preservadas do dashboard para o site)
5. ✅ **Abas Redesenhadas** (Descrição/Características/Localização com ícones + hint visual)
6. ✅ **Botão Compartilhar** — modal com seletor de foto, mensagem editável, copiar link e WhatsApp direto
7. ✅ **YouTube Facade** — thumbnail real + botão play vermelho → iframe só carrega ao clicar
8. ✅ **Perfil do Corretor** no Dashboard (nome, título, bio, foto) → exibido dinamicamente na página do imóvel
9. ✅ **Galeria com Swipe** — foco automático, teclas ← →, swipe no mobile, spinner de carregamento

---

## 📁 Arquivos Modificados Hoje

| Arquivo | Tipo | Mudança |
|---|---|---|
| `app/imoveis/[slug]/page.tsx` | Página Server | Descrição formatada, abas redesenhadas, corretor dinâmico, WhatsApp |
| `components/property-gallery.tsx` | Componente | YouTube Facade, extração de ID, cast `as any` |
| `components/property-share-button.tsx` | **Novo** | Modal de compartilhamento completo |
| `components/image-gallery.tsx` | Componente | Reescrita — foco, swipe, cast, spinner |
| `app/dashboard/properties/property-form.tsx` | Dashboard | Formulário com todos os campos |
| `app/dashboard/settings/settings-form.tsx` | Dashboard | Card "Perfil do Corretor" |
| `types/sanity.ts` | Tipos | `SiteSettings` com campos `broker*` |
| `next.config.mjs` | Config | CSP apenas `frame-src` para YouTube |

---

## 🚀 Próximos Passos (Sessão de Amanhã)

### 🔥 Prioridade 1 — Captura de Leads (Supabase)
**Motivo:** Leads perdidos = dinheiro perdido. Hoje o WhatsApp abre sem capturar nada.

**Implementar:**
- Modal de captura antes do WhatsApp: Nome + Telefone (campos obrigatórios)
- Salvar no Supabase: tabela `leads(id, name, phone, property_slug, property_title, created_at)`
- Dashboard: seção "Leads Recebidos" com tabela e data/hora
- Projeto Supabase já existe — reutilizar credenciais do `.env`

### 🔥 Prioridade 2 — Filtros na Listagem de Imóveis
**Motivo:** Usuário não consegue filtrar por tipo, quartos ou faixa de preço.

- Filtro por tipo (Casa / Apartamento / Terreno / Comercial)
- Filtro por número de quartos (1, 2, 3, 4+)
- Filtro por faixa de preço (range slider)
- Sincronizar com URL via Search Params (RF3.1 do PRD)

### 📍 Prioridade 3 — Mapa e Tour Virtual na Página do Imóvel
- Aba "Localização": embed do Google Maps via `mapUrl` cadastrado
- Aba "Tour Virtual": embed do link de tour 360°
- Ambos os campos já existem no formulário — falta só exibir

---

## ⚠️ Notas Técnicas

- **Não remover** `.npmrc` (legacy-peer-deps para Sanity v3 + Next.js 15)
- **CSP atual** (`next.config.mjs`): apenas `frame-src` — NÃO adicionar `default-src 'self'` que quebra tudo
- **getImageUrl**: sempre usar cast `as any` no segundo argumento (incompatibilidade de tipos Sanity)
- **Componentes Client** (com `"use client"`): nunca passar funções como props vindas de Server Components

---

## 🎯 Objetivo de Negócio — Visão de Produto

> Transformar este sistema em um **SaaS para corretores independentes**.
> Cada corretor terá seu próprio site + dashboard + domínio personalizado.
> Planos: Básico (10 imóveis) / Pro (ilimitado) / Enterprise (multi-filial).

**Próximo marco para viabilizar o SaaS:**
1. Captura de leads funcionando (amanhã)
2. Autenticação por corretor (Supabase Auth)
3. Isolamento de dados por corretor (Row Level Security no Supabase)

---

*Orquestrado por Antigravity + Orion (aiox-master) — 14/03/2026 às 22:32*
*Repositório: `an-victor/mvimoveis-site` | Branch: `main`*
