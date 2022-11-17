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

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule,
    AuthenticationModule,
    AdminModule,
    ReportModule,
    SessionModule.forRoot({
      session: {
        secret: process.env.session_secret,
        cookie: { maxAge: 1800000 }, // when the refresh token expires, so does the cookie
      },
    }),
  ],
  controllers: [AppController, AdminController],
  providers: [AppService, TTLSService],
})
export class AppModule {}
