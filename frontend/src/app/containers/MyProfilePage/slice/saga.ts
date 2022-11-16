import { put, takeEvery } from 'redux-saga/effects';
import { profileActions } from '.';
import * as AT from 'api/actionTypes';
import * as actions from 'api/actions';
import { api } from 'api/band';
import { ActionType } from 'typesafe-actions';

// TODO: 일반 유저의 프로필을 불러오는 액션
// Root saga
export default function* profilePageSaga(payload: any) {
  yield takeEvery(AT.LOAD_MY_PROFILE.REQUEST, getMyProfileResponse);
  yield takeEvery(AT.POST_PROFILE.REQUEST, postProfileResponse);
  yield takeEvery(AT.LOAD_INSTRUMENTS.REQUEST, getInstrumentsRequest);
}

export function* getMyProfileResponse(
  action: ActionType<typeof actions.loadMyProfile.request>,
) {
  yield put(profileActions.loadingProfileResponse('start load'));
  try {
    const profileResponse = yield api.getMyInfo(action.payload);
    yield put(profileActions.successProfileResponse(profileResponse));
  } catch (e: any) {
    yield put(profileActions.errorProfileResponse(e));
  }
}

export function* postProfileResponse(
  action: ActionType<typeof actions.postProfile.request>,
) {
  yield put(profileActions.loadingPostResponse('start load'));
  try {
    const postProfileResponse = yield api.postUserInfo(action.payload);
    yield put(profileActions.successPostResponse(postProfileResponse.data));
  } catch (e: any) {
    yield put(profileActions.errorPostResponse(e));
  }
}

export function* getInstrumentsRequest(
  action: ActionType<typeof actions.loadInstruments.request>,
) {
  yield put(profileActions.loadingInstrumentsResponse('start load'));
  try {
    const response = yield api.getInstruments();
    yield put(profileActions.successInstrumentsResponse(response));
  } catch (e: any) {
    yield put(profileActions.errorInstrumentsResponse(e));
  }
}
