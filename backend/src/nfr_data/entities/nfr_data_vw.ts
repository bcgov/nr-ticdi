import { DataSource, ViewColumn, ViewEntity } from 'typeorm';
import { NFRData } from './nfr_data.entity';

@ViewEntity({
  expression: (dataSource: DataSource) =>
    dataSource
      .createQueryBuilder()
      .select('nfr_data.id', 'NFRDataId')
      .addSelect('nfr_data.dtid', 'DTID')
      .addSelect('nfr_data.db_address_regional_office', 'DB_Address_Regional_Office')
      .addSelect('nfr_data.var_telephone_number', 'VAR_Telephone_Number')
      .addSelect('nfr_data.var_facsimile_number', 'VAR_Facsimile_Number')
      .addSelect('nfr_data.db_name_bcal_contact', 'DB_Name_BCAL_Contact')
      .addSelect('nfr_data.db_file_number', 'DB_File_Number')
      .addSelect('nfr_data.var_client_file_no', 'VAR_Client_File_No')
      .addSelect('nfr_data.var_date_of_notice', 'VAR_Date_Of_Notice')
      .addSelect('nfr_data.db_address_mailing_tenant', 'DB_Address_Mailing_Tenant')
      .addSelect('nfr_data.var_attention_line', 'VAR_Attention_Line')
      .addSelect('nfr_data.var_salutation', 'VAR_Salutation')
      .addSelect('nfr_data.db_tenure_type', 'DB_Tenure_Type')
      .addSelect('nfr_data.var_purpose_generic', 'VAR_Purpose_Generic')
      .addSelect('nfr_data.db_legal_description', 'DB_Legal_Description')
      .addSelect('nfr_data.show_section_five_1', 'showSectionFive_1')
      .addSelect('nfr_data.section_five_1_text', 'SectionFive_1_Text')
      .addSelect('nfr_data.insert_space', 'Insert_Space')
      .addSelect('nfr_data.var_replacement_tenure_type', 'VAR_Replacement_Tenure_Type')
      .addSelect('nfr_data.show_section_five_2', 'showSectionFive_2')
      .addSelect('nfr_data.section_five_2_text', 'SectionFive_2_Text')
      .addSelect('nfr_data.var_why_land_differs', 'VAR_Why_Land_Differs')
      .addSelect('nfr_data.show_section_five_3', 'showSectionFive_3')
      .addSelect('nfr_data.var_sect5_free_field', 'VAR_Sect5_Free_Field')
      .addSelect('nfr_data.var_deadline_completion_requirements', 'VAR_Deadline_Completion_Requirements')
      .addSelect('nfr_data.var_number_of_copies', 'VAR_Number_Of_Copies')
      .addSelect('nfr_data.db_fee_payable_type', 'DB_Fee_Payable_Type')
      .addSelect('nfr_data.db_fee_payable_amount_gst', 'DB_Fee_Payable_Amount_GST')
      .addSelect('nfr_data.db_fee_payable_amount', 'DB_Fee_Payable_Amount')
      .addSelect('nfr_data.db_fp_asterisk', 'DB_FP_Asterisk')
      .addSelect('nfr_data.var_fee_occupational_rental_amount', 'VAR_Fee_Occupational_Rental_Amount')
      .addSelect('nfr_data.var_fee_application_amount', 'VAR_Fee_Application_Amount')
      .addSelect('nfr_data.var_fee_other_credit_amount', 'VAR_Fee_Other_Credit_Amount')
      .addSelect('nfr_data.db_total_gst_amount', 'DB_Total_GST_Amount')
      .addSelect('nfr_data.db_total_monies_payable', 'DB_Total_Monies_Payable')
      .addSelect('nfr_data.db_address_line_regional_office', 'DB_Address_Line_Regional_Office')
      .addSelect('nfr_data.var_interim_tenure_type', 'VAR_Interim_Tenure_Type')
      .addSelect('nfr_data.show_section_fifteen_1', 'showSectionFifteen_1')
      .addSelect('nfr_data.section_fifteen_1_text', 'SectionFifteen_1_Text')
      .addSelect('nfr_data.var_occ_rent_details', 'VAR_Occ_Rent_Details')
      .addSelect('nfr_data.show_section_twenty_1', 'showSectionTwenty_1')
      .addSelect('nfr_data.section_twenty_1_text', 'SectionTwenty_1_Text')
      .addSelect('nfr_data.show_section_twenty_2', 'showSectionTwenty_2')
      .addSelect('nfr_data.section_twenty_2_text', 'SectionTwenty_2_Text')
      .addSelect('nfr_data.show_section_twenty_3', 'showSectionTwenty_3')
      .addSelect('nfr_data.section_twenty_3_text', 'SectionTwenty_3_Text')
      .addSelect('nfr_data.show_section_twenty_4', 'showSectionTwenty_4')
      .addSelect('nfr_data.section_twenty_4_text', 'SectionTwenty_4_Text')
      .addSelect('nfr_data.show_section_twenty_5', 'showSectionTwenty_5')
      .addSelect('nfr_data.section_twenty_5_text', 'SectionTwenty_5_Text')
      .addSelect('nfr_data.show_section_twentyfive_1', 'showSectionTwentyFive_1')
      .addSelect('nfr_data.section_twentyfive_1_text', 'SectionTwentyFive_1_Text')
      .addSelect('nfr_data.show_section_twentyfive_2', 'showSectionTwentyFive_2')
      .addSelect('nfr_data.section_twentyfive_2_text', 'SectionTwentyFive_2_Text')
      .addSelect('nfr_data.show_section_twentyfive_3', 'showSectionTwentyFive_3')
      .addSelect('nfr_data.section_twentyfive_3_text', 'SectionTwentyFive_3_Text')
      .addSelect('nfr_data.show_section_twentyfive_4', 'showSectionTwentyFive_4')
      .addSelect('nfr_data.section_twentyfive_4_text', 'SectionTwentyFive_4_Text')
      .addSelect('nfr_data.show_section_twentyseven_1', 'showSectionTwentySeven_1')
      .addSelect('nfr_data.section_twentyseven_1_text', 'SectionTwentySeven_1_Text')
      .addSelect('nfr_data.show_section_twentyseven_2', 'showSectionTwentySeven_2')
      .addSelect('nfr_data.section_twentyseven_2_text', 'SectionTwentySeven_2_Text')
      .addSelect('nfr_data.show_section_twentyseven_3', 'showSectionTwentySeven_3')
      .addSelect('nfr_data.section_twentyseven_3_text', 'SectionTwentySeven_3_Text')
      .addSelect('nfr_data.show_section_twentyseven_4', 'showSectionTwentySeven_4')
      .addSelect('nfr_data.section_twentyseven_4_text', 'SectionTwentySeven_4_Text')
      .addSelect('nfr_data.show_section_twentyseven_5', 'showSectionTwentySeven_5')
      .addSelect('nfr_data.section_twentyseven_5_text', 'SectionTwentySeven_5_Text')
      .addSelect('nfr_data.show_section_twentyseven_6', 'showSectionTwentySeven_6')
      .addSelect('nfr_data.section_twentyseven_6_text', 'SectionTwentySeven_6_Text')
      .from(NFRData, 'nfr_data'),
})
export class NFRDataView {
  @ViewColumn()
  NFRDataId: number;
  @ViewColumn()
  DTID: number;
  @ViewColumn()
  DB_Address_Regional_Office: string;
  @ViewColumn()
  VAR_Telephone_Number: string;
  @ViewColumn()
  VAR_Facsimile_Number: string;
  @ViewColumn()
  DB_Name_BCAL_Contact: string;
  @ViewColumn()
  DB_File_Number: string;
  @ViewColumn()
  VAR_Client_File_No: string;
  @ViewColumn()
  VAR_Date_Of_Notice: string;
  @ViewColumn()
  DB_Address_Mailing_Tenant: string;
  @ViewColumn()
  VAR_Attention_Line: string;
  @ViewColumn()
  VAR_Salutation: string;
  @ViewColumn()
  DB_Tenure_Type: string;
  @ViewColumn()
  VAR_Purpose_Generic: string;
  @ViewColumn()
  DB_Legal_Description: string;
  @ViewColumn()
  showSectionFive_1: number;
  @ViewColumn()
  SectionFive_1_Text: string;
  @ViewColumn()
  Insert_Space: string;
  @ViewColumn()
  VAR_Replacement_Tenure_Type: string;
  @ViewColumn()
  showSectionFive_2: number;
  @ViewColumn()
  SectionFive_2_Text: string;
  @ViewColumn()
  VAR_Why_Land_Differs: string;
  @ViewColumn()
  showSectionFive_3: string;
  @ViewColumn()
  VAR_Sect5_Free_Field: string;
  @ViewColumn()
  VAR_Deadline_Completion_Requirements: string;
  @ViewColumn()
  VAR_Number_Of_Copies: string;
  @ViewColumn()
  DB_Fee_Payable_Type: string;
  @ViewColumn()
  DB_Fee_Payable_Amount_GST: string;
  @ViewColumn()
  DB_Fee_Payable_Amount: string;
  @ViewColumn()
  DB_FP_Asterisk: string;
  @ViewColumn()
  VAR_Fee_Occupational_Rental_Amount: string;
  @ViewColumn()
  VAR_Fee_Application_Amount: string;
  @ViewColumn()
  VAR_Fee_Other_Credit_Amount: string;
  @ViewColumn()
  DB_Total_GST_Amount: string;
  @ViewColumn()
  DB_Total_Monies_Payable: string;
  @ViewColumn()
  DB_Address_Line_Regional_Office: string;
  @ViewColumn()
  VAR_Interim_Tenure_Type: string;
  @ViewColumn()
  showSectionFifteen_1: number;
  @ViewColumn()
  SectionFifteen_1_Text: string;
  @ViewColumn()
  VAR_Occ_Rent_Details: string;
  @ViewColumn()
  showSectionTwenty_1: number;
  @ViewColumn()
  SectionTwenty_1_Text: string;
  @ViewColumn()
  showSectionTwenty_2: number;
  @ViewColumn()
  SectionTwenty_2_Text: string;
  @ViewColumn()
  showSectionTwenty_3: number;
  @ViewColumn()
  SectionTwenty_3_Text: string;
  @ViewColumn()
  showSectionTwenty_4: number;
  @ViewColumn()
  SectionTwenty_4_Text: string;
  @ViewColumn()
  showSectionTwenty_5: number;
  @ViewColumn()
  SectionTwenty_5_Text: string;
  @ViewColumn()
  showSectionTwentyFive_1: number;
  @ViewColumn()
  SectionTwentyFive_1_Text: string;
  @ViewColumn()
  showSectionTwentyFive_2: number;
  @ViewColumn()
  SectionTwentyFive_2_Text: string;
  @ViewColumn()
  showSectionTwentyFive_3: number;
  @ViewColumn()
  SectionTwentyFive_3_Text: string;
  @ViewColumn()
  showSectionTwentyFive_4: number;
  @ViewColumn()
  SectionTwentyFive_4_Text: string;
  @ViewColumn()
  showSectionTwentySeven_1: number;
  @ViewColumn()
  SectionTwentySeven_1_Text: string;
  @ViewColumn()
  showSectionTwentySeven_2: number;
  @ViewColumn()
  SectionTwentySeven_2_Text: string;
  @ViewColumn()
  showSectionTwentySeven_3: number;
  @ViewColumn()
  SectionTwentySeven_3_Text: string;
  @ViewColumn()
  showSectionTwentySeven_4: number;
  @ViewColumn()
  SectionTwentySeven_4_Text: string;
  @ViewColumn()
  showSectionTwentySeven_5: number;
  @ViewColumn()
  SectionTwentySeven_5_Text: string;
  @ViewColumn()
  showSectionTwentySeven_6: number;
  @ViewColumn()
  SectionTwentySeven_6_Text: string;
}
