import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ProvisionJSON, VariableJSON } from 'utils/types';
import { CreateNFRDataDto } from './dto/create-nfr_data.dto';
import { NFRDataService } from './nfr_data.service';

@Controller('nfr-data')
export class NFRDataController {
  constructor(private readonly nfrDataService: NFRDataService) {}

  @Post()
  async create(
    @Body()
    data: {
      body: CreateNFRDataDto & {
        provisionJsonArray: ProvisionJSON[];
        variableJsonArray: VariableJSON[];
      };
    }
  ) {
    const provArr = data.body.provisionJsonArray;
    const varArr = data.body.variableJsonArray;
    delete data.body['provisionJsonArray'];
    delete data.body['variableJsonArray'];
    return this.nfrDataService.createOrUpdate(data.body, provArr, varArr);
  }

  @Get()
  findAll() {
    return this.nfrDataService.findAll();
  }

  @Get(':nfrDataId')
  findById(@Param('nfrDataId') nfrDataId: number) {
    if (nfrDataId && nfrDataId != 0) {
      return this.nfrDataService.findByNfrDataId(nfrDataId);
    } else {
      return null;
    }
  }

  @Get('dtid/:dtid')
  findActiveByDtid(@Param('dtid') dtid: number) {
    return this.nfrDataService.findActiveByDtid(dtid);
  }

  @Get('view/:nfrDataId')
  findViewByPRDID(@Param('nfrDataId') nfrDataId: string) {
    return this.nfrDataService.findViewByNFRDataId(+nfrDataId);
  }

  @Get('variables/:variantName/:dtid')
  getVariablesByVariantAndDtid(@Param('variantName') variantName: string, @Param('dtid') dtid: number) {
    return this.nfrDataService.getVariablesByVariantAndDtid(variantName, dtid);
  }

  @Get('provisions/:variantName/:dtid')
  getProvisionsByVariantAndDtid(@Param('variantName') variantName: string, @Param('dtid') dtid: number) {
    return this.nfrDataService.getProvisionsByVariantAndDtid(variantName, dtid);
  }

  @Get('get-enabled-provisions/:variantName/:dtid')
  getEnabledProvisionsByVariantAndDtid(@Param('variantName') variantName: string, @Param('dtid') dtid: number) {
    return this.nfrDataService.getEnabledProvisionsByVariantAndDtid(variantName, dtid);
  }

  @Delete(':dtid')
  remove(@Param('dtid') dtid: string) {
    return this.nfrDataService.remove(+dtid);
  }
}
