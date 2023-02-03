import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { DocumentTemplateService } from "./document_template.service";
import { CreateDocumentTemplateDto } from "./dto/create-document_template.dto";
import { UpdateDocumentTemplateDto } from "./dto/update-document_template.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { Express } from "express";
import { Param } from "@nestjs/common/decorators";

@Controller("document-template")
export class DocumentTemplateController {
  constructor(private readonly templateService: DocumentTemplateService) {}

  @Post("create")
  @UseInterceptors(FileInterceptor("file"))
  async create(
    @UploadedFile()
    file: Express.Multer.File,
    @Body() params: CreateDocumentTemplateDto & { active_flag: string }
  ) {
    const params2 = {
      document_type: params.document_type,
      template_author: params.template_author,
      mime_type: params.mime_type,
      file_name: params.file_name,
      comments: params.comments,
      create_userid: params.create_userid,
      active_flag: params.active_flag == "true" ? true : false,
    };
    return await this.templateService.create(params2, file);
  }

  @Post("activate-template")
  activateTemplate(
    @Body() data: { id: number; update_userid: string; document_type: string }
  ) {
    return this.templateService.activateTemplate(data);
  }

  @Post("update")
  update(@Body() data: UpdateDocumentTemplateDto) {
    return this.templateService.update(data);
  }

  @Get()
  findAll() {
    return this.templateService.findAll();
  }

  @Get("find-one/:id")
  findOne(@Param() id: number) {
    return this.templateService.findOne(id);
  }
}
