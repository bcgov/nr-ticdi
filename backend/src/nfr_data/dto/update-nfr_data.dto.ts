import { PickType } from '@nestjs/swagger';
import { NFRDataDto } from './nfr_data.dto';

export class UpdateNFRDataDto extends PickType(NFRDataDto, [
  'dtid',
  'variant_name',
  'template_id',
  'status',
  'enabled_provisions',
  'update_userid',
] as const) {}
