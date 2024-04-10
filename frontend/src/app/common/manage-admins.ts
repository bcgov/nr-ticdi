import config from '../../config';
import { IdirUserObject } from '../components/modal/manage-admins/AddAdmin';
import { AdminData } from '../components/table/manage-admins/AdminDataTable';
import * as api from './api';

/**
 * Used in report name generation
 * @returns
 */
function getDateTimeForFileName(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
}

export async function getAdminData(): Promise<AdminData[]> {
  const adminDataUrl: string = `${config.API_BASE_URL}/admin/get-admins`;
  const getParameters = api.generateApiParameters(adminDataUrl);
  const adminData: AdminData[] = await api.get(getParameters);
  return adminData;
}

/**
 * Used to generate reports
 *
 * @param dtid
 * @param fileNum
 * @param documentDescription
 */
export async function exportUsers(): Promise<void> {
  console.log(1)
  const reportUrl: string = `${config.API_BASE_URL}/admin/get-export-data`;
  console.log(2, reportUrl)
  const reportName: string = `user_list-${getDateTimeForFileName()}.csv`;
  console.log(3, reportName)
  api.handleFileDownloadGet(reportUrl, reportName);
}

export const findIdirUser = async (
  email: string
): Promise<{ foundUserObject: IdirUserObject | null; error: string | null }> => {
  const url = `${config.API_BASE_URL}/admin/search-users`;
  const data = { email };
  const postParameters = api.generateApiParameters(url, data);
  const response: { userObject: IdirUserObject | null; error: string | null } = await api.post(postParameters);
  return { foundUserObject: response.userObject || null, error: response.error || null };
};

export const addAdmin = async (idirUsername: string): Promise<void> => {
  const url = `${config.API_BASE_URL}/admin/add-admin`;
  const data = { idirUsername };
  const postParameters = api.generateApiParameters(url, data);
  await api.post(postParameters);
};

export const removeAdmin = async (idirUsername: string): Promise<{ message: string }> => {
  const url = `${config.API_BASE_URL}/admin/remove-admin`;
  const data = { idirUsername };
  const postParameters = api.generateApiParameters(url, data);
  return api.post(postParameters);
};
