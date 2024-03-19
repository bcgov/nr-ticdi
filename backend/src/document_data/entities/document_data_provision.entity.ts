import { Provision } from 'src/provision/entities/provision.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DocumentData } from './document_data.entity';

@Entity()
export class DocumentDataProvision {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => Provision, (provision) => provision.document_data_provisions, {
    onDelete: 'CASCADE',
  })
  document_provision: Provision;
  @ManyToOne(() => DocumentData, (document_data) => document_data.document_data_provisions, {
    onDelete: 'CASCADE',
  })
  document_data: DocumentData;
  @Column({ nullable: true })
  provision_free_text: string;

  constructor(provision_free_text?: string) {
    this.provision_free_text = provision_free_text || '';
  }
}
