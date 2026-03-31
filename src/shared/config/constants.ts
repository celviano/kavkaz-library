import type { Book, BookCategory } from '@/entities/book'

export const CATEGORY_LABELS: Record<BookCategory, string> = {
  history: 'История',
  geography: 'География',
  ethnography: 'Этнография',
  memoirs: 'Мемуары',
  atlases: 'Атласы',
  other: 'Другое',
}

export const CATEGORIES: BookCategory[] = [
  'history',
  'geography',
  'ethnography',
  'memoirs',
  'atlases',
  'other',
]

export const MOCK_BOOKS: Book[] = [
  {
    id: '1',
    title: 'История Грузии с древнейших времён',
    author: 'Иване Джавахишвили',
    year: 1913,
    category: 'history',
    coverUrl: '/covers/georgia-history.jpg',
    description:
      'Фундаментальный труд по истории Грузии, охватывающий период от древнейших времён до XIX века.',
    pages: 624,
    language: 'Русский',
    available: true,
  },
  {
    id: '2',
    title: 'Путешествие по Кавказу и Грузии',
    author: 'Мориц фон Энгельгардт',
    year: 1797,
    category: 'geography',
    coverUrl: '/covers/caucasus-travel.jpg',
    description:
      'Описание путешествия немецкого учёного по землям Кавказа в конце XVIII века.',
    pages: 312,
    language: 'Русский',
    available: true,
  },
  {
    id: '3',
    title: 'Этнография народов Кавказа',
    author: 'Николай Дубровин',
    year: 1871,
    category: 'ethnography',
    coverUrl: '/covers/ethnography.jpg',
    description:
      'Подробное описание быта, культуры и традиций народов Кавказского хребта.',
    pages: 488,
    language: 'Русский',
    available: true,
  },
  {
    id: '4',
    title: 'Кавказская война в отдельных очерках',
    author: 'Василий Потто',
    year: 1887,
    category: 'history',
    coverUrl: '/covers/caucasian-war.jpg',
    description:
      'Военно-исторический труд о Кавказской войне 1817–1864 годов с описанием ключевых сражений.',
    pages: 752,
    language: 'Русский',
    available: false,
  },
  {
    id: '5',
    title: 'Записки о Персии и Закавказье',
    author: 'Александр Грибоедов',
    year: 1828,
    category: 'memoirs',
    coverUrl: '/covers/griboedov.jpg',
    description:
      'Дипломатические записки и личные наблюдения великого русского писателя в период его миссии.',
    pages: 198,
    language: 'Русский',
    available: true,
  },
  {
    id: '6',
    title: 'Атлас Кавказского края',
    author: 'Корпус топографов',
    year: 1842,
    category: 'atlases',
    coverUrl: '/covers/atlas.jpg',
    description:
      'Военно-топографический атлас Кавказского края, составленный экспедицией 1830–1842 годов.',
    pages: 96,
    language: 'Русский',
    available: true,
  },
  {
    id: '7',
    title: 'Армения и Карабах. Исторические очерки',
    author: 'Лео Алексей Бабаханян',
    year: 1906,
    category: 'history',
    coverUrl: '/covers/armenia.jpg',
    description:
      'Исторические очерки об Армении и Карабахе, охватывающие средневековый период.',
    pages: 344,
    language: 'Русский',
    available: true,
  },
  {
    id: '8',
    title: 'Азербайджан. Описание страны и народа',
    author: 'Иван Березин',
    year: 1853,
    category: 'ethnography',
    coverUrl: '/covers/azerbaijan.jpg',
    description:
      'Географическое и этнографическое описание Азербайджана середины XIX века.',
    pages: 276,
    language: 'Русский',
    available: false,
  },
  {
    id: '9',
    title: 'Горная Чечня. Очерки и рассказы',
    author: 'Семён Эсадзе',
    year: 1907,
    category: 'memoirs',
    coverUrl: '/covers/chechnya.jpg',
    description:
      'Очерки о жизни и быте горцев Чечни, составленные на основе личных наблюдений автора.',
    pages: 220,
    language: 'Русский',
    available: true,
  },
  {
    id: '10',
    title: 'Описание Кавказа с кратким историческим',
    author: 'Семён Броневский',
    year: 1823,
    category: 'geography',
    coverUrl: '/covers/caucasus-desc.jpg',
    description:
      'Одно из первых систематических описаний Кавказа, составленное русским путешественником.',
    pages: 408,
    language: 'Русский',
    available: true,
  },
  {
    id: '11',
    title: 'Дагестан. История, народы, культура',
    author: 'Михаил Косвен',
    year: 1954,
    category: 'ethnography',
    coverUrl: '/covers/dagestan.jpg',
    description:
      'Комплексное исследование истории и культуры народов Дагестана советского периода.',
    pages: 560,
    language: 'Русский',
    available: true,
  },
  {
    id: '12',
    title: 'Кавказ в рисунках. Альбом гравюр',
    author: 'Князь Гагарин',
    year: 1857,
    category: 'atlases',
    coverUrl: '/covers/caucasus-art.jpg',
    description:
      'Редкий альбом гравюр с изображениями пейзажей, народов и сцен быта Кавказа.',
    pages: 120,
    language: 'Русский',
    available: false,
  },
]

export const FEATURED_BOOK_IDS = ['1', '3', '5', '6']

export const BOOK_TAGS: Record<string, string[]> = {
  '1': ['История Грузии', 'Средневековье', 'Источниковедение', 'XIX–XX вв.'],
  '2': ['Путешествия', 'XVIII век', 'Описание земель', 'Немецкая школа'],
  '3': ['Этнография', 'Народы Кавказа', 'Быт и культура', 'Полевые исследования'],
  '4': ['Военная история', 'Кавказская война', 'XIX век', 'Сражения'],
  '5': ['Мемуары', 'Дипломатия', 'Персия', 'Грибоедов'],
  '6': ['Картография', 'Топография', 'Военные карты', 'XIX век'],
  '7': ['История Армении', 'Карабах', 'Средневековье', 'Источники'],
  '8': ['Азербайджан', 'Этнография', 'Описание народа', 'XIX век'],
  '9': ['Чечня', 'Горцы', 'Мемуары', 'Очерки'],
  '10': ['Описание Кавказа', 'XVIII–XIX вв.', 'География', 'Первые исследования'],
  '11': ['Дагестан', 'Народы', 'Советский период', 'Энциклопедия'],
  '12': ['Графика', 'Гравюры', 'Визуальная история', 'XIX век'],
}

export const BOOK_PUBLISHER: Record<string, { name: string; city: string }> = {
  '1': { name: 'Тип. И. Н. Скороходова', city: 'Тифлис' },
  '2': { name: 'Имп. Акад. наук', city: 'Санкт-Петербург' },
  '3': { name: 'Тип. Деп. уделов', city: 'Санкт-Петербург' },
  '4': { name: 'Военная типография', city: 'Санкт-Петербург' },
  '5': { name: 'Рукопись', city: 'Тегеран / Тифлис' },
  '6': { name: 'Корпус топографов', city: 'Санкт-Петербург' },
  '7': { name: 'Тип. Братства', city: 'Тифлис' },
  '8': { name: 'Имп. Рус. геогр. об-во', city: 'Казань' },
  '9': { name: 'Тип. Канц. Кавк. наместника', city: 'Тифлис' },
  '10': { name: 'Тип. Корпуса путей сообщ.', city: 'Санкт-Петербург' },
  '11': { name: 'Изд-во АН СССР', city: 'Москва' },
  '12': { name: 'Лит. Мюнстера', city: 'Санкт-Петербург' },
}
