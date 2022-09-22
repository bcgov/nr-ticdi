import { ApiProperty } from "@nestjs/swagger";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { TenantAddr } from "./tenantAddr.entity";

@Entity()
export class Ticdijson {
  @ApiProperty({
    example: "1",
    description: "The ID of the ticdijson",
  })
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  dtid: number;
  @Column()
  fileNum: string;
  @Column()
  orgUnit: string;
  @Column()
  complexLevel: string;
  @Column()
  purpose: string;
  @Column()
  subPurpose: string;
  @Column()
  subType: string;
  @Column()
  type: string;
  @Column()
  bcgsSheet: string;
  @Column()
  airPhotoNum: string;
  @Column()
  area: string;
  @Column()
  locLand: string;
  @Column()
  legalDesc: string;
  @OneToOne(() => TenantAddr, (tenantAddr) => tenantAddr.ticdijson)
  @JoinColumn({ name: "dtid" })
  tenantAddr: TenantAddr;

  constructor(
    dtid?: number,
    fileNum?: string,
    orgUnit?: string,
    complexLevel?: string,
    purpose?: string,
    subPurpose?: string,
    subType?: string,
    type?: string,
    bcgsSheet?: string,
    airPhotoNum?: string,
    area?: string,
    locLand?: string,
    legalDesc?: string,
    tenantAddr?: TenantAddr
  ) {
    this.dtid = dtid || null;
    this.fileNum = fileNum || "";
    this.orgUnit = orgUnit || "";
    this.complexLevel = complexLevel || "";
    this.purpose = purpose || "";
    this.subPurpose = subPurpose || "";
    this.subType = subType || "";
    this.type = type || "";
    this.bcgsSheet = bcgsSheet || "";
    this.airPhotoNum = airPhotoNum || "";
    this.area = area || "";
    this.locLand = locLand || "";
    this.legalDesc = legalDesc || "";
    this.tenantAddr = tenantAddr || null;
  }
}
