import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { DocumentTemplate } from '../../document_template/entities/document_template.entity';
import { DocumentData } from 'src/document_data/entities/document_data.entity';
import { ProvisionGroup } from 'src/document_type/entities/provision_group.entity';
import { DocumentTypeProvision } from 'src/document_type/entities/document_type_provision';

@Entity()
export class DocumentType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  created_by: string;

  @Column({ nullable: true })
  created_date: Date;

  @Column()
  create_userid: string;

  @Column()
  update_userid: string;

  @CreateDateColumn()
  create_timestamp: Date;

  @UpdateDateColumn()
  update_timestamp: Date;

  @OneToMany(() => DocumentTemplate, (document_template) => document_template.document_type, {
    nullable: true,
  })
  document_templates: DocumentTemplate[];

  @OneToMany(() => DocumentData, (document_data) => document_data.document_type, {
    nullable: true,
  })
  document_data: DocumentData[];

  @OneToMany(() => ProvisionGroup, (provisionGroup) => provisionGroup.document_type, {
    cascade: true,
  })
  provision_groups: ProvisionGroup[];

  @OneToMany(() => DocumentTypeProvision, (documentTypeProvision) => documentTypeProvision.document_type, {
    cascade: true,
  })
  document_type_provisions: DocumentTypeProvision[];

  constructor(name?: string, created_by?: string, created_date?: Date, create_userid?: string, update_userid?: string) {
    this.name = name || '';
    this.created_by = created_by || '';
    this.created_date = created_date || null;
    this.create_userid = create_userid || '';
    this.update_userid = update_userid || '';
  }
}
