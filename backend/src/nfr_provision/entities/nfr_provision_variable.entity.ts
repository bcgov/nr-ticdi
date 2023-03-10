import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
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

  @ManyToOne(() => NFRProvision, (provision) => provision.provision_variables, {
    nullable: true,
  })
  provision: NFRProvision;
}
