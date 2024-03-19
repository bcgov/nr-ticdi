import { PickType } from '@nestjs/swagger';
import { DocumentTemplateDto } from './document_template.dto';

export class CreateDocumentTemplateDto extends PickType(DocumentTemplateDto, [
  'document_type_id',
  'template_author',
  'mime_type',
  'file_name',
  'comments',
  'create_userid',
] as const) {}
