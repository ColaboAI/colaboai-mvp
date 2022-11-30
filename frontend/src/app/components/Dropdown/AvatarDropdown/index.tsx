import React from 'react';
import { Menu, Transition } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useMediaQuery } from 'react-responsive';

export interface Props {
  userInfo: UserInfo | undefined;
  onLogoClicked: () => void;
  onSignOutClicked: () => void;
  onProfileClicked: () => void;
  onCommunityClicked: () => void;
}

export default function AvatarDropdown(props: Props) {
  const welcomeText = ' 님 반가워요!';
  const homeText = '홈';
  const profileText = '나의 프로필';
  const communityText = '커뮤니티';
  const signOutText = '로그아웃';

  const styles = {
    welcome:
      'group flex w-full items-center py-2 px-2 justify-center text-sm font-semibold whitespace-nowrap text-gray-700 border-b-2 ',
    button:
      'group flex w-full items-center py-2 px-2 justify-center border-transparent text-sm font-semibold whitespace-nowrap text-gray-700 hover:bg-indigo-400 hover:text-white',
  };

  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center border-transparent px-4 py-2">
          {props.userInfo?.photo !== null ? (
            <div>
              <img
                id="avatarDropdwonButton"
                src={props.userInfo?.photo}
                alt="User Avatar"
                className="w-8 h-8 rounded-full border cursor-pointer"
              />
            </div>
          ) : (
            <div>
              <FontAwesomeIcon
                id="avatarDropdwonButton"
                icon={faUser}
                size="lg"
              />
            </div>
          )}
        </Menu.Button>
      </div>
      <Transition
        as={React.Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 sm:w-56 mt-2 origin-top-right divide-y bg-white divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-1 py-1">
            <Menu.Item>
              <button id="profile_button" className={styles.welcome}>
                {props.userInfo?.username + welcomeText}
              </button>
            </Menu.Item>
            {isMobile ? (
              <Menu.Item>
                <button
                  id="home_button"
                  className={styles.button}
                  onClick={props.onLogoClicked}
                >
                  {homeText}
                </button>
              </Menu.Item>
            ) : null}
            <Menu.Item>
              <button
                id="profile_button"
                onClick={props.onProfileClicked}
                className={styles.button}
              >
                {profileText}
              </button>
            </Menu.Item>
            <Menu.Item>
              <button
                id="community_button"
                onClick={props.onCommunityClicked}
                className={styles.button}
              >
                {communityText}
              </button>
            </Menu.Item>
            <Menu.Item>
              <button
                id="signout_button"
                onClick={props.onSignOutClicked}
                className={styles.button}
              >
                {signOutText}
              </button>
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
