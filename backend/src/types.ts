import { ProvisionGroup } from 'src/document_type/entities/provision_group.entity';

/**
 * DocumentTemplate object without the base64 file.
 */
export type TrimmedDocumentTemplate = {
  document_type_id?: number;
  template_version?: number;
  template_author?: string;
  active_flag?: boolean;
  is_deleted?: boolean;
  mime_type?: string;
  file_name?: string;
  comments?: string;
  create_userid?: string;
  update_userid?: string;
};

export type VariableJSON = {
  variable_name: string;
  variable_value: string;
  provision_id: number;
  variable_id: number;
};

export type ProvisionJSON = {
  provision_name: string;
  provision_group: number;
  free_text: string;
  list_items: string[];
  provision_id: number;
  sequence_value: number;
  doc_type_provision_id: number;
};

export type UserObject = {
  name: string;
  username: string;
  email: string;
  remove: string;
  idirUsername: string;
};

export type SearchResultsItem = {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  attributes: {
    idir_user_guid: [string];
    idir_username: [string];
    display_name: [string];
  };
};

// type used by the frontend for displaying data in a table
export type ManageDocTypeProvision = {
  id: number;
  provision_id: number;
  type: string;
  provision_name: string;
  free_text: string;
  list_items: string[];
  help_text: string;
  category: string;
  active_flag: boolean;
  sequence_value: number;
  associated: boolean; // is the provision currently associated with the doc type
  provision_group: number;
  max: number;
  provision_group_object: ProvisionGroup;
};

export type IdirObject = {
  exp: number;
  iat: number;
  auth_time: number;
  jti: string;
  iss: string;
  aud: string;
  sub: string;
  typ: string;
  azp: string;
  nonce: string;
  session_state: string;
  scope: string;
  sid: string;
  idir_user_guid: string;
  identity_provider: string;
  idir_username: string;
  email_verified: boolean;
  name: string;
  preferred_username: string;
  display_name: string;
  given_name: string;
  family_name: string;
  email: string;
};

export interface DTR {
  dtid: number | null;
  fileNum: string | null;
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
  documentNum: number | null;
  interestParcel: InterestParcel[];
  tenantAddr: TenantAddressResource[];
}

export interface InterestParcel {
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

export interface TenantAddressResource {
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
