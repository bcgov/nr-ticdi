export interface DTR {
  // "@type": string;
  // links: RelLink[];
  dtid: number;
  fileNum: string;
  orgUnit: string | null;
  complexLevel: string | null;
  purpose: string | null;
  subPurpose: string | null;
  subType: string | null;
  type: string | null;
  bcgsSheet: string | null;
  airPhotoNum: string | null;
  locLand: string | null;
  inspectionDate: string | null;
  contactCompanyName: string | null;
  contactFirstName: string | null;
  contactMiddleName: string | null;
  contactLastName: string | null;
  contactPhoneNumber: string | null;
  contactEmail: string | null;
  feePayableType: string | null;
  feePayableAmount: number | null;
  feePayableAmountGst: number | null;
  regOfficeStreet: string | null;
  regOfficeCity: string | null;
  regOfficeProv: string | null;
  regOfficePostalCode: string | null;
  gstRate: number | null;
  gstExempt: string | null;
  gstExemptArea: number | null;
  interestParcel: InterestParcel[];
  tenantAddr: TenantAddressResource[];
}

export interface InterestParcel {
  // "@type": string;
  // links: any[];
  interestParcelId: number | null;
  legalDescription: string | null;
  areaCalcCode: string | null;
  areaCalcDescription: string | null;
  areaInHectares: number | null;
  expiryDate: Date | null;
  featureCode: string | null;
  areaInSquareMetres: number | null;
  areaLengthInMetres: number | null;
  wktGeometry: string | null;
}

// interface RelLink {
//   "@type": string;
//   rel: string | null;
//   href: string | null;
//   method: string | null;
// }

export interface TenantAddressResource {
  // "@type": string;
  // links: RelLink[];
  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
  legalName: string | null;
  incorporationNum: number | null;
  emailAddress: string | null;
  locationSid: number | null;
  ipSid: number | null;
  addrSid: number | null;
  addrLine1: string | null;
  postalCode: string | null;
  city: string | null;
  zipCode: string | null;
  addrLine2: string | null;
  addrLine3: string | null;
  countryCd: string | null;
  regionCd: string | null;
  country: string | null;
  provAbbr: string | null;
  stateAbbr: string | null;
  addrType: string | null;
  areaCode: string | null;
  phoneNumber: string | null;
}

/**
 * Parsed data for presenting data on frontend pages
 */
export interface DTRDisplayObject {
  // Basic Info
  dtid: number;
  fileNum: string;
  primaryContactName: string; // from tenantAddr
  // DTID Details
  contactName: string;
  orgUnit: string;
  primaryContactEmail: string; // from tenantAddr
  primaryContactPhone: string; // from tenantAddr
  contactEmail: string;
  contactPhoneNumber: string;
  incorporationNum: string; // from tenantAddr
  inspectionDate: string;
  // Tenure Details
  type: string;
  subType: string;
  purpose: string;
  subPurpose: string;
  mailingAddress1: string; // address line // from tenantAddr
  mailingAddress2: string; // city prov postal line // from tenantAddr
  mailingAddress3: string; // country line // from tenantAddr
  locLand: string;
  // Area (Land Use Report)
  areaList: AreaItem[];
  // Interested Parties (All Other Reports)
  interestedParties: InterestedParties[];
}

export interface AreaItem {
  areaInHectares: number | null;
  legalDescription: string | null;
}

export interface InterestedParties {
  clientName: string | null;
  address: string | null;
}
