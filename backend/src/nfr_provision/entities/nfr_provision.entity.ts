import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class NFRProvision {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: true })
  dtid: number;
  @Column({ nullable: true })
  type: string;
  @Column({ nullable: true })
  provision_group: number;
  @Column({ nullable: true })
  max: number;
  @Column({ nullable: true })
  provision_text: string;
  @Column({ nullable: true })
  free_text: string;
  @Column({ nullable: true })
  category: string;
  @Column({ nullable: true })
  active_flag: boolean;
  @Column({ nullable: true })
  select: boolean;
  @Column({ nullable: true })
  create_userid: string;
  @Column({ nullable: true })
  update_userid: string;
  @CreateDateColumn()
  create_timestamp: Date;
  @UpdateDateColumn()
  update_timestamp: Date;

  constructor(
    dtid?: number,
    type?: string,
    provision_group?: number,
    max?: number,
    provision_text?: string,
    free_text?: string,
    category?: string,
    active_flag?: boolean,
    select?: boolean,
    create_userid?: string,
    update_userid?: string
  ) {
    this.dtid = dtid || null;
    this.type = type || "";
    this.provision_group = provision_group || null;
    this.max = max || null;
    this.provision_text = provision_text || "";
    this.free_text = free_text || "";
    this.category = category || "";
    this.active_flag = active_flag || false;
    this.select = select || false;
    this.create_userid = create_userid || "";
    this.update_userid = update_userid || "";
  }
}
