import { useCallback } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { RouteComponentProps } from 'react-router-dom';
import { useCropImage, useProfile } from './hook';

// TODO: Profile/me 랑 일반 유저로 변경하기

interface MatchParams {
  id: string;
}

export interface Props extends RouteComponentProps<MatchParams> {}

export default function ProfilePage(props: Props) {
  const {
    onChangeForm,
    onSaveClick,
    form,
    photo,
    instrumentResponse,
    checkList,
    setCheckList,
  } = useProfile(props);
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

  function onEditBioClick(_event: any) {
    let description = prompt('Edit your Bio', form.description);
    if (description != null) {
      onChangeForm('description', description);
    }
  }

  function onEditNameClick(_event: any) {
    let username = prompt('Edit your Name', form.username);
    if (username != null) {
      onChangeForm('username', username);
    }
  }

  function onChooseInstruments(_event: any) {
    alert('Your instruments have been saved !');
    onChangeForm('instruments', checkList);
  }

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
        setCheckList([...checkList, key]);
      } else {
        checkList.forEach((item, index) => {
          if (item === key) checkList.splice(index, 1);
        });
        setCheckList([...checkList]);
      }
    },
    [checkList, setCheckList],
  );

  return (
    <div data-testid="ProfilePage" className="page-container">
      <div className="page-child">
        <h3 className="text-lg font-medium leading-6 text-gray-900 text-center">
          🤗 Upload Your Profile 🤗
        </h3>
        <p className="mt-1 text-sm text-gray-600 text-center">
          Upload your profile to meet more musicians!
        </p>
        <div className="profile-grid gap-2">
          <div className="px-4 py-2 font-semibold">📌 Name</div>
          <div className="px-4 py-2">{form.username}</div>
          <button
            data-testid="editnameButton"
            className="small-button"
            onClick={onEditNameClick}
          >
            Edit Your Name !
          </button>
          <div className="px-4 py-2 font-semibold">📌 Bio</div>
          <div className="px-4 py-2">{form.description}</div>
          <button
            data-testid="editBioButton"
            className="small-button"
            onClick={onEditBioClick}
          >
            Edit your Bio !
          </button>
          <div className="px-4 py-2 font-semibold">📌 Instruments</div>
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
          <button
            data-testid="chooseInstrument"
            className="px-4 py-2 small-button align-middle"
            onClick={onChooseInstruments}
          >
            연습 중이신 악기를 선택해주세요.
          </button>
          <div className="px-4 py-2 font-semibold">📷 Photo </div>
          <div>
            {!!croppedImg ? (
              <button
                data-testid="editprofileButton"
                className="small-button"
                onClick={onEditPictureClick}
              >
                Edit Profile Picture !
              </button>
            ) : (
              <div className="shrink-0">
                <img
                  className="h-16 w-16 object-cover"
                  src={photo}
                  alt="Current profile"
                />
              </div>
            )}
          </div>
          <div className="small-button align-middle">
            <label className="block">
              <span className="sr-only">Choose profile photo</span>
              <input
                id="profile-image-upload"
                type="file"
                data-testid="uploadFile"
                className="cursor-pointer block w-full text-sm text-slate-500
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

        {!!upImg ? (
          <div data-testid="reactCrop" className="flex flex-row">
            <ReactCrop
              src={upImg}
              onImageLoaded={onLoad}
              crop={crop}
              onChange={c => setCrop(c)}
              onComplete={c => onCompleteCrop(c)}
            />
            <canvas
              ref={previewCanvasRef}
              style={{
                width: Math.round(completedCrop?.width ?? 0),
                height: Math.round(completedCrop?.height ?? 0),
              }}
            />
          </div>
        ) : null}

        <div className="w-full pt-4 flex flex-col items-center">
          <div className="mt-1 text-sm text-gray-600">
            If you're ready,please submit your changes !
          </div>
          <button
            id="editnameButton"
            className="small-button"
            onClick={onSaveClick}
          >
            ❗ Submit your Change ❗
          </button>
        </div>
      </div>
    </div>
  );
}
