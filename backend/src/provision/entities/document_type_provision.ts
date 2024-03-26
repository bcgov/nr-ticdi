import { DocumentDataProvision } from 'src/document_data/entities/document_data_provision.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProvisionGroup } from '../../document_type/entities/provision_group.entity';
import { Provision } from './provision.entity';
import { DocumentType } from 'src/document_type/entities/document_type.entity';

@Entity()
export class DocumentTypeProvision {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  associated: boolean;

  @Column({ nullable: true })
  sequence_value: number;

  @Column({ nullable: true })
  type: string;

  @ManyToOne(() => DocumentType, (documentType) => documentType.document_type_provisions)
  document_type: DocumentType;

  @ManyToOne(() => Provision, (provision) => provision.document_type_provisions)
  provision: Provision;

  @ManyToOne(() => ProvisionGroup, (provisionGroup) => provisionGroup.document_type_provisions)
  provision_group: ProvisionGroup;

  @OneToMany(() => DocumentDataProvision, (documentDataProvision) => documentDataProvision.document_type_provision, {
    cascade: true,
  })
  document_data_provisions: DocumentDataProvision[];

  constructor(associated?: boolean, sequence_value?: number, type?: string) {
    this.associated = associated || false;
    this.sequence_value = sequence_value || 1;
    this.type = type || 'O';
  }
}
