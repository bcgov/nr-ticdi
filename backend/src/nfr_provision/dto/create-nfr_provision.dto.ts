import { PickType } from "@nestjs/swagger";
import { NFRProvisionDto } from "./nfr_provision.dto";

export class CreateNFRProvisionDto extends PickType(NFRProvisionDto, [
  "dtid",
  "type",
  "provision_group",
  "provision_group_text",
  "max",
  "provision_name",
  "free_text",
  "category",
  "create_userid",
] as const) {}
