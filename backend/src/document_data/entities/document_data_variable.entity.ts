import { ProvisionVariable } from 'src/provision/entities/provision_variable.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DocumentData } from './document_data.entity';

@Entity()
export class DocumentDataVariable {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => ProvisionVariable, (document_variable) => document_variable.document_data_variables, {
    onDelete: 'CASCADE',
  })
  document_variable: ProvisionVariable;
  @ManyToOne(() => DocumentData, (document_data) => document_data.document_data_variables, {
    onDelete: 'CASCADE',
  })
  document_data: DocumentData;
  @Column({ nullable: true })
  data_variable_value: string;

  constructor(data_variable_value?: string) {
    this.data_variable_value = data_variable_value || '';
  }
}
