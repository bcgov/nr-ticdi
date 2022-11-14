import { Get, Body, Controller, Post } from "@nestjs/common";
import { CreateTemplateDto } from "./dto/create-template.dto";
import { UpdateTemplateDto } from "./dto/update-template.dto";
import { TemplateService } from "./template.service";

@Controller("template")
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Post("create")
  create(@Body() data: { template: CreateTemplateDto }) {
    let templateData = data.template;
    return this.templateService.create(templateData);
  }

  @Post("update")
  update(@Body() data: { template: UpdateTemplateDto }) {
    let templateData = data.template;
    return this.templateService.update(templateData);
  }

  @Get()
  findAll() {
    return this.templateService.findAll();
  }
}
