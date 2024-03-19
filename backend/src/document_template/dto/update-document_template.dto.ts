import { PickType } from '@nestjs/swagger';
import { DocumentTemplateDto } from './document_template.dto';

export class UpdateDocumentTemplateDto extends PickType(DocumentTemplateDto, [
  'document_type_id',
  'template_version',
  'template_author',
  'template_creation_date',
  'active_flag',
  'mime_type',
  'file_name',
  'the_file',
  'comments',
  'update_userid',
] as const) {}
