import axios, { type AxiosInstance, type AxiosResponse } from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const axiosClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'content-type': 'application/json'
    }
}
)

/*Interceptor de Peticion */
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) =>{
        return Promise.reject(error);
    }
);

/*Interceptor de Respuesta */
axiosClient.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error) => {
        if(error.response && error.response.status === 401){
            console.warn('CODIGO 401 DETECTADO: Sesion no valida o expirada')
    }
    return Promise.reject(error);
    }
);

export default axiosClient;