import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CreatePrintRequestLogDto } from "./dto/create-print_request_log.dto";
import { PrintRequestLogService } from "./print_request_log.service";

@Controller("print-request-log")
export class PrintRequestLogController {
  constructor(
    private readonly printRequestLogService: PrintRequestLogService
  ) {}

  @Post()
  async create(
    @Body()
    data: {
      printRequestLog: CreatePrintRequestLogDto;
    }
  ) {
    let printRequestLog = data.printRequestLog;
    return this.printRequestLogService.create(printRequestLog);
  }

  @Get()
  findAll() {
    return this.printRequestLogService.findAll();
  }

  @Get(":dtid")
  findByDtid(@Param("dtid") dtid: string) {
    return this.printRequestLogService.findByDtid(+dtid);
  }
}
