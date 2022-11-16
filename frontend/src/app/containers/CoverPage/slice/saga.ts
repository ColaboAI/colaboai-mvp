import { put, takeEvery } from 'redux-saga/effects';
import { coverActions } from '.';
import * as AT from 'api/actionTypes';
import * as actions from 'api/actions';
import { api } from 'api/band';
import { ActionType } from 'typesafe-actions';
import { AxiosResponse } from 'axios';

// Root saga
export default function* coverPageSaga() {
  yield takeEvery(AT.LOAD_COVER.REQUEST, getCoverRequest);
  yield takeEvery(AT.DELETE_COVER.REQUEST, deleteCoverRequest);
  yield takeEvery(AT.EDIT_COVER.REQUEST, editCoverCommentRequest);
  yield takeEvery(AT.CREATE_COVER_COMMENT.REQUEST, postCoverCommentRequest);
  yield takeEvery(AT.DELETE_COVER_COMMENT.REQUEST, deleteCoverCommentRequest);
  yield takeEvery(AT.LOAD_COVER_COMMENTS.REQUEST, getCoverCommentsRequest);
}

export function* getCoverRequest(
  action: ActionType<typeof actions.loadCover.request>,
) {
  yield put(coverActions.loadingCoverResponse('start load'));
  try {
    const response: Cover = yield api.getCoverInfo(action.payload);
    yield put(coverActions.successCoverResponse(response));
  } catch (e: any) {
    yield put(coverActions.errorCoverResponse(e));
  }
}

export function* deleteCoverRequest(
  action: ActionType<typeof actions.loadCover.request>,
) {
  yield put(coverActions.loadingDeleteResponse('start load'));
  try {
    const response: AxiosResponse = yield api.deleteCover(action.payload);
    yield put(coverActions.successDeleteResponse(response.status));
  } catch (e: any) {
    yield put(coverActions.errorDeleteResponse(e));
  }
}

export function* getCoverCommentsRequest(
  action: ActionType<typeof actions.loadCoverComments.request>,
) {
  yield put(
    coverActions.loadingCoverCommentsResponse('start loading Cover Comments'),
  );
  try {
    const response = yield api.getCoverComments(action.payload);
    yield put(coverActions.successCoverCommentsResponse(response));
  } catch (e: any) {
    yield put(coverActions.errorCoverCommentsResponse(e));
  }
}

export function* postCoverCommentRequest(
  action: ActionType<typeof actions.createCoverComment.request>,
) {
  yield put(coverActions.loadingCreateCommentResponse('start Posting Comment'));
  try {
    const response = yield api.postCoverComment(action.payload);
    yield put(coverActions.successCreateCommentResponse(response));
  } catch (e: any) {
    yield put(coverActions.errorCreateCommentResponse(e));
  }
}

export function* deleteCoverCommentRequest(
  action: ActionType<typeof actions.deleteCoverComment.request>,
) {
  yield put(
    coverActions.loadingDeleteCommentResponse('start Deleting Comment'),
  );
  try {
    const response = yield api.deleteCoverComment(action.payload);
    yield put(coverActions.successDeleteCommentResponse(response));
  } catch (e: any) {
    yield put(coverActions.errorDeleteCommentResponse(e));
  }
}

export function* editCoverCommentRequest(
  action: ActionType<typeof actions.editCoverComment.request>,
) {
  yield put(coverActions.loadingEditCommentResponse('start Editing Comment'));
  try {
    const response = yield api.editCoverComment(action.payload);
    yield put(coverActions.successEditCommentResponse(response));
  } catch (e: any) {
    yield put(coverActions.errorEditCommentResponse(e));
  }
}
