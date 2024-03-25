import * as api from './api';
import config from '../../config';
import { Provision, ProvisionUpload, Variable, VariableUpload } from '../types/types';

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
  const url = `${config.API_BASE_URL}/provision/enable/${provisionId}`;
  const getParameters = api.generateApiParameters(url);
  const response = await api.get<void>(getParameters);
  console.log('enableProvision response');
  console.log(response);
};

export const disableProvision = async (provisionId: number): Promise<void> => {
  const url = `${config.API_BASE_URL}/provision/disable/${provisionId}`;
  const getParameters = api.generateApiParameters(url);
  const response = await api.get<void>(getParameters);
  console.log('disableProvision response');
  console.log(response);
};

export const addProvision = async (data: ProvisionUpload): Promise<void> => {
  const url = `${config.API_BASE_URL}/admin/add-provision`;
  const postParameters = api.generateApiParameters(url, data);
  const response = await api.post<void>(postParameters);
  console.log('addProvision response');
  console.log(response);
};

export const removeProvision = async (id: number): Promise<void> => {
  const url = `${config.API_BASE_URL}/provision/remove/${id}`;
  const getParameters = api.generateApiParameters(url);
  const response = await api.get<void>(getParameters);
  console.log('removeProvision response');
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
