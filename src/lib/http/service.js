import cookies from 'js-cookie';
import {http} from './HttpUtil';
import {
    loginByAccountPath,
    checkSessionPath,
    loginOutPath,
    smileOrCryPath,
    regByAccountPath,
    getWeixinLoginQRcodePath,
    checkWxLoginPath,
    getProjectInfoPath
} from './URLs';

const loginByAccount = function (userName, password) {
    if (typeof userName === 'undefined' || typeof password === 'undefined') {
        return new Promise((resolve, reject) => {
            reject(`用户名或密码为空`);
        });
    }
    return new Promise(((resolve, reject) => {
        http.post(loginByAccountPath, {
            userName: userName,
            password: password
        }).then(data => {
            resolve(data);
        })
            .catch(error => {
                reject(error);
            });
    }));
};

const regByAccount = function (userName, password) {
    if (typeof userName === 'undefined' || typeof password === 'undefined') {
        return new Promise((resolve, reject) => {
            reject(`用户名或密码为空`);
        });
    }
    return new Promise(((resolve, reject) => {
        http.post(regByAccountPath, {
            userName: userName,
            password: password
        }).then(data => {
            resolve(data);
        })
            .catch(error => {
                reject(error);
            });
    }));
};

const checkSession = function () {
    const sid = cookies.get('sweet_sid');
    // console.log('check session sid->', sid);
    if (typeof sid === 'undefined') {
        return new Promise((resolve, reject) => {
            resolve(null);
        });
    }
    return new Promise(((resolve, reject) => {
        http.post(checkSessionPath, {
            sid: sid
        }).then(data => {
            resolve(data);
        })
            .catch(error => {
                resolve(null);
            });
    }));
};

const getWeixinLoginQRcode = function () {
    return new Promise(((resolve, reject) => {
        http.post(getWeixinLoginQRcodePath, {
        }).then(data => {
            resolve(data);
        })
            .catch(error => {
                reject(error);
            });
    }));
};

const loginOut = function () {
    const sid = cookies.get('sweet_sid');
    if (typeof sid === 'undefined') {
        return new Promise((resolve, reject) => {
            reject(`未登录,无需退出...`);
        });
    }

    return new Promise(((resolve, reject) => {
        http.post(loginOutPath, {
            sid: sid
        }).then(data => {
            cookies.set('sweet_sid', '', {expires: 0, path: '/'});
            resolve(data);
        })
            .catch(error => {
                reject(error);
            });
    }));
};

const checkWxLogin = function (uuid) {
    if (typeof uuid === 'undefined') {
        return new Promise((resolve, reject) => {
            reject(`uuid empty.`);
        });
    }
    return new Promise(((resolve, reject) => {
        http.post(checkWxLoginPath, {
            uuid: uuid
        }).then(data => {
            cookies.set('sweet_sid', data, {expires: 10000, path: '/'});
            resolve(data);
        })
            .catch(error => {
                reject(error);
            });
    }));
};

const getProjectInfo = function (projectId) {
    if (typeof projectId === 'undefined') {
        return new Promise((resolve, reject) => {
            reject(`projectId Id is empty.`);
        });
    }
    return new Promise(((resolve, reject) => {
        http.post(getProjectInfoPath, {
            projectId: projectId
        }).then(data => {
            resolve(data);
        })
            .catch(error => {
                reject(error);
            });
    }));
};

const smileOrCry = function (projectId, flag) {
    if (typeof projectId === 'undefined') {
        return new Promise((resolve, reject) => {
            reject(`smileOrCry projectId Id is empty.`);
        });
    }
    const sid = cookies.get('sweet_sid');
    // console.log('check session sid->', sid);
    if (typeof sid === 'undefined') {
        return new Promise((resolve, reject) => {
            reject(`未登录`);
        });
    }
    return new Promise(((resolve, reject) => {
        http.post(smileOrCryPath, {
            projectId: projectId,
            flag: flag,
            sid: sid
        }).then(data => {
            resolve(data);
        })
            .catch(error => {
                reject(error);
            });
    }));
};

export {
    loginByAccount as loginByAccountService,
    checkSession as checkSessionService,
    loginOut as loginOutService,
    regByAccount as regByAccountService,
    getWeixinLoginQRcode as getWeixinLoginQRcodeService,
    checkWxLogin as checkWxLoginService,
    getProjectInfo as getProjectInfoService,
    smileOrCry as smileOrCryService
};
