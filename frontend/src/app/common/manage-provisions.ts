import * as api from './api';
import config from '../../config';
import { Provision, ProvisionUpload, Variable, VariableUpload } from '../types/types';

export const getProvisions = async (): Promise<Provision[]> => {
  const url = `${config.API_BASE_URL}/provision/`;
  const getParameters = api.generateApiParameters(url);
  const response: Provision[] = await api.get<Provision[]>(getParameters);
  return response;
};

export const getVariables = async (): Promise<Variable[]> => {
  const url = `${config.API_BASE_URL}/provision/variables`;
  const getParameters = api.generateApiParameters(url);
  const response: Variable[] = await api.get<Variable[]>(getParameters);
  return response;
};

export const getVariablesByDocType = async (document_type_id: number): Promise<Variable[]> => {
  const url = `${config.API_BASE_URL}/provision/variables-by-doc-type/${document_type_id}`;
  const getParameters = api.generateApiParameters(url);
  const response: Variable[] = await api.get<Variable[]>(getParameters);
  return response;
};

export const enableProvision = async (provisionId: number): Promise<void> => {
  const url = `${config.API_BASE_URL}/provision/enable/${provisionId}`;
  const getParameters = api.generateApiParameters(url);
  await api.get<void>(getParameters);
};

export const disableProvision = async (provisionId: number): Promise<void> => {
  const url = `${config.API_BASE_URL}/provision/disable/${provisionId}`;
  const getParameters = api.generateApiParameters(url);
  await api.get<void>(getParameters);
};

export const addProvision = async (data: ProvisionUpload): Promise<void> => {
  const url = `${config.API_BASE_URL}/provision/add`;
  const postParameters = api.generateApiParameters(url, data);
  await api.post<void>(postParameters);
};

export const updateProvision = async (data: ProvisionUpload & { id: number }): Promise<void> => {
  const url = `${config.API_BASE_URL}/provision/update`;
  const postParameters = api.generateApiParameters(url, data);
  await api.post<void>(postParameters);
};

export const removeProvision = async (id: number): Promise<void> => {
  const url = `${config.API_BASE_URL}/provision/remove/${id}`;
  const getParameters = api.generateApiParameters(url);
  await api.get<void>(getParameters);
};

export const addVariable = async (data: VariableUpload): Promise<void> => {
  const url = `${config.API_BASE_URL}/provision/add-variable`;
  const postParameters = api.generateApiParameters(url, data);
  await api.post<void>(postParameters);
};

export const updateVariable = async (data: VariableUpload & { id: number }): Promise<void> => {
  const url = `${config.API_BASE_URL}/provision/update-variable`;
  const postParameters = api.generateApiParameters(url, data);
  await api.post<void>(postParameters);
};

export const removeVariable = async (id: number) => {
  const url = `${config.API_BASE_URL}/provision/remove-variable/${id}`;
  const getParameters = api.generateApiParameters(url);
  await api.get<void>(getParameters);
};
