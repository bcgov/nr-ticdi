import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, ManyToOne } from 'typeorm';
import { Provision } from './provision.entity';
import { DocumentType } from 'src/document_type/entities/document_type.entity';

/**
 * This entity holds group descriptions and provision maximums
 * based on group number. Every Provision is associated with
 * a ProvisionGroup.
 */
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

  @OneToMany(() => Provision, (provision) => provision.provision_group, {
    nullable: true,
  })
  provisions: Provision[];
}
