import { NFRProvision } from "src/nfr_provision/entities/nfr_provision.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { NFRData } from "./nfr_data.entity";

@Entity()
export class NFRDataProvision {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(
    () => NFRProvision,
    (nfr_provision) => nfr_provision.nfr_data_provisions
  )
  nfr_provision: NFRProvision;
  @ManyToOne(() => NFRData, (nfr_data) => nfr_data.nfr_data_provisions)
  nfr_data: NFRData;
  @Column({ nullable: true })
  provision_free_text: string;

  constructor(provision_free_text?: string) {
    this.provision_free_text = provision_free_text || "";
  }
}
