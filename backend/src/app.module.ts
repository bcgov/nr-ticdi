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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
