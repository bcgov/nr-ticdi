import { DataSource, ViewColumn, ViewEntity } from "typeorm";
import { PrintRequestDetail } from "./print_request_detail.entity";

@ViewEntity({
  expression: (dataSource: DataSource) =>
    dataSource
      .createQueryBuilder()
      .select("print_request_detail.id", "PRDID")
      .addSelect("print_request_detail.dtid", "DTID")
      .addSelect("print_request_detail.tenure_file_number", "TenureFileNumber")
      .addSelect("print_request_detail.organization_unit", "OrganizationUnit")
      .addSelect("print_request_detail.purpose_name", "PurposeName")
      .addSelect("print_request_detail.sub_purpose_name", "SubPurposeName")
      .addSelect("print_request_detail.type_name", "Type_name")
      .addSelect("print_request_detail.sub_type_name", "SubTypeName")
      .addSelect("print_request_detail.area_ha_number", "AreaHaNumber")
      .addSelect("print_request_detail.first_name", "FirstName")
      .addSelect("print_request_detail.middle_name", "MiddleName")
      .addSelect("print_request_detail.last_name", "LastName")
      .addSelect(
        "print_request_detail.mailing_address_line_1",
        "MailingAddressLine1"
      )
      .addSelect(
        "print_request_detail.mailing_address_line_2",
        "MailingAddressLine2"
      )
      .addSelect(
        "print_request_detail.mailing_address_line_3",
        "MailingAddressLine3"
      )
      .addSelect("print_request_detail.mailing_city", "MailingCity")
      .addSelect(
        "print_request_detail.mailing_province_state_code",
        "MailingProvinceStateCode"
      )
      .addSelect(
        "print_request_detail.mailing_postal_code",
        "MailingPostalCode"
      )
      .addSelect("print_request_detail.mailing_zip", "MailingZip")
      .addSelect(
        "print_request_detail.mailing_country_code",
        "MailingCountryCode"
      )
      .addSelect("print_request_detail.mailing_country", "MailingCountry")
      .addSelect(
        "print_request_detail.location_description",
        "LocationDescription"
      )
      .addSelect("print_request_detail.legal_description", "LegalDescription")
      .from(PrintRequestDetail, "print_request_detail"),
})
export class PrintRequestDetailView {
  @ViewColumn()
  DTID: number;
  @ViewColumn()
  PRDID: number;
  @ViewColumn()
  TenureFileNumber: string;
  @ViewColumn()
  OrganizationUnit: string;
  @ViewColumn()
  PurposeName: string;
  @ViewColumn()
  SubPurposeName: string;
  @ViewColumn()
  Type_name: string;
  @ViewColumn()
  SubTypeName: string;
  @ViewColumn()
  AreaHaNumber: number;
  @ViewColumn()
  FirstName: string;
  @ViewColumn()
  MiddleName: string;
  @ViewColumn()
  LastName: string;
  @ViewColumn()
  MailingAddressLine1: string;
  @ViewColumn()
  MailingAddressLine2: string;
  @ViewColumn()
  MailingAddressLine3: string;
  @ViewColumn()
  MailingCity: string;
  @ViewColumn()
  MailingProvinceStateCode: string;
  @ViewColumn()
  MailingPostalCode: string;
  @ViewColumn()
  MailingZip: string;
  @ViewColumn()
  MailingCountryCode: string;
  @ViewColumn()
  MailingCountry: string;
  @ViewColumn()
  LocationDescription: string;
  @ViewColumn()
  LegalDescription: string;
}
