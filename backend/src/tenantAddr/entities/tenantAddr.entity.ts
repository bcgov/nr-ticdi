import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Ticdijson } from "../../ticdijson/entities/ticdijson.entity";

@Entity()
export class TenantAddr {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: true })
  firstName: string;
  @Column({ nullable: true })
  middleName: string;
  @Column({ nullable: true })
  lastName: string;
  @Column({ nullable: true })
  legalName: string;
  @Column({ nullable: true })
  locationSid: string;
  @Column({ nullable: true })
  ipSid: string;
  @Column({ nullable: true })
  addrSid: string;
  @Column({ nullable: true })
  addrLine1: string;
  @Column({ nullable: true })
  postalCode: string;
  @Column({ nullable: true })
  city: string;
  @Column({ nullable: true })
  zipCode: string;
  @Column({ nullable: true })
  addrLine2: string;
  @Column({ nullable: true })
  addrLine3: string;
  @Column({ nullable: true })
  countryCd: string;
  @Column({ nullable: true })
  regionCd: string;
  @Column({ nullable: true })
  country: string;
  @Column({ nullable: true })
  provAbbr: string;
  @Column({ nullable: true })
  stateAbbr: string;
  @Column({ nullable: true })
  addrType: string;
  @OneToOne(() => Ticdijson, (ticdijson) => ticdijson.tenantAddr)
  @JoinColumn()
  ticdijson: Ticdijson;

  constructor(
    firstName?: string,
    middleName?: string,
    lastName?: string,
    legalName?: string,
    locationSid?: string,
    ipSid?: string,
    addrSid?: string,
    addrLine1?: string,
    postalCode?: string,
    city?: string,
    zipCode?: string,
    addrLine2?: string,
    addrLine3?: string,
    countryCd?: string,
    regionCd?: string,
    country?: string,
    provAbbr?: string,
    stateAbbr?: string,
    addrType?: string
  ) {
    this.firstName = firstName || "";
    this.middleName = middleName || "";
    this.lastName = lastName || "";
    this.legalName = legalName || "";
    this.locationSid = locationSid || "";
    this.ipSid = ipSid || "";
    this.addrSid = addrSid || "";
    this.addrLine1 = addrLine1 || "";
    this.postalCode = postalCode || "";
    this.city = city || "";
    this.zipCode = zipCode || "";
    this.addrLine2 = addrLine2 || "";
    this.addrLine3 = addrLine3 || "";
    this.countryCd = countryCd || "";
    this.regionCd = regionCd || "";
    this.country = country || "";
    this.provAbbr = provAbbr || "";
    this.stateAbbr = stateAbbr || "";
    this.addrType = addrType || "";
  }
}
