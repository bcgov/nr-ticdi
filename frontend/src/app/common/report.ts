import { AxiosError } from 'axios';
import config from '../../config';
import { ProvisionJson, SaveProvisionData } from '../components/table/reports/SelectedProvisionsTable';
import { VariableJson } from '../components/table/reports/VariablesTable';
import {
  DTR,
  DTRDisplayObject,
  DocType,
  DocumentDataDTO,
  DocumentDataObject,
  ProvisionGroup,
  VariableData,
} from '../types/types';
import { buildDTRDisplayData } from '../util/util';
import * as api from './api';

/**
 * Gets ttls data and parses it for displaying
 *
 * @param dtid
 * @returns
 */
export async function getDisplayData(dtid: number): Promise<{ dtr: DTRDisplayObject | null; error: string | null }> {
  const url = `${config.API_BASE_URL}/report/get-data/${dtid}`;
  const getParameters = api.generateApiParameters(url);
  try {
    const data: DTR = await api.get<DTR>(getParameters);
    const displayData = buildDTRDisplayData(data);
    return { dtr: displayData, error: null };
  } catch (err: any) {
    if (err && err.isAxiosError) {
      const axiosError = err as AxiosError<any>;
      return { dtr: null, error: axiosError.response?.data.message || 'An error occurred while fetching the data' };
    }
    return { dtr: null, error: 'An error occurred while fetching the data' };
  }
}

export const getDocumentDataByDocTypeIdAndDtid = async (document_type_id: number, dtid: number) => {
  const url = `${config.API_BASE_URL}/report/get-document-data/${document_type_id}/${dtid}`;
  const getParameters = api.generateApiParameters(url);
  const response: DocumentDataObject = await api.get<DocumentDataObject>(getParameters);
  return response;
};

export const getGroupMaxByDocTypeId = async (document_type_id: number) => {
  const url = `${config.API_BASE_URL}/document-type/get-group-max/${document_type_id}`;
  const getParameters = api.generateApiParameters(url);
  const response: ProvisionGroup[] = await api.get<ProvisionGroup[]>(getParameters);
  return response;
};

export const getMandatoryProvisionsByDocTypeId = async (document_type_id: number): Promise<number[]> => {
  const url = `${config.API_BASE_URL}/report/get-mandatory-provisions-by-document-type-id/${document_type_id}`;
  const getParameters = api.generateApiParameters(url);
  const response: number[] = await api.get<number[]>(getParameters);
  return response;
};

export const getDocumentVariablesByDocTypeIdDtid = async (
  document_type_id: number,
  dtid: number
): Promise<{ variables: VariableData[]; variableIds: number[] }> => {
  const url = `${config.API_BASE_URL}/report/get-provision-variables/${document_type_id}/${dtid}`;
  const getParameters = api.generateApiParameters(url);
  const response: { variables: VariableData[]; variableIds: number[] } = await api.get<{
    variables: VariableData[];
    variableIds: number[];
  }>(getParameters);
  return response;
};

export const saveDocument = async (
  dtid: number,
  document_type_id: number,
  provisionArray: SaveProvisionData[],
  variableArray: { provision_id: number; variable_id: number; variable_value: string }[]
): Promise<void> => {
  const url = `${config.API_BASE_URL}/report/save-document`;
  const data = {
    dtid: dtid,
    document_type_id: document_type_id,
    status: 'In Progress',
    provisionArray: provisionArray,
    variableArray: variableArray,
  };
  const postParameters = api.generateApiParameters(url, data);
  await api.post<void>(postParameters);
};

export const generateReport = async (
  dtid: number,
  fileNum: string,
  document_type_id: number,
  provisionJson: ProvisionJson[],
  variableJson: VariableJson[]
) => {
  const url = `${config.API_BASE_URL}/report/generate-report`;
  const reportNameUrl = `${config.API_BASE_URL}/report/get-report-name/${dtid}/${fileNum}/${document_type_id}`;

  const reportNameResponse: { reportName: string } = await api.get({ url: reportNameUrl });
  const reportName: string = reportNameResponse.reportName;

  const data = {
    dtid: dtid,
    document_type_id: document_type_id,
    provisionJson: provisionJson,
    variableJson: variableJson,
  };
  api.handleFileDownloadPost(url, data, reportName);
};

export const getDocumentTypes = () => {
  const url = `${config.API_BASE_URL}/document-type`;
  const getParameters = api.generateApiParameters(url);
  return api.get<DocType[]>(getParameters);
};

export const getDocumentData = async (document_type_id: number, dtid: number): Promise<DocumentDataDTO> => {
  const url = `${config.API_BASE_URL}/document-data/provisions/${document_type_id}/${dtid}`;
  const getParameters = api.generateApiParameters(url);
  const response = await api.get<DocumentDataDTO>(getParameters);
  return response;
};

export const getAllProvisionGroups = async (): Promise<ProvisionGroup[]> => {
  const url = `${config.API_BASE_URL}/report/get-all-groups`;
  const getParameters = api.generateApiParameters(url);
  const response = await api.get<ProvisionGroup[]>(getParameters);
  return response;
};
