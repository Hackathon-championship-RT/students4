import type { EncodedTemplate } from '@/components/mahjong/field-template.ts'
import { TEMPLATE_1, TEMPLATE_2, TURTLE, ZEN_1, ZEN_2, ZEN_3, ZEN_4, ZEN_5, ZEN_6, ZEN_7 } from '@/components/mahjong/field-template.ts'

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
  requiredLevel?: string | null
}

export const levels: LevelInfo[] = [
  {
    id: '1',
    title: 'Уровень 1',
    description: 'Самый простой уровень',
    template: TEMPLATE_1,
    choices: allChoices,
    requiredLevel: null,
  },
  {
    id: '2',
    title: 'Уровень 2',
    description: 'Чуть сложнее',
    template: TEMPLATE_2,
    choices: allChoices,
    requiredLevel: '1',
  },
  {
    id: '3',
    title: 'Уровень 3',
    description: 'Российский автопром',
    template: TEMPLATE_2,
    choices: [
      'atom',
    ],
    requiredLevel: '2',
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
    requiredLevel: '2',
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
    requiredLevel: '2',
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
    requiredLevel: '2',
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
    requiredLevel: '2',
  },
  {
    id: 'zen-1',
    title: 'Zen 1',
    description: '',
    template: ZEN_1,
    choices: allChoices,
    requiredLevel: '2',
  },
  {
    id: 'zen-2',
    title: 'Zen 2',
    description: '',
    template: ZEN_2,
    choices: allChoices,
    requiredLevel: '2',
  },
  {
    id: 'zen-3',
    title: 'Zen 3',
    description: '',
    template: ZEN_3,
    choices: allChoices,
    requiredLevel: '2',
  },
  {
    id: 'zen-4',
    title: 'Zen 4',
    description: '',
    template: ZEN_4,
    choices: allChoices,
    requiredLevel: '2',
  },
  {
    id: 'zen-5',
    title: 'Zen 5',
    description: '',
    template: ZEN_5,
    choices: allChoices,
    requiredLevel: '2',
  },
  {
    id: 'zen-6',
    title: 'Zen 6',
    description: '',
    template: ZEN_6,
    choices: allChoices,
    requiredLevel: '2',
  },
  {
    id: 'zen-7',
    title: 'Zen 7',
    description: '',
    template: ZEN_7,
    choices: allChoices,
    requiredLevel: '2',
  },
  {
    id: 'turtle',
    title: 'Черепаха',
    description: 'Черепашка',
    template: TURTLE,
    choices: allChoices,
    requiredLevel: '2',
  },
]

export function getLevelById(id: string | undefined): LevelInfo | undefined {
  return levels.find(level => level.id === id)
}
