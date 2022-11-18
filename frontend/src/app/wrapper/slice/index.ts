import { PayloadAction } from '@reduxjs/toolkit';
import { api } from 'api/band';
import { SagaInjectionModes } from 'redux-injectors';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import wrapperSaga from './saga';
import { setAuthTokenHeader } from 'api/band/client';
import { AxiosError } from 'axios';
/* --- STATE --- */
export interface WrapperState {
  user?: UserInfo;
  currentTrack?: TrackInfo;
  auth?: AsyncStateType<User>;
  accessToken?: string;
} // state 형식 정의

export const initialState: WrapperState = {
  user: undefined,
  currentTrack: undefined,
  auth: { loading: false },
};

const slice = createSlice({
  name: 'wrapper', // 이 이름을 types/RootState.ts에 써놓아야 함
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserLoginResponse>) {
      state.user = action.payload.user;
      if (action.payload.accessToken) {
        state.accessToken = action.payload.accessToken;
        setAuthTokenHeader(action.payload.accessToken);
      }
    },
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
      setAuthTokenHeader(action.payload);
    },
    setCurrentPlaying(state, action: PayloadAction<TrackInfo>) {
      state.currentTrack = action.payload;
      return state;
    },
    signOut(state, action: PayloadAction<undefined>) {
      api.signout();
      state.accessToken = undefined;
      state.user = undefined;
      setAuthTokenHeader('');
    },
    loadingAccessTokenResponse(state, action: PayloadAction<any>) {
      state.accessToken = undefined;
      state.auth = { loading: true };
    },
    successAccessTokenResponse(state, action: PayloadAction<AccessToken>) {
      state.auth = { loading: false };
      state.accessToken = action.payload.access;
      setAuthTokenHeader(action.payload.access);
    },
    errorAccessTokenResponse(state, action: PayloadAction<AxiosError>) {
      state.accessToken = undefined;
      state.auth = { loading: false };
      state.auth.error = action.payload;
    },
    loadingMyProfileResponse(state, action: PayloadAction<any>) {
      state.auth = { loading: true };
    },
    successMyProfileResponse(state, action: PayloadAction<User>) {
      state.auth = { loading: false };
      state.auth.data = action.payload;
      state.user = { ...action.payload };
    },
    errorMyProfileResponse(state, action: PayloadAction<AxiosError>) {
      state.auth = { loading: false };
      state.auth.error = action.payload;
    },
  },
});

export const { actions: wrapperActions, reducer } = slice;

export const useWrapperSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({
    key: slice.name,
    saga: wrapperSaga,
    mode: SagaInjectionModes.RESTART_ON_REMOUNT,
  });
  return { actions: slice.actions, reducer: slice.reducer };
};
