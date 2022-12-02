import Search from 'app/components/Search';
import * as React from 'react';
import { ReactComponent as Logo } from 'res/logo.svg';
import AvatarDropdwon from 'app/components/Dropdown/AvatarDropdown';

interface Props {
  userInfo: UserInfo | undefined;
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

  const styles = {
    button:
      'mx-1 py-1 px-4 w-full justify-center border-transparent rounded-full text-sm font-semibold whitespace-nowrap text-white bg-indigo-500 hover:bg-indigo-600',
  };
  return (
    <div
      data-testid="Header"
      className="absolute top-0 left-0 w-full z-50 flex items-center sm:justify-between xs:justify-around h-12 px-4 bg-gray-100"
    >
      <button
        id="logo_button"
        onClick={props.onLogoClicked}
        className="flex-none sr-only sm:not-sr-only xs:mx-4 justify-start"
      >
        <Logo />
      </button>
      <div className="flex-auto sr-only xs:not-sr-only xs:mx-4 max-w-lg">
        <Search onSearchClicked={props.onSearchClicked} />
      </div>
      {props.accessToken && props.userInfo ? (
        /* when logged in  */
        <div className="flex-none">
          <div>
            <AvatarDropdwon
              userInfo={props.userInfo}
              onLogoClicked={props.onLogoClicked}
              onCommunityClicked={props.onCommunityClicked}
              onProfileClicked={props.onProfileClicked}
              onSignOutClicked={props.onSignOutClicked}
            />
          </div>
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
        </div>
      )}
    </div>
  );
}
