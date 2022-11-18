import * as React from 'react';
import { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

import Header from './Header';
import PlayerBar from './PlayerBar';
import { selectWrapper } from './slice/selectors';
import { useWrapperSlice, wrapperActions } from './slice';
import * as apiActions from 'api/actions';
import * as url from 'utils/urls';
import Player from 'app/helper/Player';
interface Props {
  children?: React.ReactChild | React.ReactChild[];
}

export default function Wrapper(props: Props) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  useWrapperSlice();
  const history = useHistory();
  const dispatch = useDispatch();
  const wrapperState = useSelector(selectWrapper);

  const currentTrack = wrapperState.currentTrack;

  const player = React.useMemo(() => Player.getInstance(), []);

  // TODO: 로직 제대로 수정하기
  useEffect(() => {
    if (!wrapperState.accessToken) {
      dispatch(apiActions.loadAccessTokenFromRefreshToken.request());
      dispatch(apiActions.loadMyProfile.request());
    }
  }, [dispatch, wrapperState.accessToken]);

  useEffect(() => {
    player.pause();
  }, [player]);

  const onLogoClicked = useCallback(() => {
    history.push(url.Main());
  }, [history]);

  const onSearchClicked = useCallback(
    (key: string) => {
      if (key === '') return;
      history.push({
        pathname: url.SearchResult(),
        search: `?key=${key}`,
      });
    },
    [history],
  );

  const onSignInClicked = useCallback(() => {
    history.push(url.SignIn());
  }, [history]);

  const onSignUpClicked = useCallback(() => {
    history.push(url.SignUp());
  }, [history]);

  const onSignOutClicked = useCallback(() => {
    dispatch(wrapperActions.signOut());
    history.replace(url.Main());
  }, [dispatch, history]);

  const onProfileClicked = useCallback(() => {
    history.push(url.Profile('me'));
  }, [history]);

  const setTrack = useCallback(
    (track: TrackInfo) => {
      dispatch(wrapperActions.setCurrentPlaying(track));
    },
    [dispatch],
  );

  const onLikeClicked = useCallback(
    (track: TrackInfo) => {
      if (track.combinationId) {
        dispatch(
          apiActions.editCombinationLike.request({
            combinationId: track.combinationId,
            isLiked: !track.like,
          }),
        );
      }

      const newTrack = { ...track, like: !track.like };
      setTrack(newTrack);
    },
    [dispatch, setTrack],
  );

  return (
    <div data-testid="Wrapper" className="relative w-full h-full">
      <Header
        accessToken={wrapperState.accessToken}
        onSearchClicked={onSearchClicked}
        onSignInClicked={onSignInClicked}
        onSignUpClicked={onSignUpClicked}
        onSignOutClicked={onSignOutClicked}
        onProfileClicked={onProfileClicked}
        onLogoClicked={onLogoClicked}
      />
      <div className="relative pt-16 pb-16 h-full overflow-y-auto">
        {props.children}
      </div>
      <PlayerBar
        track={currentTrack}
        setTrack={setTrack}
        onLikeClicked={onLikeClicked}
      />
    </div>
  );
}
