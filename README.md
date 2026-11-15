# Практична робота №4 — рівень 1

**Тема:** розроблення REST-ендпоінтів засобами NestJS
**Варіант:** 7 — автозапчастини (`/auto-parts`)
**Рівень:** 1 (базовий) — створення проєкту NestJS, контролер, DTO та базові ендпоінти

Робота містить лише рівень 1: проєкт NestJS, контролер `AutoPartsController`, DTO створення й оновлення та три базові ендпоінти (`GET`, `GET /:id`, `POST`). Сервісний провайдер, `PATCH`, `DELETE`, `NotFoundException` і query-фільтрація належать до рівнів 2–3 і в цьому проєкті не реалізовані.

---

## 1. Що реалізовано

| Пункт методички (рівень 1) | Де реалізовано |
| --- | --- |
| Ініціалізація проєкту через NestJS CLI (`--strict`, `npm`) | весь проєкт, `package.json`, `tsconfig.json` |
| Запуск сервера на `http://localhost:3000` | `src/main.ts` |
| Кореневий модуль `AppModule` | `src/app.module.ts` |
| Генерація контролера предметної області | `src/auto-parts/auto-parts.controller.ts` |
| Реєстрація контролера в масиві `controllers` | `src/app.module.ts` |
| Каталог `src/auto-parts/dto/` | `src/auto-parts/dto/` |
| `CreateAutoPartDto` з обов'язковими полями варіанта | `create-auto-part.dto.ts` |
| `UpdateAutoPartDto` з опціональними полями | `update-auto-part.dto.ts` |
| `@Get()` — тестовий масив сутностей | `AutoPartsController.findAll()` |
| `@Get(':id')` + `@Param('id')` | `AutoPartsController.findOne()` |
| `@Post()` + `@Body()` + присвоєння `id` | `AutoPartsController.create()` |
| Колекція запитів для REST Client | `requests.http` |

**Що не входить у рівень 1 (свідомо не реалізовано):** сервіс `@Injectable`, in-memory сховище в сервісі, `PATCH`, `DELETE`, `@HttpCode`, `NotFoundException`, `@Query`, `@Header`. Це завдання рівнів 2–3.

---

## 2. Структура проєкту

```text
Lab4/
├── package.json
├── nest-cli.json
├── tsconfig.json
├── tsconfig.build.json
├── .gitignore
├── requests.http                     # запити для VS Code REST Client
├── README.md
├── src/
│   ├── main.ts                       # точка входу, listen(3000)
│   ├── app.module.ts                 # кореневий модуль
│   ├── app.controller.ts             # службовий контролер CLI-заготовки
│   ├── app.service.ts                # службовий сервіс CLI-заготовки
│   └── auto-parts/
│       ├── auto-parts.controller.ts  # контролер варіанта 7
│       └── dto/
│           ├── create-auto-part.dto.ts
│           └── update-auto-part.dto.ts
└── test/
    └── app.e2e-spec.ts               # e2e-тест CLI-заготовки
```

`AppController` і `AppService` — стандартні файли, які NestJS CLI генерує разом із проєктом. Вони залишені, щоб кореневий маршрут `GET /` відповідав `Hello World!`, як передбачено кроком 1 методички.

Контролер автозапчастин підключений у `AppModule`:

```ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AutoPartsController } from './auto-parts/auto-parts.controller.js';

@Module({
  imports: [],
  controllers: [AppController, AutoPartsController],
  providers: [AppService],
})
export class AppModule {}
```

---

## 3. Запуск

Потрібен Node.js 18+ (у роботі використано Node.js 24.17.0, npm 11.13.0).

```powershell
cd C:\Users\denys\Розробка WEB-застосувань\Lab4

npm install          # один раз
npm run start:dev    # режим розробки з перезапуском
```

Сервер піднімається на `http://localhost:3000`. Зупинка — `Ctrl+C`.

Додаткові команди:

```powershell
npm run build        # компіляція у dist/
npm run lint         # перевірка коду (oxlint, без виводу = без зауважень)
npm test             # unit-тест CLI-заготовки
npm run test:e2e     # e2e-тест CLI-заготовки
```

Перевірка ендпоінтів — через `requests.http` у VS Code (REST Client), Postman або `curl`.

---

## 4. Фактичний результат виконання

### 4.1. Старт застосунку

