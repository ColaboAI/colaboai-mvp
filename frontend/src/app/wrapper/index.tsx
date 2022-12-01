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
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

interface WrapperProps {
  children?: React.ReactChild | React.ReactChild[];
}
export default function Wrapper(props: WrapperProps) {
  useWrapperSlice();
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const wrapperState = useSelector(selectWrapper);
  const currentTrack = wrapperState.currentTrack;

  const player = React.useMemo(() => Player.getInstance(), []);

  // TODO: 로직 제대로 수정하기
  useEffect(() => {
    const at = sessionStorage.getItem('accessToken') ?? undefined;
    const isLogout = localStorage.getItem('isLogout') ?? undefined;
    const isAnonymous = localStorage.getItem('isAnonymous') ?? undefined;
    if (location && location.pathname === '/signup') {
      return;
    }
    if (at) {
      dispatch(wrapperActions.setAccessToken(at));
      if (wrapperState.user === undefined) {
        dispatch(apiActions.loadMyProfileInAuth.request());
      }
    } else {
      if (isLogout !== 'true' && isAnonymous !== 'true') {
        dispatch(apiActions.loadMyProfileInAuth.request());
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, history, wrapperState.user]);

  useEffect(() => {
    if (wrapperState.auth.error) {
      history.push(url.SignIn());
    }
  }, [history, wrapperState.auth.error]);

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
    history.replace(url.SignIn());
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
    async (track: TrackInfo) => {
      if (wrapperState.user === undefined) {
        toast.error('로그인이 필요한 기능입니다.');
      }
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
      player.putTrack(newTrack);
    },
    [dispatch, player, setTrack, wrapperState.user],
  );

  return (
    <div data-testid="Wrapper" className="relative w-full h-full">
      <Header
        userInfo={wrapperState.user}
        accessToken={wrapperState.accessToken}
        onSearchClicked={onSearchClicked}
        onSignInClicked={onSignInClicked}
        onSignUpClicked={onSignUpClicked}
        onSignOutClicked={onSignOutClicked}
        onProfileClicked={onProfileClicked}
        onLogoClicked={onLogoClicked}
        onCommunityClicked={() => {
          window.open('https://discord.gg/XCSuNDNUyX', '_blank');
        }}
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
