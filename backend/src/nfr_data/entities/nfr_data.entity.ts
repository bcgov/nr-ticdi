import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class NFRData {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: true })
  dtid: number;
  @Column({ nullable: true })
  variant_name: string;
  @Column({ nullable: true })
  template_id: number;
  @Column({ nullable: true })
  status: string;
  @Column("int", { array: true, nullable: true })
  enabled_provisions: number[];
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
    variant_name?: string,
    template_id?: number,
    status?: string,
    enabled_provisions?: number[],
    create_userid?: string,
    update_userid?: string
  ) {
    this.dtid = dtid || null;
    this.variant_name = variant_name || "";
    this.template_id = template_id || null;
    this.status = status || "";
    this.enabled_provisions = enabled_provisions || [];
    this.create_userid = create_userid || "";
    this.update_userid = update_userid || "";
  }
}
