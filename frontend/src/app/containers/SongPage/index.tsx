import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectSong,
  selectCombination,
  selectCurrent,
} from './slice/selectors';
import { useSongSlice } from './slice';
import { useMakeCombinationSlice } from './slice/makeCombination';
import * as apiActions from 'api/actions';
import * as urls from 'utils/urls';
import { getThumbnail } from 'utils/imageTools';

import Player from 'app/helper/Player';
import SongInfoArea from './SongInfoArea';
import TopCombination from './TopCombination';
import CombinationArea from './CombinationArea';
import TopCover from './TopCover';
import Comment from 'app/components/Comment';
import { selectWrapper } from 'app/wrapper/slice/selectors';
import toast from 'react-hot-toast';
interface MatchParams {
  id?: string;
}
export interface Props extends RouteComponentProps<MatchParams> {}

export default function SongPage(props: Props) {
  useSongSlice();
  const makeCombination = useMakeCombinationSlice();
  const history = useHistory();
  const dispatch = useDispatch();
  const songState = useSelector(selectSong);
  const combination = useSelector(selectCombination);
  const current = useSelector(selectCurrent);
  const wrapperState = useSelector(selectWrapper);
  const [recordWait, setRecordWait] = useState(false);

  // loading
  const songResponse = songState.songResponse;
  const combinationResponse = songState.combinationResponse;
  const combinationsResponse = songState.combinationsResponse;
  const coversResponse = songState.coversResponse;
  const instrumentsResponse = songState.instrumentsResponse;
  const commentsResponse = songState.commentsResponse;
  const user = wrapperState.user;

  useEffect(() => {
    dispatch(apiActions.loadSong.request(Number(props.match.params.id)));
    dispatch(
      apiActions.loadCombinations.request(Number(props.match.params.id)),
    );
    dispatch(apiActions.loadCoversSong.request(Number(props.match.params.id)));
    dispatch(apiActions.loadInstruments.request());
    dispatch(
      apiActions.loadSongComments.request(Number(props.match.params.id)),
    );
  }, [dispatch, props.match]);

  useEffect(() => {
    if (!songResponse.loading) {
      if (songResponse.error) {
        toast.error('Song page does not exist.');
        history.push(urls.Main());
      } else if (songResponse.data) {
        dispatch(makeCombination.actions.setSong(songResponse.data));
      }
    }
  }, [songResponse, history, dispatch, makeCombination.actions]);

  // playing
  const player = useMemo(() => Player.getInstance(), []);

  const onClickPlay = useCallback(() => {
    let covers: number[] = combination
      .filter(item => item.cover)
      .map(item => item.cover!.id);

    dispatch(
      apiActions.createCombination.request({
        songId: Number(props.match.params.id),
        covers,
      }),
    );
  }, [combination, dispatch, props.match.params.id]);

  useEffect(() => {
    if (!combinationResponse.loading) {
      if (combinationResponse.error) {
      } else if (combinationResponse.data) {
        const currentSongInfo = songResponse.data!;
        let sources: string[] = combination
          .filter(item => item.cover)
          .map(item => item.cover!.audio);

        if (sources.length === 0) return;

        const currentTrackInfo: TrackInfo = {
          combinationId: combinationResponse.data.id,
          song: currentSongInfo,
          sources,
          like: false,
          likeCount: 10,
        };
        player.addTrack(currentTrackInfo);
      }

      if (recordWait) {
        history.push(urls.CreateCover(props.match.params.id, 'record'));
      }
    }
  }, [
    combination,
    combinationResponse,
    history,
    player,
    props.match.params.id,
    recordWait,
    songResponse.data,
  ]);

  const renderTopCover = useCallback(() => {
    if (current === null) return null;

    const currentItem = combination.find(item => item.id === current);
    return (
      currentItem &&
      coversResponse.data && (
        <TopCover
          covers={coversResponse.data.filter(
            cover =>
              cover.instrument &&
              cover.instrument.id === currentItem.instrument.id,
          )}
          instrument={currentItem.instrument}
        />
      )
    );
  }, [current, combination, coversResponse.data]);

  const onRecordClick = useCallback(() => {
    onClickPlay();
    setRecordWait(true);
  }, [onClickPlay]);

  const onCommentSubmit = useCallback(
    (
      content: string,
      parentComment: number | null,
      setNewText: (text: string) => void,
    ) => {
      if (user) {
        if (content) {
          dispatch(
            apiActions.createSongComment.request({
              songId: Number(props.match.params.id),
              content,
              parentComment,
              userId: user.id,
            }),
          );
          setNewText('');
          toast.success('댓글이 정상적으로 작성되었습니다.');
        } else {
          toast.error('내용을 입력해주세요.');
        }
      } else {
        toast.error('로그인 후 댓글 작성 가능합니다.');
      }
    },
    [dispatch, props.match.params.id, user],
  );

  return (
    <div
      data-testid="SongPage"
      className="flex justify-center h-full overflow-scroll"
    >
      <div className="flex flex-col w-screen sm:w-full sm:px-8 max-w-screen-lg">
        {songResponse.data && (
          <SongInfoArea
            song={songResponse.data}
            image={getThumbnail(songResponse.data.reference)}
          />
        )}

        {combinationsResponse.data && (
          <TopCombination combinations={combinationsResponse.data} />
        )}

        {instrumentsResponse.data && coversResponse.data && (
          <CombinationArea
            songId={props.match.params.id}
            instruments={instrumentsResponse.data}
            covers={coversResponse.data}
            onClickPlay={onClickPlay}
            onRecordClick={onRecordClick}
          />
        )}
        {renderTopCover()}
        {songResponse.data && commentsResponse.data && (
          <Comment
            commentList={commentsResponse.data}
            onCommentSubmit={onCommentSubmit}
            parentObjectId={songResponse.data.id}
            parentObjectType="song"
          />
        )}
      </div>
    </div>
  );
}
