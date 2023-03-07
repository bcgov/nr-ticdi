import { PickType } from "@nestjs/swagger";
import { NFRDataDto } from "./nfr_data.dto";

export class CreateNFRDataDto extends PickType(NFRDataDto, [
  "dtid",
  "variant_name",
  "template_id",
  "status",
  "enabled_provisions",
  "create_userid",
] as const) {}
