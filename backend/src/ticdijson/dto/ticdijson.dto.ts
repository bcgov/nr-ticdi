import { ApiProperty } from "@nestjs/swagger";

export class TicdijsonDto {
  @ApiProperty({
    example: "1",
    description: "The ID of the ticdijson",
  })
  id: number;

  @ApiProperty({
    example: "Peter Green",
    description: "The contact or agent name",
  })
  contactName: string;

  @ApiProperty({
    example: "abc@gmail.com",
    description: "The email address",
  })
  email: string;

  @ApiProperty({
    example: "",
    description: "The organization unit",
  })
  organizationUnit: string;

  @ApiProperty({
    example: "123",
    description: "The incorporation number",
  })
  incorporationNumber: number;

  @ApiProperty({
    example: "",
    description: "The policy name",
  })
  policyName: string;

  @ApiProperty({
    example: "31-05-2022",
    description: "The inspected date",
  })
  inspectedDate: Date;

  @ApiProperty({
    example: "",
    description: "The purpose statement",
  })
  purposeStatement: string;

  @ApiProperty({
    example: "",
    description: "The file number",
  })
  fileNumber: string;

  @ApiProperty({
    example: "",
    description: "The type",
  })
  type: string;

  @ApiProperty({
    example: "",
    description: "The purpose",
  })
  purpose: string;

  @ApiProperty({
    example: "",
    description: "The area",
  })
  area: string;

  @ApiProperty({
    example: "",
    description: "The legal description",
  })
  legalDescription: string;

  @ApiProperty({
    example: "",
    description: "The mailing address",
  })
  mailingAddress: string;

  @ApiProperty({
    example: "",
    description: "The subtype",
  })
  subtype: string;

  @ApiProperty({
    example: "",
    description: "The subpurpose",
  })
  subpurpose: string;

  @ApiProperty({
    example: "",
    description: "The location of land",
  })
  locationOfLand: string;
}
