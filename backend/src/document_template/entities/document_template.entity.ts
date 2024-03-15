import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class DocumentTemplate {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  document_type: string; // the template type (Land Use Report / Notice of Final Review)
  @Column()
  template_version: number;
  @Column()
  template_author: string;
  @Column()
  active_flag: boolean;
  @Column()
  is_deleted: boolean;
  @Column()
  mime_type: string;
  @Column()
  file_name: string; // template name defined by the uploader
  @Column()
  the_file: string;
  @Column()
  comments: string; // currently unused
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
    active_flag?: boolean,
    is_deleted?: boolean,
    mime_type?: string,
    file_name?: string,
    the_file?: string,
    comments?: string,
    create_userid?: string,
    update_userid?: string
  ) {
    this.document_type = document_type || '';
    this.template_version = template_version || null;
    this.template_author = template_author || '';
    this.active_flag = active_flag || false;
    this.is_deleted = is_deleted || false;
    this.mime_type = mime_type || '';
    this.file_name = file_name || '';
    this.the_file = the_file || '';
    this.comments = comments || '';
    this.create_userid = create_userid || '';
    this.update_userid = update_userid || '';
  }
}
