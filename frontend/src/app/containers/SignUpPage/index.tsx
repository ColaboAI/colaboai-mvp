import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Main } from 'utils/urls';
import { useUserSlice } from './slice';

export type Props = {
  email: string;
  password: string;
};

export default function SignUpPage(props: Props) {
  const dispatch = useDispatch();
  const { actions } = useUserSlice();

  const history = useHistory();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const onSigninClicked = () => {
    if (!email) {
      alert('Please enter email');
    } else if (!password) {
      alert('Please enter password');
    } else {
      history.push(Main());
      //dispatch(actions.signup({ email, password }));
    }
  };

  return (
    <div data-testid="SignUpPage">
      <br></br>
      <br></br>
      <br></br>
      <div className="flex bg-gray-bg1">
        <div className="w-full max-w-md m-auto bg-white rounded-lg border border-primaryBorder shadow-default py-10 px-16">
          <h1 className="text-2xl font-medium text-primary mt-4 mb-12 text-center">
            Sign Up 🔐
          </h1>
          <div>
            <label htmlFor="email">Email</label>
            <input
              data-testid="input-email"
              type="email"
              className={`w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
              id="email"
              name="email"
              placeholder="Your Email"
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              data-testid="input-password"
              type="password"
              className={`w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
              id="password"
              name="password"
              placeholder="Your Password"
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="button"></label>
            <button
              data-testid="SignupButton"
              type="submit"
              className="w-full p-4 bg-indigo-500 text-gray-100  rounded-full 
                  font-semibold font-display focus:outline-none focus:shadow-outline hover:bg-indigo-600 shadow-lg"
              onClick={onSigninClicked}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
