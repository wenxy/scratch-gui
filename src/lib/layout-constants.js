import keyMirror from 'keymirror';

/**
 * Names for each state of the stage size toggle
 * @enum {string}
 */
const STAGE_SIZE_MODES = keyMirror({
    /**
     * The "large stage" button is pressed; the user would like a large stage.
     */
    large: null,

    /**
     * The "small stage" button is pressed; the user would like a small stage.
     */
    small: null
});

/**
 * Names for each stage render size
 * @enum {string}
 */
const STAGE_DISPLAY_SIZES = keyMirror({
    /**
     * Large stage with wide browser
     */
    large: null,

    /**
     * Large stage with narrow browser
     */
    largeConstrained: null,

    /**
     * Small stage (ignores browser width)
     */
    small: null
});

const STAGE_DISPLAY_SCALES = {};
STAGE_DISPLAY_SCALES[STAGE_DISPLAY_SIZES.large] = 1; // large mode, wide browser (standard)
STAGE_DISPLAY_SCALES[STAGE_DISPLAY_SIZES.largeConstrained] = 0.85; // large mode but narrow browser
STAGE_DISPLAY_SCALES[STAGE_DISPLAY_SIZES.small] = 0.5; // small mode, regardless of browser size

const isMobile = (function () {
    const browser = navigator.userAgent.toLowerCase();
    const phone = /iphone|ipod|ipad|android|mobile|blackberry|webos|incognito|webmate|bada|nokia|lg|ucweb|skyfire|micromessenger/i;
    if (phone.test(browser)) {
        return true;
    }
    return false;
}());

const isWeixin = (function () {
    const browser = navigator.userAgent.toLowerCase();
    if (browser.match(/MicroMessenger/i)){
        return true;
    }
    return false;
}());

const standardStageWidth = (function () {
    if (isMobile) {
        return window.innerWidth - 5;
    }
    return 480;
}());
const standardStageHeight = Math.round(standardStageWidth / 1.33);


export default {
    standardStageWidth: standardStageWidth,
    standardStageHeight: standardStageHeight,
    fullSizeMinWidth: 1096,
    fullSizePaintMinWidth: 1250,
    isMobile: isMobile,
    isWeixin: isWeixin
};

export {
    STAGE_DISPLAY_SCALES,
    STAGE_DISPLAY_SIZES,
    STAGE_SIZE_MODES
};
