import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { CreateNFRProvisionDto } from "./dto/create-nfr_provision.dto";
import { NFRProvisionService } from "./nfr_provision.service";

@Controller("nfr-provision")
export class NFRProvisionController {
  constructor(private readonly nfrProvisionService: NFRProvisionService) {}

  @Post()
  async create(
    @Body()
    data: {
      nfrProvision: CreateNFRProvisionDto;
    }
  ) {
    let nfrProvision = data.nfrProvision;
    return this.nfrProvisionService.create(nfrProvision);
  }

  @Get()
  findAll() {
    return this.nfrProvisionService.findAll();
  }

  @Get(":nfrProvisionId")
  findById(@Param("nfrProvisionId") nfrProvisionId: number) {
    if (nfrProvisionId && nfrProvisionId != 0) {
      return this.nfrProvisionService.findById(nfrProvisionId);
    } else {
      return null;
    }
  }

  @Get("dtid/:dtid")
  findByDtid(@Param("dtid") dtid: number) {
    return this.nfrProvisionService.findByDtid(dtid);
  }

  @Delete(":dtid")
  remove(@Param("dtid") dtid: string) {
    return this.nfrProvisionService.remove(+dtid);
  }
}
