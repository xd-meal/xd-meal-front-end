import axios from 'axios';
import { IHttpResponse } from '@/api/http';

import { defaultResponse, commonResponse, buildParams } from '@/api/common';
export const LOGIN_API = '/api/v1/user/login';
export const LOGIN_OUT_API = '/api/v1/user/logout';
export const LOGIN_WEWORK_API = '/api/v1/user/wework?corp=:corp&code=:code';

export interface IUserLoginData {
  email: string;
  password: string;
}

export async function loginApi(
  loginData: IUserLoginData,
): Promise<
  IHttpResponse<{
    token?: string;
  }>
> {
  const response = await axios.post(LOGIN_API, loginData);
  return response ? commonResponse(response) : defaultResponse;
}

export async function logoutApi(): Promise<IHttpResponse> {
  const response = await axios.get(LOGIN_OUT_API);
  return response ? commonResponse(response) : defaultResponse;
}

export async function fetchWeworkCode(setting: { corp: string; code: string }) {
  const url = buildParams(LOGIN_WEWORK_API, setting);
  const response = await axios.get(url);
  return response ? commonResponse(response) : defaultResponse;
}
