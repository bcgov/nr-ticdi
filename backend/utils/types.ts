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
