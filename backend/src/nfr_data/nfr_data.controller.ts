import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ProvisionJSON, VariableJSON } from "utils/types";
import { CreateNFRDataDto } from "./dto/create-nfr_data.dto";
import { NFRDataService } from "./nfr_data.service";

@Controller("nfr-data")
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
    delete data.body["provisionJsonArray"];
    delete data.body["variableJsonArray"];
    return this.nfrDataService.createOrUpdate(data.body, provArr, varArr);
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

  @Get("variables/:nfrDataId")
  getVariablesByNfrId(@Param("nfrDataId") id: number) {
    return this.nfrDataService.getVariablesByNfrId(id);
  }

  @Get("provisions/:nfrDataId")
  getProvisionsByNfrId(@Param("nfrDataId") id: number) {
    return this.nfrDataService.getProvisionsByNfrId(id);
  }

  @Delete(":dtid")
  remove(@Param("dtid") dtid: string) {
    return this.nfrDataService.remove(+dtid);
  }
}
