export interface IGetRequestOptions {
  queryObject?: object;
  timeout?: number;
}

export interface IHttpService {
  get<R = any>(path: string, requestOptions?: IGetRequestOptions): Promise<R>;
}
