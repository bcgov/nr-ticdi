import { PickType } from '@nestjs/swagger';
import { DocumentDataDto } from './document_data.dto';

export class CreateDocumentDataDto extends PickType(DocumentDataDto, [
  'dtid',
  'document_type_id',
  'template_id',
  'status',
  'create_userid',
] as const) {}
