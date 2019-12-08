import axios from 'axios';
import { ILoginResponse } from '@/api/http';
import Mock from 'mockjs';

import { isDev } from '@/utils/common';
import { defaultResponse, defaultOkMock } from '@/api/common';
export const LOGIN_API = '/api/v1/Login';
export const LOGIN_OUT_API = '/api/v1/LoginOut';

if (isDev) {
  Mock.mock(LOGIN_API, 'post', defaultOkMock);
  Mock.mock(LOGIN_OUT_API, 'post', defaultOkMock);
}

export interface IUserLoginData {
  email: string;
  password: string;
}

export async function loginApi(
  loginData: IUserLoginData,
): Promise<ILoginResponse> {
  const response = await axios.post(LOGIN_API, loginData);
  return response ? response.data : defaultResponse;
}

export async function logoutApi() {
  const response = await axios.post(LOGIN_OUT_API);
  return response ? response.data : defaultResponse;
}
