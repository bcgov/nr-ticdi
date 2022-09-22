import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TTLSService } from './ttls/ttls.service';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationModule } from './authentication/authentication.module';
import { SessionModule } from 'nestjs-session';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule,
    AuthenticationModule,
    SessionModule.forRoot({
      session: { secret: process.env.session_secret },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, TTLSService],
})
export class AppModule {}
