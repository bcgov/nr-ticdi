import { Body, Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { DocumentTemplateService } from './document_template.service';
import { CreateDocumentTemplateDto } from './dto/create-document_template.dto';
import { UpdateDocumentTemplateDto } from './dto/update-document_template.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { Param } from '@nestjs/common/decorators';
import { DocumentTemplate } from './entities/document_template.entity';
import { TrimmedDocumentTemplate } from '../../utils/types';

@Controller('document-template')
export class DocumentTemplateController {
  constructor(private readonly templateService: DocumentTemplateService) {}

  @Post('create')
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile()
    file: Express.Multer.File,
    @Body() params: CreateDocumentTemplateDto
  ): Promise<any> {
    const newDocumentParams: CreateDocumentTemplateDto = {
      document_type_id: params.document_type_id,
      template_author: params.template_author,
      mime_type: params.mime_type,
      file_name: params.file_name,
      comments: params.comments,
      create_userid: params.create_userid,
    };
    const newTemplate: DocumentTemplate = await this.templateService.create(newDocumentParams, file);
    return await this.templateService.checkForActiveTemplates({
      id: newTemplate.id,
      update_userid: newTemplate.update_userid,
      document_type_id: params.document_type_id,
    });
  }

  @Post('activate-template')
  activateTemplate(@Body() data: { id: number; update_userid: string; document_type_id: number }): Promise<void> {
    return this.templateService.activateTemplate(data);
  }

  // @Post('update')
  // update(@Body() data: UpdateDocumentTemplateDto): Promise<DocumentTemplate> {
  //   return this.templateService.update(data);
  // }

  @Get('remove/:document_type/:id')
  remove(@Param('document_type') document_type_id: number, @Param('id') id: number): Promise<{ id: number }> {
    return this.templateService.remove(document_type_id, id);
  }

  @Get(':document_type_id')
  async findAll(@Param('document_type_id') document_type_id: number): Promise<TrimmedDocumentTemplate[]> {
    let documents: DocumentTemplate[] = await this.templateService.findAll(document_type_id);
    return documents.map(({ the_file, ...rest }) => rest);
  }

  @Get('get-active-report/:document_type')
  findActiveByDocumentType(@Param('document_type') document_type_id: number): Promise<DocumentTemplate> {
    return this.templateService.findActiveByDocumentType(document_type_id);
  }

  @Get('find-one/:id')
  findOne(@Param('id') id: number): Promise<DocumentTemplate> {
    return this.templateService.findOne(id);
  }

  @Post('nfr-template-info')
  getTemplatesInfoByIds(@Body() ids: number[]): Promise<any[]> {
    return this.templateService.getTemplatesInfoByIds(ids);
  }
}
