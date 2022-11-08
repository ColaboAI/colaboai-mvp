import 'react-image-crop/dist/ReactCrop.css';
import { RouteComponentProps } from 'react-router-dom';
import { useProfile, useMyProfile } from '../hook';

// TODO: Profile/me 랑 일반 유저로 변경하기

interface MatchParams {
  id: string;
}

export interface Props extends RouteComponentProps<MatchParams> {}

export default function ProfilePage(props: Props) {
  const { form, photo, instrumentResponse } = useMyProfile(props);

  return (
    <div data-testid="ProfilePage" className="page-container">
      <div className="page-child">
        <h3 className="text-lg font-medium leading-6 text-gray-900 text-center">
          🤗 Profile 🤗
        </h3>
        <div className="profile-grid gap-2">
          <div className="px-4 py-2 font-semibold">📌 Name</div>
          <div className="px-4 py-2">{form.username}</div>

          <div className="px-4 py-2 font-semibold">📌 Bio</div>
          <div className="px-4 py-2">{form.description}</div>

          <div className="px-4 py-2 font-semibold">📌 Instruments</div>
          <div className="flex flex-wrap py-2">
            {instrumentResponse.data &&
              instrumentResponse.data.map((item, _) => (
                <div
                  key={`${item.name}_checkbox`}
                  data-testid={`check${item.name}`}
                  className="flex flex-row items-center px-4"
                >
                  <div> {item.name} </div>
                </div>
              ))}
          </div>

          <div className="px-4 py-2 font-semibold">📷 Photo </div>
          <div>
            <div className="shrink-0">
              <img
                className="h-16 w-16 object-cover"
                src={photo}
                alt="Current profile"
              />
            </div>
          </div>
        </div>

        <div className="w-full pt-4 flex flex-col items-center">
          <div className="mt-1 text-sm text-gray-600">
            If you're ready,please submit your changes !
          </div>
        </div>
      </div>
    </div>
  );
}
