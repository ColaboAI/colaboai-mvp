import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Main } from 'utils/urls';
import { signInActions, useSignInSlice } from './slice';
import * as apiActions from 'api/actions';
import { selectSignIn } from './slice/selectors';
export type Props = {};

export default function SignInPage(props: Props) {
  const dispatch = useDispatch();
  useSignInSlice();
  const signInState = useSelector(selectSignIn);

  const history = useHistory();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const onSigninClicked = () => {
    if (!email) {
      alert('Please enter email');
    } else if (!password) {
      alert('Please enter password');
    } else if (signInState.signInResponse.loading) {
      alert('Still loading');
    } else {
      dispatch(apiActions.signin.request({ email, password }));
    }
  };

  useEffect(() => {
    if (!signInState.signInResponse.loading) {
      if (signInState.signInResponse.data) {
        dispatch(signInActions.clearSignInResponse());
        history.push(Main()); // TODO : testing
      }
      if (signInState.signInResponse.error) {
        alert('No User Info Received!');
        dispatch(signInActions.clearSignInResponse());
      }
    }
  });

  return (
    <div data-testid="SignInPage" className="align-middle h-full">
      <div className="flex h-full">
        <div className="w-full max-w-md m-auto bg-white rounded-lg border border-primaryBorder shadow-xl shadow-gray-200  py-10 px-16">
          <h1 className="text-2xl font-medium text-primary mt-4 mb-12 text-center">
            로그인 🔐
          </h1>
          <div>
            <label htmlFor="email">이메일</label>
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
            <label htmlFor="password">비밀번호</label>
            <input
              data-testid="input-password"
              type="password"
              className={`w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
              id="password"
              name="password"
              placeholder="비밀번호를 입력하세요."
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <div>
            <button
              data-testid="SigninButton"
              className="w-full p-4 bg-indigo-500 text-gray-100  rounded-full 
                font-semibold font-display focus:outline-none focus:shadow-outline hover:bg-indigo-600 shadow-lg"
              onClick={onSigninClicked}
            >
              로그인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
