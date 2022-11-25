import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class PrintRequestDetail {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: true })
  dtid: number;
  @Column({ nullable: true })
  tenure_file_number: string;
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
  first_name: string;
  @Column({ nullable: true })
  middle_name: string;
  @Column({ nullable: true })
  last_name: string;
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
  parcels: string;
  @Column({ nullable: true })
  area_ha_number: string; // from first entry in parcels
  @Column({ nullable: true })
  legal_description: string; // from first entry in parcels
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
    organization_unit?: string,
    purpose_name?: string,
    sub_purpose_name?: string,
    type_name?: string,
    sub_type_name?: string,
    licence_holder_name?: string,
    first_name?: string,
    middle_name?: string,
    last_name?: string,
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
    parcels?: string,
    area_ha_number?: string,
    legal_description?: string,
    create_userid?: string,
    update_userid?: string
  ) {
    this.dtid = dtid || null;
    this.tenure_file_number = tenure_file_number || "";
    this.organization_unit = organization_unit || "";
    this.purpose_name = purpose_name || "";
    this.sub_purpose_name = sub_purpose_name || "";
    this.type_name = type_name || "";
    this.sub_type_name = sub_type_name || "";
    this.licence_holder_name = licence_holder_name || "";
    this.first_name = first_name || "";
    this.middle_name = middle_name || "";
    this.last_name = last_name || "";
    this.mailing_address = mailing_address || "";
    this.mailing_address_line_1 = mailing_address_line_1 || "";
    this.mailing_address_line_2 = mailing_address_line_2 || "";
    this.mailing_address_line_3 = mailing_address_line_3 || "";
    this.mailing_city = mailing_city || "";
    this.mailing_province_state_code = mailing_province_state_code || "";
    this.mailing_postal_code = mailing_postal_code || "";
    this.mailing_zip = mailing_zip || "";
    this.mailing_country_code = mailing_country_code || "";
    this.mailing_country = mailing_country || "";
    this.location_description = location_description || "";
    this.parcels = parcels || "";
    this.area_ha_number = area_ha_number || "";
    this.legal_description = legal_description || "";
    this.create_userid = create_userid || "";
    this.update_userid = update_userid || "";
  }
}