```text
> lab-4@0.0.1 start
> nest start

[Nest] 5852  - 04.11.2026, 15:43:37     LOG [NestFactory] Starting Nest application...
[Nest] 5852  - 04.11.2026, 15:43:37     LOG [InstanceLoader] AppModule dependencies initialized +6ms
[Nest] 5852  - 04.11.2026, 15:43:37     LOG [RoutesResolver] AppController {/}: +6ms
[Nest] 5852  - 04.11.2026, 15:43:37     LOG [RouterExplorer] Mapped {/, GET} route +2ms
[Nest] 5852  - 04.11.2026, 15:43:37     LOG [RoutesResolver] AutoPartsController {/auto-parts}: +0ms
[Nest] 5852  - 04.11.2026, 15:43:37     LOG [RouterExplorer] Mapped {/auto-parts, GET} route +0ms
[Nest] 5852  - 04.11.2026, 15:43:37     LOG [RouterExplorer] Mapped {/auto-parts/:id, GET} route +1ms
[Nest] 5852  - 04.11.2026, 15:43:37     LOG [RouterExplorer] Mapped {/auto-parts, POST} route +0ms
[Nest] 5852  - 04.11.2026, 15:43:37     LOG [NestApplication] Nest application successfully started +1ms
```

### 4.2. `GET /auto-parts`

```http
GET /auto-parts HTTP/1.1
Host: localhost:3000
```

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

[{"id":"part-001","title":"Гальмівні колодки Bosch, передні","price":1450,"oemCode":"0 986 494 654","condition":"new","carBrand":"Volkswagen"},{"id":"part-002","title":"Амортизатор KYB Excel-G, задній","price":2380,"oemCode":"343402","condition":"new","carBrand":"Volkswagen"},{"id":"part-003","title":"Масляний фільтр MANN W 712/95","price":320,"oemCode":"W 712/95","condition":"refurbished","carBrand":"Skoda"}]
```

### 4.3. `GET /auto-parts/part-002`

```http
GET /auto-parts/part-002 HTTP/1.1
Host: localhost:3000
```

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{"id":"part-002","title":"Амортизатор KYB Excel-G, задній","price":2380,"oemCode":"343402","condition":"new","carBrand":"Volkswagen"}
```

### 4.4. `GET /auto-parts/part-999` (неіснуючий id)

```http
GET /auto-parts/part-999 HTTP/1.1
Host: localhost:3000
```

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{"message":"Автозапчастину з ID part-999 не знайдено"}
```

На рівні 1 обробка помилок ще не реалізується: `NotFoundException` з `404 Not Found` — це рівень 2. Тому контролер повертає звичайний об'єкт із повідомленням і статусом `200 OK`.

### 4.5. `POST /auto-parts`

```http
POST /auto-parts HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "title": "Гальмівні диски Brembo, передні",
  "price": 2890,
  "oemCode": "09.A417.11",
  "condition": "new",
  "carBrand": "Volkswagen"
}
```

```http
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8

{"id":"a3463145-d0ea-4b10-8f51-7ab76e3b2ec4","title":"Гальмівні диски Brembo, передні","price":2890,"oemCode":"09.A417.11","condition":"new","carBrand":"Volkswagen"}
```

`id` генерується на сервері через `randomUUID()`, тому при повторному запиті він буде іншим. Статус `201 Created` NestJS повертає для `POST` автоматично — окремий `@HttpCode` на рівні 1 не потрібен.

### 4.6. Список після створення

```http
GET /auto-parts HTTP/1.1
```

```json
[
  {"id":"part-001","title":"Гальмівні колодки Bosch, передні","price":1450,"oemCode":"0 986 494 654","condition":"new","carBrand":"Volkswagen"},
  {"id":"part-002","title":"Амортизатор KYB Excel-G, задній","price":2380,"oemCode":"343402","condition":"new","carBrand":"Volkswagen"},
  {"id":"part-003","title":"Масляний фільтр MANN W 712/95","price":320,"oemCode":"W 712/95","condition":"refurbished","carBrand":"Skoda"},
  {"id":"a3463145-d0ea-4b10-8f51-7ab76e3b2ec4","title":"Гальмівні диски Brembo, передні","price":2890,"oemCode":"09.A417.11","condition":"new","carBrand":"Volkswagen"}
]
```

Новий запис справді додається в масив у пам'яті — після перезапуску сервера дані повертаються до трьох початкових.

### 4.7. Перевірка збірки та тестів

```text
> npm run build
> nest build
(без помилок)

> npm run lint
> oxlint --type-aware src/ test/
(без зауважень)

> npm test
Test Files  1 passed (1)
     Tests  1 passed (1)

> npm run test:e2e
Test Files  1 passed (1)
     Tests  1 passed (1)
