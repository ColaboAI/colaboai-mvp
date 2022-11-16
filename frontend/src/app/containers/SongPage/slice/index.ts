import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { PayloadAction } from '@reduxjs/toolkit';
import { SagaInjectionModes } from 'redux-injectors';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import songPageSaga from './saga';
// TODO: apply pagenation
/* --- STATE --- */
export interface SongState {
  songResponse: AsyncStateType<Song>;
  combinationResponse: AsyncStateType<Combination>;
  combinationsResponse: AsyncStateType<Combination[]>;
  coversResponse: AsyncStateType<Cover[]>;
  instrumentsResponse: AsyncStateType<Instrument[]>;
  commentsResponse: AsyncStateType<SongComment[]>;
} // state 형식 정의

export const initialState: SongState = {
  songResponse: { loading: false },
  combinationResponse: { loading: false },
  combinationsResponse: { loading: false },
  coversResponse: { loading: false },
  instrumentsResponse: { loading: false },
  commentsResponse: { loading: false },
};

const slice = createSlice({
  name: 'song', // 이 이름을 types/RootState.ts에 써놓아야 함
  initialState,
  reducers: {
    cleanUp(_state, _action: PayloadAction<undefined>) {
      return initialState;
    },
    loadingSongResponse(state, _action: PayloadAction<any>) {
      state.songResponse = { loading: true };
    },
    successSongResponse(state, action: PayloadAction<Song>) {
      state.songResponse = { loading: false };
      state.songResponse.data = action.payload;
    },
    errorSongResponse(state, action: PayloadAction<string>) {
      state.songResponse = { loading: false };
      state.songResponse.error = action.payload;
    },

    loadingCombinationResponse(state, _action: PayloadAction<any>) {
      state.combinationResponse = { loading: true };
    },
    successCombinationResponse(state, action: PayloadAction<Combination>) {
      state.combinationResponse = { loading: false };
      state.combinationResponse.data = action.payload;
    },
    errorCombinationResponse(state, action: PayloadAction<string>) {
      state.combinationResponse = { loading: false };
      state.combinationResponse.error = action.payload;
    },

    loadingCombinationsResponse(state, _action: PayloadAction<any>) {
      state.combinationsResponse = { loading: true };
    },
    successCombinationsResponse(state, action: PayloadAction<Combination[]>) {
      state.combinationsResponse = { loading: false };
      state.combinationsResponse.data = action.payload;
    },
    errorCombinationsResponse(state, action: PayloadAction<string>) {
      state.combinationsResponse = { loading: false };
      state.combinationsResponse.error = action.payload;
    },

    loadingCoversResponse(state, _action: PayloadAction<any>) {
      state.coversResponse = { loading: true };
    },
    successCoversResponse(state, action: PayloadAction<Cover[]>) {
      state.coversResponse = { loading: false };
      state.coversResponse.data = action.payload;
    },
    errorCoversResponse(state, action: PayloadAction<string>) {
      state.coversResponse = { loading: false };
      state.coversResponse.error = action.payload;
    },

    loadingInstrumentsResponse(state, _action: PayloadAction<any>) {
      state.instrumentsResponse = { loading: true };
    },
    successInstrumentsResponse(state, action: PayloadAction<Instrument[]>) {
      state.instrumentsResponse = { loading: false };
      state.instrumentsResponse.data = action.payload;
    },
    errorInstrumentsResponse(state, action: PayloadAction<string>) {
      state.instrumentsResponse = { loading: false };
      state.instrumentsResponse.error = action.payload;
    },

    loadingSongCommentsResponse(state, _action: PayloadAction<any>) {
      state.commentsResponse = { loading: true };
    },

    successSongCommentsResponse(state, action: PayloadAction<SongComment[]>) {
      state.commentsResponse = { loading: false };
      state.commentsResponse.data = action.payload;
    },
    errorSongCommentsResponse(state, action: PayloadAction<string>) {
      state.commentsResponse = { loading: false };
      state.commentsResponse.error = action.payload;
    },
    loadingCreateCommentResponse(state, _action: PayloadAction<any>) {
      state.commentsResponse = {
        loading: true,
        data: state.commentsResponse.data,
      };
    },
    successCreateCommentResponse(state, action: PayloadAction<SongComment>) {
      state.commentsResponse.loading = false;
      if (state.commentsResponse && state.commentsResponse.data) {
        if (action.payload.parentComment) {
          const parentComment = state.commentsResponse.data.find(
            comment => comment.id === action.payload.parentComment,
          );
          if (parentComment) {
            parentComment.reply.push(action.payload);
          }
        } else {
          state.commentsResponse.data.push(action.payload);
        }
      } else {
        state.commentsResponse.data = [action.payload];
      }
    },
    errorCreateCommentResponse(state, action: PayloadAction<string>) {
      state.commentsResponse = { loading: false };
      state.commentsResponse.error = action.payload;
    },
    loadingDeleteCommentResponse(state, _action: PayloadAction<any>) {
      state.commentsResponse = { loading: true };
    },
    successDeleteCommentResponse(state, action: PayloadAction<number>) {
      state.commentsResponse = { loading: false };
      if (state.commentsResponse.data && state.commentsResponse.data.length) {
        state.commentsResponse.data = state.commentsResponse.data.filter(
          comment => comment.id !== action.payload,
        );
      }
    },
    errorDeleteCommentResponse(state, action: PayloadAction<string>) {
      state.commentsResponse = { loading: false };
      state.commentsResponse.error = action.payload;
    },

    loadingEditCommentResponse(state, _action: PayloadAction<any>) {
      state.commentsResponse = { loading: true };
    },
    successEditCommentResponse(state, action: PayloadAction<SongComment>) {
      state.commentsResponse = { loading: false };
      if (state.commentsResponse.data && state.commentsResponse.data.length) {
        const oldComment = state.commentsResponse.data.find(
          comment => comment.id === action.payload.id,
        );
        if (oldComment) {
          oldComment.content = action.payload.content;
          oldComment.updatedAt = action.payload.updatedAt;
        }
      }
    },
    errorEditCommentResponse(state, action: PayloadAction<string>) {
      state.commentsResponse = { loading: false };
      state.commentsResponse.error = action.payload;
    },
  },
});

export const { actions: songActions } = slice;

export const useSongSlice = () => {
  const dispatch = useDispatch();
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({
    key: slice.name,
    saga: songPageSaga,
    mode: SagaInjectionModes.RESTART_ON_REMOUNT,
  });
  useEffect(() => {
    return () => {
      dispatch(slice.actions.cleanUp());
    };
  }, [dispatch]);
  return { actions: slice.actions, reducer: slice.reducer };
};
