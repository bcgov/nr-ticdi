import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ProvisionVariable } from './provision_variable.entity';
import { DocumentDataProvision } from 'src/document_data/entities/document_data_provision.entity';
import { DocumentTypeProvision } from './document_type_provision';

@Entity()
export class Provision {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  provision_name: string;

  @Column({ nullable: true })
  free_text: string;

  @Column({ type: 'text', array: true, default: '{}' })
  list_items: string[];

  @Column({ nullable: true })
  help_text: string;

  @Column({ nullable: true })
  category: string;

  @Column({ nullable: true })
  active_flag: boolean;

  @Column({ nullable: true })
  is_deleted: boolean;

  @Column({ nullable: true })
  create_userid: string;

  @Column({ nullable: true })
  update_userid: string;

  @CreateDateColumn()
  create_timestamp: Date;

  @UpdateDateColumn()
  update_timestamp: Date;

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

  @OneToMany(() => DocumentTypeProvision, (documentTypeProvision) => documentTypeProvision.provision, {
    nullable: true,
    cascade: true,
  })
  document_type_provisions: DocumentTypeProvision[];

  constructor(
    provision_name?: string,
    free_text?: string,
    list_items?: string[],
    category?: string,
    active_flag?: boolean,
    create_userid?: string,
    update_userid?: string
  ) {
    this.provision_name = provision_name || '';
    this.free_text = free_text || '';
    this.list_items = list_items || [];
    this.category = category || '';
    this.active_flag = active_flag || true;
    this.create_userid = create_userid || '';
    this.update_userid = update_userid || '';
    this.is_deleted = false;
  }
}
