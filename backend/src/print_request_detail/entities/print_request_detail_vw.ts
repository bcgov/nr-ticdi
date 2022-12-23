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
      )
      .addSelect("print_request_detail.mailing_address", "MailingAddress")
      .addSelect("print_request_detail.mailing_city", "MailingCity")
      .addSelect(
        "print_request_detail.mailing_province_state_code",
        "MailingProv"
      )
      .addSelect("print_request_detail.mailing_postal_code", "PostCode")
      .addSelect("print_request_detail.email_address", "PrimaryContactEmail")
      .addSelect("print_request_detail.phone_number", "PrimaryContactPhone")
      .addSelect("print_request_detail.location_description", "Location")
      .addSelect("print_request_detail.tenure", "Tenure")
      .addSelect("print_request_detail.contact_agent", "ContactAgent")
      .addSelect(
        "print_request_detail.contact_email_address",
        "ContactAgentEmail"
      )
      .addSelect(
        "print_request_detail.contact_phone_number",
        "ContactAgentPhone"
      )
      .addSelect("print_request_detail.inspected_date", "InspectionDate")
      .addSelect(
        "print_request_detail.incorporation_number",
        "IncorporationNumber"
      )
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
  ContactAgent: string;
  @ViewColumn()
  ContactAgentEmail: string;
  @ViewColumn()
  ContactAgentPhone: string;
  @ViewColumn()
  Tenure: string;
  @ViewColumn()
  Location: string;
  @ViewColumn()
  PrimaryContactEmail: string;
  @ViewColumn()
  PrimaryContactPhone: string;
  @ViewColumn()
  InspectionDate: string;
  @ViewColumn()
  IncorporationNumber: string;
}
