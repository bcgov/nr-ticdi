import { NFRProvision } from "src/nfr_provision/entities/nfr_provision.entity";
import { NFRProvisionGroup } from "src/nfr_provision/entities/nfr_provision_group.entity";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { NFRData } from "./nfr_data.entity";

/**
 * This entity loosely connects NFRData to NFRProvision and allows
 * provisions to be enabled and disabled.
 */
@Entity()
export class NFRDataProvision {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  enabled: boolean;

  @ManyToOne(() => NFRData, (nfr_data) => nfr_data.nfr_data_provisions, {
    nullable: true,
  })
  @JoinColumn({ name: "nfr_data_id" })
  nfr_data: NFRData;

  @ManyToOne(
    () => NFRProvision,
    (nfr_provision) => nfr_provision.nfr_data_provisions,
    { nullable: true }
  )
  @JoinColumn({ name: "nfr_provision_id" })
  nfr_provision: NFRProvision;

  get provisionGroup(): NFRProvisionGroup {
    return this.nfr_provision?.provision_group;
  }

  constructor(
    enabled?: boolean,
    nfr_data?: NFRData,
    nfr_provision?: NFRProvision
  ) {
    this.enabled = enabled || false;
    this.nfr_data = nfr_data || null;
    this.nfr_provision = nfr_provision || null;
  }
}
