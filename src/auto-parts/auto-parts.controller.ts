import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import { CreateAutoPartDto } from './dto/create-auto-part.dto.js';
import type { PartCondition } from './dto/create-auto-part.dto.js';

/** Сутність предметної області — автозапчастина (варіант 7). */
export interface AutoPart {
  id: string;
  title: string;
  price: number;
  oemCode: string;
  condition: PartCondition;
  carBrand: string;
}

/**
 * REST-контролер автозапчастин.
 *
 * Рівень 1: тестовий масив у пам'яті, читання списку, пошук за id
 * та створення нового запису. Сервіс, PATCH, DELETE і фільтрація
 * через query params належать до рівнів 2–3.
 */
@Controller('auto-parts')
export class AutoPartsController {
  /** Тестовий масив сутностей (in-memory). */
  private readonly autoParts: AutoPart[] = [
    {
      id: 'part-001',
      title: 'Гальмівні колодки Bosch, передні',
      price: 1450,
      oemCode: '0 986 494 654',
      condition: 'new',
      carBrand: 'Volkswagen',
    },
    {
      id: 'part-002',
      title: 'Амортизатор KYB Excel-G, задній',
      price: 2380,
      oemCode: '343402',
      condition: 'new',
      carBrand: 'Volkswagen',
    },
    {
      id: 'part-003',
      title: 'Масляний фільтр MANN W 712/95',
      price: 320,
      oemCode: 'W 712/95',
      condition: 'refurbished',
      carBrand: 'Skoda',
    },
  ];

  /** GET /auto-parts — повертає тестовий масив автозапчастин. */
  @Get()
  findAll(): AutoPart[] {
    return this.autoParts;
  }

  /** GET /auto-parts/:id — знаходить автозапчастину за ідентифікатором. */
  @Get(':id')
  findOne(@Param('id') id: string): AutoPart | { message: string } {
    const found = this.autoParts.find((part) => part.id === id);
    return found ?? { message: `Автозапчастину з ID ${id} не знайдено` };
  }

  /**
   * POST /auto-parts — створює автозапчастину.
   *
   * NestJS за замовчуванням повертає для POST статус 201 Created.
   * Ідентифікатор генерується на сервері через randomUUID().
   */
  @Post()
  create(@Body() createAutoPartDto: CreateAutoPartDto): AutoPart {
    const created: AutoPart = {
      id: randomUUID(),
      title: createAutoPartDto.title,
      price: createAutoPartDto.price,
      oemCode: createAutoPartDto.oemCode,
      condition: createAutoPartDto.condition,
      carBrand: createAutoPartDto.carBrand,
    };

    this.autoParts.push(created);
    return created;
  }
}
