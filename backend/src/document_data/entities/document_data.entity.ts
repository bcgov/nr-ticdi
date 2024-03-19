import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DocumentDataProvision } from './document_data_provision.entity';
import { DocumentDataVariable } from './document_data_variable.entity';
import { DocumentType } from 'src/document_type/entities/document_type.entity';

@Entity()
export class DocumentData {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: true })
  dtid: number;
  @Column({ nullable: true })
  template_id: number;
  @Column({ nullable: true })
  status: string;
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
  @OneToMany(() => DocumentDataProvision, (documentDataProvision) => documentDataProvision.document_data, {
    nullable: true,
    cascade: true,
  })
  document_data_provisions: DocumentDataProvision[];
  @OneToMany(() => DocumentDataVariable, (documentDataVariable) => documentDataVariable.document_data, {
    nullable: true,
    cascade: true,
  })
  document_data_variables: DocumentDataVariable[];
  @ManyToOne(() => DocumentType, (document_type) => document_type.document_data, {})
  document_type: DocumentType;

  public get getDocumentDataProvisions(): DocumentDataProvision[] {
    return this.document_data_provisions;
  }
  public get getDocumentDataVariables(): DocumentDataVariable[] {
    return this.document_data_variables;
  }

  constructor(dtid?: number, template_id?: number, status?: string, create_userid?: string, update_userid?: string) {
    this.dtid = dtid || null;
    this.template_id = template_id || null;
    this.status = status || '';
    this.create_userid = create_userid || '';
    this.update_userid = update_userid || '';
  }
}
