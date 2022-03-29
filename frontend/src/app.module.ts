import { Module } from '@nestjs/common'
import {HttpService, HttpModule} from '@nestjs/axios'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { HttpConsumingService  } from './app.service.ttls'
@Module({
  imports: [HttpModule],
  controllers: [AppController],
  providers: [AppService, HttpConsumingService]
})
export class AppModule {}
