import { Provision } from 'src/provision/entities/provision.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DocumentData } from './document_data.entity';
import { DocumentTypeProvision } from 'src/provision/entities/document_type_provision';

@Entity()
export class DocumentDataProvision {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => DocumentTypeProvision, (documentTypeProvision) => documentTypeProvision.document_data_provisions, {
    onDelete: 'CASCADE',
  })
  document_type_provision: DocumentTypeProvision;

  @ManyToOne(() => Provision, (provision) => provision.document_data_provisions)
  document_provision: Provision;

  @ManyToOne(() => DocumentData, (documentData) => documentData.document_data_provisions, {
    onDelete: 'CASCADE',
  })
  document_data: DocumentData;
}
