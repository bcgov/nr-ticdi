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
    return await this.templateService.create(params, file);
  }

  @Post("update")
  update(@Body() data: UpdateDocumentTemplateDto) {
    return this.templateService.update(data);
  }

  @Get()
  findAll() {
    return this.templateService.findAll();
  }

  @Post("get-one")
  findOne(@Body() data: { version: number; comments: string }) {
    return this.templateService.findOne(data.version, data.comments);
  }
}
