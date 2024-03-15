/**
 * DocumentTemplate object without the base64 file.
 */
export type TrimmedDocumentTemplate = {
  document_type?: string;
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
  provision_id: number;
};

/**
 * Old frontend
 */

export type SessionData = {
  access_token: string;
  refresh_token: string;
  accounts: AccountObject[];
  activeAccount: AccountObject;
  selected_document: {
    nfr_id: number;
  };
};

export type AccountObject = {
  name: string;
  full_name: string;
  idir_username: string;
  client_roles: string[];
};

export type TokenObject = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_expires_in: number;
  error?: any;
};

export type UserObject = {
  name: string;
  username: string;
  email: string;
  remove: string;
  idirUsername: string;
};

export type ExportDataObject = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  idir_user_guid: string;
  idir_username: string;
  display_name: string;
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
