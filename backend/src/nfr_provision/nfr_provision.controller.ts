import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { CreateNFRProvisionDto } from "./dto/create-nfr_provision.dto";
import { NFRProvisionService } from "./nfr_provision.service";

@Controller("nfr-provision")
export class NFRProvisionController {
  constructor(private readonly nfrProvisionService: NFRProvisionService) {}

  @Post()
  async create(
    @Body()
    nfrProvision: CreateNFRProvisionDto
  ) {
    return this.nfrProvisionService.create(nfrProvision);
  }

  @Post("update")
  async update(@Body() nfrProvision: CreateNFRProvisionDto & { id: number }) {
    const id = nfrProvision.id;
    delete nfrProvision["id"];
    return this.nfrProvisionService.update(id, nfrProvision);
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

  @Get("enable/:id")
  enableProvision(@Param("id") id: number) {
    return this.nfrProvisionService.enable(id);
  }

  @Get("disable/:id")
  disableProvision(@Param("id") id: number) {
    return this.nfrProvisionService.disable(id);
  }

  // nestjs gets upset when there is no parameter, id is unused
  @Get("get-group-max/:id")
  getGroupMax(@Param("id") id: number) {
    return this.nfrProvisionService.getGroupMax();
  }

  @Delete(":dtid")
  remove(@Param("dtid") dtid: string) {
    return this.nfrProvisionService.remove(+dtid);
  }
}
