import { PickType } from '@nestjs/swagger';
import { DocumentDataLogDto } from './document_data_log.dto';

export class UpdateDocumentDataLogDto extends PickType(DocumentDataLogDto, [
  'dtid',
  'document_data_id',
  'document_type_id',
  'document_template_id',
  'request_app_user',
  'request_json',
  'update_userid',
] as const) {}
