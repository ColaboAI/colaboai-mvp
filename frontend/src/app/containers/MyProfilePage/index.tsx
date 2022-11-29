import { useCallback } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { RouteComponentProps } from 'react-router-dom';
import { useCropImage, useMyProfile } from './hook';

// TODO: Profile/me 랑 일반 유저로 변경하기

interface MatchParams {
  id: string;
}

export interface Props extends RouteComponentProps<MatchParams> {}

export default function MyProfilePage(props: Props) {
  const {
    onChangeForm,
    onSaveClick,
    form,
    photo,
    instrumentResponse,
    checkList,
    setCheckList,
  } = useMyProfile();
  const {
    onSelectFile,
    upImg,
    setUpImg,
    croppedImg,
    setCroppedImg,
    onLoad,
    crop,
    setCrop,
    completedCrop,
    onCompleteCrop,
    previewCanvasRef,
  } = useCropImage();

  function onEditPictureClick(_event: any) {
    _event.preventDefault();
    onChangeForm('photo', croppedImg);
    setCroppedImg(null);
    setUpImg(null);
  }

  const handelCheckInstrument = useCallback(
    (key: number) => {
      const index = checkList.indexOf(key);
      if (index === -1) {
        const newCheckList = [...checkList, key];
        setCheckList(newCheckList);
        onChangeForm('instruments', newCheckList);
      } else {
        checkList.forEach((item, index) => {
          if (item === key) checkList.splice(index, 1);
        });
        setCheckList([...checkList]);
        onChangeForm('instruments', [...checkList]);
      }
    },
    [checkList, onChangeForm, setCheckList],
  );
  const styles = {
    label: 'block text-sm font-medium text-gray-700',
    input:
      'mt-2 px-4 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md',
    tag: 'text-sm font-medium',
  };

  return (
    <div data-testid="ProfilePage" className="page-container">
      <div className="page-child">
        <h3 className="text-lg font-medium leading-6 text-gray-900 text-center mb-4">
          🤗 나의 프로필 🤗
        </h3>
        <p className="text-sm text-gray-600 text-center mb-8">
          더욱 많은 사람들과 음악을 나누고 싶다면 프로필을 작성해주세요!
        </p>
        <div className="gap-2">
          <form className="x-4 py-5 bg-white sm:p-6 shadow border overflow-hidden sm:rounded-md">
            <div className="space-y-6 sm:space-y-3">
              <div className="px-4 py-2 font-semibold">프로필 사진</div>
              <div className="flex justify-between items-center">
                <div className="flex justify-center">
                  <div className="md:shrink-0  xs:w-24 xs:h-24 md:w-32 md:h-32 lg:w-48 lg:h-48  min-w-fit">
                    <img
                      className="object-cover"
                      src={photo}
                      alt="Current profile"
                    />
                  </div>
                </div>
                <div className="small-button  max-h-16 justify-center m-4 w-1/3 min-w-min md:shrink-2">
                  <label>
                    <span className="sr-only">Choose profile photo</span>
                    <input
                      id="profile-image-upload"
                      type="file"
                      data-testid="uploadFile"
                      className="cursor-pointer border-none block w-full text-sm text-slate-500 
                              file:border-none
                              file:mr-4 file:py-2 file:px-4
                              file:rounded-full file:border-0
                              file:text-sm file:font-semibold
                            file:bg-blue-50 file:text-slate-700
                            hover:file:bg-blue-100"
                      accept="image/*"
                      onChange={onSelectFile}
                    />
                  </label>
                </div>
              </div>
              <div className="">
                <label className="px-4 py-2 font-semibold">닉네임</label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  className={styles.input}
                  value={form.username}
                  onChange={e => onChangeForm('username', e.target.value)}
                />
              </div>
              <div>
                <label className="px-4 py-2 font-semibold">자기소개</label>
                <input
                  type="text"
                  name="description"
                  id="description"
                  className={styles.input}
                  value={form.description}
                  onChange={e => onChangeForm('description', e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="instrument" className="px-4 py-2 font-semibold">
                  선호하는 악기
                </label>
                <div className="flex flex-wrap py-2">
                  {instrumentResponse.data &&
                    instrumentResponse.data.map((item, _) => (
                      <div
                        key={`${item.name}_checkbox`}
                        data-testid={`check${item.name}`}
                        className="flex flex-row items-center px-4"
                        onClick={() => handelCheckInstrument(item.id)}
                      >
                        <input
                          type="checkbox"
                          className="form-checkbox mr-2"
                          checked={checkList.includes(item.id)}
                          readOnly
                        />
                        <div> {item.name} </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </form>
        </div>

        {!!upImg ? (
          <div data-testid="reactCrop" className="flex-col">
            <div className="px-4 py-2 font-semibold"> 원본 사진 </div>
            <ReactCrop
              src={upImg}
              onImageLoaded={onLoad}
              crop={crop}
              onChange={c => setCrop(c)}
              onComplete={c => onCompleteCrop(c)}
            />
            <div className="px-4 py-2 font-semibold"> 새로운 사진 </div>
            <canvas
              ref={previewCanvasRef}
              style={{
                objectFit: 'contain',
                width: Math.round(completedCrop?.width ?? 0),
                height: Math.round(completedCrop?.height ?? 0),
              }}
            />
            {!!croppedImg ? (
              <button
                data-testid="editprofileButton"
                className="small-button mt-4"
                onClick={onEditPictureClick}
              >
                새로운 사진 사용
              </button>
            ) : null}
          </div>
        ) : null}

        <div className="w-full pt-4 flex flex-col items-center">
          <div className="mt-1 text-sm text-gray-600">
            작성을 완료하셨다면, 아래의 버튼을 눌러주세요!
          </div>
          <button
            id="editnameButton"
            className="small-button"
            onClick={onSaveClick}
          >
            ❗ 제출하기 ❗
          </button>
        </div>
      </div>
    </div>
  );
}
