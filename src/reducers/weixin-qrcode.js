import log from '../lib/log';

const QRCODE_SHOW = 'scratch-gui/weixiniQRCode/SHOW';
const QRCODE_HIDE = 'scratch-gui/weixiniQRCode/HIDE';

const initialState = {
    qrcodeShow: false
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case QRCODE_SHOW:
        return Object.assign({}, state, {
            qrcodeShow: true
        });
    case QRCODE_HIDE:
        return Object.assign({}, state, {
            qrcodeShow: false
        });
    default:
        return state;
    }
};

const QRCodeShwo = function () {
    return {
        type: QRCODE_SHOW
    };
}

const QRCodeHide = function () {
    return {
        type: QRCODE_HIDE
    };
}

export {
    reducer as default,
    initialState as wxQRcodeState,
    QRCodeShwo,
    QRCodeHide
};
