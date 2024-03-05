import * as api from './api';
import config from '../../config';

export type TemplateInfo = {
  template_version: number;
  file_name: string;
  update_timestamp: string;
  active_flag: boolean;
  view: any; // remove from route
  remove: any; // remove from route
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

export const getTemplatesInfo = async (reportType: string): Promise<TemplateInfo[]> => {
  const url = `${config.API_BASE_URL}/admin/get-templates/${reportType.toUpperCase()}`;
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
  const url = `${config.API_BASE_URL}/admin/nfr-provisions`;
  const getParameters = api.generateApiParameters(url);
  const response: Provision[] = await api.get<Provision[]>(getParameters);
  console.log('getProvisions response');
  console.log(response);
  return response;
};

export const getVariables = async (): Promise<Variable[]> => {
  const url = `${config.API_BASE_URL}/admin/nfr-variables`;
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

export const downloadTemplate = async (id: number, fileName: string): Promise<void> => {
  const url = `${config.API_BASE_URL}/admin/download-template/${id}`;
  const response = await api.handleFileDownloadGet(url, fileName);
  console.log('downloadTemplate response');
  console.log(response);
};

export const removeTemplate = async (id: number, reportType: string): Promise<void> => {
  const url = `${config.API_BASE_URL}/admin/remove-template/${reportType}/${id}`;
  const getParameters = api.generateApiParameters(url);
  const response = await api.get<void>(getParameters);
  console.log('removeTemplate response');
  console.log(response);
};

export const activateTemplate = async (id: number, variantType: string): Promise<void> => {
  const url = `${config.API_BASE_URL}/admin/activate-template/${id}/${variantType}`;
  const getParameters = api.generateApiParameters(url);
  await api.get<void>(getParameters);
};

export const uploadTemplate = async (formData: FormData): Promise<void> => {
  const url = `${config.API_BASE_URL}/admin/upload-template`;
  const postParameters = api.generateApiParameters(url, formData);
  await api.post<{ message: string }>(postParameters);
};

export const addProvision = async (data: ProvisionUpload): Promise<void> => {
  const url = `${config.API_BASE_URL}/admin/add-provision`;
  const postParameters = api.generateApiParameters(url, data);
  const response = await api.post<void>(postParameters);
  console.log('addProvision response');
  console.log(response);
};

export const updateProvision = async (data: ProvisionUpload & { id: number }): Promise<void> => {
  const url = `${config.API_BASE_URL}/admin/update-provision`;
  const postParameters = api.generateApiParameters(url, data);
  const response = await api.post<void>(postParameters);
  console.log('updateProvision response');
  console.log(response);
};

export const addVariable = async (data: VariableUpload): Promise<void> => {
  const url = `${config.API_BASE_URL}/admin/add-variable`;
  const postParameters = api.generateApiParameters(url, data);
  const response = await api.post<void>(postParameters);
  console.log('addVariable response');
  console.log(response);
};

export const updateVariable = async (data: VariableUpload & { id: number }): Promise<void> => {
  const url = `${config.API_BASE_URL}/admin/update-variable`;
  const postParameters = api.generateApiParameters(url, data);
  const response = await api.post<void>(postParameters);
  console.log('updateVariable response');
  console.log(response);
};

export const removeVariable = async (id: number) => {
  const url = `${config.API_BASE_URL}/admin/remove-variable/${id}`;
  const getParameters = api.generateApiParameters(url);
  const response = await api.get<void>(getParameters);
  console.log('removeVariable response');
  console.log(response);
};
