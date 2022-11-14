import { ApiProperty } from "@nestjs/swagger";
import { TenantAddr } from "../../tenantAddr/entities/tenantAddr.entity";

export class TicdijsonDto {
  @ApiProperty({ example: "", description: "" })
  dtid: number;
  @ApiProperty({ example: "", description: "" })
  fileNum: string;
  @ApiProperty({ example: "", description: "" })
  orgUnit: string;
  @ApiProperty({ example: "", description: "" })
  complexLevel: string;
  @ApiProperty({ example: "", description: "" })
  purpose: string;
  @ApiProperty({ example: "", description: "" })
  subPurpose: string;
  @ApiProperty({ example: "", description: "" })
  subType: string;
  @ApiProperty({ example: "", description: "" })
  type: string;
  @ApiProperty({ example: "", description: "" })
  bcgsSheet: string;
  @ApiProperty({ example: "", description: "" })
  airPhotoNum: string;
  @ApiProperty({ example: "", description: "" })
  area: string;
  @ApiProperty({ example: "", description: "" })
  locLand: string;
  @ApiProperty({ example: "", description: "" })
  legalDesc: string;
  @ApiProperty({ example: "", description: "" })
  tenantAddr: TenantAddr;
}
