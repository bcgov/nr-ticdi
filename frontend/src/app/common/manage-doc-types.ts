import config from '../../config';
import { DocType, GroupMax, Provision, ProvisionGroup, Variable } from '../types/types';
import * as api from './api';

export type ManageDocTypeProvision = {
  id: number;
  provision_id: number;
  type: string;
  provision_name: string;
  free_text: string;
  help_text: string;
  category: string;
  active_flag: boolean;
  sequence_value: number;
  associated: boolean;
  provision_group: number;
  max: number;
  provision_group_object: ProvisionGroup | null;
};

export type ProvisionInfo = Provision & {
  provision_variables: Variable[];
};

export const getDocumentTypes = () => {
  const url = `${config.API_BASE_URL}/document-type`;
  const getParameters = api.generateApiParameters(url);
  return api.get<DocType[]>(getParameters);
};

export const addDocType = (name: string, prefix: string, created_by: string, created_date: string) => {
  const url = `${config.API_BASE_URL}/admin/add-document-type`;
  const data = {
    name,
    prefix,
    created_by,
    created_date,
  };
  const postParameters = api.generateApiParameters(url, data);
  return api.post<DocType>(postParameters);
};

export const updateDocType = (id: number, name: string, prefix: string, created_by: string, created_date: string) => {
  const url = `${config.API_BASE_URL}/document-type/update`;
  const data = {
    id,
    name,
    prefix,
    created_by,
    created_date,
  };
  const postParameters = api.generateApiParameters(url, data);
  return api.post<DocType>(postParameters);
};

export const removeDocType = (id: number) => {
  const url = `${config.API_BASE_URL}/admin/remove-document-type/${id}`;
  const getParameters = api.generateApiParameters(url);
  return api.get<DocType>(getParameters);
};

export const getActiveDocTypes = () => {
  const url = `${config.API_BASE_URL}/document-type/active-doc-types`;
  const getParameters = api.generateApiParameters(url);
  return api.get<DocType[]>(getParameters);
};

// used to activate doc type so that it displays in dropdowns
export const activateDocType = (document_type_id: number) => {
  const url = `${config.API_BASE_URL}/document-type/activate/${document_type_id}`;
  const getParameters = api.generateApiParameters(url);
  return api.get<any>(getParameters);
};

// used to deactivate doc type so that it does not display in dropdowns
export const deactivateDocType = (document_type_id: number) => {
  const url = `${config.API_BASE_URL}/document-type/deactivate/${document_type_id}`;
  const getParameters = api.generateApiParameters(url);
  return api.get<any>(getParameters);
};

export const getManageDocumentTypeProvisions = (document_type_id: number) => {
  const url = `${config.API_BASE_URL}/provision/get-manage-doc-type-provisions/${document_type_id}`;
  const getParameters = api.generateApiParameters(url);
  return api.get<ManageDocTypeProvision[]>(getParameters);
};

export const getGlobalProvisions = () => {
  const url = `${config.API_BASE_URL}/provision`;
  const getParameters = api.generateApiParameters(url);
  return api.get<Provision[]>(getParameters);
};

export const getProvisionInfo = (provision_id: number) => {
  const url = `${config.API_BASE_URL}/provision/get-provision-info/${provision_id}`;
  const getParameters = api.generateApiParameters(url);
  return api.get<ProvisionInfo>(getParameters);
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

export const updateManageDocTypeProvisions = (
  document_type_id: number,
  updatedProvisions: ManageDocTypeProvision[]
) => {
  const url = `${config.API_BASE_URL}/provision/update-manage-doc-type-provisions`;
  const data = {
    document_type_id: document_type_id,
    provisions: updatedProvisions,
  };
  const postParameters = api.generateApiParameters(url, data);
  return api.post<ManageDocTypeProvision[]>(postParameters);
};

// used on manage doc types page
export const getGroupMax = async (): Promise<GroupMax[]> => {
  const url = `${config.API_BASE_URL}/document-type/get-group-max`;
  const getParameters = api.generateApiParameters(url);
  const response: GroupMax[] = await api.get<GroupMax[]>(getParameters);
  return response;
};

// to be used on report page
export const getGroupMaxByDocTypeId = async (document_type_id: number): Promise<GroupMax[]> => {
  const url = `${config.API_BASE_URL}/document-type/get-group-max/${document_type_id}`;
  const getParameters = api.generateApiParameters(url);
  const response: GroupMax[] = await api.get<GroupMax[]>(getParameters);
  return response;
};

export const addProvisionGroup = async (
  provision_group: number,
  provision_group_text: string,
  max: number,
  document_type_id: number
) => {
  const url = `${config.API_BASE_URL}/document-type/add-provision-group`;
  const data = {
    provision_group,
    provision_group_text,
    max,
    document_type_id,
  };
  const postParameters = api.generateApiParameters(url, data);
  const response = await api.post<any>(postParameters);
  return response;
};

export const updateProvisionGroups = async (updatedProvisionGroups: ProvisionGroup[], document_type_id: number) => {
  const url = `${config.API_BASE_URL}/document-type/update-provision-groups`;
  const data = {
    provision_groups: updatedProvisionGroups,
    document_type_id,
  };
  const postParameters = api.generateApiParameters(url, data);
  const response = await api.post<any>(postParameters);
  return response;
};

export const removeProvisionGroup = async (provision_group_id: number) => {
  const url = `${config.API_BASE_URL}/document-type/remove-provision-group`;
  const data = {
    provision_group_id: provision_group_id,
  };
  const postParameters = api.generateApiParameters(url, data);
  const response = await api.post<any>(postParameters);
  return response;
};
