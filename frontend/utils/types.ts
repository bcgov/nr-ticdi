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
