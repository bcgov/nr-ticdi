import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import config from '../../config';
import UserService from '../service/user-service';
import fileDownload from 'js-file-download';

const STATUS_CODES = {
  Ok: 200,
  BadRequest: 400,
  Unauthorized: 401,
  Forbiden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  InternalServerError: 500,
  BadGateway: 502,
  ServiceUnavailable: 503,
};

const { KEYCLOAK_URL } = config;

interface ApiRequestParameters<T = {}> {
  url: string;
  requiresAuthentication?: boolean;
  params?: T;
}

const axiosInstance = axios.create();

// check the token status on every request, refresh it if it is 3 minutes old (5min expiry time)
axiosInstance.interceptors.request.use(
  async (config) => {
    if (config.headers.Authorization) {
      const tokenAge = UserService.getTokenAge();
      if (tokenAge > 180) {
        // If token is older than 3 minutes
        try {
          const token = await UserService.updateToken();
          config.headers.Authorization = `Bearer ${token}`;
        } catch (error) {
          console.error('Token refresh failed:', error);
          return Promise.reject(error);
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// if we get a 401, it's because the token has expired, try to refresh it
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === STATUS_CODES.Unauthorized && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const token = await UserService.updateToken();
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        console.error('Token refresh failed:', refreshError);
        window.location.href = KEYCLOAK_URL;
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const get = <T, M = {}>(parameters: ApiRequestParameters<M>, headers?: {}): Promise<T> => {
  const { url, requiresAuthentication, params } = parameters;
  let config: AxiosRequestConfig = { headers: headers };

  // always send JWT
  config.headers = {
    ...config.headers,
    Authorization: `Bearer ${UserService.getToken()}`,
  };

  if (params) {
    config.params = params;
  }

  return axiosInstance.get(url, config).then((response: AxiosResponse) => response.data as T);
};

export const post = <T, M = {}>(parameters: ApiRequestParameters<M>): Promise<T> => {
  const { url, requiresAuthentication, params } = parameters;
  let config: AxiosRequestConfig = { headers: {} };

  if (config && config.headers) {
    config.headers['Authorization'] = `Bearer ${UserService.getToken()}`;
  }

  return axiosInstance.post(url, params, config).then((response: AxiosResponse) => response.data as T);
};

const fileDownloadGet = <T, M = {}>(parameters: ApiRequestParameters<M>): Promise<T> => {
  const { url, requiresAuthentication } = parameters;
  let config: AxiosRequestConfig = { headers: {}, responseType: 'blob' };

  if (config && config.headers) {
    config.headers['Authorization'] = `Bearer ${UserService.getToken()}`;
  }

  return axiosInstance.get(url, config).then((response: AxiosResponse) => response.data as T);
};

const fileDownloadPost = <T, M = {}>(parameters: ApiRequestParameters<M>): Promise<T> => {
  const { url, requiresAuthentication, params } = parameters;
  let config: AxiosRequestConfig = { headers: {}, responseType: 'blob' };

  if (config && config.headers) {
    config.headers['Authorization'] = `Bearer ${UserService.getToken()}`;
  }

  return axiosInstance.post(url, params, config).then((response: AxiosResponse) => response.data as T);
};

/**
 * Used for file Preview through get request
 *
 * @param url
 * @param filename
 */
export const handleFilePreviewGet = async (url: string): Promise<Blob | null> => {
  try {
    const getParameters = generateApiParameters(url);
    return fileDownloadGet<Blob>(getParameters);
  } catch (error) {
    console.error('Preview error:', error);
    return null;
  }
};

/**
 * Used for file downloads through get request
 *
 * @param url
 * @param filename
 */
export const handleFileDownloadGet = async (url: string, filename: string) => {
  const getParameters = generateApiParameters(url);
  try {
    const blob = await fileDownloadGet<Blob>(getParameters);
    fileDownload(blob, filename);
  } catch (error) {
    console.error('Download error:', error);
  }
};

/**
 * Used for file donwloads through post request
 *
 * @param url
 * @param data { prdid: number | null; dtid: number; document_type: string }
 * @param filename
 */
export const handleFileDownloadPost = async (url: string, data: any, filename: string) => {
  const postParameters = generateApiParameters(url, data);
  try {
    const blob = await fileDownloadPost<Blob>(postParameters);
    fileDownload(blob, filename);
  } catch (error) {
    console.error('Download error:', error);
  }
};

export const put = <T, M = {}>(parameters: ApiRequestParameters<M>): Promise<T> => {
  const { url, requiresAuthentication, params: data } = parameters;
  let config: AxiosRequestConfig = { headers: {} };

  if (config && config.headers) {
    config.headers['Authorization'] = `Bearer ${UserService.getToken()}`;
  }

  return axiosInstance.put(url, data, config).then((response: AxiosResponse) => response.data as T);
};

export const putFile = <T, M = {}>(parameters: ApiRequestParameters<M>, headers: {}, file: File): Promise<T> => {
  const { url, requiresAuthentication } = parameters;
  let config: AxiosRequestConfig = { headers: headers };

  if (config && config.headers) {
    config.headers['Authorization'] = `Bearer ${UserService.getToken()}`;
  }

  const formData = new FormData();
  if (file) formData.append('file', file);

  return axiosInstance.put(url, formData, config).then((response: AxiosResponse) => response.data as T);
};

export const generateApiParameters = <T = {}>(
  url: string,
  params?: T,
  requiresAuthentication: boolean = true
): ApiRequestParameters<T> => {
  let result = {
    url,
    requiresAuthentication,
  } as ApiRequestParameters<T>;

  if (params) {
    return { ...result, params };
  }

  return result;
};

export default {
  get,
  post,
  put,
  putFile,
  handleFilePreviewGet,
  handleFileDownloadGet,
  handleFileDownloadPost,
  generateApiParameters,
};
