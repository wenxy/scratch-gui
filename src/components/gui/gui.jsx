import classNames from 'classnames';
import omit from 'lodash.omit';
import PropTypes from 'prop-types';
import React from 'react';
import {defineMessages, FormattedMessage, injectIntl, intlShape} from 'react-intl';
import {connect} from 'react-redux';
import MediaQuery from 'react-responsive';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import tabStyles from 'react-tabs/style/react-tabs.css';
import VM from 'scratch-vm';
import Renderer from 'scratch-render';

import Blocks from '../../containers/blocks.jsx';
import CostumeTab from '../../containers/costume-tab.jsx';
import TargetPane from '../../containers/target-pane.jsx';
import SoundTab from '../../containers/sound-tab.jsx';
import StageWrapper from '../../containers/stage-wrapper.jsx';
import Loader from '../loader/loader.jsx';
import Box from '../box/box.jsx';
import MenuBar from '../menu-bar/menu-bar.jsx';
import CostumeLibrary from '../../containers/costume-library.jsx';
import BackdropLibrary from '../../containers/backdrop-library.jsx';
import Watermark from '../../containers/watermark.jsx';

import WebGlModal from '../../containers/webgl-modal.jsx';
import TipsLibrary from '../../containers/tips-library.jsx';
import Cards from '../../containers/cards.jsx';
import Alerts from '../../containers/alerts.jsx';
import DragLayer from '../../containers/drag-layer.jsx';
import ConnectionModal from '../../containers/connection-modal.jsx';
import TelemetryModal from '../telemetry-modal/telemetry-modal.jsx';
import LoginUI from '../user/login-ui.jsx';
import RegUI from '../user/reg-ui.jsx';
import {closeLoginUI, closeRegUI} from '../../reducers/login-reg';
import layout, {STAGE_SIZE_MODES} from '../../lib/layout-constants';
import {resolveStageSize} from '../../lib/screen-utils';
import {getStageDimensions} from '../../lib/screen-utils.js';
import WeixinQRCode from '../user/weixin-qrcode.jsx';

import styles from './gui.css';
import addExtensionIcon from './icon--extensions.svg';
import codeIcon from './icon--code.svg';
import costumesIcon from './icon--costumes.svg';
import soundsIcon from './icon--sounds.svg';

import {Grid, Tag, Icon, Balloon, Dialog, Button} from '@alifd/next';
const {Row, Col} = Grid;
/**
 * 什么
 */
import {login, loginAction, checkSession, reg, regAction, getWeixinLoginQRcode, getWeixinLoginQRcodeAction} from '../../reducers/session';

import IcePanel from '@icedesign/panel';

import logo from './logo-1.png';

import iconAvatar from './icon--avatar-default.svg';

import iconFriend from './icon--friend.svg';

const messages = defineMessages({
    addExtension: {
        id: 'gui.gui.addExtension',
        description: 'Button to add an extension in the target pane',
        defaultMessage: 'Add Extension'
    }
});

// Cache this value to only retrieve it once the first time.
// Assume that it doesn't change for a session.
let isRendererSupported = null;

