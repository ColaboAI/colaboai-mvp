import 'react-image-crop/dist/ReactCrop.css';
import { RouteComponentProps } from 'react-router-dom';
import { useProfile } from '../hook';

// TODO: Profile/me 랑 일반 유저로 변경하기

interface MatchParams {
  id: string;
}

export interface Props extends RouteComponentProps<MatchParams> {}

export default function ProfilePage(props: Props) {
  const { form } = useProfile(props);
  const styles = {
    label: 'block text-sm font-medium text-gray-700',
    text: 'mt-2 px-4 sm:text-sm rounded-md',
    tag: 'text-sm font-medium',
  };

  return (
    <div data-testid="ProfilePage" className="page-container">
      <div className="page-child">
        <h3 className="text-lg font-medium leading-6 text-gray-900 text-center    mb-3">
          @{form.username} 님의 프로필
        </h3>
        <div className="gap-2">
          <form className="x-4 py-5 bg-white sm:p-6 shadow border overflow-hidden sm:rounded-md">
            <div className="space-y-6 sm:space-y-3">
              <div className="px-4 py-2 font-semibold">프로필 사진</div>
              <div className="flex justify-between items-center">
                <div className="flex justify-center">
                  <div className="ml-4 md:shrink-0  xs:w-24 xs:h-24 md:w-32 md:h-32 lg:w-48 lg:h-48  min-w-fit">
                    <img
                      className="object-cover"
                      src={form.photo}
                      alt="Current profile"
                    />
                  </div>
                </div>
              </div>
              <div className="">
                <div className="px-4 py-2 font-semibold">닉네임</div>
                <div id="username" className={styles.text}>
                  {form.username}
                </div>
              </div>
              <div>
                <div className="px-4 py-2 font-semibold">자기소개</div>
                <div id="description" className={styles.text}>
                  {form.description}
                </div>
              </div>
              <div>
                <div className="px-4 py-2 font-semibold">선호하는 악기</div>
                <div className="flex flex-wrap py-2">
                  {form.instruments &&
                    form.instruments.map((item, _) => (
                      <div
                        key={`${item.name}_checkbox`}
                        data-testid={`check${item.name}`}
                        className="flex flex-row items-center px-4"
                      >
                        <div> {item.name} </div>
                      </div>
                    ))}
                </div>
              </div>
              <div className="px-4 py-2 font-semibold">
                팔로잉 {form.following} 명
              </div>
              <div className="px-4 py-2 font-semibold">
                팔로워 {form.follower} 명
              </div>
            </div>
          </form>
        </div>

        {/* TODO: 팔로우 버튼 생성 */}
      </div>
    </div>
  );
}
