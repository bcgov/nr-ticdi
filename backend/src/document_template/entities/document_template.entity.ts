import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class DocumentTemplate {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  document_type: string;
  @Column()
  template_version: number;
  @Column()
  template_author: string;
  @Column()
  template_creation_date: string; // ?
  @Column()
  active_flag: boolean;
  @Column()
  mime_type: string;
  @Column()
  file_name: string;
  @Column()
  the_file: string;
  @Column()
  comments: string;
  @Column()
  create_userid: string;
  @Column()
  update_userid: string;
  @CreateDateColumn()
  create_timestamp: Date;
  @UpdateDateColumn()
  update_timestamp: Date;

  constructor(
    document_type?: string,
    template_version?: number,
    template_author?: string,
    template_creation_date?: string,
    active_flag?: boolean,
    mime_type?: string,
    file_name?: string,
    the_file?: string,
    comments?: string,
    create_userid?: string,
    update_userid?: string
  ) {
    this.document_type = document_type || "";
    this.template_version = template_version || null;
    this.template_author = template_author || "";
    this.template_creation_date = template_creation_date || "";
    this.active_flag = active_flag || false;
    this.mime_type = mime_type || "";
    this.file_name = file_name || "";
    this.the_file = the_file || "";
    this.comments = comments || "";
    this.create_userid = create_userid || "";
    this.update_userid = update_userid || "";
  }
}
