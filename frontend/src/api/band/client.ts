import axios from 'axios';
import applyCaseMiddleware from 'axios-case-converter';
const apiClient = applyCaseMiddleware(axios.create());

// apiClient.defaults.withCredentials = true;
apiClient.defaults.xsrfCookieName = 'csrftoken';
apiClient.defaults.xsrfHeaderName = 'X-CSRFToken';

apiClient.get('/api/token/');

const setAuthTokenHeader = async (token: string) => {
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export { apiClient, setAuthTokenHeader };
