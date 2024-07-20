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
  dtid: number | null;
  fileNum: string | null;
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

export type DocumentDataVariableObject = {
  data_variable_value: string;
  id: number;
  provision_variable: ProvisionVariableObject;
};

export type ProvisionVariableObject = {
  id: number;
  variable_name: string;
  variable_value: string;
  help_text: string;
  create_userid: string;
  update_userid: string;
  create_timestamp: string;
  update_timestamp: string;
  provision: Provision;
};

export type SimpleVariableObject = {
  id: number;
  variable_name: string;
  variable_value: string;
  help_text: string;
  create_userid: string;
  update_userid: string;
  create_timestamp: string;
  update_timestamp: string;
  provision_id: number;
};

export type DocumentDataProvisionObject = {
  provision_free_text: string;
  id: number;
  provision: ProvisionObject;
};

// Used on manage-templates page?
export type ProvisionObject = {
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
  sequence_value: number;
  create_timestamp: string;
  update_timestamp: string;
};

export type ProvisionGroup = {
  id: number;
  provision_group: number;
  provision_group_text: string;
  max: number;
};

export type DocumentDataObject = {
  documentData: {
    dtid: number;
    template_id: number;
    status: string;
    create_userid: string;
    update_userid: string;
    id: number;
    active: boolean;
    create_timestamp: string;
    update_timestamp: string;
    document_data_provisions: DocumentDataProvisionObject;
    document_data_variables: DocumentDataVariableObject;
    document_type: any; //
  };
  provisionIds: number[];
  variableIds: number[];
};

export type TemplateInfo = {
  template_version: number;
  file_name: string;
  create_timestamp: string;
  update_timestamp: string;
  active_flag: boolean;
  view: any; // remove from route
  remove: any; // remove from route
  preview: any; // remove from route
  edit: any;
  id: number;
};

export type GroupMax = {
  provision_group: number;
  max: number;
  provision_group_text: string;
};

export type Provision = {
  active_flag: boolean;
  category: string;
  create_timestamp: string;
  create_userid: string;
  free_text: string;
  help_text: string;
  id: number;
  is_deleted: boolean;
  provision_name: string;
  update_timestamp: string;
  update_userid: string;
};

export type Variable = {
  variable_name: string;
  variable_value: string;
  help_text: string;
  id: number;
  provision_id: number;
};

// used on Manage Provisions page
export type ProvisionUpload = {
  provision_name: string;
  free_text: string;
  help_text: string;
  category: string;
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
  document_data_id: number; //
  document_type: DocType; //
};

export type DocType = {
  id: number;
  name: string;
  prefix: string;
  created_by: string;
  created_date: string;
  create_userid: string;
  update_userid: string;
  create_timestamp: string;
  update_timestamp: string;
};

export type DocumentData = {
  dtid: number;
  template_id: number;
  status: string;
  active: boolean;
  create_userid: string;
  update_userid: string;
  create_timestamp: Date;
  update_timestamp: Date;
  document_data_provisions?: DocumentDataProvision[];
  document_data_variables?: DocumentDataVariable[];
  document_type?: DocumentType;
};

export type DocTypeProvision = {
  id: number;
  associated: boolean;
  sequence_value: number;
  type: string;
  document_type?: DocumentType;
  provision?: Provision;
  provision_group?: ProvisionGroup;
  document_data_provisions?: DocumentDataProvision[];
};

export type DocumentDataProvision = {
  id: number;
  document_type_provision?: DocTypeProvision;
  document_provision?: Provision;
  document_data?: DocumentData;
};

export type DocumentDataVariable = {
  id: number;
  data_variable_value: string;
  document_variable_id: number;
  document_data_id: number;
};

export type SavedVariableInfo = {
  id: number;
  variable_id: number;
  saved_value: string;
};

export type DocumentDataDTO = {
  provisions: ProvisionDataObject[];
  variables: ProvisionVariableObject[];
  preselectedProvisionIds: number[];
  preselectedVariableIds: number[];
  documentDataProvisions: DocumentDataProvision[];
  savedVariableInfo: SavedVariableInfo[];
};

export type ProvisionDataObject = {
  id: number;
  associated: boolean;
  sequence_value: number;
  type: string;
  provision_id: number;
  provision_name: string;
  category: string;
  free_text: string;
  help_text: string;
  active_flag: boolean; // from global provision
  is_deleted: boolean; // from global provision
  create_userid: string;
  create_timestamp: string;
  update_userid: string;
  update_timestamp: string;
  provision_group: ProvisionGroup;
  document_type: DocumentType;
};

export type ReducedProvisionDataObject = {
  id: number;
  associated: boolean;
  sequence_value: number;
  type: string;
  provision_id: number;
  provision_name: string;
  category: string;
  free_text: string;
  help_text: string;
  active_flag: boolean; // from global provision
  is_deleted: boolean; // from global provision
  create_userid: string;
  create_timestamp: string;
  update_userid: string;
  update_timestamp: string;
  provision_group: ProvisionGroup;
};

export type VariableData = {
  id: number;
  variable_name: string;
  variable_value: string;
  help_text: string;
  create_userid: string;
  update_userid: string;
  create_timestamp: string;
  update_timestamp: string;
  provision: Provision;
};

export type UserObject = {
  name: string;
  username: string;
  email: string;
  remove: string;
  idirUsername: string;
};
