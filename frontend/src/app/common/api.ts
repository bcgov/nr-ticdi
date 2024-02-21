import axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from "axios";
import { Dispatch } from "redux";
import config from "../../config";
import { AUTH_TOKEN } from "../service/user-service";

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

export const get = <T, M = {}>(
  parameters: ApiRequestParameters<M>,
  headers?: {}
): Promise<T> => {
  let config: AxiosRequestConfig = { headers: headers };
  return new Promise<T>((resolve, reject) => {
    const { url, requiresAuthentication, params } = parameters;

    if (requiresAuthentication) {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${localStorage.getItem(AUTH_TOKEN)}`;
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

export const post = <T, M = {}>(
  parameters: ApiRequestParameters<M>
): Promise<T> => {
  let config: AxiosRequestConfig = { headers: {} };
  return new Promise<T>((resolve, reject) => {
    const { url, requiresAuthentication, params } = parameters;

    if (requiresAuthentication) {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${localStorage.getItem(AUTH_TOKEN)}`;
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

export const fileDownload = <T, M = {}>(
  parameters: ApiRequestParameters<M>
): Promise<T> => {
  let config: AxiosRequestConfig = { headers: {}, responseType: "blob" };
  return new Promise<T>((resolve, reject) => {
    const { url, requiresAuthentication, params } = parameters;

    if (requiresAuthentication) {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${localStorage.getItem(AUTH_TOKEN)}`;
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

export const patch = <T, M = {}>(
  parameters: ApiRequestParameters<M>
): Promise<T> => {
  let config: AxiosRequestConfig = { headers: {} };
  return new Promise<T>((resolve, reject) => {
    const { url, requiresAuthentication, params: data } = parameters;

    if (requiresAuthentication) {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${localStorage.getItem(AUTH_TOKEN)}`;
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

export const put = <T, M = {}>(
  parameters: ApiRequestParameters<M>
): Promise<T> => {
  let config: AxiosRequestConfig = { headers: {} };
  return new Promise<T>((resolve, reject) => {
    const { url, requiresAuthentication, params: data } = parameters;

    if (requiresAuthentication) {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${localStorage.getItem(AUTH_TOKEN)}`;
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
export const putFile = <T, M = {}>(
  parameters: ApiRequestParameters<M>,
  headers: {},
  file: File
): Promise<T> => {
  let config: AxiosRequestConfig = { headers: headers };

  const formData = new FormData();
  if (file) formData.append("file", file);

  return new Promise<T>((resolve, reject) => {
    const { url, requiresAuthentication } = parameters;

    if (requiresAuthentication) {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${localStorage.getItem(AUTH_TOKEN)}`;
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
  requiresAuthentication: boolean = false
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

//const response = await get<Blob>(parameters, header, attachment);

// const response = await putFile<COMSObject>(
//   dispatch,
//   parameters,
//   header,
//   attachment
// );
