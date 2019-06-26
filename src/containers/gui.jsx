import PropTypes from 'prop-types';
import React from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';
import ReactModal from 'react-modal';
import VM from 'scratch-vm';
import {defineMessages, injectIntl, intlShape} from 'react-intl';

import {Message} from '@alifd/next'

import ErrorBoundaryHOC from '../lib/error-boundary-hoc.jsx';
import {
    getIsError,
    getIsShowingProject
} from '../reducers/project-state';
import {setProjectTitle} from '../reducers/project-title';
import {
    activateTab,
    BLOCKS_TAB_INDEX,
    COSTUMES_TAB_INDEX,
    SOUNDS_TAB_INDEX
} from '../reducers/editor-tab';

import {
    closeCostumeLibrary,
    closeBackdropLibrary,
    closeTelemetryModal,
    openExtensionLibrary
} from '../reducers/modals';

import FontLoaderHOC from '../lib/font-loader-hoc.jsx';
import LocalizationHOC from '../lib/localization-hoc.jsx';
import ProjectFetcherHOC from '../lib/project-fetcher-hoc.jsx';
import ProjectSaverHOC from '../lib/project-saver-hoc.jsx';
import QueryParserHOC from '../lib/query-parser-hoc.jsx';
import storage from '../lib/storage';
import vmListenerHOC from '../lib/vm-listener-hoc.jsx';
import vmManagerHOC from '../lib/vm-manager-hoc.jsx';
import cloudManagerHOC from '../lib/cloud-manager-hoc.jsx';
import Loader from '../components/loader/loader.jsx';

// import GUIComponent from '../components/gui/gui.jsx';
import {setIsScratchDesktop} from '../lib/isScratchDesktop.js';

import VideoProvider from '../lib/video/video-provider';
// import GoogleAnalytics from '../lib/analytics.js';

const messages = defineMessages({
    defaultProjectTitle: {
        id: 'gui.gui.defaultProjectTitle',
        description: 'Default title for project',
        defaultMessage: 'Scratch Project'
    }
});

