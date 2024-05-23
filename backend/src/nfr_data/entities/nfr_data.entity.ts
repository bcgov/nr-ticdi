import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { NFRDataProvision } from "./nfr_data_provision.entity";
import { NFRDataVariable } from "./nfr_data_variable.entity";

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
  @Column({ nullable: true })
  status: string;
  @OneToMany(
    () => NFRDataProvision,
    (nfrDataProvision) => nfrDataProvision.nfr_data,
    {
      nullable: true,
      cascade: true,
    }
  )
  nfr_data_provisions: NFRDataProvision[];
  @OneToMany(
    () => NFRDataVariable,
    (nfrDataVariable) => nfrDataVariable.nfr_data,
    {
      nullable: true,
      cascade: true,
    }
  )
  nfr_data_variables: NFRDataVariable[];
  @Column({ nullable: true })
  active: boolean;
  @Column({ nullable: true })
  create_userid: string;
  @Column({ nullable: true })
  update_userid: string;
  @CreateDateColumn()
  create_timestamp: Date;
  @UpdateDateColumn()
  update_timestamp: Date;

  public get getNfrDataProvisions(): NFRDataProvision[] {
    return this.nfr_data_provisions;
  }
  public get getNfrDataVariables(): NFRDataVariable[] {
    return this.nfr_data_variables;
  }

  constructor(
    dtid?: number,
    variant_name?: string,
    template_id?: number,
    status?: string,
    create_userid?: string,
    update_userid?: string
  ) {
    this.dtid = dtid || null;
    this.variant_name = variant_name || "";
    this.template_id = template_id || null;
    this.status = status || "";
    this.create_userid = create_userid || "";
    this.update_userid = update_userid || "";
  }
}
