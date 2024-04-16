import axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';
import config from '../../config';
import { AUTH_TOKEN } from '../service/user-service';
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

export const get = <T, M = {}>(parameters: ApiRequestParameters<M>, headers?: {}): Promise<T> => {
  let config: AxiosRequestConfig = { headers: headers };
  return new Promise<T>((resolve, reject) => {
    const { url, requiresAuthentication, params } = parameters;

    if (requiresAuthentication) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem(AUTH_TOKEN)}`;
    }

    if (params) {
      config.params = params;
    }

    axios
      .get(url, config)
      .then((response: AxiosResponse) => {
        const { data, status } = response;

        if (status === STATUS_CODES.Unauthorized) {
          window.location = KEYCLOAK_URL;
        }

        resolve(data as T);
      })
      .catch((error: AxiosError) => {
        console.log(error.message);
        reject(error);
      });
  });
};

export const post = <T, M = {}>(parameters: ApiRequestParameters<M>): Promise<T> => {
  let config: AxiosRequestConfig = {
    headers: {},
  };
  return new Promise<T>((resolve, reject) => {
    const { url, requiresAuthentication, params } = parameters;

    if (requiresAuthentication) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem(AUTH_TOKEN)}`;
    }

    axios
      .post(url, params, config)
      .then((response: AxiosResponse) => {
        resolve(response.data as T);
      })
      .catch((error: AxiosError) => {
        console.log(error.message);
        reject(error);
      });
  });
};

const fileDownloadGet = <T, M = {}>(parameters: ApiRequestParameters<M>): Promise<T> => {
  let config: AxiosRequestConfig = { headers: {}, responseType: 'blob' };
  return new Promise<T>((resolve, reject) => {
    const { url, requiresAuthentication } = parameters;

    if (requiresAuthentication) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem(AUTH_TOKEN)}`;
    }

    axios
      .get(url, config)
      .then((response: AxiosResponse) => {
        resolve(response.data as T);
      })
      .catch((error: AxiosError) => {
        console.log(error.message);
        reject(error);
      });
  });
};

const fileDownloadPost = <T, M = {}>(parameters: ApiRequestParameters<M>): Promise<T> => {
  let config: AxiosRequestConfig = { headers: {}, responseType: 'blob' };
  return new Promise<T>((resolve, reject) => {
    const { url, requiresAuthentication, params } = parameters;

    if (requiresAuthentication) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem(AUTH_TOKEN)}`;
    }

    axios
      .post(url, params, config)
      .then((response: AxiosResponse) => {
        resolve(response.data as T);
      })
      .catch((error: AxiosError) => {
        console.log(error.message);
        reject(error);
      });
  });
};

/**
 * Used for file Preview through get request
 *
 * @param url
 * @param filename
 */
export const handleFilePreviewGet = async (url: string, filename: string): Promise<Blob | null> => {
  try {
    const getParameters = generateApiParameters(url);
    return new Promise<Blob>((resolve, reject) => {
      fileDownloadGet<Blob>(getParameters)
        .then(blob => {
          resolve(blob);
        })
        .catch(error => {
          console.error('Preview error:', error);
          reject(error);
        });
    });
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

  console.log(getParameters)

  await fileDownloadGet<Blob>(getParameters)
    .then(async (blob) => {
      fileDownload(blob, filename);
    })
    .catch((error) => {
      console.error('Download error:', error);
    });
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

  await fileDownloadPost<Blob>(postParameters)
    .then(async (blob) => {
      fileDownload(blob, filename);
    })
    .catch((error) => {
      console.error('Download error:', error);
    });
};

export const patch = <T, M = {}>(parameters: ApiRequestParameters<M>): Promise<T> => {
  let config: AxiosRequestConfig = { headers: {} };
  return new Promise<T>((resolve, reject) => {
    const { url, requiresAuthentication, params: data } = parameters;

    if (requiresAuthentication) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem(AUTH_TOKEN)}`;
    }

    axios
      .patch(url, data, config)
      .then((response: AxiosResponse) => {
        const { status } = response;

        if (status === STATUS_CODES.Unauthorized) {
          window.location = KEYCLOAK_URL;
        }

        resolve(response.data as T);
      })
      .catch((error: AxiosError) => {
        console.log(error.message);
        reject(error);
      });
  });
};

export const put = <T, M = {}>(parameters: ApiRequestParameters<M>): Promise<T> => {
  let config: AxiosRequestConfig = { headers: {} };
  return new Promise<T>((resolve, reject) => {
    const { url, requiresAuthentication, params: data } = parameters;

    if (requiresAuthentication) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem(AUTH_TOKEN)}`;
    }

    axios
      .put(url, data, config)
      .then((response: AxiosResponse) => {
        const { status } = response;

        if (status === STATUS_CODES.Unauthorized) {
          window.location = KEYCLOAK_URL;
        }

        resolve(response.data as T);
      })
      .catch((error: AxiosError) => {
        console.log(error.message);
        reject(error);
      });
  });
};

// adjust for uploading templates
export const putFile = <T, M = {}>(parameters: ApiRequestParameters<M>, headers: {}, file: File): Promise<T> => {
  let config: AxiosRequestConfig = { headers: headers };

  const formData = new FormData();
  if (file) formData.append('file', file);

  return new Promise<T>((resolve, reject) => {
    const { url, requiresAuthentication } = parameters;

    if (requiresAuthentication) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem(AUTH_TOKEN)}`;
    }

    axios
      .put(url, file, config)
      .then((response: AxiosResponse) => {
        const { status } = response;

        if (status === STATUS_CODES.Unauthorized) {
          window.location = KEYCLOAK_URL;
        }

        resolve(response.data as T);
      })
      .catch((error: AxiosError) => {
        console.log(error.message);
        reject(error);
      });
  });
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
