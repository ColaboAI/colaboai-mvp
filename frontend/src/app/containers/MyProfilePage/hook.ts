import { useEffect, useCallback, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { profileActions, useProfileSlice } from './slice';
import * as apiActions from 'api/actions';
import { selectProfile } from './slice/selectors';
import { selectWrapper } from 'app/wrapper/slice/selectors';
import * as urls from 'utils/urls';
import { Props } from '.';
import { Crop } from 'react-image-crop';
import toast from 'react-hot-toast';

const loading = 'Loading';
const initForm: UserPostForm = {
  id: -1,
  username: loading,
  description: loading,
  photo: '',
  instruments: [],
};

const initUser: User = {
  id: -1,
  username: 'Your ID',
  description: 'Your Description',
  photo: '',
  instruments: [],
  follower: 0,
  following: 0,
};

export const useMyProfile = () => {
  useProfileSlice();
  const wrapperState = useSelector(selectWrapper);
  const pageState = useSelector(selectProfile);
  const history = useHistory();
  const dispatch = useDispatch();

  const profileResponse = pageState.profileResponse;
  const postProfileResponse = pageState.postProfileResponse;
  const instrumentResponse = pageState.instrumentsResponse;

  const [form, setForm] = useState<UserPostForm>({
    ...initForm,
  });
  const [checkList, setCheckList] = useState<number[]>(form.instruments || []);

  const [photo, setPhoto] = useState<string>('');

  // handle initial state
  useEffect(() => {
    dispatch(apiActions.loadInstruments.request());
    dispatch(apiActions.loadMyProfile.request());

    return () => {
      dispatch(profileActions.clearRedux());
    };
  }, [dispatch]);

  useEffect(() => {
    if (wrapperState.accessToken) {
      if (profileResponse.error) {
        toast.error(profileResponse.error);
      } else if (profileResponse.data) {
        const user = profileResponse.data;
        setForm({
          id: user.id,
          username: user.username,
          description: user.description,
          // photo: user.photo,
          instruments: user.instruments.map(instrument => instrument.id),
        });
        setPhoto(user.photo);
        setCheckList(user.instruments.map(instrument => instrument.id));
      }
    } else if (!profileResponse.loading) {
      dispatch(apiActions.loadMyProfile.request());
    }
  }, [
    dispatch,
    profileResponse.data,
    profileResponse.error,
    profileResponse.loading,
    wrapperState.accessToken,
  ]);

  // handle post response
  useEffect(() => {
    if (!postProfileResponse.loading) {
      if (postProfileResponse.error) {
        toast.error('저장에 실패하였습니다\n' + postProfileResponse.error);
      } else if (postProfileResponse.data) {
        toast.success('저장되었습니다.');
        history.replace(urls.Main());
      }
    }
  }, [history, postProfileResponse]);

  const onChangeForm = useCallback(
    (key: string, value: any) => {
      switch (key) {
        case 'description':
          setForm({ ...form, description: value });
          break;
        case 'username':
          setForm({ ...form, username: value });
          break;
        case 'instruments':
          setForm({ ...form, instruments: value });
          break;
        case 'photo':
          setPhoto(value);
          break;
      }
    },
    [form],
  );

  const onSaveClick = useCallback(() => {
    dispatch(apiActions.postProfile.request({ ...form, photo }));
  }, [dispatch, form, photo]);

  return {
    onChangeForm,
    onSaveClick,
    form,
    photo,
    instrumentResponse,
    checkList,
    setCheckList,
  };
};

export const useProfile = (props: Props) => {
  useProfileSlice();
  const wrapperState = useSelector(selectWrapper);
  const pageState = useSelector(selectProfile);
  const history = useHistory();
  const dispatch = useDispatch();

  const profileResponse = pageState.profileResponse;
  const instrumentResponse = pageState.instrumentsResponse;

  const [form, setForm] = useState<User>({
    ...initUser,
    id: Number(props.match.params.id),
  });
  // handle initial state
  useEffect(() => {
    dispatch(apiActions.loadInstruments.request());
    dispatch(apiActions.loadProfile.request(Number(props.match.params.id)));
    dispatch(apiActions.loadMyProfileInAuth.request());
    return () => {
      dispatch(profileActions.clearRedux());
    };
  }, [dispatch, props.match.params.id]);

  useEffect(() => {
    if (!profileResponse.loading) {
      if (profileResponse.error) {
        toast.error('프로필 정보를 불러오는데 실패했습니다.');
        history.replace(urls.Main());
      } else if (profileResponse.data) {
        const user = profileResponse.data;
        setForm({
          id: user.id,
          username: user.username,
          description: user.description,
          photo: user.photo,
          instruments: user.instruments,
          follower: user.follower,
          following: user.following,
        });
        // TODO: 프로필 수정 페이지로 표현?
        if (wrapperState.auth.data && user.id === wrapperState.auth.data.id) {
          history.replace(urls.Profile('me'));
        }
      }
    }
  }, [
    profileResponse,
    instrumentResponse,
    dispatch,
    history,
    props.match.params.id,
    wrapperState.user,
    wrapperState.auth.data,
  ]);

  return { form };
};

export const useCropImage = () => {
  /* Start of crop related functions, variables*/
  const [upImg, setUpImg] = useState(null as any);
  const imgRef = useRef(null as any);
  const previewCanvasRef = useRef(null as any);
  const [crop, setCrop] = useState({
    unit: '%',
    width: 30,
    aspect: 1,
  } as any);
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null);
  const [croppedImg, setCroppedImg] = useState<string | null>(null);

  const onSelectFile = useCallback((e: any) => {
    setUpImg(null);
    setCroppedImg(null);
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setUpImg(reader.result as any));
      reader.readAsDataURL(e.target.files[0]);
    }
  }, []);

  const onLoad = useCallback(img => {
    imgRef.current = img;
  }, []);

  const onCompleteCrop = useCallback((crop: Crop) => {
    if (!previewCanvasRef.current || !imgRef.current) return;
    const image = imgRef.current;
    const canvas = previewCanvasRef.current;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');
    const pixelRatio = window.devicePixelRatio;

    canvas.width = Math.floor(crop.width * pixelRatio * scaleX);
    canvas.height = Math.floor(crop.height * pixelRatio * scaleY);
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY,
    );

    canvas.toBlob(blob => {
      blob.name = 'croppedImg';
      setCroppedImg(URL.createObjectURL(blob));
    }, 'image/png');
    setCompletedCrop(crop);
    ctx.restore();
  }, []);

  return {
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
  };
};
