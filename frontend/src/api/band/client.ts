import axios from 'axios';
import applyCaseMiddleware from 'axios-case-converter';
import toast from 'react-hot-toast';
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
let isTokenRefreshing = false;
let isFirstRequest = true;
let refreshSubscribers: any[] = [];

const onTokenRefreshed = (accessToken: string): void => {
  refreshSubscribers.forEach(cb => cb(accessToken));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

apiClient.interceptors.request.use(config => {
  const tokensData = sessionStorage.getItem('accessToken') ?? '';
  setAuthTokenHeader(tokensData);
  return config;
});

apiClient.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const {
      config,
      response: { status },
    } = error;
    const originalRequest = config;
    if (config.url === REFRESH_URL || status !== 401)
      return Promise.reject(error);

    // token이 재발급 되는 동안의 요청은 refreshSubscribers에 저장
    const retryOriginalRequest = new Promise((resolve, _) => {
      addRefreshSubscriber((accessToken: string) => {
        originalRequest.headers.Authorization = 'Bearer ' + accessToken;
        resolve(axios(originalRequest));
      });
    });

    if (status === 401) {
      if (!isTokenRefreshing) {
        // isTokenRefreshing이 false인 경우에만 token refresh 요청
        isTokenRefreshing = true;
        try {
          const response = await axios.post<AccessToken>(
            REFRESH_URL, // token refresh api
          );
          const { access: newAccessToken } = response.data;
          // 새로운 토큰 저장
          sessionStorage.setItem('accessToken', newAccessToken);

          isTokenRefreshing = false;

          // 새로운 토큰으로 지연되었던 요청 진행
          onTokenRefreshed(newAccessToken);
        } catch (err) {
          const isLogout = localStorage.getItem('isLogout');
          if (isLogout === 'true') {
            toast.error('로그인이 만료되었습니다. 다시 로그인해주세요.');
            window.location.href = '/signin';
          }
          sessionStorage.clear();
        }
      }

      // Original request
      return retryOriginalRequest;
    }
    return Promise.reject(error);
  },
);

export { apiClient, setAuthTokenHeader };
