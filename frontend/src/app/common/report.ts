import config from '../../config';
import { DTR, DTRDisplayObject } from '../types/types';
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
    .fileDownload<Blob>(postParameters)
    .then(async (blob) => {
      fileDownload(blob, filename);
    })
    .catch((error) => {
      console.error('Download error:', error);
    });
};
