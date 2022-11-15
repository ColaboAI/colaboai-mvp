import React, { useState, useEffect } from 'react';
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
        apiActions.signup.request({ username, email, password1, password2 }),
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
        alert('SignUp Failed!');
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
          <div>
            <label htmlFor="username">닉네임</label>
            <input
              data-testid="input-username"
              type="text"
              className={`w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
              id="username"
              name="username"
              placeholder="닉네임을 입력해주세요."
              onChange={e => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              data-testid="input-email"
              type="email"
              className={`w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
              id="email"
              name="email"
              placeholder="example@example.com"
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password1">비밀번호</label>
            <input
              data-testid="input-password1"
              type="password"
              className={`w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
              id="password1"
              name="password1"
              placeholder="비밀번호"
              onChange={e => setPassword1(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password2">확인 비밀번호</label>
            <input
              data-testid="input-password2"
              type="password"
              className={`w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
              id="password2"
              name="password2"
              placeholder="확인 비밀번호"
              onChange={e => setPassword2(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="button"></label>
            <button
              data-testid="SignupButton"
              type="submit"
              className="w-full p-4 bg-indigo-500 text-gray-100  rounded-full 
                  font-semibold font-display focus:outline-none focus:shadow-outline hover:bg-indigo-600 shadow-lg"
              onClick={onSignUpClicked}
              disabled={
                signUpState.signUpResponse.loading ||
                !email ||
                !password1 ||
                !password2 ||
                !username
              }
            >
              회원가입
            </button>
          </div>
          <div className="w-full p-4  text-center">
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
