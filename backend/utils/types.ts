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
