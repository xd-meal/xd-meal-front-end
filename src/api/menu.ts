import { IHttpResponse } from '@/api/http';
import { LOGIN_WEWORK_API } from '@/api/login';
import lodash from 'lodash';
import axios from 'axios';
import { defaultResponse, commonResponse, buildParams } from '@/api/common';
const WEEKDAY_DISHES_API = '/api/v1/dining/list';
const ORDER_DISHES_API = '/api/v1/order';
const MY_DISHES_API = '/api/v1/orders';
const HATE_DISH_API = '/api/v1/order/:id/hate';

export interface IHttpDish {
  _id: string;
  title: string;
  desc: string;
  supplier?: string;
}
export interface IHttpDining {
  _id: string;
  title: string;
  order_start: string;
  order_end: string;
  pick_start: string;
  pick_end: string;
  stat_type: 0 | 1;
  menu: IHttpDish[];
  isVoteDown?: boolean;
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
export interface IOrder {
  _id: string;
  dining_id: string;
  menu_id: string;
  picked: false;
  isVoteDown?: boolean;
}
export interface IMyDining {
  id: string;
  title: string;
  order_start: string;
  order_end: string;
  pick_start: string;
  pick_end: string;
  menu: IHttpDish;
  isVoteDown: boolean;
}
export interface IMyDishesResponse extends IHttpResponse {
  data: IMyDining[];
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
  const data: {
    dinings: IHttpDining[];
    ordered: IOrder[];
  } = response.data;
  const dinings: { [key: string]: IHttpDining } = lodash(data.dinings)
    .keyBy('_id')
    .value();
  const mydinings: IMyDining[] = lodash(data.ordered)
    .map((orderedItem: IOrder) => {
      const dining = dinings[orderedItem.dining_id];
      const menuKeys: { [key: string]: IHttpDish } = lodash(dining.menu)
        .keyBy('_id')
        .value();
      return {
        id: orderedItem._id,
        title: dining.title,
        order_start: dining.order_start,
        order_end: dining.order_end,
        pick_start: dining.pick_start,
        pick_end: dining.pick_end,
        menu: menuKeys[orderedItem.menu_id],
        isVoteDown: Boolean(orderedItem.isVoteDown),
      };
    })
    .value();
  return response
    ? {
        code: response?.status,
        data: mydinings,
        msg: response?.data?.msg,
      }
    : {
        code: 404,
        data: [],
        msg: '未知错误',
      };
}

export async function VoteDown(
  id: string,
  isVoteDown: boolean,
): Promise<IHttpResponse> {
  const url = buildParams(HATE_DISH_API, { id });
  const response = await axios.put(url, { id, isVoteDown });
  return response ? commonResponse(response) : defaultResponse;
}
