import { PickType } from '@nestjs/swagger';
import { ProvisionDto } from './provision.dto';

export class CreateProvisionDto extends PickType(ProvisionDto, [
  'dtid',
  'type',
  'provision_name',
  'free_text',
  'list_items',
  'list_enabled',
  'help_text',
  'category',
  'sequence_value',
  'create_userid',
] as const) {}
