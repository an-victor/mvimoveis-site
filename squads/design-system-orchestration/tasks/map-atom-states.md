---
task: Map Atom States
responsavel: "@atomic-architect"
responsavel_type: agent
atomic_layer: task
Entrada:
  - atom_definition: Definição do átomo (input, botão, etc.)
  - interactive_context: Contexto de interação esperado
Saida:
  - state_matrix: Matriz de estados (hover, active, focus, disabled)
  - interaction_docs: Documentação de comportamento
Checklist:
  - "[ ] Identificar todos os estados possíveis"
  - "[ ] Definir estilos visuais para cada estado"
  - "[ ] Validar contraste em estados desabilitados"
---

# *map-atom-states

Ao desenhar átomos, catalogue rigorosamente todos os seus estados interativos possíveis.
