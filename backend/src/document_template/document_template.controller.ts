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
    @Body() params: CreateDocumentTemplateDto
  ) {
    const params2 = {
      document_type: params.document_type,
      template_author: params.template_author,
      mime_type: params.mime_type,
      file_name: params.file_name,
      comments: params.comments,
      create_userid: params.create_userid,
    };
    const newTemplate = await this.templateService.create(params2, file);
    return await this.templateService.checkForActiveTemplates({
      id: newTemplate.id,
      update_userid: newTemplate.update_userid,
      document_type: newTemplate.document_type,
    });
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

  @Get("remove/:document_type/:id")
  remove(
    @Param("document_type") document_type: string,
    @Param("id") id: number
  ): Promise<any> {
    return this.templateService.remove(document_type, id);
  }

  @Get(":document_type")
  findAll(@Param("document_type") document_type: string) {
    return this.templateService.findAll(document_type);
  }

  @Get("get-active-report/:document_type")
  findActiveByDocumentType(@Param("document_type") document_type: string) {
    return this.templateService.findActiveByDocumentType(document_type);
  }

  @Get("find-one/:id")
  findOne(@Param("id") id: number) {
    return this.templateService.findOne(id);
  }
}
