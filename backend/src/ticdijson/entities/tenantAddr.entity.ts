import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Ticdijson } from "./ticdijson.entity";

@Entity()
export class TenantAddr {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  firstName: string;
  @Column()
  middleName: string;
  @Column()
  lastName: string;
  @Column()
  legalName: string;
  @Column()
  locationSid: string;
  @Column()
  ipSid: string;
  @Column()
  addrSid: string;
  @Column()
  addrLine1: string;
  @Column()
  postalCode: string;
  @Column()
  city: string;
  @Column()
  zipCode: string;
  @Column()
  addrLine2: string;
  @Column()
  addrLine3: string;
  @Column()
  countryCd: string;
  @Column()
  regionCd: string;
  @Column()
  country: string;
  @Column()
  provAbbr: string;
  @Column()
  stateAbbr: string;
  @Column()
  addrType: string;
  @OneToOne(() => Ticdijson, (ticdijson) => ticdijson.tenantAddr)
  @JoinColumn({ name: "dtid" })
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
