import { Provider } from 'react-redux';
import { Switch, Route, Redirect, BrowserRouter } from 'react-router-dom';
import { screen, render, waitFor } from '@testing-library/react';
import { configureAppStore } from 'store/configureStore';
import ProfilePage from '.';
import { dummyUser } from 'api/dummy';
import * as urls from 'utils/urls';
import { api } from 'api/band';
import { RootState } from '../../../../utils/types';

window.alert = jest.fn();

const mockHistoryPush = jest.fn();
const mockHistoryReplace = jest.fn();

const stubState = {
  wrapper: {
    name: 'wrapper',
    user: dummyUser[0],
    auth: { loading: false },
  },
};

api.getUserInfo = jest.fn();
api.postUserInfo = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
    replace: mockHistoryReplace,
  }),
}));

const spySelectWrapper = jest.spyOn(
  require('app/wrapper/slice/selectors'),
  'selectWrapper',
);

beforeEach(() => {
  jest.clearAllMocks();
  (api.getUserInfo as jest.Mock).mockImplementation(
    (userId: number) =>
      new Promise((res, rej) => {
        res(dummyUser[userId]);
      }),
  );
  (api.postUserInfo as jest.Mock).mockImplementation(
    (form: UserPostForm) =>
      new Promise((res, rej) => {
        res({
          data: {
            ...dummyUser[form.id],
            ...form,
          },
        });
      }),
  );
});

function setup(state: RootState) {
  spySelectWrapper.mockReturnValue(state?.wrapper);
  const store = configureAppStore();
  const page = (
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route exact path={urls.Profile(':id')} component={ProfilePage} />
          <Redirect exact from="/" to={urls.Profile(1)} />
          <Route component={() => <div />} />
        </Switch>
      </BrowserRouter>
    </Provider>
  );
  return { page };
}

it('should render', () => {
  const { page } = setup(stubState);
  render(page);
  expect(screen.getByTestId('ProfilePage')).toBeTruthy();
});

it('error on load cover', async () => {
  const { page } = setup(stubState);
  (api.getUserInfo as jest.Mock).mockRejectedValueOnce('ERROR');
  render(page);

  await waitFor(() => expect(mockHistoryReplace).toBeCalledTimes(1));
  expect(window.alert).toHaveBeenCalled();
  expect(mockHistoryReplace).toHaveBeenLastCalledWith(urls.Main());
});
