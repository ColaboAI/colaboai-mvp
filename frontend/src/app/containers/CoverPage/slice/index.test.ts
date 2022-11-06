import { initialState, CoverState, useCoverSlice, coverActions } from './index';

import {
  InjectReducerParams,
  InjectSagaParams,
  RootStateKeyType,
} from 'utils/types/injector-typings';
import { selectCover } from './selectors';
import coverPageSaga, { getCoverRequest, deleteCoverRequest } from './saga';
import { takeEvery } from '@redux-saga/core/effects';
import * as AT from 'api/actionTypes';

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

test('should return initial state', () => {
  expect(useCoverSlice().reducer(undefined, { type: '' })).toEqual(
    initialState,
  );
});

test('return init when state is null', () => {
  expect(selectCover({})).toBe(initialState);
});

test('should handle cover response state', () => {
  const stateInit: CoverState = {
    ...initialState,
  };
  const stateLoading: CoverState = {
    ...initialState,
    coverResponse: { loading: true },
  };
  const stateSuccess: CoverState = {
    ...initialState,
    coverResponse: { loading: false, data: 'MOCK' as any },
  };
  const stateError: CoverState = {
    ...initialState,
    coverResponse: { loading: false, error: 'MOCK_ERROR' },
  };

  expect(
    useCoverSlice().reducer(stateInit, coverActions.loadingCoverResponse('')),
  ).toEqual(stateLoading);

  expect(
    useCoverSlice().reducer(
      stateLoading,
      coverActions.successCoverResponse('MOCK' as any),
    ),
  ).toEqual(stateSuccess);

  expect(
    useCoverSlice().reducer(
      stateLoading,
      coverActions.errorCoverResponse('MOCK_ERROR'),
    ),
  ).toEqual(stateError);
});

test('should take sagas', () => {
  const genObject = coverPageSaga();

  expect(genObject.next().value).toEqual(
    takeEvery(AT.LOAD_COVER.REQUEST, getCoverRequest),
  );
  expect(genObject.next().value).toEqual(
    takeEvery(AT.DELETE_COVER.REQUEST, deleteCoverRequest),
  );
  expect(genObject.next().done).toBeTruthy();
});
