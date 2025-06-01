import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '98pdr6kx',
    dataset: 'production'
  },
  // Adicione a linha abaixo:
  projectGroup: 'production', // ou o grupo que você usa, se diferente
  studioHost: 'painel-mvimoveis' 
})