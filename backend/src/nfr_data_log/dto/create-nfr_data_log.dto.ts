import { PickType } from '@nestjs/swagger';
import { NFRDataLogDto } from './nfr_data_log.dto';

export class CreateNFRDataLogDto extends PickType(NFRDataLogDto, [
  'document_template_id',
  'nfr_data_id',
  'dtid',
  'request_app_user',
  'request_json',
  'create_userid',
] as const) {}
