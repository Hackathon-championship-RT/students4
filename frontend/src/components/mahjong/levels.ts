import type { EncodedTemplate } from '@/components/mahjong/field-template.ts'
import { TEMPLATE_1, TEMPLATE_2 } from '@/components/mahjong/field-template.ts'

const allChoices = [
  'alfa-romeo',
  'aston-martin',
  'atom',
  'audi',
  'bentley',
  'bmw',
  'bugatti',
  'byd',
  'chevrolet',
  'ferrari',
  'fiat',
  'ford',
  'honda',
  'hyundai',
  'jeep',
  'kia',
  'lamborghini',
  'land-rover',
  'lexus',
  'lucid-motors',
  'mclaren',
  'mercedes-benz',
  'mini',
  'morgan-motor-company',
  'nio',
  'porsche',
  'rivian',
  'rolls-royce',
  'subaru',
  'tesla',
  'toyota',
  'volkswagen',
  'volvo',
]
type Choice = typeof allChoices[number]

export type LevelInfo = {
  id: string
  title: string
  description: string
  template: EncodedTemplate
  choices: Choice[]
}

export const levels: LevelInfo[] = [
  {
    id: '1',
    title: 'Уровень 1',
    description: 'Самый простой уровень',
    template: TEMPLATE_1,
    choices: allChoices,
  },
  {
    id: '2',
    title: 'Уровень 2',
    description: 'Чуть сложнее',
    template: TEMPLATE_2,
    choices: allChoices,
  },
  {
    id: '3',
    title: 'Уровень 3',
    description: 'Российский автопром',
    template: TEMPLATE_2,
    choices: [
      'atom',
    ],
  },
  {
    id: '4',
    title: 'Уровень 4',
    description: 'Только топовые марки',
    template: TEMPLATE_2,
    choices: [
      'bugatti',
      'ferrari',
      'lamborghini',
      'mclaren',
      'porsche',
      'rolls-royce',
      'tesla',
    ],
  },
  {
    id: '5',
    title: 'Уровень 5',
    description: 'Только немецкие марки',
    template: TEMPLATE_2,
    choices: [
      'audi',
      'bmw',
      'mercedes-benz',
      'porsche',
      'volkswagen',
    ],
  },
  {
    id: '6',
    title: 'Уровень 6',
    description: 'Только китайские марки',
    template: TEMPLATE_2,
    choices: [
      'byd',
      'nio',
    ],
  },
  {
    id: '7',
    title: 'Уровень 7',
    description: 'Только японские марки',
    template: TEMPLATE_2,
    choices: [
      'honda',
      'lexus',
      'subaru',
      'toyota',
    ],
  },
]

export function getLevelById(id: string | undefined): LevelInfo | undefined {
  return levels.find(level => level.id === id)
}