class GUI extends React.Component {
    componentDidMount () {
        setIsScratchDesktop(this.props.isScratchDesktop);
        this.setReduxTitle(this.props.projectTitle);
        this.props.onStorageInit(storage);

        // Use setTimeout. Do not use requestAnimationFrame or a resolved
        // Promise. We want this work delayed until after the data request is
        // made.
        setTimeout(this.ensureRenderer.bind(this));

        // Once the GUI component has been rendered, always render GUI and do
        // not revert back to a Loader in this component.
        //
        // This makes GUI container not a pure component. We don't want to use
        // state for this. That would possibly cause a full second render of GUI
        // after the first one.
        const {fontsLoaded, fetchingProject, isLoading} = this.props;
        this.isAfterGUI = this.isAfterGUI || (
            fontsLoaded && !fetchingProject && !isLoading
        );
    }
    componentDidUpdate (prevProps) {
        if (this.props.projectId !== prevProps.projectId && this.props.projectId !== null) {
            this.props.onUpdateProjectId(this.props.projectId);
        }
        if (this.props.projectTitle !== prevProps.projectTitle) {
            this.setReduxTitle(this.props.projectTitle);
        }
        if (this.props.isShowingProject && !prevProps.isShowingProject) {
            // this only notifies container when a project changes from not yet loaded to loaded
            // At this time the project view in www doesn't need to know when a project is unloaded
            this.props.onProjectLoaded();
        }

        // Once the GUI component has been rendered, always render GUI and do
        // not revert back to a Loader in this component.
        //
        // This makes GUI container not a pure component. We don't want to use
        // state for this. That would possibly cause a full second render of GUI
        // after the first one.
        const {fontsLoaded, fetchingProject, isLoading} = this.props;
        this.isAfterGUI = this.isAfterGUI || (
            fontsLoaded && !fetchingProject && !isLoading
        );
    }
    setReduxTitle (newTitle) {
        if (newTitle === null || typeof newTitle === 'undefined') {
            this.props.onUpdateReduxProjectTitle(
                this.props.intl.formatMessage(messages.defaultProjectTitle)
            );
        } else {
            this.props.onUpdateReduxProjectTitle(newTitle);
        }
    }
    ensureRenderer () {
        /* if (this.props.vm.renderer) {
            return;
        } */

        // Wait to load svg-renderer and render after the data request. This
        // way the data request is made earlier.
        const Renderer = require('scratch-render');
        const {
            SVGRenderer: V2SVGAdapter,
            BitmapAdapter: V2BitmapAdapter
        } = require('scratch-svg-renderer');

        const vm = this.props.vm;
        this.canvas = null;
        this.canvas = document.createElement('canvas');
        this.renderer = new Renderer(this.canvas);
        vm.attachRenderer(this.renderer);

        vm.attachV2SVGAdapter(new V2SVGAdapter());
        vm.attachV2BitmapAdapter(new V2BitmapAdapter());

        // Only attach a video provider once because it is stateful
        vm.setVideoProvider(new VideoProvider());

        // Calling draw a single time before any project is loaded just
        // makes the canvas white instead of solid black–needed because it
        // is not possible to use CSS to style the canvas to have a
        // different default color


        // 加载作品
        const projectUrl = window.projectUrl;
        const projectId = window.projectId || 0;
        const projectTitle = window.projectTitle || '编程作品示例';
        if ((typeof projectUrl) !== 'undefined' && projectUrl !== '') {
            fetch(projectUrl, {method: 'GET'})
                .then(response => response.blob())
                .then(blob => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        this.props.onUpdateProjectId(projectId);
                        this.setReduxTitle(projectTitle);
                        vm.loadProject(reader.result)
                            .then(() => {
                                vm.renderer.draw();
                            });
                    };
                    reader.readAsArrayBuffer(blob);
                })
                .catch(err => {
                    Message.show({
                        type: 'error',
                        content: `加载异常${err}`
                    });
                });
        }
    }
    render () {
        if (this.props.isError) {
            throw new Error(
                `Error in Scratch GUI [location=${window.location}]: ${this.props.error}`);
        }
        const {
            /* eslint-disable no-unused-vars */
            assetHost,
            cloudHost,
            error,
            fontsLoaded,
            isError,
            isScratchDesktop,
            isShowingProject,
            onProjectLoaded,
            onStorageInit,
            onUpdateProjectId,
            onUpdateReduxProjectTitle,
            projectHost,
            projectId,
            projectTitle,
            /* eslint-enable no-unused-vars */
            children,
            fetchingProject,
            isLoading,
            loadingStateVisible,
            ...componentProps
        } = this.props;

        if (!this.isAfterGUI && (
            !fontsLoaded || fetchingProject || isLoading
        )) {
            // Make sure a renderer exists.
            if (fontsLoaded && !fetchingProject) this.ensureRenderer();
            return <Loader />;
        }
        const canShare = false;
        const showBranding = false;
        const GUIComponent = require('../components/gui/gui.jsx').default;
        return (
            <GUIComponent
                canShare={canShare}
                loading={fetchingProject || isLoading || loadingStateVisible}
                showBranding={showBranding}
                {...componentProps}
            >
                {children}
            </GUIComponent>
        );
    }
}

GUI.propTypes = {
    assetHost: PropTypes.string,
    children: PropTypes.node,
    cloudHost: PropTypes.string,
    error: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    fetchingProject: PropTypes.bool,
    fontsLoaded: PropTypes.bool,
    intl: intlShape,
    isError: PropTypes.bool,
    isLoading: PropTypes.bool,
    isScratchDesktop: PropTypes.bool,
    isShowingProject: PropTypes.bool,
    loadingStateVisible: PropTypes.bool,
    loginVisible: PropTypes.bool,
    onProjectLoaded: PropTypes.func,
    onSeeCommunity: PropTypes.func,
    onStorageInit: PropTypes.func,
    onUpdateProjectId: PropTypes.func,
    onUpdateProjectTitle: PropTypes.func,
    onUpdateReduxProjectTitle: PropTypes.func,
    projectHost: PropTypes.string,
    projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    projectTitle: PropTypes.string,
    telemetryModalVisible: PropTypes.bool,
    vm: PropTypes.instanceOf(VM).isRequired
};

