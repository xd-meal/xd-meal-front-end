import { defaultResponse } from '@/api/common';
import { IHttpResponse } from '@/api/http';
import axios from 'axios';

const GET_DISH_API = '/api/v1/myDish';

export async function payCode(): Promise<IHttpResponse> {
  const response = await axios.get(GET_DISH_API);
  return response ? response.data : defaultResponse;
}
