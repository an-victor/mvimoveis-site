import property from './property'
import settings from './settings'
import testimonial from './testimonial'

// Você também pode importar objetos se for necessário no schema
import { objects } from './objects'

export const schemaTypes = [
  property,
  settings,
  testimonial,
  ...objects,
]
