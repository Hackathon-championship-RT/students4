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
  'kamaz',
  'lada',
  'uaz',
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
    description: 'Теперь сложнее',
    template: ZEN_2,
    choices: allChoices,
    requiredLevel: 'zen-1',
    story: 'Постепенно сложность уровней будет увеличиваться. На этом уровне больше производителей, и есть заблокированные фигуры - те, которые закрыты справа и слева другими фигурами.',
  },
  {
    id: 'zen-3',
    title: 'Обучение 3',
    description: 'Сложнее и сложнее',
    template: ZEN_3,
    choices: allChoices,
    requiredLevel: 'zen-2',
    story: 'А на этом уровне несколько слоёв. Но мы уверены, что вы справитесь!',
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
      'ford',
    ],
    story: 'Добро пожаловать в эпоху зарождения автомобильной промышленности! В этот период появились первые автомобильные компании. Mercedes-Benz (тогда еще Daimler-Motoren-Gesellschaft) создал первый автомобиль в 1886 году, Fiat начал производство в 1899, Rolls-Royce появился в 1904 году, а Ford произвел революцию с Model T в 1908. Найдите пары логотипов этих брендов в их исторических версиях.',
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
    description: 'Электрическая революция (2010-2020)',
    template: ZEN_5,
    choices: [
      'tesla',
      'rivian',
      'lucid-motors',
      'nio',
      'byd',
      'volkswagen',
      'bmw',
      'porsche',
      'hyundai',
      'kia',
    ],
    story: 'Начало новой эры в автомобилестроении! Tesla произвела революцию в индустрии, показав, что электромобили могут быть желанными. За ней последовали новые игроки: Rivian с электрическими внедорожниками, Lucid Motors с люксовыми седанами, китайские NIO и BYD с инновационными технологиями. Традиционные производители тоже включились в гонку: Volkswagen с линейкой ID, BMW с i-серией, Porsche с Taycan, а корейские Hyundai и Kia с их электрическими новинками.',
    requiredLevel: 'zen-6',
  },
  {
    id: 'zen-7',
    title: 'Уровень 6',
    description: 'История отечественного автомобилестроения',
    template: ZEN_7,
    choices: [
      'kamaz',
      'lada',
      'uaz',
      'atom',
      'volkswagen',
      'toyota',
      'hyundai',
      'kia',
      'bmw',
      'mercedes-benz',
    ],
    story: 'История российского автопрома богата традициями. КАМАЗ, основанный в 1969 году, стал символом надежности в грузовом транспорте. LADA (ВАЗ) с 1966 года производит доступные автомобили для массового потребителя. УАЗ, начавший свою историю в 1941 году, известен своими неприхотливыми внедорожниками. Новый бренд ATOM представляет будущее российского автопрома в эпоху электромобилей. На российском рынке также активно представлены Volkswagen, Toyota, корейские Hyundai и Kia, премиальные BMW и Mercedes-Benz, имеющие локальное производство.',
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
      'lucid-motors',
      'rivian',
      'porsche',
      'volkswagen',
      'bmw',
      'hyundai',
    ],
    story: 'Мы наблюдаем новую революцию в автомобильной индустрии. Китайский BYD стал крупнейшим производителем электромобилей в мире, российский ATOM стремится занять свое место на рынке электромобилей, Tesla продолжает инновации, а NIO расширяет присутствие в Европе. Lucid Motors и Rivian представляют новое поколение электромобилей премиум-класса, в то время как традиционные производители Porsche, Volkswagen, BMW и Hyundai активно развивают свои электрические линейки. Современные логотипы этих компаний отражают дух цифровой эпохи.',
    requiredLevel: 'zen-7',
  },
]

export function getLevelById(id: string | undefined): LevelInfo | undefined {
  return levels.find(level => level.id === id)
}
