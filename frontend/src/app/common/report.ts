import config from '../../config';
import { ProvisionData } from '../components/table/ProvisionsTable';
import { DTR, DTRDisplayObject, NfrDataObject, ProvisionGroup } from '../types/types';
import { buildDTRDisplayData } from '../util/util';
import * as api from './api';
import fileDownload from 'js-file-download';

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
  handleDownload(reportUrl, data, reportName);
}

/**
 * Helper function that presents generated report for download
 *
 * @param url
 * @param data
 * @param filename
 */
const handleDownload = async (
  url: string,
  data: { prdid: number | null; dtid: number; document_type: string },
  filename: string
) => {
  const postParameters = api.generateApiParameters(url, data);

  await api
    .fileDownloadPost<Blob>(postParameters)
    .then(async (blob) => {
      fileDownload(blob, filename);
    })
    .catch((error) => {
      console.error('Download error:', error);
    });
};

/** Section for Notice of Final Review which has lots of custom logic */
export const getNfrDataByDtid = async (dtid: number) => {
  const url = `${config.API_BASE_URL}/report/get-nfr-data/${dtid}`;
  const getParameters = api.generateApiParameters(url);
  const response: NfrDataObject = await api.get<NfrDataObject>(getParameters);
  return response;
};

export const getGroupMaxByVariant = async (variant: string) => {
  const url = `${config.API_BASE_URL}/report/get-group-max/${variant}`;
  const getParameters = api.generateApiParameters(url);
  const response: ProvisionGroup[] = await api.get<ProvisionGroup[]>(getParameters);
  return response;
};

export const getNfrProvisionsByVariantDtid = async (variant: string, dtid: number): Promise<ProvisionData[]> => {
  const url = `${config.API_BASE_URL}/report/nfr-provisions/${variant.toUpperCase()}/${dtid}`;
  const getParameters = api.generateApiParameters(url);
  const response: any = await api.get<any>(getParameters);
  return response;
};
