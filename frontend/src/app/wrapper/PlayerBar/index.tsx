import { useState, useCallback, useRef, useEffect, useMemo } from 'react';

import loadingGif from 'res/loading.gif';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHeart,
  faPlay,
  faPause,
  faStepBackward,
  faStepForward,
} from '@fortawesome/free-solid-svg-icons';
import { faHeart as faEmptyHeart } from '@fortawesome/free-regular-svg-icons';

import Player from 'app/helper/Player';
import { useInterval } from 'app/helper/Hooks';
import { api } from 'api/band';
import { useMediaQuery } from 'react-responsive';

interface Props {
  track?: TrackInfo;
  setTrack: (track: TrackInfo) => void;
  onLikeClicked: (track: TrackInfo) => void;
}

export default function PlayerBar(props: Props) {
  const player = useMemo(() => Player.getInstance(), []);
  const [currLength, setCurrLength] = useState(0);
  const [length, setLength] = useState(0);
  const [status, setStatus] = useState('');
  const progress = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  useEffect(() => {
    player.onStatusChange = newStatus => {
      setStatus(newStatus);
      setLength(player.getDuration());
    };
    player.onTrackChanged = newTrack => {
      props.setTrack(newTrack);
      api.logCombination(newTrack.combinationId);
    };
  }, [player, props]);

  const onPlayClicked = useCallback(() => {
    if (player.isPaused()) {
      player.play();
    } else {
      player.pause();
    }
  }, [player]);

  const onPrevClicked = useCallback(() => {
    player.playPrev();
  }, [player]);

  const onNextClicked = useCallback(() => {
    player.playNext();
  }, [player]);

  const updateProgress = useCallback(() => {
    const currentTime = player.getCurrentTime();
    setCurrLength(currentTime);
    const currnetPercent = length ? (currentTime / length) * 100 : 0;
    bar.current!.style.width = currnetPercent + '%';
    if (length && currentTime >= length - 0.01) {
      player.playNext();
    }
  }, [player, length]);

  const onProgressClick = useCallback(
    (e: any) => {
      let offset = e.target.getBoundingClientRect().left;
      let newOffSet = e.clientX;
      let newWidth = newOffSet - offset;
      let secPerPx = length / (progress.current?.offsetWidth ?? 1);
      player.setCurrentTime(secPerPx * newWidth);
      updateProgress();
    },
    [length, player, updateProgress],
  );

  const formatMinute = useCallback((time: number) => {
    if (isNaN(time)) return '0:00';
    const timeInt = Math.ceil(time);
    const min = Math.floor(timeInt / 60);
    const sec = timeInt - min * 60;
    return `${min}:${`0${sec}`.slice(-2)}`;
  }, []);

  useInterval(updateProgress, 200);

  return (
    <div
      data-testid="PlayerBar"
      className="fixed bottom-0 left-0 z-50 h-16 pt-1 px-4 sm:px-8 w-full flex items-center justify-between bg-gray-100"
    >
      <div id="info" className="h-full py-2 flex sm:w-6/12 items-center w-3/12">
        <div className="flex h-full sm:px-2 sm:py-1 sm:text-base sm:border-2 font-semibold  border-black rounded-lg text-[8px] items-center whitespace-pre-line truncate">
          {isMobile
            ? props.track
              ? `${props.track.song.title}`
              : 'Select Music'
            : props.track
            ? `${props.track.song.title} - ${props.track.song.singer}`
            : 'Select Music'}
        </div>
        <button
          className="h-full mx-2 sm:px-2 sm:text-xl outline-none"
          id="like-button"
          onClick={() => {
            props.track && props.onLikeClicked(props.track);
          }}
        >
          {props.track?.like ? (
            <FontAwesomeIcon
              data-testid="likeIcon"
              icon={faHeart}
              className="text-red-500"
            />
          ) : (
            <FontAwesomeIcon
              data-testid="unLikeIcon"
              icon={faEmptyHeart}
              className="text-red-400"
            />
          )}
        </button>
      </div>
      <div
        id="controller"
        className="flex h-full w-6/12 py-2 justify-center items-stretch sm:text-xl"
      >
        <button
          className="sm:mx-2 sm:w-8 mx-1 w-4 outline-none"
          id="prev-button"
          onClick={onPrevClicked}
        >
          <FontAwesomeIcon icon={faStepBackward} />
        </button>
        <button
          className="sm:mx-2 sm:w-8 mx-1 w-4 outline-none"
          id="play-button"
          onClick={onPlayClicked}
        >
          {status === 'loading' ? (
            <img data-testid="loadingIcon" src={loadingGif} alt="Loading" />
          ) : status === 'play' ? (
            <FontAwesomeIcon data-testid="pauseIcon" icon={faPause} />
          ) : (
            <FontAwesomeIcon data-testid="playIcon" icon={faPlay} />
          )}
        </button>
        <button
          className="sm:mx-2 sm:w-8 mx-1 w-4 outline-none"
          id="next-button"
          onClick={onNextClicked}
        >
          <FontAwesomeIcon icon={faStepForward} />
        </button>
      </div>
      <div
        id="timer"
        className="text-right sm:w-6/12 sm:text-lg text-gray-600 font-semibold text-xs w-3/12"
      >
        {`${formatMinute(currLength)} / ${formatMinute(length)}`}
      </div>
      <div
        ref={progress}
        className="absolute left-0 top-0 w-full flex justify-evenly items-center"
      >
        <div
          data-testid="progressBox"
          className="w-full h-1.5 bg-gray-300 hover:h-2.5 cursor-pointer"
          onClick={onProgressClick}
        >
          <div
            data-testid="progressFill"
            ref={bar}
            className="w-0 h-full bg-indigo-500"
          ></div>
        </div>
      </div>
    </div>
  );
}
