import * as api from './api';
import config from '../../config';
import { TemplateInfo } from '../types/types';

export const getTemplatesInfo = async (document_type_id: number): Promise<TemplateInfo[]> => {
  const url = `${config.API_BASE_URL}/admin/get-templates/${document_type_id}`;
  const getParameters = api.generateApiParameters(url);
  const response: TemplateInfo[] = await api.get<TemplateInfo[]>(getParameters);
  console.log('getTemplatesInfo response');
  console.log(response);
  return response;
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
