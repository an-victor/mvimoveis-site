import { createClient } from '@sanity/client';
const client = createClient({ 
  projectId: '98pdr6kx', 
  dataset: 'production', 
  useCdn: false, 
  apiVersion: '2023-01-01' 
}); 
client.fetch('*[_type == "property"]{title, featured}').then(console.log).catch(console.error);
