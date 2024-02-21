import { Module } from "@nestjs/common";
import { TTLSService } from "../ttls/ttls.service";
import { ReportController } from "./report.controller";
import { AuthenticationModule } from "src/authentication/authentication.module";
import { ReportService } from "./report.service";
import { HttpModule } from "@nestjs/axios";
import { DocumentTemplateModule } from "src/document_template/document_template.module";
import { PrintRequestLogModule } from "src/print_request_log/print_request_log.module";

@Module({
  imports: [
    HttpModule,
    AuthenticationModule,
    DocumentTemplateModule,
    PrintRequestLogModule,
  ],
  providers: [TTLSService, ReportService],
  exports: [ReportService],
  controllers: [ReportController],
})
export class ReportModule {}
