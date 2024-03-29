import AddedCoverList from './AddedCoverList';
import AddCoverButton from './AddCoverButton';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faCircle } from '@fortawesome/free-solid-svg-icons';

export interface Props {
  songId: string | undefined;
  instruments: Instrument[];
  covers: Cover[];
  onClickPlay: () => void;
  onRecordClick: () => void;
}

export default function CombinationArea(props: Props) {
  return (
    <div data-testid="CombinationArea" className="mt-4 ml-4 sm:ml-0">
      <h2 className="text-left text-sm font-bold text-gray-600 tracking-wider">
        새로운 콜라보 만들기
      </h2>
      <div className="mt-2 flex w-full items-start">
        <AddedCoverList />
        <AddCoverButton instruments={props.instruments} />
        <button
          className="ml-auto inline-flex justify-center mt-2 px-2 border-transparent rounded-lg text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600"
          data-testid="PlayButton"
          onClick={props.onClickPlay}
        >
          <div className="text-lg text-center">
            <FontAwesomeIcon icon={faPlay} />
          </div>
        </button>
        <button
          onClick={props.onRecordClick}
          className="ml-2 mr-4 sm:mr-0 inline-flex justify-center items-center mt-2 px-2 border-transparent rounded-lg text-sm font-medium text-white bg-red-500 hover:bg-red-600"
        >
          <div className="text-md text-center">
            <FontAwesomeIcon icon={faCircle} />
          </div>
          <span className="ml-1 text-lg">녹음</span>
        </button>
      </div>
    </div>
  );
}
