import { PickType } from "@nestjs/swagger";
import { PrintRequestDetailDto } from "./print_request_detail.dto";

export class UpdatePrintRequestDetailDto extends PickType(
  PrintRequestDetailDto,
  [
    "dtid",
    "tenure_file_number",
    "organization_unit",
    "purpose_name",
    "sub_purpose_name",
    "type_name",
    "sub_type_name",
    "area_ha_number",
    "first_name",
    "middle_name",
    "last_name",
    "mailing_address_line_1",
    "mailing_address_line_2",
    "mailing_address_line_3",
    "mailing_city",
    "mailing_province_state_code",
    "mailing_postal_code",
    "mailing_zip",
    "mailing_country_code",
    "mailing_country",
    "location_description",
    "legal_description",
    "update_userid",
  ] as const
) {}
