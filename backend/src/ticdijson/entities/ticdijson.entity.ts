import { TenantAddr } from "../../tenantAddr/entities/tenantAddr.entity";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";

@Entity()
export class Ticdijson {
  @PrimaryGeneratedColumn()
  id: number;
  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  createdAt: Date;
  @Column({ nullable: true })
  dtid: number;
  @Column({ nullable: true })
  fileNum: string;
  @Column({ nullable: true })
  orgUnit: string;
  @Column({ nullable: true })
  complexLevel: string;
  @Column({ nullable: true })
  purpose: string;
  @Column({ nullable: true })
  subPurpose: string;
  @Column({ nullable: true })
  subType: string;
  @Column({ nullable: true })
  type: string;
  @Column({ nullable: true })
  bcgsSheet: string;
  @Column({ nullable: true })
  airPhotoNum: string;
  @Column({ nullable: true })
  area: string;
  @Column({ nullable: true })
  locLand: string;
  @Column({ nullable: true })
  legalDesc: string;
  @OneToOne(() => TenantAddr, (tenantAddr) => tenantAddr.ticdijson)
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
