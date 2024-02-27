import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class PrintRequestDetail {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: true })
  dtid: number;
  @Column({ nullable: true })
  tenure_file_number: string;
  @Column({ nullable: true })
  incorporation_number: string;
  @Column({ nullable: true })
  organization_unit: string;
  @Column({ nullable: true })
  purpose_name: string;
  @Column({ nullable: true })
  sub_purpose_name: string;
  @Column({ nullable: true })
  type_name: string;
  @Column({ nullable: true })
  sub_type_name: string;
  @Column({ nullable: true })
  licence_holder_name: string;
  @Column({ nullable: true })
  contact_agent: string;
  @Column({ nullable: true })
  contact_company_name?: string;
  @Column({ nullable: true })
  contact_first_name?: string;
  @Column({ nullable: true })
  contact_middle_name?: string;
  @Column({ nullable: true })
  contact_last_name?: string;
  @Column({ nullable: true })
  contact_phone_number?: string;
  @Column({ nullable: true })
  contact_email_address?: string;
  @Column({ nullable: true })
  first_name: string;
  @Column({ nullable: true })
  middle_name: string;
  @Column({ nullable: true })
  last_name: string;
  @Column({ nullable: true })
  legal_name: string;
  @Column({ nullable: true })
  email_address: string;
  @Column({ nullable: true })
  phone_number: string;
  @Column({ nullable: true })
  inspected_date: string;
  @Column({ nullable: true })
  mailing_address: string;
  @Column({ nullable: true })
  mailing_address_line_1: string;
  @Column({ nullable: true })
  mailing_address_line_2: string;
  @Column({ nullable: true })
  mailing_address_line_3: string;
  @Column({ nullable: true })
  mailing_city: string;
  @Column({ nullable: true })
  mailing_province_state_code: string;
  @Column({ nullable: true })
  mailing_postal_code: string;
  @Column({ nullable: true })
  mailing_zip: string;
  @Column({ nullable: true })
  mailing_country_code: string;
  @Column({ nullable: true })
  mailing_country: string;
  @Column({ nullable: true })
  location_description: string;
  @Column({ nullable: true })
  tenure: string;
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
    tenure_file_number?: string,
    incorporation_number?: string,
    organization_unit?: string,
    purpose_name?: string,
    sub_purpose_name?: string,
    type_name?: string,
    sub_type_name?: string,
    licence_holder_name?: string,
    contact_agent?: string,
    contact_company_name?: string,
    contact_first_name?: string,
    contact_middle_name?: string,
    contact_last_name?: string,
    contact_phone_number?: string,
    contact_email_address?: string,
    first_name?: string,
    middle_name?: string,
    last_name?: string,
    legal_name?: string,
    email_address?: string,
    phone_number?: string,
    inspected_date?: string,
    mailing_address?: string,
    mailing_address_line_1?: string,
    mailing_address_line_2?: string,
    mailing_address_line_3?: string,
    mailing_city?: string,
    mailing_province_state_code?: string,
    mailing_postal_code?: string,
    mailing_zip?: string,
    mailing_country_code?: string,
    mailing_country?: string,
    location_description?: string,
    tenure?: string,
    create_userid?: string,
    update_userid?: string
  ) {
    this.dtid = dtid || null;
    this.tenure_file_number = tenure_file_number || '';
    this.incorporation_number = incorporation_number || '';
    this.organization_unit = organization_unit || '';
    this.purpose_name = purpose_name || '';
    this.sub_purpose_name = sub_purpose_name || '';
    this.type_name = type_name || '';
    this.sub_type_name = sub_type_name || '';
    this.licence_holder_name = licence_holder_name || '';
    this.contact_agent = contact_agent || '';
    this.contact_company_name = contact_company_name || '';
    this.contact_first_name = contact_first_name || '';
    this.contact_middle_name = contact_middle_name || '';
    this.contact_last_name = contact_last_name || '';
    this.contact_phone_number = contact_phone_number || '';
    this.contact_email_address = contact_email_address || '';
    this.first_name = first_name || '';
    this.middle_name = middle_name || '';
    this.last_name = last_name || '';
    this.legal_name = legal_name || '';
    this.email_address = email_address || '';
    this.phone_number = phone_number || '';
    this.inspected_date = inspected_date || '';
    this.mailing_address = mailing_address || '';
    this.mailing_address_line_1 = mailing_address_line_1 || '';
    this.mailing_address_line_2 = mailing_address_line_2 || '';
    this.mailing_address_line_3 = mailing_address_line_3 || '';
    this.mailing_city = mailing_city || '';
    this.mailing_province_state_code = mailing_province_state_code || '';
    this.mailing_postal_code = mailing_postal_code || '';
    this.mailing_zip = mailing_zip || '';
    this.mailing_country_code = mailing_country_code || '';
    this.mailing_country = mailing_country || '';
    this.location_description = location_description || '';
    this.tenure = tenure || '';
    this.create_userid = create_userid || '';
    this.update_userid = update_userid || '';
  }
}
