import { MainState } from 'app/containers/MainPage/slice';
import { SearchResultState } from 'app/containers/SearchResultPage/slice';
import { CreateCoverState } from 'app/containers/CreateCoverPage/slice';
import { SignInState } from 'app/containers/SignInPage/slice';
import { CreateSongState } from 'app/containers/CreateSongPage/slice';
import { SongState } from 'app/containers/SongPage/slice';
import { MakeCombinationState } from 'app/containers/SongPage/slice/makeCombination';
import { WrapperState } from 'app/wrapper/slice';
import { CoverState } from 'app/containers/CoverPage/slice';
import { SignUpState } from 'app/containers/SignUpPage/slice';
import { CoverEditState } from 'app/containers/CoverEditPage/slice';
import { ProfileState } from 'app/containers/MyProfilePage/slice';
// import { CreateCover } from '../utils/urls';
// [IMPORT NEW CONTAINERSTATE ABOVE] < Needed for generating containers seamlessly

/* 
  Because the redux-injectors injects your reducers asynchronously somewhere in your code
  You have to declare them here manually
*/
export interface RootState {
  main?: MainState;
  searchResult?: SearchResultState;
  createCover?: CreateCoverState;
  createSong?: CreateSongState;
  song?: SongState;
  makeCombination?: MakeCombinationState;
  wrapper?: WrapperState;
  cover?: CoverState;
  signin?: SignInState;
  signup?: SignUpState;
  coverEdit?: CoverEditState;
  profile?: ProfileState;
  // [INSERT NEW REDUCER KEY ABOVE] < Needed for generating containers seamlessly
}
