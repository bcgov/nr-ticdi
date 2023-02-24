import { PickType } from "@nestjs/swagger";
import { NFRProvisionDto } from "./nfr_provision.dto";

export class CreateNFRProvisionDto extends PickType(NFRProvisionDto, [
  "type",
  "provision_group",
  "max",
  "provision_text",
  "free_text",
  "category",
  "create_userid",
] as const) {}
