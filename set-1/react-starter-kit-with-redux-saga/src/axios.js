import axios from 'axios'

const axiosInstance = axios.create()

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response.status === 403) {
            localStorage.removeItem('accessToken');
            window.location.href = '/';
        } 
        else {
            return Promise.reject((error.response) || 'Something went wrong!')
        }
    }
)

export default axiosInstance
