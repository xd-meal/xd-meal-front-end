import { IHttpResponse } from '@/api/http';
import { isDev } from '@/utils/common';
import axios from 'axios';
import Mock from 'mockjs';
import { defaultResponse, defaultOkMock, commonResponse } from '@/api/common';
const WEEKDAY_DISHES_API = '/api/v1/dining/list';
const ORDER_DISHES_API = '/api/v1/order';
const MY_DISHES_API = '/api/v1/myDish';
// const CAN_ORDER_SWITCH_API = '/api/v1/GetUserOrderSwitch';
const EVAL_DISH_API = '/api/v1/EvalDish';

export interface IMyDish {
  _id: string;
  dishId: string;
  mealDay: string;
  status: number;
  uid: string;
  createTime: string;
  mealNum: number;
  name: string;
  supplier: string;
  desc?: string;
  /**
   * @desc 1 午餐 2 晚餐
   */
  typeA: number;
  /**
   * @desc 1 自助 2 简餐
   */
  typeB: number;
  updateTime: string;
  badEval: boolean;
}

export interface IDishes {
  _id: string;
  createTime: string;
  mealDay: string;
  name: string;
  status: number;
  supplier: string;
  /**
   * @desc 1 午餐 2 晚餐
   */
  typeA: number;
  /**
   * @desc 1 自助 2 简餐
   */
  typeB: number;
  updateTime: string;
  mealNum?: number;
}
export interface IHttpDish {
  _id: string;
  title: string;
  desc: string;
}
export interface IHttpDining {
  _id: string;
  name: string;
  order_start: string;
  order_end: string;
  pick_start: string;
  pick_end: string;
  stat_type: 0 | 1;
  menu: IHttpDish[];
}
export interface IHttpOrderDining {
  dining_id: string;
  menu_id: string;
}
export interface IWeekdayDishesResponse extends IHttpResponse {
  data: {
    dinings: IHttpDining[];
    orders: IHttpOrderDining[];
  };
}

export interface IMyDishesResponse extends IHttpResponse {
  data: IMyDish[];
}

export async function fetchWeekdayDishes(): Promise<IWeekdayDishesResponse> {
  const response = await axios.get(WEEKDAY_DISHES_API);
  return response ? commonResponse(response) : defaultResponse;
}

export async function orderDishes(
  dishIds: Array<{ diningId: string; menuId: string }>,
): Promise<IHttpResponse> {
  const response = await axios.post(ORDER_DISHES_API, dishIds);
  return response ? commonResponse(response) : defaultResponse;
}

export async function fetchMyDishes(): Promise<IMyDishesResponse> {
  const response = await axios.get(MY_DISHES_API);
  return response ? commonResponse(response) : defaultResponse;
}

export async function VoteDown(
  id: string,
  value: boolean,
): Promise<IHttpResponse> {
  const response = await axios.post(EVAL_DISH_API, { id, Eval: value });
  return response ? response.data : defaultResponse;
}
