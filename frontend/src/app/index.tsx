/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import { Helmet } from 'react-helmet-async';
import { Switch, Route, Redirect, BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Wrapper from './wrapper';
import MainPage from './containers/MainPage';
import SignUpPage from './containers/SignUpPage';
import SignInPage from './containers/SignInPage';
import SearchResultPage from './containers/SearchResultPage';
import SongPage from './containers/SongPage';
import CreateSongPage from './containers/CreateSongPage';
import CoverPage from './containers/CoverPage';
import {
  CreateCoverInfo,
  CreateCoverRecord,
} from './containers/CreateCoverPage';
import ProfilePage from './containers/MyProfilePage/ProfilePage';
import CoverEditPage from './containers/CoverEditPage';
import MyProfilePage from './containers/MyProfilePage';

import * as url from 'utils/urls';

export function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Helmet titleTemplate="%s - ColaboAI" defaultTitle="ColaboAI">
          <meta name="description" content="ColaboAI" />
        </Helmet>

        <Wrapper>
          <Switch>
            <Route exact path={url.Main()} component={MainPage} />
            <Route exact path={url.SignUp()} component={SignUpPage} />
            <Route exact path={url.SignIn()} component={SignInPage} />
            <Route
              exact
              path={url.SearchResult()}
              component={SearchResultPage}
            />
            <Route exact path={url.CreateSong()} component={CreateSongPage} />
            <Route exact path={url.Song(':id')} component={SongPage} />
            <Route exact path={url.Cover(':id')} component={CoverPage} />
            <Route
              exact
              path={url.CreateCover(':id', 'record')}
              component={CreateCoverRecord}
            />
            <Route
              exact
              path={url.CoverEdit(':id')}
              component={CoverEditPage}
            />
            <Route
              exact
              path={url.CreateCover(':id', 'info')}
              component={CreateCoverInfo}
            />
            <Route exact path={url.Song(':id')} component={CoverPage} />
            <Route exact path={url.Profile(':id')} component={ProfilePage} />
            <Route exact path={url.Profile('me')} component={MyProfilePage} />
            <Redirect to={url.Main()} />
          </Switch>
        </Wrapper>
        <Toaster position="top-center" />
      </div>
    </BrowserRouter>
  );
}
