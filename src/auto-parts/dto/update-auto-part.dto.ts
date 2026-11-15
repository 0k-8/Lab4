import type { PartCondition } from './create-auto-part.dto.js';

/**
 * DTO оновлення автозапчастини.
 *
 * Усі поля опціональні: клієнт передає лише ті, які потрібно змінити.
 * На рівні 1 клас оголошений як контракт; PATCH-ендпоінт з'явиться на рівні 2.
 */
export class UpdateAutoPartDto {
  readonly title?: string;
  readonly price?: number;
  readonly oemCode?: string;
  readonly condition?: PartCondition;
  readonly carBrand?: string;
}
