import { PayloadAction } from '@reduxjs/toolkit';
import { api } from 'api/band';
import { SagaInjectionModes } from 'redux-injectors';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import wrapperSaga from './saga';
import { AxiosError } from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
/* --- STATE --- */
export interface WrapperState {
  user?: UserInfo;
  currentTrack?: TrackInfo;
  auth: AsyncStateType<User>;
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
      if (!state.accessToken) {
        state.accessToken = action.payload.accessToken;
      }
      sessionStorage.setItem('accessToken', action.payload.accessToken);
    },

    setAccessToken(state, action: PayloadAction<string | undefined>) {
      state.accessToken = action.payload;
      localStorage.setItem('isLogout', 'false');
    },

    setCurrentPlaying(state, action: PayloadAction<TrackInfo>) {
      state.currentTrack = action.payload;
      return state;
    },
    signOut(state, action: PayloadAction<undefined>) {
      api.signout();
      state.user = undefined;
      state.auth = { loading: false };
      state.accessToken = undefined;
      localStorage.setItem('isLogout', 'true');
      sessionStorage.clear();
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
    cleanUp(state, action: PayloadAction<undefined>) {
      state = initialState;
    },
  },
});

export const { actions: wrapperActions, reducer } = slice;

export const useWrapperSlice = () => {
  const dispatch = useDispatch();
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({
    key: slice.name,
    saga: wrapperSaga,
    mode: SagaInjectionModes.RESTART_ON_REMOUNT,
  });
  useEffect(() => {
    return () => {
      dispatch(slice.actions.cleanUp());
    };
  }, [dispatch]);
  return { actions: slice.actions, reducer: slice.reducer };
};
