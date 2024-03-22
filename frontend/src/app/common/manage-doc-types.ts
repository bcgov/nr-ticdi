import config from '../../config';
import { DocType, ProvisionGroup } from '../types/types';
import * as api from './api';

export type ManageDocTypeProvision = {
  id: number;
  type: string;
  provision_name: string;
  free_text: string;
  help_text: string;
  category: string;
  active_flag: boolean;
  order_value: number;
  associated: boolean;
  provision_group: ProvisionGroup;
  // create_userid: string;
  // update_userid: string;
  // create_timestamp: string;
  // update_timestamp: string;
};

export const getDocumentTypes = () => {
  const url = `${config.API_BASE_URL}/document-type`;
  const getParameters = api.generateApiParameters(url);
  return api.get<DocType[]>(getParameters);
};

export const addDocType = (name: string, created_by: string, created_date: string) => {
  const url = `${config.API_BASE_URL}/document-type/add`;
  const data = {
    name,
    created_by,
    created_date,
  };
  const postParameters = api.generateApiParameters(url, data);
  return api.post<DocType>(postParameters);
};

export const updateDocType = (id: number, name: string, created_by: string, created_date: string) => {
  const url = `${config.API_BASE_URL}/document-type/update`;
  const data = {
    id,
    name,
    created_by,
    created_date,
  };
  const postParameters = api.generateApiParameters(url, data);
  return api.post<DocType>(postParameters);
};

export const removeDocType = (id: number) => {
  const url = `${config.API_BASE_URL}/document-type/remove/${id}`;
  const getParameters = api.generateApiParameters(url);
  return api.get<DocType>(getParameters);
};

export const getManageDocumentTypeProvisions = (document_type_id: number) => {
  const url = `${config.API_BASE_URL}/provision/get-manage-doc-type-provisions/${document_type_id}`;
  const getParameters = api.generateApiParameters(url);
  return api.get<ManageDocTypeProvision[]>(getParameters);
};

export const associateProvisionToDocType = (provision_id: number, document_type_id: number) => {
  const url = `${config.API_BASE_URL}/provision/associate-doc-type/${provision_id}/${document_type_id}`;
  const getParameters = api.generateApiParameters(url);
  return api.get<any>(getParameters);
};

export const disassociateProvisionFromDocType = (provision_id: number, document_type_id: number) => {
  const url = `${config.API_BASE_URL}/provision/disassociate-doc-type/${provision_id}/${document_type_id}`;
  const getParameters = api.generateApiParameters(url);
  return api.get<any>(getParameters);
};
