export type SessionData = {
  access_token: string;
  refresh_token: string;
  accounts: AccountObject[];
  activeAccount: AccountObject;
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
  role: string;
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
