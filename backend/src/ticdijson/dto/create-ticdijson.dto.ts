import { PickType } from "@nestjs/swagger";
import { TicdijsonDto } from "./ticdijson.dto";

export class CreateTicdijsonDto extends PickType(TicdijsonDto, [
  "contactName",
  "email",
  "organizationUnit",
  "incorporationNumber",
  "policyName",
  "inspectedDate",
  "purposeStatement",
  "fileNumber",
  "type",
  "purpose",
  "area",
  "legalDescription",
  "mailingAddress",
  "subtype",
  "subpurpose",
  "locationOfLand",
] as const) {}