```

---

## 5. Пояснення реалізації

### 5.1. Точка входу `main.ts`

```ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
```

`NestFactory.create()` створює застосунок за описом кореневого модуля, а `listen()` запускає HTTP-сервер. Порт за замовчуванням — `3000`; його можна перевизначити змінною середовища `PORT`.

### 5.2. Контролер і маршрутизація

```ts
@Controller('auto-parts')
export class AutoPartsController {
  private readonly autoParts: AutoPart[] = [ /* 3 тестові записи */ ];

  @Get()
  findAll(): AutoPart[] {
    return this.autoParts;
  }

  @Get(':id')
  findOne(@Param('id') id: string): AutoPart | { message: string } {
    const found = this.autoParts.find((part) => part.id === id);
    return found ?? { message: `Автозапчастину з ID ${id} не знайдено` };
  }

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
```

- `@Controller('auto-parts')` задає префікс усіх маршрутів контролера;
- `@Get()` — `GET /auto-parts`;
- `@Get(':id')` — `GET /auto-parts/:id`, значення `:id` потрапляє в параметр через `@Param('id')`;
- `@Post()` — `POST /auto-parts`, тіло запиту передається в `@Body() createAutoPartDto: CreateAutoPartDto`;
- Nest автоматично серіалізує повернений об'єкт у JSON.

### 5.3. DTO створення

```ts
export type PartCondition = 'new' | 'refurbished';

export class CreateAutoPartDto {
  readonly title: string;
  readonly price: number;
  readonly oemCode: string;
  readonly condition: PartCondition;
  readonly carBrand: string;
}
```

Поля відповідають варіанту 7. `condition` — літеральний union: компілятор не дасть передати стан, відмінний від `new` або `refurbished`. `readonly` забороняє змінювати DTO після створення.

### 5.4. DTO оновлення

```ts
export class UpdateAutoPartDto {
  readonly title?: string;
  readonly price?: number;
  readonly oemCode?: string;
  readonly condition?: PartCondition;
  readonly carBrand?: string;
}
```

Усі поля опціональні — це контракт часткового оновлення. Сам `PATCH`-ендпоінт, який його використовує, належить до рівня 2.

### 5.5. Чому DTO — класи

Клас після компіляції залишається реальним значенням JavaScript, тому NestJS може створити його екземпляр і застосувати runtime-валідацію (`ValidationPipe`, `class-validator`). Інтерфейс під час транспіляції повністю стирається, і в рантаймі перевірити його неможливо.

---

## 6. Відповіді на контрольні питання

**1. Що таке Inversion of Control і як Dependency Injection реалізований у NestJS?**
IoC — це принцип, за якого об'єкт не створює свої залежності сам, а отримує їх ззовні; керування життєвим циклом бере на себе контейнер. У NestJS IoC-контейнер сканує модулі, створює провайдери (`@Injectable()`) і передає їх у конструктори споживачів (constructor injection). Тип параметра конструктора зчитується з метаданих (`emitDecoratorMetadata` + `reflect-metadata`), тому достатньо оголосити `constructor(private readonly service: MyService) {}`. У CLI-заготовці це видно на `AppController`, який отримує `AppService`; у рівні 1 контролер автозапчастин працює з масивом самостійно, а DI для нього з'явиться на рівні 2.

**2. Різниця між `@Module`, `@Controller` і `@Injectable`.**
`@Module` описує функціональний блок застосунку: що імпортує, які контролери та провайдери містить, що експортує. `@Controller` позначає клас, який приймає HTTP-запити й повертає відповіді; методи контролера прив'язані до маршрутів декораторами `@Get`, `@Post` тощо. `@Injectable` позначає провайдер (зазвичай сервіс) з бізнес-логікою, який може бути впроваджений в інші класи через DI. Коротко: модуль — структура, контролер — транспорт/маршрути, провайдер — логіка.

**3. Чому DTO — класи, а не інтерфейси?**
Інтерфейси TypeScript існують лише на етапі компіляції та повністю стираються з JavaScript. Класи ж залишаються реальними конструкторами, тому NestJS може створити екземпляр DTO, прочитати метадані полів і виконати runtime-валідацію через `ValidationPipe` та `class-validator`. Крім того, клас можна описати декораторами (`@IsString`, `@IsNumber`, `@Min`) і використовувати для генерації Swagger-схеми.

**4. Декоратори параметрів запиту.**
- `@Param('id') id: string` — route param із `/auto-parts/:id`;
- `@Query('search') search?: string` — query param із `?search=...`;
- `@Body() dto: CreateAutoPartDto` — тіло запиту (JSON payload);
- `@Headers('authorization') token?: string` — окремий HTTP-заголовок.
Без ключа (`@Param() params`, `@Query() query`, `@Headers() headers`) повертається об'єкт усіх відповідних значень. У роботі використано `@Param('id')` і `@Body()`; `@Query` та `@Headers` — теми рівня 3.

**5. HTTP-статуси за замовчуванням.**
NestJS повертає `200 OK` для `GET` і `DELETE`, а для `POST` — `201 Created`. `PATCH`/`PUT` також `200 OK`. Змінити статус можна декоратором `@HttpCode(HttpStatus.NO_CONTENT)` (для `DELETE`), `@HttpCode(HttpStatus.CREATED)` (для `POST`) тощо. У рівні 1 статуси не перевизначаються: `GET` дає `200`, `POST` — `201`. `@HttpCode` належить до рівня 2.

**6. Вбудована обробка виключень.**
NestJS має глобальний exception layer: якщо метод контролера кидає `HttpException` (або його нащадок), фреймворк перехоплює виключення й формує JSON-відповідь із відповідним статусом. `throw new NotFoundException('Сутність не знайдена')` дає `404 Not Found` і тіло:

```json
{
  "message": "Сутність не знайдена",
  "error": "Not Found",
  "statusCode": 404
}
```

Неперехоплені помилки дають `500 Internal Server Error`. На рівні 1 `NotFoundException` ще не використовується — це завдання рівня 2.

**7. Кастомний заголовок через `@Header()`.**
Декоратор `@Header('X-API-Version', '1.0')` ставиться на метод контролера (або на весь контролер) і додає вказаний заголовок до HTTP-відповіді:

```ts
@Get()
@Header('X-API-Version', '1.0')
@Header('X-Service-Status', 'operational')
findAll() { /* ... */ }
```

Клієнт побачить `X-API-Version: 1.0` у відповіді. Це тема рівня 3, у рівні 1 заголовки не налаштовуються.

**8. `PUT` vs `PATCH`.**
`PUT` замінює ресурс повністю: клієнт надсилає всі поля, а відсутні слід трактувати як видалені/скинуті до значень за замовчуванням. `PATCH` змінює лише передані поля, решта залишається без змін. `PUT` зручний для повного перезапису, `PATCH` — для точкових змін (наприклад, змінити лише ціну). Обидва методи за специфікацією ідемпотентні, але семантика різна. У проєкті `UpdateAutoPartDto` з опціональними полями підготовлений саме під `PATCH` рівня 2; у рівні 1 ендпоінтів оновлення немає.

---

## 7. Що залишилося зробити вручну

1. **Скриншоти** (вимога методички):
   - термінал зі стартом NestJS (рядки `Mapped {/auto-parts, ...}` і `Nest application successfully started`);
   - `GET /auto-parts` у браузері або Postman (200, список із 3 записів);
   - `POST /auto-parts` у Postman/REST Client (201 Created і згенерований `id`);
   - термінал із `npm run build`, `npm run lint`, `npm test` без помилок.
2. **Git-репозиторій:**

```powershell
cd C:\Users\denys\Розробка WEB-застосувань\Lab4
git init
git add .
git commit -m "Практична №4: рівень 1, варіант 7 (NestJS REST, автозапчастини)"
git branch -M main
git remote add origin <URL_репозиторію>
git push -u origin main
```

`node_modules/` і `dist/` уже додані до `.gitignore`.

---

## 8. Примітки

- Проєкт створено командою NestJS CLI:
  `npx @nestjs/cli@latest new lab-4 --strict --package-manager npm --skip-git`
  (`--skip-git` лише вимикає автоматичний `git init`; репозиторій ініціалізується вручну, команди вище).
- Використано NestJS 12, TypeScript 6, ESM (`"type": "module"`), тому імпорти в коді мають розширення `.js` — це вимога Node.js ESM, а не помилка.
- Контролер і DTO створені в тій самій структурі, яку генерує `nest g co auto-parts --no-spec`; контролер зареєстрований у `controllers` кореневого `AppModule`.
- In-memory масив живе лише в пам'яті процесу: після перезапуску сервера створені через `POST` записи зникають.
- `id` нового запису — `randomUUID()`, тому в звіті та на скриншотах він буде іншим; це очікувано.
- Рівні 2 і 3 (сервіс, повний CRUD, `HttpCode`, `NotFoundException`, query-фільтрація, `@Header`, `requests.http` для PATCH/DELETE) не реалізовані — робота виконана лише на рівень 1.
