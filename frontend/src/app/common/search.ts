import config from '../../config';
import { SearchData } from '../types/types';
import * as api from './api';

/**
 * Returns an array of previously generated documents with information on them
 *
 * @returns SearchData[]
 */
export async function getSearchData(): Promise<SearchData[]> {
  try {
    const url = `${config.API_BASE_URL}/report/search-document-data`;
    const parameters = api.generateApiParameters(url);

    const response = await api.get<SearchData[]>(parameters);
    if (Array.isArray(response)) {
      return response;
    } else {
      return [];
    }
  } catch (err) {
    console.log('Error in getSearchData');
    console.log(err);
    return [];
  }
}
