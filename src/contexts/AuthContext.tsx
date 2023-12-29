import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import * as Facebook from 'expo-auth-session/providers/facebook';
import {
  backendAuthApi,
  useGetAuthenticatedUserMutation,
  useLazyGetBackendTokenQuery,
  User,
} from '../store/api/backendAuthApi';
import { useStorageState } from '../hooks/useStorageState';
import { useAppDispatch, useAppSelector } from '../hooks/storeHooks';
import { authSlice, selectIsAuthenticated } from '../store/slices/AuthSlice';

const AuthContext = createContext<{
  signIn: () => void;
  signOut: () => void;
  authenticated: boolean;
  isAuthLoading: boolean;
  user: User;
} | null>(null);

// This hook can be used to access the user info.
export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoadingStoredToken], setJwtToken] = useStorageState('jwtToken');
  const [, , promptAsync] = Facebook.useAuthRequest({
    clientId: '1386162638604035',
  });
  const [facebookLoading, setFacebookLoading] = useState(false);
  const dispatch = useAppDispatch();
  const authenticated = useAppSelector(selectIsAuthenticated);

  const [getUser, getUserResponse] = useGetAuthenticatedUserMutation();

  const [getToken, getTokenResponse] = useLazyGetBackendTokenQuery();

  useEffect(() => {
    getUser();
  }, [getUser]);

  const obtainNewToken = useCallback(() => {
    setFacebookLoading(true);
    promptAsync()
      .then((response) => {
        if (
          response &&
          response.type === 'success' &&
          response.authentication
        ) {
          getToken(response.authentication.accessToken).unwrap().then(getUser);
        }
      })
      .finally(() => setFacebookLoading(false));
  }, [getToken, promptAsync, getUser]);

  const auth = useMemo(
    () => ({
      signIn: () => {
        obtainNewToken();
      },
      signOut: () => {
        setJwtToken(null);
        dispatch(authSlice.actions.logout());
        dispatch(backendAuthApi.util.resetApiState());
        // dispatch(backendAuthApi.util.invalidateTags(...Tags to invalidate)); // In case needed in the future - can also invalidate specific tags
      },
      user: getUserResponse.data,
      authenticated: authenticated && !!getUserResponse.data,
      isAuthLoading:
        getUserResponse.isLoading ||
        getTokenResponse.isLoading ||
        isLoadingStoredToken ||
        facebookLoading,
    }),
    [
      getUserResponse.data,
      getUserResponse.isLoading,
      authenticated,
      getTokenResponse.isLoading,
      isLoadingStoredToken,
      facebookLoading,
      obtainNewToken,
      setJwtToken,
      dispatch,
    ]
  );
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}
