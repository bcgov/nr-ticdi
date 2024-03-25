import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, ManyToOne } from 'typeorm';
import { DocumentType } from 'src/document_type/entities/document_type.entity';
import { DocumentTypeProvision } from './document_type_provision';

@Entity()
export class ProvisionGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  provision_group: number;

  @Column({ nullable: true })
  provision_group_text: string;

  @Column({ nullable: true })
  max: number;

  @ManyToOne(() => DocumentType, (documentType) => documentType.provision_groups)
  document_type: DocumentType;

  @OneToMany(() => DocumentTypeProvision, (documentTypeProvision) => documentTypeProvision.provision_group, {
    nullable: true,
  })
  provisions: DocumentTypeProvision[];
}
