import { delay, put, takeLatest } from 'redux-saga/effects';
import { ActionType } from 'typesafe-actions';
import * as AT from 'api/actionTypes';
import * as actions from 'api/actions';
import { api } from 'api/band';
import { wrapperActions } from '.';

// Root saga
export default function* wrapperSaga() {
  yield takeLatest(AT.EDIT_COMBINATION_LIKE.REQUEST, putCombinationLikeRequest);
  yield takeLatest(
    AT.LOAD_ACCESS_TOKEN_FROM_REFRESH_TOKEN.REQUEST,
    getAccessTokenFromRefreshTokenRequest,
  );
  yield takeLatest(AT.LOAD_MY_PROFILE.REQUEST, getMyProfileRequest);
}
// TODO: 구현 마무리
export function* putCombinationLikeRequest(
  action: ActionType<typeof actions.editCombinationLike.request>,
) {
  try {
    const response = yield api.putCombinationLike(action.payload);
  } catch (e: any) {}
}

export function* getAccessTokenFromRefreshTokenRequest(
  action: ActionType<typeof actions.loadAccessTokenFromRefreshToken.request>,
) {
  try {
    yield put(wrapperActions.loadingAccessTokenResponse('start load'));
    const response = yield api.getAccessTokenFromRefreshToken();
    yield put(wrapperActions.successAccessTokenResponse(response));
  } catch (e: any) {
    yield put(wrapperActions.errorAccessTokenResponse(e));
  }
}

export function* getMyProfileRequest(
  action: ActionType<typeof actions.loadMyProfile.request>,
) {
  try {
    yield put(wrapperActions.loadingMyProfileResponse('start load'));
    // TODO: remove delay
    yield delay(500);
    const response = yield api.getMyInfo();
    yield put(wrapperActions.successMyProfileResponse(response));
  } catch (e: any) {
    yield put(wrapperActions.errorMyProfileResponse(e));
  }
}
