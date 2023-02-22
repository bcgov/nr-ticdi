import { PickType } from "@nestjs/swagger";
import { NFRProvisionDto } from "./nfr_provision.dto";

export class CreateNFRProvisionDto extends PickType(NFRProvisionDto, [
  "dtid",
  "type",
  "provision_group",
  "max",
  "free_text",
  "category",
  "active_flag",
  "create_userid",
] as const) {}
