import cookies from 'js-cookie';
import {Message} from '@alifd/next';

import {loginByAccountService, checkSessionService, loginOutService} from '../lib/http/service';
import {regByAccountService, getWeixinLoginQRcodeService} from '../lib/http/service';

import log from '../lib/log';

import {FUNC_LOGIN, FUNC_REG} from './login-reg';

export const LOGIN_IN_SUCCESS = 'LOGIN_IN_SUCCESS';
export const LOGIN_OUT = 'LOGIN_OUT';
export const NEED_LOGIN = 'NEED_LOGIN';
const GET_WX_QRCODE = 'GET_WX_QRCODE';

const SESSION = 'session';
const USER_INFO = 'userInfo';

const initialState = (function () {
    // document.cookies.ge
    /* const sid = cookies.get('sweet_sid');
    if (typeof sid === 'undefined') {
        http.post(userDefaultRegPath).then(data => {
            log.debug('*****', data);
            log.debug(`no session and default reg success. session = ${data.session}`);
            return {
                [SESSION]: data.session,
                [USER_NAME]: 'wenxy',
                [AVATAR_URL]: avatarDefault
            };
        });
    } else {
        return {
            [SESSION]: sid,
            [USER_NAME]: 'wenxy',
            [AVATAR_URL]: avatarDefault
        };
    } */
    return {
        [SESSION]: null,
        [USER_INFO]: {},
        needLogin: false
    };
}());

const loginAction = function (data) {
    log.debug('loginAction.', data);
    if (!data){
        return {
            type: NEED_LOGIN
        };
    }
    return {
        type: LOGIN_IN_SUCCESS,
        modal: FUNC_LOGIN,
        data
    };
};

const getWeixinLoginQRcodeAction = function (data) {
    log.debug('getWeixinLoginQRcodeAction.', data);
    return {
        type: GET_WX_QRCODE,
        data
    };
};

/*
(;*/

const regAction = data => ({
    type: LOGIN_IN_SUCCESS,
    modal: FUNC_REG,
    data
});

const loginOutAction = data => ({
    type: LOGIN_OUT,
    data
});

const loginOut = actionFunc => dispatch => {
    loginOutService().then(data => {
        const action = actionFunc(data);
        dispatch(action);
    })
        .catch(error => {
            log.error(`login out  fail.${error}`);
            const action = actionFunc(null);
            dispatch(action);
        });
};

const checkSession = actionFunc => dispatch => {
    checkSessionService().then(data => {
        const action = actionFunc(data);
        cookies.set('sweet_sid', data.session, {expires: 10000, path: '/'});
        dispatch(action);
    })
        .catch(error => {
            log.error(`check session fail.${error}`);
            const action = actionFunc(null);
            dispatch(action);
        });
};

const getWeixinLoginQRcode = actionFunc => dispatch => {
    getWeixinLoginQRcodeService().then(data => {
        const action = actionFunc(data);
        dispatch(action);
    })
        .catch(err => {
            log.error(`getWeixinLoginQRcode fail.${err}`);
        });
};

const login = (values, actionFunc) => dispatch => {
    // console.log('*****', values, defaultAvatar);
    /* axios.get(url).then(function(res){
    const action = func(res.data)
    dispatch(action)
    })*/
    /**
     * {
            session: '123456',
            userInfo: {
                userName: values.userName,
                avatarUrl: defaultAvatar
            }
        }
     */
    Message.show({
        title: '登录中...',
        type: 'loading',
        hasMask: true,
        duration: 0
    });
    loginByAccountService(values.userName, values.password).then(data => {
        const action = actionFunc(data);
        cookies.set('sweet_sid', data.session, {expires: 10000, path: '/'});
        Message.hide();
        dispatch(action);
    })
        .catch(error => {
            log.error(`login by account fail.${error}`);
            Message.show({
                title: '登录失败',
                type: 'error',
                hasMask: true
            });
        });

};

const reg = (values, actionFunc) => dispatch => {
    Message.show({
        title: '注册中，请稍后...',
        type: 'loading',
        hasMask: true,
        duration: 0
    });

    regByAccountService(values.userName, values.password).then(data => {
        const action = actionFunc(data);
        cookies.set('sweet_sid', data.session, {expires: 10000, path: '/'});
        Message.hide();
        dispatch(action);
    })
        .catch(error => {
            log.error(`reg by account fail.${error}`);
            Message.show({
                title: '注册失败',
                type: 'error',
                hasMask: true
            });
        });
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case LOGIN_IN_SUCCESS:
        return Object.assign({}, state, action.data);
    case LOGIN_OUT:
        // 登录态清除
        state.session = null;
        return Object.assign({}, state, action.data);
    case NEED_LOGIN:
        log.debug('reducer excute set needLoing = true');
        return Object.assign({}, state, {needLogin: true});;
    case GET_WX_QRCODE:
        return Object.assign({}, state, action.data);
    default:
        return state;
    }
};

export {
    reducer as default,
    initialState as sessionStatusInitialState,
    loginAction,
    login,
    checkSession,
    loginOutAction,
    loginOut,
    reg,
    regAction,
    getWeixinLoginQRcode,
    getWeixinLoginQRcodeAction
};
