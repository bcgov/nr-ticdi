import { PickType } from "@nestjs/swagger";
import { TenantAddrDto } from "./tenantAddr.dto";

export class CreateTenantAddrDto extends PickType(TenantAddrDto, [
  "id",
  "dtid",
  "firstName",
  "middleName",
  "lastName",
  "legalName",
  "locationSid",
  "ipSid",
  "addrSid",
  "addrLine1",
  "postalCode",
  "city",
  "zipCode",
  "addrLine2",
  "addrLine3",
  "countryCd",
  "regionCd",
  "country",
  "provAbbr",
  "stateAbbr",
  "addrType",
] as const) {}
