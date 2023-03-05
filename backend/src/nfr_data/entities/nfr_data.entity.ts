import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { NFRDataProvision } from "./nfr_data_provision.entity";

@Entity()
export class NFRData {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: true })
  dtid: number;
  @Column({ nullable: true })
  variant_name: string;
  @Column({ nullable: true })
  template_id: number;
  @OneToMany(
    () => NFRDataProvision,
    (nfr_data_provision) => nfr_data_provision.nfr_data,
    { nullable: true }
  )
  nfr_data_provisions: NFRDataProvision[];
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
    variant_name?: string,
    template_id?: number,
    nfr_data_provisions?: NFRDataProvision[],
    create_userid?: string,
    update_userid?: string
  ) {
    this.dtid = dtid || null;
    this.variant_name = variant_name || "";
    this.template_id = template_id || null;
    this.nfr_data_provisions = nfr_data_provisions || null;
    this.create_userid = create_userid || "";
    this.update_userid = update_userid || "";
  }
}
