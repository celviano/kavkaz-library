import { rules } from '@/shared/lib/validation'

const currentYear = new Date().getFullYear()

export const addBookRules = {
  title: [
    rules.required('Введите название книги'),
    rules.minLength(2, 'Минимум 2 символа'),
    rules.maxLength(300),
  ],
  author: [
    rules.required('Введите имя автора'),
    rules.minLength(2, 'Минимум 2 символа'),
    rules.maxLength(200),
  ],
  year: [
    rules.required('Введите год издания'),
    rules.number(1400, currentYear, `Год от 1400 до ${currentYear}`),
  ],
  pages: [
    rules.number(1, 9999, 'От 1 до 9999 страниц'),
  ],
  price: [
    rules.required('Введите цену'),
    rules.number(0, 9999999, 'Цена не может быть отрицательной'),
  ],
  copies: [
    rules.number(1, 99, 'От 1 до 99 экземпляров'),
  ],
  tags: [
    rules.maxLength(500, 'Слишком длинный список тегов'),
  ],
  description: [
    rules.maxLength(2000, 'Максимум 2000 символов'),
  ],
}
