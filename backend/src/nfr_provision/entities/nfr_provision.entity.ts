import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { NFRProvisionGroup } from "./nfr_provision_group.entity";
import { NFRProvisionVariant } from "./nfr_provision_variant.entity";
import { NFRProvisionVariable } from "./nfr_provision_variable.entity";
import { NFRDataProvision } from "src/nfr_data/entities/nfr_data_provision.entity";

@Entity()
export class NFRProvision {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: true })
  type: string;
  @Column({ nullable: true })
  provision_name: string;
  @Column({ nullable: true })
  free_text: string;
  @Column({ nullable: true })
  help_text: string;
  @Column({ nullable: true })
  category: string;
  @Column({ nullable: true })
  active_flag: boolean;
  @Column({ nullable: true })
  mandatory: boolean;
  @Column({ nullable: true })
  create_userid: string;
  @Column({ nullable: true })
  update_userid: string;
  @CreateDateColumn()
  create_timestamp: Date;
  @UpdateDateColumn()
  update_timestamp: Date;
  @ManyToOne(
    () => NFRProvisionGroup,
    (provisionGroup) => provisionGroup.provisions
  )
  provision_group: NFRProvisionGroup;
  @OneToMany(
    () => NFRProvisionVariable,
    (provisionVariable) => provisionVariable.provision,
    {
      nullable: true,
      cascade: true,
    }
  )
  provision_variables: NFRProvisionVariable[];
  @ManyToMany(() => NFRProvisionVariant, {
    nullable: true,
    eager: true,
  })
  @JoinTable()
  provision_variant: NFRProvisionVariant[];
  @OneToMany(
    () => NFRDataProvision,
    (nfrDataProvision) => nfrDataProvision.nfr_provision,
    {
      nullable: true,
      cascade: true,
    }
  )
  nfr_data_provisions: NFRDataProvision[];

  constructor(
    type?: string,
    provision_name?: string,
    free_text?: string,
    category?: string,
    active_flag?: boolean,
    mandatory?: boolean,
    create_userid?: string,
    update_userid?: string,
    provision_group?: NFRProvisionGroup,
    provision_variant?: NFRProvisionVariant[]
  ) {
    this.type = type || "";
    this.provision_name = provision_name || "";
    this.free_text = free_text || "";
    this.category = category || "";
    this.active_flag = active_flag;
    this.mandatory = mandatory;
    this.create_userid = create_userid || "";
    this.update_userid = update_userid || "";
    this.provision_group = provision_group || null;
    this.provision_variant = provision_variant;
  }
}
