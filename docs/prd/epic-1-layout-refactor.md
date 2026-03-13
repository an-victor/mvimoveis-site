## Épico 1: Refatoração de Core e Layout (Performance)

### Histórias de Usuário:
1.  **Story 1.1: Unificação de Layout Global**
    - **Objetivo**: Mover Header e Footer para o `layout.tsx` raiz e remover duplicatas das páginas `app/page.tsx` e `app/imoveis/page.tsx`.
2.  **Story 1.2: Integração de Cores Dinâmicas do Sanity**
    - **Objetivo**: Consumir `primaryColor` e `secondaryColor` do Sanity e injetar como variáveis CSS no root do projeto.
3.  **Story 1.3: Modularização de Seções de Negócio**
    - **Objetivo**: Extrair as seções de "Contato", "Sobre" e "Depoimentos" para componentes React independentes em `/components`.
