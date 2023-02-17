import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class NFRData {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: true })
  dtid: number;
  @Column({ nullable: true })
  template_id: number;
  @Column({ nullable: true })
  status: string;
  @Column({ nullable: true })
  db_address_regional_office: string;
  @Column({ nullable: true })
  var_telephone_number: string;
  @Column({ nullable: true })
  var_facsimile_number: string;
  @Column({ nullable: true })
  db_name_bcal_contact: string;
  @Column({ nullable: true })
  db_file_number: string;
  @Column({ nullable: true })
  var_client_file_no: string;
  @Column({ nullable: true })
  var_date_of_notice: string;
  @Column({ nullable: true })
  db_address_mailing_tenant: string;
  @Column({ nullable: true })
  var_attention_line: string;
  @Column({ nullable: true })
  var_salutation: string;
  @Column({ nullable: true })
  db_tenure_type: string;
  @Column({ nullable: true })
  var_purpose_generic: string;
  @Column({ nullable: true })
  db_legal_description: string;
  @Column({ nullable: true })
  show_section_five_1: number;
  @Column({ nullable: true })
  section_five_1_text: string;
  @Column({ nullable: true })
  insert_space: string;
  @Column({ nullable: true })
  var_replacement_tenure_type: string;
  @Column({ nullable: true })
  show_section_five_2: number;
  @Column({ nullable: true })
  section_five_2_text: string;
  @Column({ nullable: true })
  var_why_land_differs: string;
  @Column({ nullable: true })
  show_section_five_3: number;
  @Column({ nullable: true })
  var_sect5_free_field: string;
  @Column({ nullable: true })
  var_deadline_completion_requirements: string;
  @Column({ nullable: true })
  var_number_of_copies: string;
  @Column({ nullable: true })
  db_fee_payable_type: string;
  @Column({ nullable: true })
  db_fee_payable_amount_gst: string;
  @Column({ nullable: true })
  db_fee_payable_amount: string;
  @Column({ nullable: true })
  db_fp_asterisk: string;
  @Column({ nullable: true })
  var_fee_occupational_rental_amount: string;
  @Column({ nullable: true })
  var_fee_application_amount: string;
  @Column({ nullable: true })
  var_fee_other_credit_amount: string;
  @Column({ nullable: true })
  db_total_gst_amount: string;
  @Column({ nullable: true })
  db_total_monies_payable: string;
  @Column({ nullable: true })
  db_address_line_regional_office: string;
  @Column({ nullable: true })
  var_interim_tenure_type: string;
  @Column({ nullable: true })
  show_section_fifteen_1: number;
  @Column({ nullable: true })
  section_fifteen_1_text: string;
  @Column({ nullable: true })
  var_occ_rent_details: string;
  @Column({ nullable: true })
  show_section_twenty_1: number;
  @Column({ nullable: true })
  section_twenty_1_text: string;
  @Column({ nullable: true })
  show_section_twenty_2: number;
  @Column({ nullable: true })
  section_twenty_2_text: string;
  @Column({ nullable: true })
  show_section_twenty_3: number;
  @Column({ nullable: true })
  section_twenty_3_text: string;
  @Column({ nullable: true })
  show_section_twenty_4: number;
  @Column({ nullable: true })
  section_twenty_4_text: string;
  @Column({ nullable: true })
  show_section_twenty_5: number;
  @Column({ nullable: true })
  section_twenty_5_text: string;
  @Column({ nullable: true })
  show_section_twentyfive_1: number;
  @Column({ nullable: true })
  section_twentyfive_1_text: string;
  @Column({ nullable: true })
  show_section_twentyfive_2: number;
  @Column({ nullable: true })
  section_twentyfive_2_text: string;
  @Column({ nullable: true })
  show_section_twentyfive_3: number;
  @Column({ nullable: true })
  section_twentyfive_3_text: string;
  @Column({ nullable: true })
  show_section_twentyfive_4: number;
  @Column({ nullable: true })
  section_twentyfive_4_text: string;
  @Column({ nullable: true })
  show_section_twentyseven_1: number;
  @Column({ nullable: true })
  section_twentyseven_1_text: string;
  @Column({ nullable: true })
  show_section_twentyseven_2: number;
  @Column({ nullable: true })
  section_twentyseven_2_text: string;
  @Column({ nullable: true })
  show_section_twentyseven_3: number;
  @Column({ nullable: true })
  section_twentyseven_3_text: string;
  @Column({ nullable: true })
  show_section_twentyseven_4: number;
  @Column({ nullable: true })
  section_twentyseven_4_text: string;
  @Column({ nullable: true })
  show_section_twentyseven_5: number;
  @Column({ nullable: true })
  section_twentyseven_5_text: string;
  @Column({ nullable: true })
  show_section_twentyseven_6: number;
  @Column({ nullable: true })
  section_twentyseven_6_text: string;
  @Column({ nullable: true })
  create_userid: string;
  @Column({ nullable: true })
  update_userid: string;
  @CreateDateColumn()
  create_timestamp: Date;
  @UpdateDateColumn()
  update_timestamp: Date;

  constructor(
    dtid?: number,
    template_id?: number,
    db_address_regional_office?: string,
    var_telephone_number?: string,
    var_facsimile_number?: string,
    db_name_bcal_contact?: string,
    db_file_number?: string,
    var_client_file_no?: string,
    var_date_of_notice?: string,
    db_address_mailing_tenant?: string,
    var_attention_line?: string,
    var_salutation?: string,
    db_tenure_type?: string,
    var_purpose_generic?: string,
    db_legal_description?: string,
    show_section_five_1?: number,
    section_five_1_text?: string,
    insert_space?: string,
    var_replacement_tenure_type?: string,
    show_section_five_2?: number,
    section_five_2_text?: string,
    var_why_land_differs?: string,
    show_section_five_3?: number,
    var_sect5_free_field?: string,
    var_deadline_completion_requirements?: string,
    var_number_of_copies?: string,
    db_fee_payable_type?: string,
    db_fee_payable_amount_gst?: string,
    db_fee_payable_amount?: string,
    db_fp_asterisk?: string,
    var_fee_occupational_rental_amount?: string,
    var_fee_application_amount?: string,
    var_fee_other_credit_amount?: string,
    db_total_gst_amount?: string,
    db_total_monies_payable?: string,
    db_address_line_regional_office?: string,
    var_interim_tenure_type?: string,
    show_section_fifteen_1?: number,
    section_fifteen_1_text?: string,
    var_occ_rent_details?: string,
    show_section_twenty_1?: number,
    section_twenty_1_text?: string,
    show_section_twenty_2?: number,
    section_twenty_2_text?: string,
    show_section_twenty_3?: number,
    section_twenty_3_text?: string,
    show_section_twenty_4?: number,
    section_twenty_4_text?: string,
    show_section_twenty_5?: number,
    section_twenty_5_text?: string,
    show_section_twentyfive_1?: number,
    section_twentyfive_1_text?: string,
    show_section_twentyfive_2?: number,
    section_twentyfive_2_text?: string,
    show_section_twentyfive_3?: number,
    section_twentyfive_3_text?: string,
    show_section_twentyfive_4?: number,
    section_twentyfive_4_text?: string,
    show_section_twentyseven_1?: number,
    section_twentyseven_1_text?: string,
    show_section_twentyseven_2?: number,
    section_twentyseven_2_text?: string,
    show_section_twentyseven_3?: number,
    section_twentyseven_3_text?: string,
    show_section_twentyseven_4?: number,
    section_twentyseven_4_text?: string,
    show_section_twentyseven_5?: number,
    section_twentyseven_5_text?: string,
    show_section_twentyseven_6?: number,
    section_twentyseven_6_text?: string,
    create_userid?: string,
    update_userid?: string
  ) {
    this.dtid = dtid || null;
    this.template_id = template_id || null;
    this.db_address_regional_office = db_address_regional_office || "";
    this.var_telephone_number = var_telephone_number || "";
    this.var_facsimile_number = var_facsimile_number || "";
    this.db_name_bcal_contact = db_name_bcal_contact || "";
    this.db_file_number = db_file_number || "";
    this.var_client_file_no = var_client_file_no || "";
    this.var_date_of_notice = var_date_of_notice || "";
    this.db_address_mailing_tenant = db_address_mailing_tenant || "";
    this.var_attention_line = var_attention_line || "";
    this.var_salutation = var_salutation || "";
    this.db_tenure_type = db_tenure_type || "";
    this.var_purpose_generic = var_purpose_generic || "";
    this.db_legal_description = db_legal_description || "";
    this.show_section_five_1 = show_section_five_1 || 0;
    this.section_five_1_text = section_five_1_text || "";
    this.insert_space = insert_space || "";
    this.var_replacement_tenure_type = var_replacement_tenure_type || "";
    this.show_section_five_2 = show_section_five_2 || 0;
    this.section_five_2_text = section_five_2_text || "";
    this.var_why_land_differs = var_why_land_differs || "";
    this.show_section_five_3 = show_section_five_3 || 0;
    this.var_sect5_free_field = var_sect5_free_field || "";
    this.var_deadline_completion_requirements =
      var_deadline_completion_requirements || "";
    this.var_number_of_copies = var_number_of_copies || "";
    this.db_fee_payable_type = db_fee_payable_type || "";
    this.db_fee_payable_amount_gst = db_fee_payable_amount_gst || "";
    this.db_fee_payable_amount = db_fee_payable_amount || "";
    this.db_fp_asterisk = db_fp_asterisk || "";
    this.var_fee_occupational_rental_amount =
      var_fee_occupational_rental_amount || "";
    this.var_fee_application_amount = var_fee_application_amount || "";
    this.var_fee_other_credit_amount = var_fee_other_credit_amount || "";
    this.db_total_gst_amount = db_total_gst_amount || "";
    this.db_total_monies_payable = db_total_monies_payable || "";
    this.db_address_line_regional_office =
      db_address_line_regional_office || "";
    this.var_interim_tenure_type = var_interim_tenure_type || "";
    this.show_section_fifteen_1 = show_section_fifteen_1 || 0;
    this.section_fifteen_1_text = section_fifteen_1_text || "";
    this.var_occ_rent_details = var_occ_rent_details || "";
    this.show_section_twenty_1 = show_section_twenty_1 || 0;
    this.section_twenty_1_text = section_twenty_1_text || "";
    this.show_section_twenty_2 = show_section_twenty_2 || 0;
    this.section_twenty_2_text = section_twenty_2_text || "";
    this.show_section_twenty_3 = show_section_twenty_3 || 0;
    this.section_twenty_3_text = section_twenty_3_text || "";
    this.show_section_twenty_4 = show_section_twenty_4 || 0;
    this.section_twenty_4_text = section_twenty_4_text || "";
    this.show_section_twenty_5 = show_section_twenty_5 || 0;
    this.section_twenty_5_text = section_twenty_5_text || "";
    this.show_section_twentyfive_1 = show_section_twentyfive_1 || 0;
    this.section_twentyfive_1_text = section_twentyfive_1_text || "";
    this.show_section_twentyfive_2 = show_section_twentyfive_2 || 0;
    this.section_twentyfive_2_text = section_twentyfive_2_text || "";
    this.show_section_twentyfive_3 = show_section_twentyfive_3 || 0;
    this.section_twentyfive_3_text = section_twentyfive_3_text || "";
    this.show_section_twentyfive_4 = show_section_twentyfive_4 || 0;
    this.section_twentyfive_4_text = section_twentyfive_4_text || "";
    this.show_section_twentyseven_1 = show_section_twentyseven_1 || 0;
    this.section_twentyseven_1_text = section_twentyseven_1_text || "";
    this.show_section_twentyseven_2 = show_section_twentyseven_2 || 0;
    this.section_twentyseven_2_text = section_twentyseven_2_text || "";
    this.show_section_twentyseven_3 = show_section_twentyseven_3 || 0;
    this.section_twentyseven_3_text = section_twentyseven_3_text || "";
    this.show_section_twentyseven_4 = show_section_twentyseven_4 || 0;
    this.section_twentyseven_4_text = section_twentyseven_4_text || "";
    this.show_section_twentyseven_5 = show_section_twentyseven_5 || 0;
    this.section_twentyseven_5_text = section_twentyseven_5_text || "";
    this.show_section_twentyseven_6 = show_section_twentyseven_6 || 0;
    this.section_twentyseven_6_text = section_twentyseven_6_text || "";
    this.create_userid = create_userid || "";
    this.update_userid = update_userid || "";
  }
}
