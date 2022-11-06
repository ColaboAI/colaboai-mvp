import axios from 'axios';
import applyCaseMiddleware from 'axios-case-converter';
const apiClient = applyCaseMiddleware(axios.create());

apiClient.defaults.xsrfCookieName = 'csrftoken';
apiClient.defaults.xsrfHeaderName = 'X-CSRFToken';

apiClient.get('/api/token/');

export { apiClient };
