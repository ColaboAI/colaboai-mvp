import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Main } from 'utils/urls';
import { signUpActions, useSignUpSlice } from './slice';
import * as apiActions from 'api/actions';
import { selectSignUp } from './slice/selectors';
import toast from 'react-hot-toast';

export type Props = {};

export default function SignUpPage(props: Props) {
  const dispatch = useDispatch();
  useSignUpSlice();
  const signUpState = useSelector(selectSignUp);

  const history = useHistory();
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password1, setPassword1] = useState<string>('');
  const [password2, setPassword2] = useState<string>('');
  const [checkboxValue, setCheckboxValue] = useState({
    tos: false,
    privacy: false,
    marketing: false,
  });
  const [error, setError] = useState({
    username: [],
    email: [],
    password1: [],
    password2: [],
  });
  const onCheckboxChecked = useCallback(
    (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
      const { name, checked } = e.currentTarget;
      if (name === 'tos') {
        setCheckboxValue({ ...checkboxValue, tos: checked });
      }
      if (name === 'privacy') {
        setCheckboxValue({ ...checkboxValue, privacy: checked });
      }
      if (name === 'marketing') {
        setCheckboxValue({ ...checkboxValue, marketing: checked });
      }
    },
    [checkboxValue],
  );

  // TODO: add validation w/ react-hook-form -> 유저 이름
  const onSignUpClicked = () => {
    if (!email) {
      toast.error('이메일을 입력해주세요.');
    } else if (!password1 || !password2) {
      toast.error('비밀번호를 입력해주세요.');
    } else if (!username) {
      toast.error('유저 이름을 입력해주세요.');
    } else if (password1 !== password2) {
      toast.error('비밀번호와 확인 비밀번호가 일치하지 않습니다.');
    } else if (signUpState.signUpResponse.loading) {
      alert('Still loading');
    } else {
      dispatch(
        apiActions.signup.request({
          username,
          email,
          password1,
          password2,
          tosAgreement: checkboxValue.tos,
          privacyAgreement: checkboxValue.privacy,
          marketingAgreement: checkboxValue.marketing,
        }),
      );
    }
  };

  useEffect(() => {
    if (!signUpState.signUpResponse.loading) {
      if (signUpState.signUpResponse.data) {
        dispatch(signUpActions.clearSignUpResponse());
        history.push(Main());
      }
      if (signUpState.signUpResponse.error) {
        toast.error('회원가입에 실패했습니다. 다시 시도해주세요.');
        setError({ ...signUpState.signUpResponse.error });
        dispatch(signUpActions.clearSignUpResponse());
      }
    }
  });

  return (
    <div data-testid="SignUpPage" className="align-middle h-full">
      <div className="flex h-full">
        <div className="w-full max-w-md m-auto bg-white rounded-lg border border-primaryBorder shadow-default py-10 px-16">
          <h1 className="text-2xl font-medium text-primary mt-4 mb-12 text-center">
            회원가입 🔐
          </h1>
          <div className="mb-4">
            <label htmlFor="username">닉네임</label>
            <input
              data-testid="input-username"
              type="text"
              className="input-form"
              id="username"
              name="username"
              placeholder="닉네임을 입력해주세요."
              onChange={e => setUsername(e.target.value)}
            />
            {!!error.username &&
              error.username.map((err, index) => (
                <span
                  className="error-text"
                  key={`username-error-msg-${index}`}
                >
                  * {err}
                </span>
              ))}
          </div>
          <div className="mb-4">
            <label htmlFor="email">Email</label>
            <input
              data-testid="input-email"
              type="email"
              className="input-form"
              id="email"
              name="email"
              placeholder="example@example.com"
              onChange={e => setEmail(e.target.value)}
            />
            {!!error.email &&
              error.email.map((err, index) => (
                <p className="error-text" key={`email-error-msg-${index}`}>
                  * {err}
                </p>
              ))}
          </div>
          <div className="mb-4">
            <label htmlFor="password1">비밀번호</label>
            <input
              data-testid="input-password1"
              type="password"
              className="input-form"
              id="password1"
              name="password1"
              placeholder="비밀번호"
              onChange={e => setPassword1(e.target.value)}
            />
            {!!error.password1 &&
              error.password1.map((err, index) => (
                <p className="error-text" key={`pw1-error-msg-${index}`}>
                  * {err}
                </p>
              ))}
          </div>

          <div className="mb-4">
            <label htmlFor="password2">확인 비밀번호</label>
            <input
              data-testid="input-password2"
              type="password"
              className="input-form"
              id="password2"
              name="password2"
              placeholder="확인 비밀번호"
              onChange={e => setPassword2(e.target.value)}
            />
            {!!error.password2 &&
              error.password2.map((err, index) => (
                <p className="error-text" key={`pw2-error-msg-${index}`}>
                  * {err}
                </p>
              ))}
          </div>

          <div>
            <input
              type="checkbox"
              id="tos"
              name="tos"
              className="mr-2 mb-2"
              onClick={onCheckboxChecked}
            />
            <label htmlFor="tos">
              (필수){' '}
              <span
                onClick={e => {
                  e.preventDefault();
                  window.open(
                    'https://colaboai.notion.site/a529a76231114e11a5e70d22b1693271',
                    '_blank',
                  );
                }}
                className="text-blue-600 dark:text-blue-500 hover:underline cursor-pointer"
              >
                이용약관
              </span>
              에 동의합니다.
            </label>
          </div>

          <div>
            <input
              type="checkbox"
              id="privacy"
              name="privacy"
              className="mr-2 mb-2"
              onClick={onCheckboxChecked}
            />
            <label htmlFor="privacy">
              (필수){' '}
              <span
                onClick={e => {
                  e.preventDefault();
                  window.open(
                    'https://colaboai.notion.site/5fd5a0163a524044bf7fc0ab2cceab09',
                    '_blank',
                  );
                }}
                className="text-blue-600 dark:text-blue-500 hover:underline cursor-pointer"
              >
                개인정보처리방침
              </span>
              에 동의합니다.
            </label>
          </div>
          <div>
            <input
              type="checkbox"
              id="marketing"
              name="marketing"
              className="mr-2 mb-2"
              onClick={onCheckboxChecked}
            />
            <label htmlFor="marketing">
              (선택) 마케팅 정보 수신에 동의합니다.
            </label>
          </div>

          <div className="mt-4">
            <label htmlFor="button"></label>
            <button
              data-testid="SignupButton"
              type="submit"
              className="w-full p-4 bg-indigo-500 text-gray-100  rounded-full 
                  font-semibold font-display focus:outline-none focus:shadow-outline hover:bg-indigo-600 shadow-lg disabled:bg-neutral-500"
              onClick={onSignUpClicked}
              disabled={
                signUpState.signUpResponse.loading ||
                !email ||
                !password1 ||
                !password2 ||
                !username ||
                !checkboxValue.privacy ||
                !checkboxValue.tos
              }
            >
              회원가입
            </button>
          </div>
          <div className="w-full p-4 text-center">
            이미 colaboAI 회원이신가요?{' '}
            <a className=" text-blue-700" href="/signin">
              로그인
            </a>
            하세요.
          </div>
        </div>
      </div>
    </div>
  );
}
