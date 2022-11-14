import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Template {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  template: string;
  @Column()
  document_description: string;
  @Column()
  document_type: string;
  @Column()
  document_version: string;
  @Column()
  author: string;
  @Column()
  updated_by: string;
  @CreateDateColumn()
  created_date: Date;
  @UpdateDateColumn()
  updated_date: Date;

  constructor(
    template?: string,
    document_description?: string,
    document_type?: string,
    document_version?: string,
    author?: string,
    updated_by?: string
  ) {
    this.template = template;
    this.document_description = document_description;
    this.document_type = document_type;
    this.document_version = document_version;
    this.author = author;
    this.updated_by = updated_by || "";
  }
}
