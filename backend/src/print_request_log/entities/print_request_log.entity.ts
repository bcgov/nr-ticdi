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
  @Column()
  document_template_id: number;
  @Column()
  print_request_detail_id: number;
  @Column()
  dtid: number;
  @Column()
  request_app_user: string;
  @Column()
  request_json: string;
  @Column()
  create_userid: string;
  @Column()
  update_userid: string;
  @CreateDateColumn()
  create_timestamp: Date;
  @UpdateDateColumn()
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
