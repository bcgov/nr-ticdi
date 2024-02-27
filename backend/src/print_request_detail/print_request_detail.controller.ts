import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreatePrintRequestDetailDto } from './dto/create-print_request_detail.dto';
import { PrintRequestDetailService } from './print_request_detail.service';

@Controller('print-request-detail')
export class PrintRequestDetailController {
  constructor(private readonly printRequestDetailService: PrintRequestDetailService) {}

  @Post()
  async create(
    @Body()
    data: {
      printRequestDetail: CreatePrintRequestDetailDto;
    }
  ) {
    let printRequestDetail = data.printRequestDetail;
    return this.printRequestDetailService.create(printRequestDetail);
  }

  @Get()
  findAll() {
    return this.printRequestDetailService.findAll();
  }

  @Get(':dtid')
  findByDtid(@Param('dtid') dtid: string) {
    return this.printRequestDetailService.findByDtid(+dtid);
  }

  @Get('view/:prdid')
  findViewByPRDID(@Param('prdid') prdid: string) {
    return this.printRequestDetailService.findViewByPRDID(+prdid);
  }

  @Delete(':dtid')
  remove(@Param('dtid') dtid: string) {
    return this.printRequestDetailService.remove(+dtid);
  }
}
