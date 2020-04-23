import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { IGetRequestOptions, IHttpService } from './IHttpService';

export class HttpService implements IHttpService {
  constructor(private axios: AxiosInstance) {}

  public async get<R = any>(path: string, requestOptions: IGetRequestOptions = {}): Promise<R> {
    const config: AxiosRequestConfig = {};

    if (requestOptions.queryObject) {
      config.params = requestOptions.queryObject;
    }

    if (requestOptions.timeout) {
      config.timeout = requestOptions.timeout;
    }

    const axiosResponse = await this.axios.get<R>(path, config);

    return axiosResponse.data;
  }
}
