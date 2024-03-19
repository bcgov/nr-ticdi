import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class DocumentDataLog {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: true })
  dtid: number;
  @Column({ nullable: true })
  document_type_id: number;
  @Column({ nullable: true })
  document_data_id: number;
  @Column({ nullable: true })
  document_template_id: number;
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
    dtid?: number,
    document_type_id?: number,
    document_data_id?: number,
    document_template_id?: number,
    request_app_user?: string,
    request_json?: string,
    create_userid?: string,
    update_userid?: string
  ) {
    this.dtid = dtid || null;
    this.document_type_id = document_type_id || null;
    this.document_data_id = document_data_id || null;
    this.document_template_id = document_template_id || null;
    this.request_app_user = request_app_user || '';
    this.request_json = request_json || '';
    this.create_userid = create_userid || '';
    this.update_userid = update_userid || '';
  }
}
