import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProvisionGroup } from './provision_group.entity';
import { ProvisionVariable } from './provision_variable.entity';
import { DocumentDataProvision } from 'src/document_data/entities/document_data_provision.entity';
import { DocumentType } from 'src/document_type/entities/document_type.entity';

@Entity()
export class Provision {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: true })
  type: string;
  @Column({ nullable: true })
  provision_name: string;
  @Column({ nullable: true })
  free_text: string;
  @Column({ nullable: true })
  help_text: string;
  @Column({ nullable: true })
  category: string;
  @Column({ nullable: true })
  active_flag: boolean;
  @Column({ nullable: true })
  create_userid: string;
  @Column({ nullable: true })
  update_userid: string;
  @CreateDateColumn()
  create_timestamp: Date;
  @UpdateDateColumn()
  update_timestamp: Date;
  @ManyToOne(() => ProvisionGroup, (provisionGroup) => provisionGroup.provisions)
  provision_group: ProvisionGroup;
  @OneToMany(() => ProvisionVariable, (provisionVariable) => provisionVariable.provision, {
    nullable: true,
    cascade: true,
  })
  provision_variables: ProvisionVariable[];
  @OneToMany(() => DocumentDataProvision, (documentDataProvision) => documentDataProvision.document_provision, {
    nullable: true,
    cascade: true,
  })
  document_data_provisions: DocumentDataProvision[];
  @ManyToMany(() => DocumentType)
  @JoinTable({
    name: 'provision_document_type',
    joinColumn: {
      name: 'provision_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'document_type_id',
      referencedColumnName: 'id',
    },
  })
  document_types: DocumentType[];

  constructor(
    type?: string,
    provision_name?: string,
    free_text?: string,
    category?: string,
    active_flag?: boolean,
    create_userid?: string,
    update_userid?: string,
    provision_group?: ProvisionGroup
  ) {
    this.type = type || '';
    this.provision_name = provision_name || '';
    this.free_text = free_text || '';
    this.category = category || '';
    this.active_flag = active_flag;
    this.create_userid = create_userid || '';
    this.update_userid = update_userid || '';
    this.provision_group = provision_group || null;
  }
}
