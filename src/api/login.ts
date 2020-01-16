import axios from 'axios';
import { IHttpResponse, ILoginResponse } from '@/api/http';

import {
  defaultResponse,
  defaultOkMock,
  commonResponse,
  buildParams,
} from '@/api/common';
export const LOGIN_API = '/api/v1/user/login';
export const LOGIN_OUT_API = '/api/v1/user/logout';
export const LOGIN_STATUS_API = '/api/v1/CheckUserLogin';
export const RESET_PASSWORD_API = '/api/v1/ResetPasswordByUser';
export const LOGIN_WEWORK_API = '/api/v1/user/wework?corp=:corp&code=:code';

export interface IUserLoginData {
  email: string;
  password: string;
}

export async function loginApi(
  loginData: IUserLoginData,
): Promise<ILoginResponse> {
  const response = await axios.post(LOGIN_API, loginData);
  return response ? commonResponse(response) : defaultResponse;
}

export async function logoutApi(): Promise<IHttpResponse> {
  const response = await axios.get(LOGIN_OUT_API);
  return response ? commonResponse(response) : defaultResponse;
}

export async function checkUserLogin() {
  const response = await axios.post(LOGIN_STATUS_API);
  return response ? commonResponse(response) : defaultResponse;
}

export async function resetPwd(
  oldPassword: string,
  password: string,
): Promise<IHttpResponse> {
  const response = await axios.post(RESET_PASSWORD_API, {
    oldPassword,
    password,
  });
  return response ? commonResponse(response) : defaultResponse;
}

export async function fetchWeworkCode(setting: { corp: string; code: string }) {
  const url = buildParams(LOGIN_WEWORK_API, setting);
  const response = await axios.get(url);
  return response ? commonResponse(response) : defaultResponse;
}
