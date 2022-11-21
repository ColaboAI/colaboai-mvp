import Search from 'app/components/Search';
import * as React from 'react';
import { ReactComponent as Logo } from 'res/logo.svg';

interface Props {
  accessToken?: string | null;
  onSearchClicked?: (key: string) => void;
  onSignInClicked: () => void;
  onSignUpClicked: () => void;
  onSignOutClicked: () => void;
  onProfileClicked: () => void;
  onLogoClicked: () => void;
  onCommunityClicked: () => void;
}

export default function Header(props: Props) {
  const signInText = '로그인';
  const signUpText = '회원가입';
  const signOutText = '로그아웃';
  const profileText = '나의 프로필';
  const communityText = '커뮤니티';

  const styles = {
    button:
      'mx-1 py-1 px-2 justify-center border-transparent rounded-lg text-sm font-medium whitespace-nowrap text-white bg-blue-800 hover:bg-blue-900',
  };

  return (
    <div
      data-testid="Header"
      className="absolute top-0 left-0 w-full z-50 flex items-center justify-between h-12 px-4 bg-gray-100"
    >
      <button
        id="logo_button"
        onClick={props.onLogoClicked}
        className="sr-only sm:not-sr-only flex-none sm:mx-4 justify-start"
      >
        <Logo />
      </button>
      <div className="flex-auto mx-4 max-w-lg">
        <Search onSearchClicked={props.onSearchClicked} />
      </div>
      {props.accessToken ? (
        /* when logged in  */
        <div className="flex-none">
          <button
            id="signout_button"
            onClick={props.onSignOutClicked}
            className={styles.button}
          >
            {signOutText}
          </button>
          <button
            id="profile_button"
            onClick={props.onProfileClicked}
            className={styles.button}
          >
            {profileText}
          </button>
          <button
            id="community_button"
            onClick={props.onCommunityClicked}
            className={styles.button}
          >
            {communityText}
          </button>
        </div>
      ) : (
        /* when not logged in  */
        <div className="flex-none">
          <button
            id="signin_button"
            onClick={props.onSignInClicked}
            className={styles.button}
          >
            {signInText}
          </button>
          <button
            id="signup_button"
            onClick={props.onSignUpClicked}
            className={styles.button}
          >
            {signUpText}
          </button>
          <button
            id="community_button"
            onClick={props.onCommunityClicked}
            className={styles.button}
          >
            {communityText}
          </button>
        </div>
      )}
    </div>
  );
}
