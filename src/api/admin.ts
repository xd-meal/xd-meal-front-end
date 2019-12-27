import { buildParams, defaultResponse } from '@/api/common';
import { IHttpResponse } from '@/api/http';
import axios, { AxiosResponse } from 'axios';
import { Loading, QSpinnerGears } from 'quasar';
let timer: any = null;
function showAdminLoading(timeout = 300) {
  if (timer) {
    clearTimeout(timer);
  }
  timer = setTimeout(() => {
    Loading.show({
      spinner: QSpinnerGears as any,
    });
  }, timeout);
}
function stopAdminLoading() {
  clearTimeout(timer);
  Loading.hide();
}
const ADMIN_IMPORT_USER_LIST_API = '/admin/user/list';
const ADMIN_GET_DISH_LIST_API = '/admin/dish/list';
const ADMIN_CREATE_DISH_API = '/admin/dish';
const ADMIN_UPDATE_DISH_BY_ID_API = '/admin/dish/:id';
const ADMIN_DINNING_BY_TIME_API = '/admin/dining/:startTime/:endTime';
const ADMIN_CREATE_DINING_API = '/admin/dining';
const ADMIN_UPDATE_DINING_API = '/admin/dining/:id';
const ADMIN_DELETE_DINING_API = '/admin/dining/:id';
const ADMIN_GET_ALL_USERS_API = '/admin/users';
const ADMIN_GET_ORDER_BY_TIME_API = '/admin/order/:startTime/:endTime';
function adminResponse(response: AxiosResponse) {
  const msg = response.data
    ? response.data.msg || response.data.message || response.data.error
    : '';
  return {
    code: response.status,
    data: response.data,
    msg,
  };
}
export interface IUserTableItem {
  username: string;
  department: string;
  corp?: string;
  email: string;
  password?: string;
}

export async function importUserList(
  list: IUserTableItem[],
): Promise<IHttpResponse> {
  const response = await axios.post(ADMIN_IMPORT_USER_LIST_API, {
    list,
  });
  return response ? adminResponse(response) : defaultResponse;
}
export interface IDish {
  title: string;
  desc: string;
  supplier: string;
}
export async function getDishList(): Promise<IHttpResponse> {
  showAdminLoading();
  const response = await axios.get(ADMIN_GET_DISH_LIST_API);
  stopAdminLoading();
  return response ? adminResponse(response) : defaultResponse;
}
export async function createDish(dish: IDish): Promise<IHttpResponse> {
  showAdminLoading();
  const response = await axios.post(ADMIN_CREATE_DISH_API, dish);
  stopAdminLoading();
  return response ? adminResponse(response) : defaultResponse;
}

export async function updateOrderById(setting: {
  id: string;
  dish: IDish;
}): Promise<IHttpResponse> {
  showAdminLoading();
  const url = buildParams(ADMIN_UPDATE_DISH_BY_ID_API, { id: setting.id });
  const response = await axios.put(url, setting.dish);
  stopAdminLoading();
  return response ? adminResponse(response) : defaultResponse;
}

export async function getDiningByTime(setting: {
  startTime: string;
  endTime: string;
}): Promise<IHttpResponse> {
  showAdminLoading();
  const url = buildParams(ADMIN_DINNING_BY_TIME_API, {
    startTime: setting.startTime,
    endTime: setting.endTime,
  });
  const response = await axios.get(url);
  stopAdminLoading();
  return response ? adminResponse(response) : defaultResponse;
}
export interface IDining {
  order_start: number;
  order_end: number;
  pick_start: number;
  pick_end: number;
  stat_type: 0 | 1;
  menu: string[];
}
export async function createDining(dining: IDining): Promise<IHttpResponse> {
  showAdminLoading();
  const response = await axios.post(ADMIN_CREATE_DINING_API, dining);
  stopAdminLoading();
  return response ? adminResponse(response) : defaultResponse;
}
export async function updateDining(setting: {
  id: string;
  dining: IDining;
}): Promise<IHttpResponse> {
  showAdminLoading();
  const url = buildParams(ADMIN_UPDATE_DINING_API, { id: setting.id });
  const response = await axios.put(url, setting.dining);
  stopAdminLoading();
  return response ? adminResponse(response) : defaultResponse;
}

export async function deleteDining(id: string): Promise<IHttpResponse> {
  showAdminLoading();
  const url = buildParams(ADMIN_DELETE_DINING_API, { id });
  const response = await axios.delete(url);
  stopAdminLoading();
  return response ? adminResponse(response) : defaultResponse;
}

export async function getAllUsers(): Promise<IHttpResponse> {
  showAdminLoading();
  const response = await axios.get(ADMIN_GET_ALL_USERS_API);
  stopAdminLoading();
  return response ? adminResponse(response) : defaultResponse;
}

export async function getOrderByTime(setting: {
  startTime: string;
  endTime: string;
}): Promise<IHttpResponse> {
  showAdminLoading();
  const url = buildParams(ADMIN_GET_ORDER_BY_TIME_API, {
    startTime: setting.startTime,
    endTime: setting.endTime,
  });
  stopAdminLoading();
  const response = await axios.get(url);
  return response ? adminResponse(response) : defaultResponse;
}
