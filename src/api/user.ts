import { IHttpDining, IHttpOrderDining } from '@/api/menu';
import axios from 'axios';
import { commonResponse, defaultResponse } from '@/api/common';
import { IHttpResponse } from '@/api/http';

const USER_CONFIG_API = '/api/v1/user/config';
const USER_PROFILE_API = '/api/v1/user/profile';
const USER_RESET_PWD_API = '/api/v1/user/reset_pwd';
export interface IUserConfig {
  advance: boolean;
  randomBtn: boolean;
  buffetBtn: boolean;
}

export async function userConfigUpdate(
  config: IUserConfig,
): Promise<IHttpResponse> {
  const response = await axios.put(USER_CONFIG_API, config);
  return response ? commonResponse(response) : defaultResponse;
}
export interface IProfile {
  config: IUserConfig;
  avatar: string;
  username: string;
}
export interface IUserProfileResponse extends IHttpResponse {
  data: IProfile;
}
export async function fetchUserProfile(): Promise<IUserProfileResponse> {
  const response = await axios.get(USER_PROFILE_API);
  return response ? commonResponse(response) : defaultResponse;
}

export async function resetUserPsw(
  oldPsw: string,
  newPsw: string,
): Promise<IHttpResponse> {
  const response = await axios.put(USER_RESET_PWD_API, {
    oldPsw,
    newPsw,
  });
  return response ? commonResponse(response) : defaultResponse;
}
