import { NFRDataVariable } from "src/nfr_data/entities/nfr_data_variable.entity";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { NFRProvision } from "./nfr_provision.entity";

/**
 * This entity holds variables associated with a provision.
 * When a document is generated, these variables are
 * inserted into the provision text.
 */
@Entity()
export class NFRProvisionVariable {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: true })
  variable_name: string;
  @Column({ nullable: true })
  variable_value: string;
  @Column({ nullable: true })
  help_text: string;
  @Column({ nullable: true })
  create_userid: string;
  @Column({ nullable: true })
  update_userid: string;
  @CreateDateColumn()
  create_timestamp: Date;
  @UpdateDateColumn()
  update_timestamp: Date;
  @ManyToOne(() => NFRProvision, (provision) => provision.provision_variables, {
    nullable: true,
  })
  provision: NFRProvision;
  @OneToMany(
    () => NFRDataVariable,
    (nfrDataVariable) => nfrDataVariable.nfr_variable,
    {
      nullable: true,
      cascade: true,
    }
  )
  nfr_data_variables: NFRDataVariable[];
}
