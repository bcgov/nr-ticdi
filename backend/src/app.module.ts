import "dotenv/config";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DocumentTemplateModule } from "./document_template/document_template.module";
import { PrintRequestDetailModule } from "./print_request_detail/print_request_detail.module";
import { PrintRequestLogModule } from "./print_request_log/print_request_log.module";
import { NFRDataModule } from "./nfr_data/nfr_data.module";
import { NFRDataLogModule } from "./nfr_data_log/nfr_data_log.module";
import { NFRProvisionModule } from "./nfr_provision/nfr_provision.module";

import { HttpModule } from "@nestjs/axios";
import { TTLSService } from "./ttls/ttls.service";
import { AuthenticationModule } from "./authentication/authentication.module";
import { SessionModule } from "nestjs-session";
import { AdminController } from "./admin/admin.controller";
import { AdminModule } from "./admin/admin.module";
import { ReportModule } from "./report/report.module";
import { HttpExceptionFilter } from "./authentication/http-exception.filter";
import { APP_FILTER } from "@nestjs/core";

import config from "./ormconfig";

console.log("Var check - POSTGRESQL_HOST", process.env.POSTGRESQL_HOST);
console.log("Var check - POSTGRESQL_DATABASE", process.env.POSTGRESQL_DATABASE);
console.log("Var check - POSTGRESQL_USER", process.env.POSTGRESQL_USER);
if (process.env.POSTGRESQL_PASSWORD != null) {
  console.log("Var check - POSTGRESQL_PASSWORD present");
} else {
  console.log("Var check - POSTGRESQL_PASSWORD not present");
}

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(config),
    DocumentTemplateModule,
    PrintRequestDetailModule,
    NFRDataModule,
    NFRDataLogModule,
    NFRProvisionModule,
    PrintRequestLogModule,
    HttpModule,
    AuthenticationModule,
    AdminModule,
    ReportModule,
    SessionModule.forRoot({
      session: { secret: process.env.session_secret },
    }),
  ],
  controllers: [AdminController],
  providers: [
    AppService,
    TTLSService,
    // {
    //   provide: APP_FILTER,
    //   useClass: HttpExceptionFilter,
    // },
  ],
})
export class AppModule {}
