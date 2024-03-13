import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Provision } from './provision.entity';

/**
 * This entity holds group descriptions and provision maximums
 * based on group number. Every NFRProvision is associated with
 * an NFRProvisionGroup.
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

  @OneToMany(() => Provision, (provision) => provision.provision_group, {
    nullable: true,
  })
  provisions: Provision[];
}
