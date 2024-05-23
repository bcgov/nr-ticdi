import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TTLSService } from "./ttls/ttls.service";
import { ConfigModule } from "@nestjs/config";
import { AuthenticationModule } from "./authentication/authentication.module";
import { SessionModule } from "nestjs-session";
import { HttpModule } from "@nestjs/axios";
import { AdminController } from "./admin/admin.controller";
import { AdminModule } from "./admin/admin.module";
import { ReportModule } from "./report/report.module";
import { HttpExceptionFilter } from "./authentication/http-exception.filter";
import { APP_FILTER } from "@nestjs/core";

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule,
    AuthenticationModule,
    AdminModule,
    ReportModule,
    SessionModule.forRoot({
      session: { secret: process.env.session_secret },
    }),
  ],
  controllers: [AppController, AdminController],
  providers: [
    AppService,
    TTLSService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
