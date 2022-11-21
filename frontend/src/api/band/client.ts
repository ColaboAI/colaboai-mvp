import { wrapperActions } from 'app/wrapper/slice';
import axios from 'axios';
import applyCaseMiddleware from 'axios-case-converter';
import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

const apiClient = applyCaseMiddleware(axios.create());
const REFRESH_URL = `/api/accounts/token/refresh/`;
apiClient.defaults.withCredentials = true;
apiClient.defaults.xsrfCookieName = 'csrftoken';
apiClient.defaults.xsrfHeaderName = 'X-CSRFToken';
apiClient.get('/api/token/');

const setAuthTokenHeader = async (token: string) => {
  if (!!token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

export default function AuthProvider() {
  const [isTokenRefreshing, setIsTokenRefreshing] = useState(false);
  const [refreshSubscribers, setRefreshSubscriber] = useState<any>([]);
  const history = useHistory();
  const dispatch = useDispatch();

  const onTokenRefreshed = useCallback(
    (accessToken: string): void => {
      refreshSubscribers.forEach(cb => cb(accessToken));
      setRefreshSubscriber([]);
    },
    [refreshSubscribers],
  );

  const addRefreshSubscriber = useCallback(
    (cb: (token: string) => void) => {
      const refreshSubscribersCopy = [...refreshSubscribers, cb];
      setRefreshSubscriber(refreshSubscribersCopy);
    },
    [refreshSubscribers],
  );

  apiClient.interceptors.request.use(
    async (config: any) => {
      const originalRequest = config;
      const tokenData = sessionStorage.getItem('accessToken');
      if (tokenData) {
        originalRequest.headers['Authorization'] = `Bearer ${tokenData}`;
      }

      return config;
    },
    error => Promise.reject(error),
  );

  apiClient.interceptors.response.use(
    response => response,
    async error => {
      const {
        config,
        response: { status },
      } = error;
      const originalRequest = config;
      const isAnonymous = sessionStorage.getItem('isAnonymous') === 'true';
      const isLogout = sessionStorage.getItem('isLogout') === 'true';
      if (config.url === REFRESH_URL || status !== 401) {
        return Promise.reject(error);
      }

      // token이 재발급 되는 동안의 요청은 refreshSubscribers에 저장
      const retryOriginalRequest = new Promise((resolve, _) => {
        addRefreshSubscriber((accessToken: string) => {
          originalRequest.headers.Authorization = 'Bearer ' + accessToken;
          resolve(apiClient(originalRequest));
        });
      });

      if (status === 401 && !isLogout && !isAnonymous) {
        if (!isTokenRefreshing) {
          // isTokenRefreshing이 false인 경우에만 token refresh 요청
          setIsTokenRefreshing(true);
          try {
            const response = await apiClient.post<AccessToken>(
              REFRESH_URL, // token refresh api
            );
            const { access: newAccessToken } = response.data;
            // 새로운 토큰 저장
            sessionStorage.setItem('accessToken', newAccessToken);
            dispatch(wrapperActions.setAccessToken(newAccessToken));
            setIsTokenRefreshing(false);
            // 새로운 토큰으로 지연되었던 요청 진행
            onTokenRefreshed(newAccessToken);
          } catch (err) {
            dispatch(wrapperActions.cleanUp());
            const isLogout = sessionStorage.getItem('isLogout');
            if (isLogout === 'false') {
              toast.error(
                '로그인 인증 정보가 만료되었습니다. 다시 로그인해주세요.',
              );
              history.push('/signin');
            } else {
              sessionStorage.removeItem('accessToken');
              sessionStorage.removeItem('isLogout');
              sessionStorage.setItem('isAnonymous', 'true');
            }
          }
        }

        // Original request
        return retryOriginalRequest;
      }
      return Promise.reject(error);
    },
  );

  return null;
}

export { apiClient, setAuthTokenHeader };