const GUIComponent = props => {
    const {
        accountNavOpen,
        activeTabIndex,
        alertsVisible,
        loginVisible,
        regVisible,
        authorId,
        authorThumbnailUrl,
        authorUsername,
        basePath,
        backdropLibraryVisible,
        blocksTabVisible,
        cardsVisible,
        canCreateNew,
        canEditTitle,
        canRemix,
        canSave,
        canCreateCopy,
        canShare,
        showBranding,
        canUseCloud,
        children,
        connectionModalVisible,
        costumeLibraryVisible,
        costumesTabVisible,
        enableCommunity,
        intl,
        needLogin,
        isCreating,
        isFullScreen,
        isPlayerOnly,
        isRtl,
        isShared,
        loading,
        renderLogin,
        onClickAccountNav,
        onCloseAccountNav,
        onCloseLoginUI,
        onCloseRegUI,
        onLoginBtnClick,
        onRegBtnClick,
        onCheckSession,
        onLogOut,
        onOpenRegistration,
        onToggleLoginOpen,
        onUpdateProjectTitle,
        onActivateCostumesTab,
        onActivateSoundsTab,
        onActivateTab,
        onClickLogo,
        onExtensionButtonClick,
        onProjectTelemetryEvent,
        onRequestCloseBackdropLibrary,
        onRequestCloseCostumeLibrary,
        onRequestCloseTelemetryModal,
        onSeeCommunity,
        onShare,
        onTelemetryModalCancel,
        onTelemetryModalOptIn,
        onTelemetryModalOptOut,
        showComingSoon,
        soundsTabVisible,
        stageSizeMode,
        targetIsStage,
        telemetryModalVisible,
        tipsLibraryVisible,
        vm,
        ...componentProps
    } = omit(props, 'dispatch');

    if (children) {
        return <Box {...componentProps}>{children}</Box>;
    }


    const tabClassNames = {
        tabs: styles.tabs,
        tab: classNames(tabStyles.reactTabsTab, styles.tab),
        tabList: classNames(tabStyles.reactTabsTabList, styles.tabList),
        tabPanel: classNames(tabStyles.reactTabsTabPanel, styles.tabPanel),
        tabPanelSelected: classNames(tabStyles.reactTabsTabPanelSelected, styles.isSelected),
        tabSelected: classNames(tabStyles.reactTabsTabSelected, styles.isSelected)
    };

    if (isRendererSupported === null) {
        if (vm.renderer) {
            isRendererSupported = true;
        } else {
            isRendererSupported = Renderer.isSupported();
        }
    }

    // 登录态校验
    onCheckSession();

    if (needLogin){
       // onGetWeixinQRCode();
    }
    console.log('needLogin===>', needLogin);

    const stageDimensions = getStageDimensions(STAGE_SIZE_MODES.large, false);

    return (<MediaQuery minWidth={layout.fullSizeMinWidth}>{isFullSize => {
        const stageSize = resolveStageSize(stageSizeMode, isFullSize);
        const smallTipShare = layout.isWeixin ? (
            <div
                style={{
                    height: '50px',
                    width: '100%',
                    background: '#d91579',
                    position: 'fixed',
                    display: 'flex',
                    bottom: '0px',
                    left: '0px',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <img
                    src={iconFriend}
                    style={{
                        height: '45px',
                        width: '45px',
                        marginLeft: '10px',
                        marginRight: '10px'
                    }}
                />
                <span
                    style={{
                        fontSize: '20px',
                        color: '#fff'
                    }}
                >
                    分享到朋友圈完成打卡
                </span>
            </div>
        ) : null;
        const avatar = isPlayerOnly ? (
            <div
                style={{
                    position: 'absolute',
                    right: '5px',
                    top: '-20px'
                }}
            >
                <img
                    src={iconAvatar}
                    style={{
                        width: `45px`,
                        height: '45px',
                        borderRadius: '45px'
                    }}
                />
            </div>
        ) : null;

        const whos = isPlayerOnly ? (
            <Balloon
                defaultVisible
                visible
                align="l"
                closable={false}
                trigger={avatar}
            >
                <span>
                    小宝宝的第10个作品
                </span>
            </Balloon>
        ) : null;

        const title = isPlayerOnly ? (
            <div
                style={{
                    width: `${stageDimensions.width}px`,
                    textAlign: 'left',
                    background: '#fff',
                    borderTopLeftRadius: '5px',
                    borderTopRightRadius: '5px',
                    position: 'relative'
                }}
            >
                {whos}
                <h3
                    style={{
                        marginLeft: '5px'
                    }}
                >
                    作品标题

                </h3>
            </div>
        ) : null;


        return isPlayerOnly ? (
            <div
                style={{
                    width: `100%`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    background: 'linear-gradient(#5c2928, #e2a82b)'
                }}
            >

                {smallTipShare}

                <Row
                    align="center"
                    style={{
                        height: '120px',
                        width: '100%'
                    }}
                >
                    <img
                        src={logo}
                        style={{
                            height: '100px',
                            width: '100px',
                            marginLeft: '10px'
                        }}
                    />
                    <span
                        style={{
                            marginLeft: '10px',
                            color: '#fff',
                            fontSize: '24px'
                        }}
                    >
                        甜甜圈编程
                    </span>
                </Row>
                {title}
                <StageWrapper
                    isFullScreen={isFullScreen}
                    isRendererSupported={isRendererSupported}
                    isRtl={isRtl}
                    loading={loading}
                    showBranding={showBranding}
                    stageSize={STAGE_SIZE_MODES.large}
                    vm={vm}
                >
                    {alertsVisible ? (
                        <Alerts className={styles.alertsContainer} />
                    ) : null}
                </StageWrapper>
                <Row
                    align="center"
                    justify="center"
                    style={{
                        width: `${stageDimensions.width}px`,
                        borderBottomLeftRadius: '5px',
                        borderBottomRightRadius: '5px',
                        background: '#e5f0ff',
                        borderTop: '1px solid #f9f9f9',
                        height: '56px'
                    }}
                >
                    <Col
                        span="12"
                        style={{
                            textAlign: 'center'
                        }}
                    >
                        <Tag
                            size="large"
                            style={{
                                border: '1px solid #ffffff7a',
                                borderRadius: '30px'
                            }}
                        >
                            <Icon
                                style={{color: 'rgb(8, 167, 21)', marginRight: '5px'}}
                                type="smile"
                            />
                            10000
                        </Tag>
                    </Col>
                    <Col
                        align="center"
                        span="12"
                        style={{
                            textAlign: 'center'
                        }}
                    >
                        <Tag
                            size="large"
                            style={{
                                border: '1px solid #ffffff7a',
                                borderRadius: '30px'
                            }}
                        >
                            <Icon
                                style={{color: '#ccc', marginRight: '5px'}}
                                type="cry"
                            />
                            1000
                        </Tag>
                    </Col>
                </Row>
                <div>
                    <IcePanel
                        status="warning"
                        style={{
                            marginTop: '5px',
                            marginBottom: '60px',
                            width: `${stageDimensions.width}px`,
                            border: 'none'
                        }}
                    >
                        <IcePanel.Header
                            style={{
                                background: '#ffffff',
                                border: 'none'
                            }}
                        >
                        甜甜圈老师点评
                        </IcePanel.Header>
                        <IcePanel.Body
                            style={{
                                background: 'rgb(251, 233, 203)',
                                border: 'none'
                            }}
                        >
                            <p style={{fontSize: '15px', margin: 0, lineHeight: 1.5, color: '#333'}}>
                            参差荇菜，左右芼之。窈窕淑女，钟鼓乐之。
                            </p>
                        </IcePanel.Body>
                    </IcePanel>
                </div>
            </div>
        ) : (
            <Box
                className={styles.pageWrapper}
                dir={isRtl ? 'rtl' : 'ltr'}
                {...componentProps}
            >
                {telemetryModalVisible ? (
                    <TelemetryModal
                        onCancel={onTelemetryModalCancel}
                        onOptIn={onTelemetryModalOptIn}
                        onOptOut={onTelemetryModalOptOut}
                        onRequestClose={onRequestCloseTelemetryModal}
                    />
                ) : null}
                {loading ? (
                    <Loader />
                ) : null}
                {isCreating ? (
                    <Loader messageId="gui.loader.creating" />
                ) : null}
                {isRendererSupported ? null : (
                    <WebGlModal isRtl={isRtl} />
                )}
                {tipsLibraryVisible ? (
                    <TipsLibrary />
                ) : null}
                {cardsVisible ? (
                    <Cards />
                ) : null}
                {alertsVisible ? (
                    <Alerts className={styles.alertsContainer} />
                ) : null}
                {connectionModalVisible ? (
                    <ConnectionModal
                        vm={vm}
                    />
                ) : null}
                {costumeLibraryVisible ? (
                    <CostumeLibrary
                        vm={vm}
                        onRequestClose={onRequestCloseCostumeLibrary}
                    />
                ) : null}
                {backdropLibraryVisible ? (
                    <BackdropLibrary
                        vm={vm}
                        onRequestClose={onRequestCloseBackdropLibrary}
                    />
                ) : null}
                {loginVisible ? (
                    <Dialog
                        animation={{in: 'fadeInDown', out: 'fadeOutUp'}}
                        footer={false}
                        title={'登录'}
                        visible={loginVisible}
                        onClose={onCloseLoginUI}
                    >
                        <LoginUI
                            onLoginBtnClick={onLoginBtnClick}
                        />
                    </Dialog>
                ) : null}

                {regVisible ? (
                    <Dialog
                        animation={{in: 'fadeInDown', out: 'fadeOutUp'}}
                        footer={false}
                        title={'注册'}
                        visible={regVisible}
                        onClose={onCloseRegUI}
                    >
                        <RegUI
                            onRegBtnClick={onRegBtnClick}
                        />
                    </Dialog>
                ) : null}
                {needLogin ? (
                    <WeixinQRCode
                        needLogin={needLogin}
                        onCheckSession={onCheckSession} />
                ) : null}

                <MenuBar
                    accountNavOpen={accountNavOpen}
                    authorId={authorId}
                    authorThumbnailUrl={authorThumbnailUrl}
                    authorUsername={authorUsername}
                    canCreateCopy={canCreateCopy}
                    canCreateNew={canCreateNew}
                    canEditTitle={canEditTitle}
                    canRemix={canRemix}
                    canSave={canSave}
                    canShare={canShare}
                    className={styles.menuBarPosition}
                    enableCommunity={enableCommunity}
                    isShared={isShared}
                    renderLogin={renderLogin}
                    showComingSoon={showComingSoon}
                    onClickAccountNav={onClickAccountNav}
                    onClickLogo={onClickLogo}
                    onCloseAccountNav={onCloseAccountNav}
                    onLogOut={onLogOut}
                    onOpenRegistration={onOpenRegistration}
                    onProjectTelemetryEvent={onProjectTelemetryEvent}
                    onSeeCommunity={onSeeCommunity}
                    onShare={onShare}
                    onToggleLoginOpen={onToggleLoginOpen}
                    onUpdateProjectTitle={onUpdateProjectTitle}
                />
                <Box className={styles.bodyWrapper}>
                    <Box className={styles.flexWrapper}>
                        <Box className={styles.editorWrapper}>
                            <Tabs
                                forceRenderTabPanel
                                className={tabClassNames.tabs}
                                selectedIndex={activeTabIndex}
                                selectedTabClassName={tabClassNames.tabSelected}
                                selectedTabPanelClassName={tabClassNames.tabPanelSelected}
                                onSelect={onActivateTab}
                            >
                                <TabList className={tabClassNames.tabList}>
                                    <Tab className={tabClassNames.tab}>
                                        <img
                                            draggable={false}
                                            src={codeIcon}
                                        />
                                        <FormattedMessage
                                            defaultMessage="Code"
                                            description="Button to get to the code panel"
                                            id="gui.gui.codeTab"
                                        />
                                    </Tab>
                                    <Tab
                                        className={tabClassNames.tab}
                                        onClick={onActivateCostumesTab}
                                    >
                                        <img
                                            draggable={false}
                                            src={costumesIcon}
                                        />
                                        {targetIsStage ? (
                                            <FormattedMessage
                                                defaultMessage="Backdrops"
                                                description="Button to get to the backdrops panel"
                                                id="gui.gui.backdropsTab"
                                            />
                                        ) : (
                                            <FormattedMessage
                                                defaultMessage="Costumes"
                                                description="Button to get to the costumes panel"
                                                id="gui.gui.costumesTab"
                                            />
                                        )}
                                    </Tab>
                                    <Tab
                                        className={tabClassNames.tab}
                                        onClick={onActivateSoundsTab}
                                    >
                                        <img
                                            draggable={false}
                                            src={soundsIcon}
                                        />
                                        <FormattedMessage
                                            defaultMessage="Sounds"
                                            description="Button to get to the sounds panel"
                                            id="gui.gui.soundsTab"
                                        />
                                    </Tab>
                                </TabList>
                                <TabPanel className={tabClassNames.tabPanel}>
                                    <Box className={styles.blocksWrapper}>
                                        <Blocks
                                            canUseCloud={canUseCloud}
                                            grow={1}
                                            isVisible={blocksTabVisible}
                                            options={{
                                                media: `${basePath}static/blocks-media/`
                                            }}
                                            stageSize={stageSize}
                                            vm={vm}
                                        />
                                    </Box>
                                    <Box className={styles.extensionButtonContainer}>
                                        <button
                                            className={styles.extensionButton}
                                            title={intl.formatMessage(messages.addExtension)}
                                            onClick={onExtensionButtonClick}
                                        >
                                            <img
                                                className={styles.extensionButtonIcon}
                                                draggable={false}
                                                src={addExtensionIcon}
                                            />
                                        </button>
                                    </Box>
                                    <Box className={styles.watermark}>
                                        <Watermark />
                                    </Box>
                                </TabPanel>
                                <TabPanel className={tabClassNames.tabPanel}>
                                    {costumesTabVisible ? <CostumeTab vm={vm} /> : null}
                                </TabPanel>
                                <TabPanel className={tabClassNames.tabPanel}>
                                    {soundsTabVisible ? <SoundTab vm={vm} /> : null}
                                </TabPanel>
                            </Tabs>
                            {/*
                            {backpackVisible ? (
                                <Backpack host={backpackHost} />
                            ) : null}
                            */}
                        </Box>

                        <Box className={classNames(styles.stageAndTargetWrapper, styles[stageSize])}>
                            <StageWrapper
                                isRendererSupported={isRendererSupported}
                                isRtl={isRtl}
                                stageSize={stageSize}
                                vm={vm}
                            />
                            <Box className={styles.targetWrapper}>
                                <TargetPane
                                    stageSize={stageSize}
                                    vm={vm}
                                />
                            </Box>
                        </Box>
                    </Box>
                </Box>
                <DragLayer />
            </Box>
        );
    }}</MediaQuery>);
};

GUIComponent.propTypes = {
    accountNavOpen: PropTypes.bool,
    activeTabIndex: PropTypes.number,
    authorId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    authorThumbnailUrl: PropTypes.string, // can be false
    authorUsername: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    backdropLibraryVisible: PropTypes.bool, // can be false
    basePath: PropTypes.string,
    blocksTabVisible: PropTypes.bool,
    canCreateCopy: PropTypes.bool,
    canCreateNew: PropTypes.bool,
    canEditTitle: PropTypes.bool,
    canRemix: PropTypes.bool,
    canSave: PropTypes.bool,
    canShare: PropTypes.bool,
    canUseCloud: PropTypes.bool,
    cardsVisible: PropTypes.bool,
    children: PropTypes.node,
    costumeLibraryVisible: PropTypes.bool,
    costumesTabVisible: PropTypes.bool,
    enableCommunity: PropTypes.bool,
    intl: intlShape.isRequired,
    isCreating: PropTypes.bool,
    isFullScreen: PropTypes.bool,
    isPlayerOnly: PropTypes.bool,
    isRtl: PropTypes.bool,
    isShared: PropTypes.bool,
    loading: PropTypes.bool,
    loginVisible: PropTypes.bool,
    needLogin: PropTypes.bool,
    onActivateCostumesTab: PropTypes.func,
    onActivateSoundsTab: PropTypes.func,
    onActivateTab: PropTypes.func,
    onCheckSession: PropTypes.func,
    onClickAccountNav: PropTypes.func,
    onClickLogo: PropTypes.func,
    onCloseAccountNav: PropTypes.func,
    onCloseLoginUI: PropTypes.func,
    onCloseRegUI: PropTypes.func,
    onExtensionButtonClick: PropTypes.func,
    onGetWeixinQRCode: PropTypes.func,
    onLogOut: PropTypes.func,
    onOpenRegistration: PropTypes.func,
    onRequestCloseBackdropLibrary: PropTypes.func,
    onRequestCloseCostumeLibrary: PropTypes.func,
    onRequestCloseTelemetryModal: PropTypes.func,
    onSeeCommunity: PropTypes.func,
    onShare: PropTypes.func,
    onTabSelect: PropTypes.func,
    onTelemetryModalCancel: PropTypes.func,
    onTelemetryModalOptIn: PropTypes.func,
    onTelemetryModalOptOut: PropTypes.func,
    onToggleLoginOpen: PropTypes.func,
    onUpdateProjectTitle: PropTypes.func,
    regVisible: PropTypes.bool,
    renderLogin: PropTypes.func,
    showBranding: PropTypes.bool,
    showComingSoon: PropTypes.bool,
    soundsTabVisible: PropTypes.bool,
    stageSizeMode: PropTypes.oneOf(Object.keys(STAGE_SIZE_MODES)),
    targetIsStage: PropTypes.bool,
    telemetryModalVisible: PropTypes.bool,
    tipsLibraryVisible: PropTypes.bool,
    vm: PropTypes.instanceOf(VM).isRequired
};
GUIComponent.defaultProps = {
    basePath: './',
    canCreateNew: false,
    canEditTitle: false,
    canRemix: false,
    canSave: false,
    canCreateCopy: false,
    canShare: false,
    showBranding: false,
    canUseCloud: false,
    enableCommunity: false,
    isCreating: false,
    isShared: false,
    loading: false,
    onUpdateProjectTitle: () => {},
    showComingSoon: false,
    stageSizeMode: STAGE_SIZE_MODES.large,
};

const mapStateToProps = state => ({
    // This is the button's mode, as opposed to the actual current state
    stageSizeMode: state.scratchGui.stageSize.stageSize,
    needLogin: state.session.needLogin,
});
const mapDispatchToProps = dispatch => ({
    onCloseLoginUI: () => dispatch(closeLoginUI()),
    onLoginBtnClick: values => dispatch(login(values, loginAction)),
    onRegBtnClick: values => dispatch(reg(values, regAction)),
    onCheckSession: () => dispatch(checkSession(loginAction)),
    onCloseRegUI: () => dispatch(closeRegUI())
});
export default injectIntl(connect(
    mapStateToProps,
    mapDispatchToProps
)(GUIComponent));
