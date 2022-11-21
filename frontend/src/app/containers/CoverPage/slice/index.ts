import { PayloadAction } from '@reduxjs/toolkit';
import { SagaInjectionModes } from 'redux-injectors';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import coverPageSaga from './saga';

/* --- STATE --- */
export interface CoverState {
  name: string;
  coverResponse: AsyncStateType<Cover>;
  deleteResponse: AsyncStateType<number>;
  commentsResponse: AsyncStateType<CoverComment[]>;
} // state 형식 정의

export const initialState: CoverState = {
  name: 'cover',
  coverResponse: { loading: false },
  deleteResponse: { loading: false },
  commentsResponse: { loading: false },
};

const slice = createSlice({
  name: 'cover', // 이 이름을 types/RootState.ts에 써놓아야 함
  initialState,
  reducers: {
    clearDeleteResponse(state, _action: PayloadAction<undefined>) {
      state.deleteResponse = { loading: false };
    },
    loadingCoverResponse(state, _action: PayloadAction<any>) {
      state.coverResponse = { loading: true };
      return state;
    },
    successCoverResponse(state, action: PayloadAction<Cover>) {
      state.coverResponse = { loading: false };
      state.coverResponse.data = action.payload;
      return state;
    },
    errorCoverResponse(state, action: PayloadAction<string>) {
      state.coverResponse = { loading: false };
      state.coverResponse.error = action.payload;
      return state;
    },

    loadingDeleteResponse(state, _action: PayloadAction<any>) {
      state.deleteResponse = { loading: true };
      return state;
    },
    successDeleteResponse(state, action: PayloadAction<number>) {
      state.deleteResponse = { loading: false };
      state.deleteResponse.data = action.payload;
      return state;
    },
    errorDeleteResponse(state, action: PayloadAction<string>) {
      state.deleteResponse = { loading: false };
      state.deleteResponse.error = action.payload;
      return state;
    },

    loadingCoverCommentsResponse(state, _action: PayloadAction<any>) {
      state.commentsResponse = { loading: true };
    },

    successCoverCommentsResponse(state, action: PayloadAction<CoverComment[]>) {
      state.commentsResponse = { loading: false };
      state.commentsResponse.data = action.payload;
    },
    errorCoverCommentsResponse(state, action: PayloadAction<string>) {
      state.commentsResponse = { loading: false };
      state.commentsResponse.error = action.payload;
    },
    loadingCreateCommentResponse(state, _action: PayloadAction<any>) {
      state.commentsResponse = {
        loading: true,
        data: state.commentsResponse.data,
      };
    },
    successCreateCommentResponse(state, action: PayloadAction<CoverComment>) {
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
    successEditCommentResponse(state, action: PayloadAction<CoverComment>) {
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

export const { actions: coverActions } = slice;

export const useCoverSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({
    key: slice.name,
    saga: coverPageSaga,
    mode: SagaInjectionModes.RESTART_ON_REMOUNT,
  });
  return { actions: slice.actions, reducer: slice.reducer };
};

/**
 * Example Usage:
 *
 * export function MyComponentNeedingThisSlice() {
 *  const { actions } = useExampleSlice();
 *
 *  const onButtonClick = (evt) => {
 *    dispatch(actions.someAction());
 *   };
 * }
 */
