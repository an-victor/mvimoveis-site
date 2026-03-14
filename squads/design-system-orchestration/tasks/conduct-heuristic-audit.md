---
task: Conduct Heuristic Audit
responsavel: "@ux-expert"
responsavel_type: agent
atomic_layer: task
Entrada:
  - ui_flows: Fluxos de interface ou wireframes
  - nielsen_heuristics: Lista de heurísticas de Nielsen
Saida:
  - audit_report: Relatório de conformidade heurística
  - friction_points: Lista de pontos de fricção identificados
Checklist:
  - "[ ] Auditar visibilidade do status do sistema"
  - "[ ] Verificar controle e liberdade do usuário"
  - "[ ] Avaliar consistência e padrões"
  - "[ ] Validar prevenção de erros"
---

# *conduct-heuristic-audit

Antes de liberar o fluxo para o design visual, audite cada tela usando heurísticas.
