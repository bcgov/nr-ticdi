import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { NFRProvision } from "./nfr_provision.entity";

@Entity()
export class NFRProvisionGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  provision_group: number;

  @Column()
  provision_group_text: string;

  @Column()
  max: number;

  @OneToMany(() => NFRProvision, (provision) => provision.provision_group)
  provisions: NFRProvision[];
}
