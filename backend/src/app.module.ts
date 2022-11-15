import "dotenv/config";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DocumentTemplateModule } from "./document_template/document_template.module";
import { PrintRequestDetailModule } from "./print_request_detail/print_request_detail.module";
import { PrintRequestLogModule } from "./print_request_log/print_request_log.module";
import { PrintRequestDetail } from "./print_request_detail/entities/print_request_detail.entity";
import { PrintRequestLog } from "./print_request_log/entities/print_request_log.entity";
import { DocumentTemplate } from "./document_template/entities/document_template.entity";
import { PrintRequestDetailView } from "./print_request_detail/entities/print_request_detail_vw";

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
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.POSTGRESQL_HOST || "localhost",
      port: 5432,
      database: process.env.POSTGRESQL_DATABASE || "postgres",
      username: process.env.POSTGRESQL_USER || "postgres",
      password: process.env.POSTGRESQL_PASSWORD,
      entities: [
        PrintRequestDetail,
        PrintRequestLog,
        DocumentTemplate,
        PrintRequestDetailView,
      ],
      autoLoadEntities: true, // Auto load all entities regiestered by typeorm forFeature method.
      synchronize: true, // This changes the DB schema to match changes to entities, which we might not want.
    }),
    DocumentTemplateModule,
    PrintRequestDetailModule,
    PrintRequestLogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
