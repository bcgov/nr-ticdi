export interface DTR {
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

export type NfrDataVariableObject = {
  data_variable_value: string;
  id: number;
  nfr_variable: NfrVariableObject;
};

export type NfrVariableObject = {
  id: number;
  variable_name: string;
  variable_value: string;
  help_text: string;
  create_userid: string;
  update_userid: string;
  create_timestamp: string;
  update_timestamp: string;
};

export type NfrDataProvisionObject = {
  provision_free_text: string;
  id: number;
  provision: NfrProvisionObject;
};

export type NfrProvisionObject = {
  type: string;
  provision_name: string;
  free_text: string;
  category: string;
  active_flag: boolean;
  create_userid: string;
  update_userid: string;
  provision_group: number; // will always be null
  id: number;
  help_text: string;
  create_timestamp: string;
  update_timestamp: string;
};

export type ProvisionGroup = {
  id: number;
  provision_group: number;
  provision_group_text: string;
  max: number;
};

export type NfrDataObject = {
  nfrData: {
    dtid: number;
    variant_name: string;
    template_id: number;
    status: string;
    create_userid: string;
    update_userid: string;
    id: number;
    active: boolean;
    create_timestamp: string;
    update_timestamp: string;
    document_data_provisions: NfrDataProvisionObject;
    document_data_variables: NfrDataVariableObject;
  };
  provisionIds: number[];
  variableIds: number[];
};

export type TemplateInfo = {
  template_version: number;
  file_name: string;
  update_timestamp: string;
  active_flag: boolean;
  view: any; // remove from route
  remove: any; // remove from route
  preview: any; // remove from route
  id: number;
};

export type GroupMax = {
  provision_group: number;
  max: number;
  provision_group_text: string;
};

export type Provision = {
  type: string;
  provision_group: number;
  max: number;
  provision_name: string;
  free_text: string;
  category: string;
  active_flag: boolean;
  edit: any; // remove from route
  help_text: string;
  id: number;
  variants: any; // seems to be a string array which gets converted to string and saved in the cell
};

export type Variable = {
  variable_name: string;
  variable_value: string;
  edit: any; // remove
  remove: any; // remove
  help_text: string;
  id: number;
  provision_id: number;
};

export type ProvisionUpload = {
  type: string;
  provision_group: number;
  provision_group_text: string;
  max: number;
  provision_name: string;
  free_text: string;
  help_text: string;
  category: string;
  variants: any;
};

export type VariableUpload = {
  provision_id: number;
  variable_name: string;
  variable_value: string;
  help_text: string;
};

export type SearchData = {
  dtid: number;
  version: number;
  file_name: string;
  updated_date: string;
  status: string;
  active: boolean;
  nfr_id: number;
  variant_name: string;
};

export type DocumentType = {
  id: number;
  name: string;
  create_userid: string;
  update_userid: string;
  create_timestamp: string;
  update_timestamp: string;
};
