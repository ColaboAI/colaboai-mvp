import { asyncActionCreator } from 'api/utils';

// instrument actionTypes
export const LOAD_INSTRUMENTS = asyncActionCreator('LOAD_INSTRUMENTS');

// cover actionTypes
export const LOAD_COVERS_SONG = asyncActionCreator('LOAD_COVERS_SONG');
export const LOAD_COVERS_SONG_INST = asyncActionCreator(
  'LOAD_COVERS_SONG_INST',
);
export const LOAD_COVER = asyncActionCreator('LOAD_COVER');
export const LOAD_SIGNIN = asyncActionCreator('LOAD_SIGNIN');
export const LOAD_SIGNUP = asyncActionCreator('LOAD_SIGNUP');
export const LOAD_PROFILE = asyncActionCreator('LOAD_PROFILE');
export const LOAD_MY_PROFILE = asyncActionCreator('LOAD_MY_PROFILE');
export const REFRESH_TOKEN = asyncActionCreator('REFRESH_TOKEN');

export const POST_PROFILE = asyncActionCreator('POST_PROFILE');
export const EDIT_COVER = asyncActionCreator('EDIT_COVER');
export const DELETE_COVER = asyncActionCreator('DELETE_COVER');
export const CREATE_COVER = asyncActionCreator('CREATE_COVER');
export const LOAD_COVER_COMMENTS = asyncActionCreator('LOAD_COVER_COMMENTS');
export const CREATE_COVER_COMMENT = asyncActionCreator('CREATE_COVER_COMMENT');
export const EDIT_COVER_COMMENT = asyncActionCreator('EDIT_COVER_COMMENT');
export const DELETE_COVER_COMMENT = asyncActionCreator('DELETE_COVER_COMMENT');

// combination actionTypes
export const LOAD_COMBINATIONS = asyncActionCreator('LOAD_COMBINATIONS');
export const LOAD_COMBINATIONS_MAIN = asyncActionCreator(
  'LOAD_COMBINATIONS_MAIN',
);
export const CREATE_COMBINATION = asyncActionCreator('CREATE_COMBINATION');
export const LOAD_COMBINATION_LIKE = asyncActionCreator(
  'LOAD_COMBINATION_LIKE',
);
export const EDIT_COMBINATION_LIKE = asyncActionCreator(
  'EDIT_COMBINATION_LIKE',
);

// song actionTypes
export const CREATE_SONG = asyncActionCreator('CREATE_SONG');
export const LOAD_SONG = asyncActionCreator('LOAD_SONG');
export const LOAD_SONG_COMMENTS = asyncActionCreator('LOAD_SONG_COMMENTS');
export const CREATE_SONG_COMMENT = asyncActionCreator('CREATE_SONG_COMMENT');
export const EDIT_SONG_COMMENT = asyncActionCreator('EDIT_SONG_COMMENT');
export const DELETE_SONG_COMMENT = asyncActionCreator('DELETE_SONG_COMMENT');
export const LOAD_SONGS_SEARCH = asyncActionCreator('LOAD_SONGS_SEARCH');
