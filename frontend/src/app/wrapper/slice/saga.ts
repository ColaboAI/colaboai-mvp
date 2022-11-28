import { put, takeLatest } from 'redux-saga/effects';
import { ActionType } from 'typesafe-actions';
import * as AT from 'api/actionTypes';
import * as actions from 'api/actions';
import { api } from 'api/band';
import { wrapperActions } from '.';

// Root saga
export default function* wrapperSaga() {
  yield takeLatest(AT.EDIT_COMBINATION_LIKE.REQUEST, putCombinationLikeRequest);
  yield takeLatest(AT.LOAD_MY_PROFILE_IN_AUTH.REQUEST, getMyProfileRequest);
}
// TODO: 구현 마무리
export function* putCombinationLikeRequest(
  action: ActionType<typeof actions.editCombinationLike.request>,
) {
  try {
    yield api.putCombinationLike(action.payload);
  } catch (e: any) {}
}

export function* getMyProfileRequest() {
  try {
    yield put(wrapperActions.loadingMyProfileResponse('start load'));
    const response2 = yield api.getMyInfo();
    yield put(wrapperActions.successMyProfileResponse(response2));
  } catch (e: any) {
    yield put(wrapperActions.errorMyProfileResponse(e));
  }
}
