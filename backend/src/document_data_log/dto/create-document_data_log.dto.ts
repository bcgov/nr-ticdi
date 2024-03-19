import { PickType } from '@nestjs/swagger';
import { DocumentDataLogDto } from './document_data_log.dto';

export class CreateDocumentDataLogDto extends PickType(DocumentDataLogDto, [
  'dtid',
  'document_type_id',
  'document_data_id',
  'document_template_id',
  'request_app_user',
  'request_json',
  'create_userid',
] as const) {}
