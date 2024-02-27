import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { NFRProvision } from './nfr_provision.entity';

/**
 * This entity allows us to associate certain provisions with certain
 * variants and to alter those associations easily. This is used
 * when loading the NFR report page with relevant provisions.
 */
@Entity()
export class NFRProvisionVariant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  variant_name: string;

  @ManyToMany(() => NFRProvision, (provision) => provision.provision_variant, {
    nullable: true,
  })
  provisions: NFRProvision[];
}
