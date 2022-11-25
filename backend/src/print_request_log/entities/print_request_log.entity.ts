import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class PrintRequestLog {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: true })
  document_template_id: number;
  @Column({ nullable: true })
  print_request_detail_id: number;
  @Column({ nullable: true })
  dtid: number;
  @Column({ nullable: true })
  request_app_user: string;
  @Column({ nullable: true })
  request_json: string;
  @Column({ nullable: true })
  create_userid: string;
  @Column({ nullable: true })
  update_userid: string;
  @CreateDateColumn({ nullable: true })
  create_timestamp: Date;
  @UpdateDateColumn({ nullable: true })
  update_timestamp: Date;

  constructor(
    document_template_id?: number,
    print_request_detail_id?: number,
    dtid?: number,
    request_app_user?: string,
    request_json?: string,
    create_userid?: string,
    update_userid?: string
  ) {
    this.document_template_id = document_template_id || null;
    this.print_request_detail_id = print_request_detail_id || null;
    this.dtid = dtid || null;
    this.request_app_user = request_app_user || "";
    this.request_json = request_json || "";
    this.create_userid = create_userid || "";
    this.update_userid = update_userid || "";
  }
}