GUI.defaultProps = {
    isScratchDesktop: false,
    onStorageInit: storageInstance => storageInstance.addOfficialScratchWebStores(),
    onProjectLoaded: () => {},
    onUpdateProjectId: () => {}
};

const mapStateToProps = state => {
    const loadingState = state.scratchGui.projectState.loadingState;
    return {
        activeTabIndex: state.scratchGui.editorTab.activeTabIndex,
        alertsVisible: state.scratchGui.alerts.visible,
        loginVisible: state.loginReg.funcLogin,
        regVisible: state.loginReg.funcReg,
        backdropLibraryVisible: state.scratchGui.modals.backdropLibrary,
        blocksTabVisible: state.scratchGui.editorTab.activeTabIndex === BLOCKS_TAB_INDEX,
        cardsVisible: state.scratchGui.cards.visible,
        connectionModalVisible: state.scratchGui.modals.connectionModal,
        costumeLibraryVisible: state.scratchGui.modals.costumeLibrary,
        costumesTabVisible: state.scratchGui.editorTab.activeTabIndex === COSTUMES_TAB_INDEX,
        error: state.scratchGui.projectState.error,
        fontsLoaded: state.scratchGui.fontsLoaded,
        isError: getIsError(loadingState),
        isFullScreen: state.scratchGui.mode.isFullScreen,
        isPlayerOnly: state.scratchGui.mode.isPlayerOnly,
        isRtl: state.locales.isRtl,
        isShowingProject: getIsShowingProject(loadingState),
        loadingStateVisible: state.scratchGui.modals.loadingProject,
        projectId: state.scratchGui.projectState.projectId,
        soundsTabVisible: state.scratchGui.editorTab.activeTabIndex === SOUNDS_TAB_INDEX,
        targetIsStage: (
            state.scratchGui.targets.stage &&
            state.scratchGui.targets.stage.id === state.scratchGui.targets.editingTarget
        ),
        telemetryModalVisible: state.scratchGui.modals.telemetryModal,
        tipsLibraryVisible: state.scratchGui.modals.tipsLibrary,
        vm: state.scratchGui.vm
    };
};

const mapDispatchToProps = dispatch => ({
    onExtensionButtonClick: () => dispatch(openExtensionLibrary()),
    onActivateTab: tab => dispatch(activateTab(tab)),
    onActivateCostumesTab: () => dispatch(activateTab(COSTUMES_TAB_INDEX)),
    onActivateSoundsTab: () => dispatch(activateTab(SOUNDS_TAB_INDEX)),
    onRequestCloseBackdropLibrary: () => dispatch(closeBackdropLibrary()),
    onRequestCloseCostumeLibrary: () => dispatch(closeCostumeLibrary()),
    onRequestCloseTelemetryModal: () => dispatch(closeTelemetryModal()),
    onUpdateReduxProjectTitle: title => dispatch(setProjectTitle(title))
});

const ConnectedGUI = injectIntl(connect(
    mapStateToProps,
    mapDispatchToProps,
)(GUI));

// note that redux's 'compose' function is just being used as a general utility to make
// the hierarchy of HOC constructor calls clearer here; it has nothing to do with redux's
// ability to compose reducers.
const WrappedGui = compose(
    LocalizationHOC,
    ErrorBoundaryHOC('Top Level App'),
    FontLoaderHOC,
    QueryParserHOC,
    ProjectFetcherHOC,
    ProjectSaverHOC,
    vmListenerHOC,
    vmManagerHOC,
    cloudManagerHOC
)(ConnectedGUI);

WrappedGui.setAppElement = ReactModal.setAppElement;
export default WrappedGui;
