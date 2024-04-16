import * as api from './api';
import config from '../../config';
import { GroupMax, Provision, TemplateInfo, Variable } from '../types/types';

export const getTemplatesInfo = async (document_type_id: number): Promise<TemplateInfo[]> => {
  const url = `${config.API_BASE_URL}/admin/get-templates/${document_type_id}`;
  const getParameters = api.generateApiParameters(url);
  const response: TemplateInfo[] = await api.get<TemplateInfo[]>(getParameters);
  console.log('getTemplatesInfo response');
  console.log(response);
  return response;
};

export const getGroupMax = async (): Promise<GroupMax[]> => {
  const url = `${config.API_BASE_URL}/admin/get-group-max`;
  const getParameters = api.generateApiParameters(url);
  const response: GroupMax[] = await api.get<GroupMax[]>(getParameters);
  console.log('getGroupMax response');
  console.log(response);
  return response;
};

export const getProvisions = async (): Promise<Provision[]> => {
  const url = `${config.API_BASE_URL}/admin/provisions`;
  const getParameters = api.generateApiParameters(url);
  const response: Provision[] = await api.get<Provision[]>(getParameters);
  console.log('getProvisions response');
  console.log(response);
  return response;
};

export const getVariables = async (): Promise<Variable[]> => {
  const url = `${config.API_BASE_URL}/admin/document-variables`;
  const getParameters = api.generateApiParameters(url);
  const response: Variable[] = await api.get<Variable[]>(getParameters);
  console.log('getVariables response');
  console.log(response);
  return response;
};

export const enableProvision = async (provisionId: number): Promise<void> => {
  const url = `${config.API_BASE_URL}/admin/enable-provision/${provisionId}`;
  const getParameters = api.generateApiParameters(url);
  const response = await api.get<void>(getParameters);
  console.log('enableProvision response');
  console.log(response);
};

export const disableProvision = async (provisionId: number): Promise<void> => {
  const url = `${config.API_BASE_URL}/admin/disable-provision/${provisionId}`;
  const getParameters = api.generateApiParameters(url);
  const response = await api.get<void>(getParameters);
  console.log('disableProvision response');
  console.log(response);
};

export const previewTemplate = async (id: number, fileName: string): Promise<Blob | null> => {
  const url = `${config.API_BASE_URL}/admin/preview-template/${id}`;
  const response = await api.handleFilePreviewGet(url, fileName);
  if (response) {
    console.log('Preview response:');
    console.log(response);
    return response;
  } else {
    console.log('Preview response was null or there was an error.');
    return null;
  }
};

export const downloadTemplate = async (id: number, fileName: string): Promise<void> => {
  const url = `${config.API_BASE_URL}/admin/download-template/${id}`;
  const response = await api.handleFileDownloadGet(url, fileName);
  console.log('downloadTemplate response');
  console.log(response);
};

export const removeTemplate = async (id: number, documentTypeId: number): Promise<void> => {
  const url = `${config.API_BASE_URL}/admin/remove-template/${id}/${documentTypeId}`;
  const getParameters = api.generateApiParameters(url);
  const response = await api.get<void>(getParameters);
  console.log('removeTemplate response');
  console.log(response);
};

export const activateTemplate = async (id: number, documentTypeId: number): Promise<void> => {
  const url = `${config.API_BASE_URL}/admin/activate-template/${id}/${documentTypeId}`;
  const getParameters = api.generateApiParameters(url);
  await api.get<void>(getParameters);
};

export const uploadTemplate = async (formData: FormData): Promise<void> => {
  const url = `${config.API_BASE_URL}/admin/upload-template`;
  const postParameters = api.generateApiParameters(url, formData);
  await api.post<{ message: string }>(postParameters);
};
