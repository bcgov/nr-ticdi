import { DocumentDataVariable } from 'src/document_data/entities/document_data_variable.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Provision } from './provision.entity';

/**
 * This entity holds variables associated with a provision.
 * When a document is generated, these variables are
 * inserted into the provision text.
 */
@Entity()
export class ProvisionVariable {
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

  @ManyToOne(() => Provision, (provision) => provision.provision_variables, {
    nullable: true,
  })
  provision: Provision;

  @OneToMany(() => DocumentDataVariable, (documentDataVariable) => documentDataVariable.document_variable, {
    nullable: true,
    cascade: true,
  })
  document_data_variables: DocumentDataVariable[];
}
