import axios from 'axios';
import { store } from '../../Redux/store';
import { RemoveUser } from '../../Redux/UserContext/UserSlice';

function joinURL(baseURL: string, url: string) {
    // return `${baseURL}/${url}`;
    console.log(baseURL);
    return `${url}`;
}

axios.interceptors.request.use(
    (config) => {
        // Modify request config as needed
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

// Response interceptor
axios.interceptors.response.use(
    (response) => {
        // Handle successful responses
        return response;
    },
    (error) => {
        if (
            (error.response &&
                error.response.data &&
                error.response.data.status === 'TOKEN_EXPIRED') ||
            error.response.status === 440
        ) {
            // Dispatch removeUser action to log out the user
            alert('Your session has expired please login again!');
            store.dispatch(RemoveUser());
            localStorage.clear();
            sessionStorage.clear();
        }
        return Promise.reject(error);
    },
);

class Service {
    domain;
    constructor() {
        this.domain = '';
        if (process.env.BZENV === 'development') {
            this.domain = '';
        }
    }

    async request(url: string, method = 'POST', data?: any) {
        url = joinURL(this.domain, url);

        let token: any = localStorage.getItem('persist:root');

        token = JSON.parse(token).token as string;
        token = token.slice(1, token.length - 1);

        const res = await axios.request({
            url,
            method,
            data,
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    }

    post(url: string, data: any) {
        const method = 'POST';
        return this.request(url, method, data);
    }

    get(url: string) {
        const method = 'GET';
        return this.request(url, method);
    }

    delete(url: string, data: any) {
        const method = 'DELETE';
        return this.request(url, method, data);
    }

    put(url: string, data: any) {
        const method = 'PUT';
        return this.request(url, method, data);
    }

    patch(url: string, data: any) {
        const method = 'PATCH';
        return this.request(url, method, data);
    }
}

export default Service;
