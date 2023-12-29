import { AnyAction, combineReducers, configureStore } from '@reduxjs/toolkit';
import counterReducer from './slices/UserSlice';
import authReducer from './slices/AuthSlice';
import { backendAuthApi } from './api/backendAuthApi';

const reducers = {
  counter: counterReducer,
  auth: authReducer,
  [backendAuthApi.reducerPath]: backendAuthApi.reducer,
};

const rootReducer = combineReducers(reducers);

const resettableRootReducer = (
  state: ReturnType<typeof rootReducer>,
  action: AnyAction
) => {
  if (action.type === 'user/logout') {
    return rootReducer(undefined, action);
  }

  return rootReducer(state, action);
};

const store = configureStore({
  reducer: resettableRootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(backendAuthApi.middleware),
  devTools: true,
});
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export default store;
