import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateTicdijsonDto } from "./dto/create-ticdijson.dto";
import { TicdijsonService } from "./ticdijson.service";

@ApiTags("ticdijson")
@Controller("ticdijson")
export class TicdijsonController {
  constructor(private readonly ticdijsonService: TicdijsonService) {}

  @Post()
  create(@Body() createTicdijsonDto: CreateTicdijsonDto) {
    return this.ticdijsonService.create(createTicdijsonDto);
  }

  @Get()
  findAll() {
    return this.ticdijsonService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.ticdijsonService.findOne(+id);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.ticdijsonService.remove(+id);
  }
}
