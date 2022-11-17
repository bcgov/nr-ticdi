import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { TTLSService } from "../ttls/ttls.service";
import { ReportController } from "./report.controller";
import { AuthenticationModule } from "src/authentication/authentication.module";

@Module({
  imports: [HttpModule, AuthenticationModule],
  providers: [TTLSService],
  exports: [],
  controllers: [ReportController],
})
export class ReportModule {}
