import config from "../../config";
import * as api from "./api";
import fileDownload from "js-file-download";

export async function generateReport(
  dtid: number,
  fileNum: string,
  documentDescription: string
): Promise<void> {
  const reportNameUrl = `${config.API_BASE_URL}/report/get-report-name/${dtid}/${fileNum}/${documentDescription}`;
  const reportUrl = `${config.API_BASE_URL}/report/generate-report`;

  const reportName: string = await api.get({ url: reportNameUrl });
  console.log(reportName);
  const data = {
    prdid: null,
    dtid: dtid,
    document_type: documentDescription,
  };
  handleDownload(reportUrl, data, reportName);
}

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
      console.error("Download error:", error);
    });
};
