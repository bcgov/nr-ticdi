import { PickType } from '@nestjs/swagger';
import { DocumentDataDto } from './document_data.dto';

export class UpdateDocumentDataDto extends PickType(DocumentDataDto, [
  'dtid',
  'document_type_id',
  'template_id',
  'status',
  'enabled_provisions',
  'update_userid',
] as const) {}
