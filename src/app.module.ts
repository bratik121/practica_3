import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StatusController } from './status/status.controller';
import { DbModule } from './config/db/db.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DbModule,
  ],
  controllers: [AppController, StatusController],
  providers: [AppService],
})
export class AppModule {}
