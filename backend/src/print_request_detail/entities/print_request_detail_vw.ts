import { DataSource, ViewColumn, ViewEntity } from "typeorm";
import { PrintRequestDetail } from "./print_request_detail.entity";

@ViewEntity({
  expression: (dataSource: DataSource) =>
    dataSource
      .createQueryBuilder()
      .select("print_request_detail.id", "PRDID")
      .addSelect("print_request_detail.dtid", "DTID")
      .addSelect("print_request_detail.tenure_file_number", "FileNum")
      .addSelect("print_request_detail.organization_unit", "OrganizationUnit")
      .addSelect("print_request_detail.purpose_name", "Purpose")
      .addSelect("print_request_detail.sub_purpose_name", "SubPurpose")
      .addSelect("print_request_detail.type_name", "TenureType")
      .addSelect("print_request_detail.sub_type_name", "TenureSubType")
      .addSelect(
        "print_request_detail.licence_holder_name",
        "LicenceHolderName"
      ) // add to entity
      .addSelect("print_request_detail.mailing_address", "MailingAddress") // add to entity
      .addSelect("print_request_detail.mailing_city", "MailingCity")
      .addSelect(
        "print_request_detail.mailing_province_state_code",
        "MailingProv"
      )
      .addSelect("print_request_detail.mailing_postal_code", "PostCode")
      .addSelect("print_request_detail.location_description", "Location")
      .addSelect("print_request_detail.area_ha_number", "TenureArea")
      .addSelect("print_request_detail.legal_description", "LegalDescription")
      .from(PrintRequestDetail, "print_request_detail"),
})
export class PrintRequestDetailView {
  @ViewColumn()
  DTID: number;
  @ViewColumn()
  PRDID: number;
  @ViewColumn()
  FileNum: string;
  @ViewColumn()
  OrganizationUnit: string;
  @ViewColumn()
  Purpose: string;
  @ViewColumn()
  SubPurpose: string;
  @ViewColumn()
  TenureType: string;
  @ViewColumn()
  TenureSubType: string;
  @ViewColumn()
  LicenceHolderName: string;
  @ViewColumn()
  MailingAddress: string;
  @ViewColumn()
  MailingCity: string;
  @ViewColumn()
  MailingProv: string;
  @ViewColumn()
  PostCode: string;
  @ViewColumn()
  TenureArea: string;
  @ViewColumn()
  Location: string;
  @ViewColumn()
  LegalDescription: string;
}
