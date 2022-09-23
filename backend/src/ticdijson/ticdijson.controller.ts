import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { TenantAddrService } from "../tenantAddr/tenantAddr.service";
import { CreateTenantAddrDto } from "../tenantAddr/dto/create-tenantAddr.dto";
import { CreateTicdijsonDto } from "./dto/create-ticdijson.dto";
import { TicdijsonService } from "./ticdijson.service";

@ApiTags("ticdijson")
@Controller("ticdijson")
export class TicdijsonController {
  constructor(
    private readonly ticdijsonService: TicdijsonService,
    private readonly tenantAddrService: TenantAddrService
  ) {}

  @Post()
  async create(
    @Body()
    data: {
      ticdijson: CreateTicdijsonDto;
      tenantAddr: CreateTenantAddrDto;
    }
  ) {
    let tenantAddr = data.tenantAddr;
    let ticdijson = data.ticdijson;
    const savedTenantAddr = await this.tenantAddrService.create(tenantAddr);
    return this.ticdijsonService.create(ticdijson, savedTenantAddr);
  }

  @Get()
  findAll() {
    return this.ticdijsonService.findAll();
  }

  @Get(":dtid")
  findOne(@Param("dtid") dtid: string) {
    return this.ticdijsonService.findOne(+dtid);
  }

  @Delete(":dtid")
  remove(@Param("dtid") dtid: string) {
    return this.ticdijsonService.remove(+dtid);
  }
}
