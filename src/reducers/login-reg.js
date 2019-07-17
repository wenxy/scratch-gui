import {LOGIN_IN_SUCCESS} from './session';

const OPEN_LOGIN_REG = 'scratch-gui/loginReg/OPEN';
const CLOSE_LOGIN_REG = 'scratch-gui/loginReg/CLOSE';

export const FUNC_LOGIN = 'funcLogin';
export const FUNC_REG = 'funcReg';

const initialState = {
    [FUNC_LOGIN]: false,
    [FUNC_REG]: false
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case OPEN_LOGIN_REG:
        return Object.assign({}, state, {
            [action.modal]: true
        });
    case CLOSE_LOGIN_REG:
        return Object.assign({}, state, {
            [action.modal]: false
        });
    case LOGIN_IN_SUCCESS:
        return Object.assign({}, state, {
            [action.modal]: false
        });
    default:
        return state;
    }
};
const openLoginReg = function (modal) {
    return {
        type: OPEN_LOGIN_REG,
        modal: modal
    };
};
const closeLoginiReg = function (modal) {
    return {
        type: CLOSE_LOGIN_REG,
        modal: modal
    };
};

const openLoginUI = function () {
    return openLoginReg(FUNC_LOGIN);
};

const openRegUI = function () {
    return openLoginReg(FUNC_REG);
};

const closeLoginUI = function () {
    return closeLoginiReg(FUNC_LOGIN);
};

const closeRegUI = function () {
    return closeLoginiReg(FUNC_REG);
};


export {
    reducer as default,
    initialState as loginRegInitialState,
    openLoginUI,
    openRegUI,
    closeLoginUI,
    closeRegUI
};
