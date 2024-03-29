import { put, takeEvery } from 'redux-saga/effects';
import { songActions } from '.';
import * as AT from 'api/actionTypes';
import * as actions from 'api/actions';
import { api } from 'api/band';
import { ActionType } from 'typesafe-actions';

// Root saga
export default function* songPageSaga() {
  yield takeEvery(AT.LOAD_SONG.REQUEST, getSongRequest);
  yield takeEvery(AT.CREATE_COMBINATION.REQUEST, postCombinationRequest);
  yield takeEvery(AT.LOAD_COMBINATIONS.REQUEST, getCombinationsRequest);
  yield takeEvery(AT.LOAD_COVERS_SONG.REQUEST, getCoversRequest);
  yield takeEvery(AT.LOAD_INSTRUMENTS.REQUEST, getInstrumentsRequest);
  yield takeEvery(AT.CREATE_SONG_COMMENT.REQUEST, postSongCommentRequest);
  yield takeEvery(AT.LOAD_SONG_COMMENTS.REQUEST, getSongCommentsRequest);
  yield takeEvery(AT.DELETE_SONG_COMMENT.REQUEST, deleteSongCommentRequest);
  yield takeEvery(AT.EDIT_SONG_COMMENT.REQUEST, editSongCommentRequest);
}

export function* getSongRequest(
  action: ActionType<typeof actions.loadSong.request>,
) {
  yield put(songActions.loadingSongResponse('start load'));
  try {
    const response = yield api.getSongInfo(action.payload);
    yield put(songActions.successSongResponse(response));
  } catch (e: any) {
    yield put(songActions.errorSongResponse(e));
  }
}

export function* postCombinationRequest(
  action: ActionType<typeof actions.createCombination.request>,
) {
  yield put(songActions.loadingCombinationResponse('start load'));
  try {
    const response = yield api.postCombination(action.payload);
    yield put(songActions.successCombinationResponse(response.data));
  } catch (e: any) {
    yield put(songActions.errorCombinationResponse(e));
  }
}

export function* getCombinationsRequest(
  action: ActionType<typeof actions.loadCombinations.request>,
) {
  yield put(songActions.loadingCombinationsResponse('start load'));
  try {
    const response = yield api.getCombinationsBySong(action.payload);
    yield put(songActions.successCombinationsResponse(response));
  } catch (e: any) {
    yield put(songActions.errorCombinationsResponse(e));
  }
}

export function* getCoversRequest(
  action: ActionType<typeof actions.loadCoversSong.request>,
) {
  yield put(songActions.loadingCoversResponse('start load'));
  try {
    const response = yield api.getCoversBySongId(action.payload);
    yield put(songActions.successCoversResponse(response));
  } catch (e: any) {
    yield put(songActions.errorCoversResponse(e));
  }
}

export function* getInstrumentsRequest(
  action: ActionType<typeof actions.loadInstruments.request>,
) {
  yield put(songActions.loadingInstrumentsResponse('start load'));
  try {
    const response = yield api.getInstruments();
    yield put(songActions.successInstrumentsResponse(response));
  } catch (e: any) {
    yield put(songActions.errorInstrumentsResponse(e));
  }
}

export function* getSongCommentsRequest(
  action: ActionType<typeof actions.loadSongComments.request>,
) {
  yield put(
    songActions.loadingSongCommentsResponse('start loading Song Comments'),
  );
  try {
    const response = yield api.getSongComments(action.payload);
    yield put(songActions.successSongCommentsResponse(response));
  } catch (e: any) {
    yield put(songActions.errorSongCommentsResponse(e));
  }
}

export function* postSongCommentRequest(
  action: ActionType<typeof actions.createSongComment.request>,
) {
  yield put(songActions.loadingCreateCommentResponse('start Posting Comment'));
  try {
    const response = yield api.postSongComment(action.payload);
    yield put(songActions.successCreateCommentResponse(response));
  } catch (e: any) {
    yield put(songActions.errorCreateCommentResponse(e));
  }
}

export function* deleteSongCommentRequest(
  action: ActionType<typeof actions.deleteSongComment.request>,
) {
  yield put(songActions.loadingDeleteCommentResponse('start Deleting Comment'));
  try {
    const response = yield api.deleteSongComment(action.payload);
    yield put(songActions.successDeleteCommentResponse(response));
  } catch (e: any) {
    yield put(songActions.errorDeleteCommentResponse(e));
  }
}

export function* editSongCommentRequest(
  action: ActionType<typeof actions.editSongComment.request>,
) {
  yield put(songActions.loadingEditCommentResponse('start Editing Comment'));
  try {
    const response = yield api.editSongComment(action.payload);
    yield put(songActions.successEditCommentResponse(response));
  } catch (e: any) {
    yield put(songActions.errorEditCommentResponse(e));
  }
}
