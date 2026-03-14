---
task: Audit Math Accessibility
responsavel: "@ui-stylist"
responsavel_type: agent
atomic_layer: task
Entrada:
  - component_colors: Cores do componente
  - font_sizes: Tamanhos de fonte
Saida:
  - wcag_report: Relatório de conformidade WCAG 2.1
  - contrast_ratios: Taxas de contraste calculadas
Checklist:
  - "[ ] Validar contraste de texto (mínimo 4.5:1)"
  - "[ ] Validar contraste de componentes interativos (mínimo 3:1)"
  - "[ ] Verificar suporte a daltonismo e legibilidade"
---

# *audit-math-accessibility

Assegure níveis de contraste WCAG 2.1 (AA ou AAA) garantindo taxas mínimas de 4.5:1 para textos.
