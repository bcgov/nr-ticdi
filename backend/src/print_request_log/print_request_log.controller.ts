import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CreatePrintRequestLogDto } from "./dto/create-print_request_log.dto";
import { PrintRequestLog } from "./entities/print_request_log.entity";
import { PrintRequestLogService } from "./print_request_log.service";
//
@Controller("print-request-log")
export class PrintRequestLogController {
  constructor(
    private readonly printRequestLogService: PrintRequestLogService
  ) {}

  @Post()
  async create(
    @Body()
    printRequestLog: CreatePrintRequestLogDto
  ): Promise<PrintRequestLog> {
    return this.printRequestLogService.create(printRequestLog);
  }

  @Get()
  findAll(): Promise<PrintRequestLog[]> {
    return this.printRequestLogService.findAll();
  }

  @Get(":dtid")
  findByDtid(@Param("dtid") dtid: string): Promise<PrintRequestLog[]> {
    return this.printRequestLogService.findByDtid(+dtid);
  }

  @Get("version/:dtid/:documentType")
  findNextVersion(@Param("dtid") dtid: string, @Param("documentType") documentType: string): Promise<string> {
    return this.printRequestLogService.findNextVersion(+dtid, documentType);
  }
}
