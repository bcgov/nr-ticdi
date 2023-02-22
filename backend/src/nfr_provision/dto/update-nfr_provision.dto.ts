import { PickType } from "@nestjs/swagger";
import { NFRProvisionDto } from "./nfr_provision.dto";

export class UpdateNFRProvisionDto extends PickType(NFRProvisionDto, [
  "dtid",
  "type",
  "provision_group",
  "max",
  "free_text",
  "category",
  "active_flag",
  "update_userid",
] as const) {}
