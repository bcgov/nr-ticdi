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

  @Get("variant/:variant")
  findByDtid(@Param("variant") variantName: string) {
    return this.nfrProvisionService.findProvisionsByVariant(variantName);
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

  @Get("get-group-max/variant/:variant")
  getGroupMaxByDTID(@Param("variant") variantName: string) {
    return this.nfrProvisionService.getGroupMaxByVariant(variantName);
  }

  @Get("get-provision-variables/variant/:variant")
  getVariablesByVariant(@Param("variant") variantName: string) {
    return this.nfrProvisionService.getVariablesByVariant(variantName);
  }

  @Delete(":id")
  remove(@Param("id") id: number) {
    return this.nfrProvisionService.remove(id);
  }
}
