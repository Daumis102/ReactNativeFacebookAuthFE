import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import * as SecureStore from 'expo-secure-store';
import { setAuthenticated } from '../slices/AuthSlice';

const apiUrl = process.env.EXPO_PUBLIC_BACKEND_API_URL;

const baseQuery = fetchBaseQuery({
  baseUrl: `http://${apiUrl}/`, // adding http seems to crash the app every time
  prepareHeaders: async (headers) => {
    const token = await SecureStore.getItemAsync('jwtToken');
    if (token && !headers.get('Authorization')) {
      // don't overwrite header if set by endpoint itself.
      headers.set('Authorization', token);
    }
    return headers;
  },
});

export const baseQueryWithToken: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);
  if (!result.error) {
    const token = result.meta.response.headers.get('authorization'); // fetch api used under the hood lowercases headers
    if (token !== undefined) {
      await SecureStore.setItemAsync('jwtToken', token);
      api.dispatch(setAuthenticated(true));
    } else {
      await SecureStore.deleteItemAsync('jwtToken');
      api.dispatch(setAuthenticated(false));
    }
  } else {
    if (result.error.status === 401) {
      await SecureStore.deleteItemAsync('jwtToken');
      api.dispatch(setAuthenticated(false));
    }
  }
  return result;
};
