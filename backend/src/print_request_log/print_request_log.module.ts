import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PrintRequestLog } from "./entities/print_request_log.entity";
import { PrintRequestLogController } from "./print_request_log.controller";
import { PrintRequestLogService } from "./print_request_log.service";

@Module({
  imports: [TypeOrmModule.forFeature([PrintRequestLog])],
  controllers: [PrintRequestLogController],
  providers: [PrintRequestLogService],
})
export class PrintRequestLogModule {}
