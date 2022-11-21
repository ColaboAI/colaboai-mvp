import React, { useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
interface Props {
  url: string;
  isPlaying: boolean;
  currentTime: number;
  setCurrentTime: (time: number) => void;
}

export default function YoutubePlayer(props: Props) {
  const player = useRef<ReactPlayer>(null);

  useEffect(() => {
    const playerCurrent = player.current;
    if (playerCurrent) {
      playerCurrent.seekTo(props.currentTime, 'seconds');
    }
  }, [props.currentTime]);

  return (
    <div data-testid="youtube-player">
      <ReactPlayer
        ref={player}
        playing={props.isPlaying}
        className={'shadow border'}
        url={props.url}
        controls={true}
      />
    </div>
  );
}
