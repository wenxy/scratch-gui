import axios from 'axios';
import {baseURL} from './URLs';
import log from '../log';
import QS from 'qs';

const http = axios.create({
    baseURL: baseURL,
    timeout: 5000,
    transformRequest: data => {
        if (data instanceof FormData){
            return data;
        }
        return QS.stringify(data);
    }
});
http.interceptors.request.use(config => {
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    return config;
}, error => {
    log.error(`request error ${error}`);
});

http.interceptors.response.use(response => {
    log.debug(response);
    if (response.data && response.status === 200 && response.data.data && response.data.code === 1){
        return response.data.data;
    }
    log.warn(`response fail because business exception. ${response.data}`);
    throw `response error${JSON.stringify(response)}`;
}, error => {
    log.error(`response error ${error}`);
    throw error;
});
export {
    http
};
