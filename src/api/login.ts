import axios from 'axios';
import { ILoginResponse } from '@/api/http';
import Mock from 'mockjs';

import { isDev } from '@/utils/common';
export interface IUserLoginData {
  username: string;
  password: string;
}
const LOGIN_API = '/login';
if (isDev) {
  Mock.mock(LOGIN_API, 'post', {
    code: 0,
    data: {
      token: 'asdas',
    },
  });
}
export async function loginApi(
  loginData: IUserLoginData,
): Promise<ILoginResponse> {
  const response = await axios.post(LOGIN_API, loginData);
  return response
    ? response.data
    : {
        code: 0,
        data: {},
      };
}
