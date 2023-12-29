// Need to use the React-specific entry point to import createApi
import { createApi } from '@reduxjs/toolkit/query/react';
import type { User } from './types';
import { baseQueryWithToken } from '../config';

export const backendAuthApi = createApi({
  reducerPath: 'backendAuthApi',
  baseQuery: baseQueryWithToken,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getBackendToken: builder.query<void, string>({
      query: (accessToken) => ({
        url: `oauth/token`,
        headers: { Authorization: accessToken },
        method: 'GET',
      }),
    }),
    getRefreshedToken: builder.query<void, void>({
      query: () => ({
        url: `oauth/refreshToken`,
        method: 'GET',
      }),
    }),
    getAuthenticatedUser: builder.mutation<User, void>({
      query: () => ({
        url: `user/getAuthenticatedUser`,
        method: 'GET',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useLazyGetBackendTokenQuery,
  useGetAuthenticatedUserMutation,
  useLazyGetRefreshedTokenQuery,
} = backendAuthApi;
