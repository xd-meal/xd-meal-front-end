export interface IHttpResponse {
  /**
   * @type number
   * @desc use 1 for ok, others for error
   */
  code: number;
  data: any;
}
export interface ILoginResponse extends IHttpResponse {
  data: {
    token?: string;
  };
}
