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
  story?: string
}

export const levels: LevelInfo[] = [
  {
    id: 'zen-1',
    title: 'Обучение 1',
    description: 'Знакомство с игрой',
    template: ZEN_1,
    choices: allChoices,
    story: 'Добро пожаловать в Автомаджик! В этой игре вам предстоит найти пары логотипов автомобильных компаний. Найдите все пары, чтобы пройти уровень.',
  },
  {
    id: 'zen-2',
    title: 'Обучение 2',
    description: '',
    template: ZEN_2,
    choices: allChoices,
    requiredLevel: 'zen-1',
  },
  {
    id: 'zen-3',
    title: 'Обучение 3',
    description: '',
    template: ZEN_3,
    choices: allChoices,
    requiredLevel: 'zen-2',
  },
  {
    id: '1',
    title: 'Уровень 1',
    description: 'Начало автомобильной эры (1886-1920)',
    template: TEMPLATE_1,
    choices: [
      'mercedes-benz',
      'fiat',
      'rolls-royce',
    ],
    story: 'Добро пожаловать в эпоху зарождения автомобильной промышленности! В этот период появились первые автомобильные компании. Mercedes-Benz (тогда еще Daimler-Motoren-Gesellschaft) создал первый автомобиль в 1886 году, Fiat начал производство в 1899, а Rolls-Royce появился в 1904 году. Найдите пары логотипов этих pioneering брендов в их исторических версиях.',
  },
  {
    id: 'zen-4',
    title: 'Уровень 2',
    description: 'Золотые 20-е и 30-е',
    template: ZEN_4,
    choices: [
      'bentley',
      'bugatti',
      'ferrari',
      'aston-martin',
    ],
    story: 'В этот период автомобили стали символом роскоши и скорости. Bentley (осн. 1919) создавал победителей Ле-Мана, Bugatti (осн. 1909) установил множество рекордов скорости, Ferrari (осн. 1939) начала свой путь к легенде, а Aston Martin (осн. 1913) определил британский стиль спортивных автомобилей. Сравните, как выглядели логотипы этих легендарных марок в их ранние годы.',
    requiredLevel: '1',
  },
  {
    id: '2',
    title: 'Уровень 3',
    description: 'Послевоенная эпоха (1945-1960)',
    template: TEMPLATE_2,
    choices: [
      'volkswagen',
      'porsche',
      'land-rover',
      'ferrari',
    ],
    story: 'После Второй мировой войны автомобильная индустрия переживала революцию. Volkswagen с его "Жуком" сделал автомобили доступными для масс, Porsche представил свой легендарный 356, Land Rover начал эру внедорожников, а Ferrari окончательно утвердилась как производитель суперкаров. Посмотрите, как менялись логотипы этих компаний в период их становления.',
    requiredLevel: 'zen-4',
  },
  {
    id: 'zen-6',
    title: 'Уровень 4',
    description: 'Японское экономическое чудо (1960-1980)',
    template: ZEN_6,
    choices: [
      'toyota',
      'honda',
      'subaru',
      'lexus',
    ],
    story: 'Япония ворвалась на мировой авторынок. Toyota революционизировала производственные процессы, Honda удивила мир своими инновационными двигателями, Subaru представил полный привод для массового рынка. Позже появился и премиальный бренд Lexus. Найдите пары логотипов японских производителей разных периодов.',
    requiredLevel: '2',
  },
  {
    id: 'zen-5',
    title: 'Уровень 5',
    description: 'Корейский прорыв (1990-2010)',
    template: ZEN_5,
    choices: [
      'hyundai',
      'kia',
    ],
    story: 'Корейские автопроизводители совершили невероятный прорыв. От бюджетных машин сомнительного качества до современных, технологичных автомобилей, конкурирующих с лучшими мировыми брендами. Hyundai и Kia прошли удивительный путь развития, что отразилось и в эволюции их логотипов.',
    requiredLevel: 'zen-6',
  },
  {
    id: 'zen-7',
    title: 'Уровень 6',
    description: 'Электрическая революция (2010-2020)',
    template: ZEN_7,
    choices: [
      'tesla',
      'rivian',
      'lucid-motors',
      'nio',
    ],
    story: 'Начало новой эры в автомобилестроении! Tesla произвела революцию в индустрии, показав, что электромобили могут быть желанными. За ней последовали новые игроки: Rivian с электрическими внедорожниками, Lucid Motors с люксовыми седанами, и китайский NIO с инновационной системой замены батарей.',
    requiredLevel: 'zen-5',
  },
  {
    id: 'turtle',
    title: 'Уровень 7',
    description: 'Современность (2020+)',
    template: TURTLE,
    choices: [
      'byd',
      'atom',
      'tesla',
      'nio',
    ],
    story: 'Мы наблюдаем новую революцию в автомобильной индустрии. Китайский BYD стал крупнейшим производителем электромобилей в мире, российский ATOM стремится занять свое место на рынке электромобилей, Tesla продолжает инновации, а NIO расширяет присутствие в Европе. Современные логотипы этих компаний отражают дух цифровой эпохи.',
    requiredLevel: 'zen-7',
  },
]

export function getLevelById(id: string | undefined): LevelInfo | undefined {
  return levels.find(level => level.id === id)
}
