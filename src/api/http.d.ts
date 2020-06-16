export interface IHttpResponse<T = any> {
  /**
   * @type number
   * @desc use 1 for ok, others for error
   */
  code: number;
  msg?: string;
  data: T;
}
