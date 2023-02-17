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

  @Get(":dtid")
  findByDtid(@Param("dtid") dtid: string) {
    return this.nfrDataService.findByDtid(+dtid);
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
