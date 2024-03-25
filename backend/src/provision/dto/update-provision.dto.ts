import { PickType } from '@nestjs/swagger';
import { ProvisionDto } from './provision.dto';

export class UpdateProvisionDto extends PickType(ProvisionDto, [
  'dtid',
  'type',
  // 'provision_group',
  // 'provision_group_text',
  // 'max',
  'provision_name',
  'free_text',
  'help_text',
  'category',
  'order_value',
  'update_userid',
] as const) {}
