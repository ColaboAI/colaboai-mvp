import React, { useEffect, useMemo, useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Album from '../../components/Album/index';
import Player from 'app/helper/Player';
import * as urls from 'utils/urls';
import * as apiActions from 'api/actions';
import { selectMain } from './slice/selectors';
import { useMainSlice } from './slice';
import { useWrapperSlice } from 'app/wrapper/slice';
import { selectWrapper } from 'app/wrapper/slice/selectors';
import toast from 'react-hot-toast';

export type Props = {};

export default function MainPage(props: Props) {
  useMainSlice();
  useWrapperSlice();
  const history = useHistory();
  const dispatch = useDispatch();
  const mainState = useSelector(selectMain);
  const wrapperState = useSelector(selectWrapper);
  const [trackInfos, setTrackInfos] = useState<TrackInfo[]>([]);
  useSelector(selectWrapper);

  const player = useMemo(() => Player.getInstance(), []);

  // loading
  const combinationsResponse = mainState.combinationsResponse;

  useEffect(() => {
    dispatch(apiActions.loadCombinationsMain.request());
  }, [dispatch]);

  useEffect(() => {
    if (!combinationsResponse.loading) {
      if (combinationsResponse.error) {
        toast.error('Error: could not fetch bands.');
      } else if (combinationsResponse.data && player) {
        const uid = wrapperState.user?.id;
        const trackInfos = combinationsResponse.data.map(combination => {
          const sources = combination.covers.map(cover => cover.audio);
          const trackInfo: TrackInfo = {
            combinationId: combination.id,
            song: combination.song,
            sources,
            like: uid ? combination.likes.includes(uid) : false,
            likeCount: combination.likeCount,
          };
          return trackInfo;
        });
        // setting tracks
        setTrackInfos(trackInfos);
        player.setTracks(trackInfos);
      }
    }
  }, [combinationsResponse, player, wrapperState.user]);

  const onClickPlay = useCallback(
    (index: number) => {
      const currentCombi = player.getTrack()?.combinationId ?? -1;
      if (currentCombi !== trackInfos[index].combinationId) {
        player.addTrack(trackInfos[index]);
      }
    },
    [player, trackInfos],
  );

  const getIsPlaying = useCallback(
    (combination_id: number) => {
      return player.getTrack()?.combinationId === combination_id;
    },
    [player],
  );

  return (
    <div
      data-testid="MainPage"
      className="items-center overflow-hidden grid grid-cols-10 pt-8"
    >
      {combinationsResponse.data && combinationsResponse.data.length > 0 ? (
        combinationsResponse.data.map((combination, index) => (
          <Album
            key={combination.id}
            combination={combination}
            onClickTitle={() => history.push(urls.Song(combination.song.id))}
            onClickPlay={() => onClickPlay(index)}
            isPlaying={getIsPlaying(combination.id)}
          />
        ))
      ) : (
        <div className="w-full col-span-12 text-center">Loading...</div>
      )}

      <div className="flex">
        <p></p>
      </div>
    </div>
  );
}
