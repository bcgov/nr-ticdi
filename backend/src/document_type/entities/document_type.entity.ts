import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DocumentTemplate } from '../../document_template/entities/document_template.entity';
import { DocumentData } from 'src/document_data/entities/document_data.entity';
import { Provision } from 'src/provision/entities/provision.entity';
import { ProvisionGroup } from 'src/provision/entities/provision_group.entity';

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
  @ManyToMany(() => Provision, (provision) => provision.document_types)
  provisions: Provision[];
  @OneToMany(() => ProvisionGroup, (provisionGroup) => provisionGroup.document_type, {
    cascade: true,
  })
  provision_groups: ProvisionGroup[];

  constructor(name?: string, created_by?: string, created_date?: Date, create_userid?: string, update_userid?: string) {
    this.name = name || '';
    this.created_by = created_by || '';
    this.created_date = created_date || null;
    this.create_userid = create_userid || '';
    this.update_userid = update_userid || '';
  }
}
