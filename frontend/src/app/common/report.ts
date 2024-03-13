import config from '../../config';
import { ProvisionJson } from '../components/table/reports/SelectedProvisionsTable';
import { VariableJson } from '../components/table/reports/VariablesTable';
import { ProvisionData } from '../content/display/Provisions';
import { VariableData } from '../content/display/Variables';
import { DTR, DTRDisplayObject, DocumentType, NfrDataObject, ProvisionGroup } from '../types/types';
import { buildDTRDisplayData } from '../util/util';
import * as api from './api';

/**
 * Gets ttls data and parses it for displaying
 *
 * @param dtid
 * @returns
 */
export async function getData(dtid: number): Promise<DTRDisplayObject> {
  const dataUrl = `${config.API_BASE_URL}/report/get-data/${dtid}`;

  const data: DTR = await api.get({ url: dataUrl });
  const displayData = buildDTRDisplayData(data);
  return displayData;
}

/**
 * Used to generate reports
 *
 * @param dtid
 * @param fileNum
 * @param documentDescription
 */
export async function generateReport(dtid: number, fileNum: string, documentDescription: string): Promise<void> {
  const reportNameUrl = `${config.API_BASE_URL}/report/get-report-name/${dtid}/${fileNum}/${documentDescription}`;
  const reportUrl = `${config.API_BASE_URL}/report/generate-report`;

  const reportNameResponse: { reportName: string } = await api.get({ url: reportNameUrl });
  const reportName: string = reportNameResponse.reportName;

  const data = {
    prdid: null,
    dtid: dtid,
    document_type: documentDescription,
  };
  api.handleFileDownloadPost(reportUrl, data, reportName);
}

/** Section for Notice of Final Review which has lots of custom logic */
export const getDocumentDataByDtid = async (dtid: number) => {
  const url = `${config.API_BASE_URL}/report/get-document-data/${dtid}`;
  const getParameters = api.generateApiParameters(url);
  const response: NfrDataObject = await api.get<NfrDataObject>(getParameters);
  return response;
};

export const getGroupMaxByDocTypeId = async (document_type_id: number) => {
  const url = `${config.API_BASE_URL}/report/get-group-max/${document_type_id}`;
  const getParameters = api.generateApiParameters(url);
  const response: ProvisionGroup[] = await api.get<ProvisionGroup[]>(getParameters);
  return response;
};

export const getMandatoryProvisionsByDocTypeId = async (document_type_id: number): Promise<number[]> => {
  const url = `${config.API_BASE_URL}/report/get-mandatory-provisions-by-variant/${document_type_id}`;
  const getParameters = api.generateApiParameters(url);
  const response: number[] = await api.get<number[]>(getParameters);
  return response;
};

export const getDocumentProvisionsByDocTypeIdDtid = async (
  document_type_id: number,
  dtid: number
): Promise<ProvisionData[]> => {
  const url = `${config.API_BASE_URL}/report/provisions/${document_type_id}/${dtid}`;
  const getParameters = api.generateApiParameters(url);
  const response: ProvisionData[] = await api.get<ProvisionData[]>(getParameters);
  return response;
};

export const getDocumentVariablesByDocTypeIdDtid = async (
  document_type_id: number,
  dtid: number
): Promise<VariableData[]> => {
  const url = `${config.API_BASE_URL}/report/get-provision-variables/${document_type_id}/${dtid}`;
  const getParameters = api.generateApiParameters(url);
  const response: VariableData[] = await api.get<VariableData[]>(getParameters);
  return response;
};

export const saveDocument = async (
  dtid: number,
  variantName: string,
  provisionArray: { provision_id: number; free_text: string }[],
  variableArray: { provision_id: number; variable_id: number; variable_value: string }[]
): Promise<void> => {
  const url = `${config.API_BASE_URL}/report/save-nfr`;
  const data = {
    dtid: dtid,
    variant_name: variantName,
    status: 'In Progress',
    provisionArray: provisionArray,
    variableArray: variableArray,
  };
  const postParameters = api.generateApiParameters(url, data);
  await api.post<void>(postParameters);
};

export const generateNfrReport = async (
  dtid: number,
  fileNum: string,
  variant: string,
  provisionJson: ProvisionJson[],
  variableJson: VariableJson[]
) => {
  const url = `${config.API_BASE_URL}/report/generate-nfr-report`;
  const reportNameUrl = `${config.API_BASE_URL}/report/get-nfr-report-name/${dtid}/${fileNum}`;

  const reportNameResponse: { reportName: string } = await api.get({ url: reportNameUrl });
  const reportName: string = reportNameResponse.reportName;

  const data = {
    dtid: dtid,
    variantName: variant,
    provisionJson: provisionJson,
    variableJson: variableJson,
  };

  api.handleFileDownloadPost(url, data, reportName);
};

export const getDocumentTypes = () => {
  const url = `${config.API_BASE_URL}/report/get-document-types`;
  const getParameters = api.generateApiParameters(url);
  return api.get<DocumentType[]>(getParameters);
};
