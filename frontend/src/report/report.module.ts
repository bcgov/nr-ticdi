import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { TTLSService } from "../ttls/ttls.service";
import { ReportController } from "./report.controller";
import { AuthenticationModule } from "src/authentication/authentication.module";
import { ReportService } from './report.service';

@Module({
  imports: [HttpModule, AuthenticationModule],
  providers: [TTLSService, ReportService],
  exports: [],
  controllers: [ReportController],
})
export class ReportModule {}
