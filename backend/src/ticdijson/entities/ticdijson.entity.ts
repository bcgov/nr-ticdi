import { ApiProperty } from "@nestjs/swagger";
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Ticdijson {
  @ApiProperty({
    example: "1",
    description: "The ID of the ticdijson",
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: "Peter Green",
    description: "The contact or agent name",
  })
  @Column()
  contactName: string;

  @ApiProperty({
    example: "abc@gmail.com",
    description: "The email address",
  })
  @Column()
  email: string;

  @ApiProperty({
    example: "",
    description: "The organization unit",
  })
  @Column()
  organizationUnit: string;

  @ApiProperty({
    example: "123",
    description: "The incorporation number",
  })
  @Column()
  incorporationNumber: number;

  @ApiProperty({
    example: "",
    description: "The policy name",
  })
  @Column()
  policyName: string;

  @ApiProperty({
    example: "31-05-2022",
    description: "The inspected date",
  })
  @Column()
  inspectedDate: Date;

  @ApiProperty({
    example: "",
    description: "The purpose statement",
  })
  @Column()
  purposeStatement: string;

  @ApiProperty({
    example: "",
    description: "The file number",
  })
  @Column()
  fileNumber: string;

  @ApiProperty({
    example: "",
    description: "The type",
  })
  @Column()
  type: string;

  @ApiProperty({
    example: "",
    description: "The purpose",
  })
  @Column()
  purpose: string;

  @ApiProperty({
    example: "",
    description: "The area",
  })
  @Column()
  area: string;

  @ApiProperty({
    example: "",
    description: "The legal description",
  })
  @Column()
  legalDescription: string;

  @ApiProperty({
    example: "",
    description: "The mailing address",
  })
  @Column()
  mailingAddress: string;

  @ApiProperty({
    example: "",
    description: "The subtype",
  })
  @Column()
  subtype: string;

  @ApiProperty({
    example: "",
    description: "The subpurpose",
  })
  @Column()
  subpurpose: string;

  @ApiProperty({
    example: "",
    description: "The location of land",
  })
  @Column()
  locationOfLand: string;

  constructor(name?: string, email?: string) {
    this.contactName = name || "";
    this.email = email || "";
    this.organizationUnit || "";
    this.incorporationNumber || "";
    this.policyName || "";
    this.inspectedDate || "";
    this.purposeStatement || "";
    this.fileNumber || "";
    this.type || "";
    this.purpose || "";
    this.area || "";
    this.legalDescription || "";
    this.mailingAddress || "";
    this.subtype || "";
    this.subpurpose || "";
    this.locationOfLand || "";
  }
}
