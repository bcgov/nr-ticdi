export interface DispositionTransactionResource {
  "@type": "DispositionTransactionResource";
  links: RelLink[];
  dtid: number;
  fileNum: string;
  orgUnit: string;
  complexLevel: string;
  purpose: string;
  subPurpose: string;
  subType: string;
  type: string;
  bcgsSheet: string;
  airPhotoNum: string;
  locLand: string;
  inspectionDate: string;
  interestParcel: any[]; // Define the actual type for interestParcel
  contactCompanyName: string;
  contactFirstName: string;
  contactMiddleName: string;
  contactLastName: string;
  contactPhoneNumber: string;
  contactEmail: string;
  feePayableType: string;
  feePayableAmount: number;
  feePayableAmountGst: number;
  regOfficeStreet: string;
  regOfficeCity: string;
  regOfficeProv: string;
  regOfficePostalCode: string;
  gstRate: number;
  gstExempt: "U";
  gstExemptArea: number;
  tenantAddr: TenantAddressResource[];
}

interface RelLink {
  "@type": "RelLink";
  rel: string;
  href: string;
  method: string;
}

export interface TenantAddressResource {
  "@type": "TenantAddressResource";
  links: RelLink[];
  firstName: string;
  middleName: string;
  lastName: string;
  legalName: string;
  incorporationNum: string;
  emailAddress: string;
  locationSid: number;
  ipSid: number;
  addrSid: number;
  addrLine1: string;
  postalCode: string;
  city: string;
  zipCode: string;
  addrLine2: string;
  addrLine3: string;
  countryCd: string;
  regionCd: string;
  country: string;
  provAbbr: string;
  stateAbbr: string;
  addrType: string;
  areaCode: string;
  phoneNumber: string;
}
