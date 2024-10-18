import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StatusController } from './status/status.controller';
import { DbModule } from './config/db/db.module';
import { DirectoiresController } from './directories/directories.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DbModule,
  ],
  controllers: [AppController, StatusController, DirectoiresController],
  providers: [AppService],
})
export class AppModule {}
