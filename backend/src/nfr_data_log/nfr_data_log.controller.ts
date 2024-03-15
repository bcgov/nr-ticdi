import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateNFRDataLogDto } from './dto/create-nfr_data_log.dto';
import { NFRDataLog } from './entities/nfr_data_log.entity';
import { NFRDataLogService } from './nfr_data_log.service';

@Controller('nfr-data-log')
export class NFRDataLogController {
  constructor(private readonly nfrDataLogService: NFRDataLogService) {}

  @Post()
  async create(
    @Body()
    nfrDataLog: CreateNFRDataLogDto
  ): Promise<NFRDataLog> {
    return this.nfrDataLogService.create(nfrDataLog);
  }

  @Get()
  findAll(): Promise<NFRDataLog[]> {
    return this.nfrDataLogService.findAll();
  }

  @Get(':dtid')
  findByDtid(@Param('dtid') dtid: string): Promise<NFRDataLog[]> {
    return this.nfrDataLogService.findByDtid(+dtid);
  }

  @Get('version/:dtid')
  findNextVersion(@Param('dtid') dtid: string): Promise<string> {
    return this.nfrDataLogService.findNextVersion(+dtid);
  }
}
