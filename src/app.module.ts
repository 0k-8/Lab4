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
