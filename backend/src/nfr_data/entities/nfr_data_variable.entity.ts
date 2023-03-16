import { NFRProvisionVariable } from "src/nfr_provision/entities/nfr_provision_variable.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { NFRData } from "./nfr_data.entity";

@Entity()
export class NFRDataVariable {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(
    () => NFRProvisionVariable,
    (nfr_variable) => nfr_variable.nfr_data_variables,
    { onDelete: "CASCADE" }
  )
  nfr_variable: NFRProvisionVariable;
  @ManyToOne(() => NFRData, (nfr_data) => nfr_data.nfr_data_variables, {
    onDelete: "CASCADE",
  })
  nfr_data: NFRData;
  @Column({ nullable: true })
  data_variable_value: string;

  constructor(data_variable_value?: string) {
    this.data_variable_value = data_variable_value || "";
  }
}
