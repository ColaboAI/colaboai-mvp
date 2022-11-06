import * as AT from 'api/actionTypes';
import { asyncAction } from 'api/utils';
import { AxiosError } from 'axios';

// user actions
export const signin = asyncAction<SignInForm, UserInfo, string>(AT.LOAD_SIGNIN);
export const signup = asyncAction<SignUpForm, null, string>(AT.LOAD_SIGNUP);
export const loadProfile = asyncAction<number, User, string>(AT.LOAD_PROFILE);
export const postProfile = asyncAction<UserPostForm, User, string>(
  AT.POST_PROFILE,
);

// instrument actions
export const loadInstruments = asyncAction<undefined, Instrument[], AxiosError>(
  AT.LOAD_INSTRUMENTS,
);

// cover actions
export const loadCoversSong = asyncAction<number, Cover[], AxiosError>(
  AT.LOAD_COVERS_SONG,
);
export const loadCoversSongInst = asyncAction<
  { songId: number; instrumentId: number },
  Cover[],
  AxiosError
>(AT.LOAD_COVERS_SONG_INST);
export const loadCover = asyncAction<number, Cover, AxiosError>(AT.LOAD_COVER);
export const editCover = asyncAction<CoverFormPut, Cover, AxiosError>(
  AT.EDIT_COVER,
);
export const deleteCover = asyncAction<number, number, AxiosError>(
  AT.DELETE_COVER,
);
export const createCover = asyncAction<CoverForm, Cover, AxiosError>(
  AT.CREATE_COVER,
);
export const loadCoverComments = asyncAction<
  number,
  CoverComment[],
  AxiosError
>(AT.LOAD_COVER_COMMENTS);
export const createCoverComment = asyncAction<
  CoverCommentForm,
  CoverComment,
  AxiosError
>(AT.CREATE_COVER_COMMENT);

export const editCoverComment = asyncAction<
  CoverCommentForm,
  CoverComment,
  AxiosError
>(AT.EDIT_COVER_COMMENT);

export const deleteCoverComment = asyncAction<
  DeleteCommentForm,
  number,
  AxiosError
>(AT.DELETE_COVER_COMMENT);

// combination actions
export const createCombination = asyncAction<
  CombinationForm,
  Combination,
  AxiosError
>(AT.CREATE_COMBINATION);
export const loadCombinations = asyncAction<number, Combination[], AxiosError>(
  AT.LOAD_COMBINATIONS,
);
export const loadCombinationsMain = asyncAction<
  undefined,
  Combination[],
  AxiosError
>(AT.LOAD_COMBINATIONS_MAIN);
export const loadCombinationLike = asyncAction<number, LikeForm, AxiosError>(
  AT.LOAD_COMBINATION_LIKE,
);
export const editCombinationLike = asyncAction<
  {
    combinationId: number;
    isLiked: Boolean;
  },
  LikeForm,
  AxiosError
>(AT.EDIT_COMBINATION_LIKE);

// song actions
export const createSong = asyncAction<SongForm, Song, AxiosError>(
  AT.CREATE_SONG,
);
export const loadSong = asyncAction<number, Song, AxiosError>(AT.LOAD_SONG);
export const loadSongsSearch = asyncAction<string, Song[], AxiosError>(
  AT.LOAD_SONGS_SEARCH,
);

export const loadSongComments = asyncAction<number, SongComment[], AxiosError>(
  AT.LOAD_SONG_COMMENTS,
);

export const createSongComment = asyncAction<
  SongCommentForm,
  SongComment,
  AxiosError
>(AT.CREATE_SONG_COMMENT);

export const editSongComment = asyncAction<
  SongCommentForm,
  SongComment,
  AxiosError
>(AT.EDIT_SONG_COMMENT);

export const deleteSongComment = asyncAction<
  DeleteCommentForm,
  number,
  AxiosError
>(AT.DELETE_SONG_COMMENT);
