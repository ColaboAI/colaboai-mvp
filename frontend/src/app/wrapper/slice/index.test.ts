import {
  initialState,
  useWrapperSlice,
  wrapperActions,
  WrapperState,
} from './index';
import * as ReactRedux from 'react-redux';
import {
  InjectReducerParams,
  InjectSagaParams,
  RootStateKeyType,
} from 'utils/types/injector-typings';
import { selectSlice } from './selectors';
import { dummyTrackInfos } from 'api/dummy';

jest.mock('utils/redux-injectors', () => {
  const originalModule = jest.requireActual('utils/redux-injectors');

  return {
    __esModule: true,
    ...originalModule,
    useInjectSaga: jest.fn((params: InjectSagaParams) => {}),
    useInjectReducer: jest.fn(
      (params: InjectReducerParams<RootStateKeyType>) => {},
    ),
  };
});

jest.spyOn(ReactRedux, 'useDispatch').mockImplementation(() => jest.fn());

test('should return initial state', () => {
  expect(useWrapperSlice().reducer(undefined, { type: '' })).toEqual(
    initialState,
  );
});

test('return init when state is null', () => {
  const selector = selectSlice({});
  expect(selector).toBe(initialState);
});

test('setUser', () => {
  const dummyUserInfo: UserInfo = {
    id: 1,
    username: 'dummy',
    photo: 'https://dummyimage.com/300x300/000/fff',
    follower: 0,
    following: 0,
  };
  const dummyUserResponse: UserLoginResponse = {
    user: dummyUserInfo,
    accessToken: 'dummyAccessToken',
    refreshToken: 'dummyRefreshToken',
  };

  const stateInit: WrapperState = { auth: { loading: false } };
  const stateChanged: WrapperState = {
    ...stateInit,
    user: dummyUserInfo,
  };

  expect(
    useWrapperSlice().reducer(
      stateInit,
      wrapperActions.setUser(dummyUserResponse),
    ),
  ).toEqual(stateChanged);
});

test('setCurrentPlaying', () => {
  const stateInit: WrapperState = { auth: { loading: false } };
  const stateChanged: WrapperState = {
    ...stateInit,
    currentTrack: dummyTrackInfos[0],
  };

  expect(
    useWrapperSlice().reducer(
      stateInit,
      wrapperActions.setCurrentPlaying(dummyTrackInfos[0]),
    ),
  ).toEqual(stateChanged);
});
