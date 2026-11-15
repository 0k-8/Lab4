/** Стан автозапчастини — літеральний union (варіант 7). */
export type PartCondition = 'new' | 'refurbished';

/**
 * DTO створення автозапчастини.
 *
 * Містить обов'язкові поля, які клієнт передає в тілі POST-запиту.
 * `id` присвоюється сервером, тому в DTO його немає.
 */
export class CreateAutoPartDto {
  readonly title: string;
  readonly price: number;
  readonly oemCode: string;
  readonly condition: PartCondition;
  readonly carBrand: string;
}
