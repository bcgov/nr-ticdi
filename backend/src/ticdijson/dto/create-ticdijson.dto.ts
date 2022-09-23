import { PickType } from "@nestjs/swagger";
import { TicdijsonDto } from "./ticdijson.dto";

export class CreateTicdijsonDto extends PickType(TicdijsonDto, [
  "dtid",
  "fileNum",
  "orgUnit",
  "complexLevel",
  "purpose",
  "subPurpose",
  "subType",
  "type",
  "bcgsSheet",
  "airPhotoNum",
  "area",
  "locLand",
  "legalDesc",
  "tenantAddr",
] as const) {}
