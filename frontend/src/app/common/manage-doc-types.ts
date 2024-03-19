import config from '../../config';
import { DocType } from '../types/types';
import * as api from './api';

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
