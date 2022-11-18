import { wrapperActions } from 'app/wrapper/slice';
import axios from 'axios';
import applyCaseMiddleware from 'axios-case-converter';
import toast from 'react-hot-toast';
import { useHistory } from 'react-router-dom';
const apiClient = applyCaseMiddleware(axios.create());

apiClient.defaults.withCredentials = true;
apiClient.defaults.xsrfCookieName = 'csrftoken';
apiClient.defaults.xsrfHeaderName = 'X-CSRFToken';
apiClient.get('/api/token/');

const setAuthTokenHeader = async (token: string) => {
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};
let isTokenRefreshing = false;
let refreshSubscribers: CallableFunction[] = [];

const onTokenRefreshed = (accessToken: string) => {
  refreshSubscribers.map((cb: CallableFunction) => cb(accessToken));
};

const addRefreshSubscriber = (callback: CallableFunction) => {
  refreshSubscribers.push(callback);
};

apiClient.interceptors.request.use(
  response => {
    return response;
  },
  async error => {
    const {
      config,
      response: { status },
    } = error;
    const originalRequest = config;
    if (status === 401) {
      if (!isTokenRefreshing) {
        // isTokenRefreshing이 false인 경우에만 token refresh 요청
        isTokenRefreshing = true;
        try {
          const response = await axios.post<AccessToken>(
            `/token/refresh/`, // token refresh api
          );

          const { access: newAccessToken } = response.data;
          wrapperActions.setAccessToken(newAccessToken);
          // 새로운 토큰 저장
          isTokenRefreshing = false;

          // 새로운 토큰으로 지연되었던 요청 진행
          onTokenRefreshed(newAccessToken);
        } catch (err) {
          toast.error('로그인 인증이 만료되었습니다. 다시 로그인해주세요.');
          const history = useHistory();
          history.push('/login');
        }
      }

      // token이 재발급 되는 동안의 요청은 refreshSubscribers에 저장
      const retryOriginalRequest = new Promise(resolve => {
        addRefreshSubscriber(accessToken => {
          originalRequest.headers.Authorization = 'Bearer ' + accessToken;
          resolve(axios(originalRequest));
        });
      });
      return retryOriginalRequest;
    }
    return Promise.reject(error);
  },
);

export { apiClient, setAuthTokenHeader };
