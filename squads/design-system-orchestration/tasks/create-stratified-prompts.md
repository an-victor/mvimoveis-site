---
task: Create Stratified Prompts
responsavel: "@visual-generator"
responsavel_type: agent
atomic_layer: task
Entrada:
  - visual_identity: DNA visual da marca
  - action_context: Ações dinâmicas (poses, cenários)
Saida:
  - 4_layer_prompt: Prompt estratificado (DNA, Base, Pose, Render)
  - seed_values: Valores de semente para consistência
Checklist:
  - "[ ] Definir DNA inalterável (etnia, estilo)"
  - "[ ] Criar imagem base de ancoragem"
  - "[ ] Parametrizar ações dinâmicas"
  - "[ ] Configurar métricas de renderização"
---

# *create-stratified-prompts

Desenvolva prompts divididos estritamente em 4 camadas de variáveis de controle.
