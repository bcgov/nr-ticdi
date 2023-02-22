import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { CreateNFRDataDto } from "./dto/create-nfr_data.dto";
import { NFRDataService } from "./nfr_data.service";

@Controller("nfr-data")
export class NFRDataController {
  constructor(private readonly nfrDataService: NFRDataService) {}

  @Post()
  async create(
    @Body()
    data: {
      nfrData: CreateNFRDataDto;
    }
  ) {
    let nfrData = data.nfrData;
    return this.nfrDataService.create(nfrData);
  }

  @Get()
  findAll() {
    return this.nfrDataService.findAll();
  }

  @Get(":nfrDataId")
  findById(@Param("nfrDataId") nfrDataId: number) {
    if (nfrDataId && nfrDataId != 0) {
      return this.nfrDataService.findByNfrDataId(nfrDataId);
    } else {
      return null;
    }
  }

  @Get("dtid/:dtid")
  findByDtid(@Param("dtid") dtid: number) {
    return this.nfrDataService.findByDtid(dtid);
  }

  @Get("view/:nfrDataId")
  findViewByPRDID(@Param("nfrDataId") nfrDataId: string) {
    return this.nfrDataService.findViewByNFRDataId(+nfrDataId);
  }

  @Delete(":dtid")
  remove(@Param("dtid") dtid: string) {
    return this.nfrDataService.remove(+dtid);
  }
}
