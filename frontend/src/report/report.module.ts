import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { TTLSService } from "../ttls/ttls.service";
import { ReportController } from "./report.controller";

@Module({
  imports: [HttpModule],
  providers: [TTLSService],
  exports: [],
  controllers: [ReportController],
})
export class ReportModule {}
