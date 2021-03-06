import classNames from 'classnames';
import {defineMessages, injectIntl, intlShape} from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import VM from 'scratch-vm';

import Box from '../box/box.jsx';
import Button from '../button/button.jsx';
import Controls from '../../containers/controls.jsx';
import layout, {STAGE_SIZE_MODES} from '../../lib/layout-constants';

import largeStageIcon from './icon--large-stage.svg';
import smallStageIcon from './icon--small-stage.svg';
import unFullScreenIcon from './icon--unfullscreen.svg';
import gaibianIcon from './icon-gaibian.svg';

import scratchLogo from '../menu-bar/scratch-logo.svg';
import styles from './stage-header.css';

import {Grid} from '@alifd/next';
const {Row} = Grid;

import {setPlayer} from '../../reducers/mode';

const messages = defineMessages({
    largeStageSizeMessage: {
        defaultMessage: 'Switch to large stage',
        description: 'Button to change stage size to large',
        id: 'gui.stageHeader.stageSizeLarge'
    },
    smallStageSizeMessage: {
        defaultMessage: 'Switch to small stage',
        description: 'Button to change stage size to small',
        id: 'gui.stageHeader.stageSizeSmall'
    },
    fullStageSizeMessage: {
        defaultMessage: 'Enter full screen mode',
        description: 'Button to change stage size to full screen',
        id: 'gui.stageHeader.stageSizeFull'
    },
    unFullStageSizeMessage: {
        defaultMessage: 'Exit full screen mode',
        description: 'Button to get out of full screen mode',
        id: 'gui.stageHeader.stageSizeUnFull'
    },
    fullscreenControl: {
        defaultMessage: 'Full Screen Control',
        description: 'Button to enter/exit full screen mode',
        id: 'gui.stageHeader.fullscreenControl'
    }
});

const handleInside = () => {
    const projectId = window.projectId;
    const url = `http://sweetbiancheng.com/scratch/index.html?projectId=${projectId}`;
    window.location.href = url;
};

const StageHeaderComponent = function (props) {
    const {
        isFullScreen,
        isPlayerOnly,
        onKeyPress,
        onSetStageLarge,
        onSetStageSmall,
        onSetStageUnFull,
        showBranding,
        stageSizeMode,
        vm
    } = props;
    let header = null;

    if (isFullScreen) {
        const stageButton = showBranding ? (
            <div className={styles.embedScratchLogo}>
                <a
                    href="https://scratch.mit.edu"
                    rel="noopener noreferrer"
                    target="_blank"
                >
                    <img
                        alt="Scratch"
                        src={scratchLogo}
                    />
                </a>
            </div>
        ) : (
            <Button
                className={styles.stageButton}
                onClick={onSetStageUnFull}
                onKeyPress={onKeyPress}
            >
                <img
                    alt={props.intl.formatMessage(messages.unFullStageSizeMessage)}
                    className={styles.stageButtonIcon}
                    draggable={false}
                    src={unFullScreenIcon}
                    title={props.intl.formatMessage(messages.fullscreenControl)}
                />
            </Button>
        );
        header = (
            <Box className={styles.stageHeaderWrapperOverlay}>
                <Box
                    className={styles.stageMenuWrapper}
                >
                    <Controls vm={vm} />
                    {stageButton}
                </Box>
            </Box>
        );
    } else {
        const showEditCtr = isPlayerOnly && !layout.isMobile ? (
            <div className={styles.stageSizeToggleGroup}>
                <div>
                    <Button
                        className={classNames(
                            styles.stageButton,
                            styles.stageButtonFirst,
                            (stageSizeMode === STAGE_SIZE_MODES.small) ? null : styles.stageButtonToggledOff
                        )}
                        onClick={handleInside}
                    >
                        <img
                            alt={'改编此作品'}
                            className={styles.stageButtonIcon}
                            draggable={false}
                            src={gaibianIcon}
                        />
                    </Button>
                </div>
            </div>
        ) : null;
        const stageControls = !isPlayerOnly && !layout.isMobile ?
            (
                <div className={styles.stageSizeToggleGroup}>
                    <div>
                        <Button
                            className={classNames(
                                styles.stageButton,
                                styles.stageButtonFirst,
                                (stageSizeMode === STAGE_SIZE_MODES.small) ? null : styles.stageButtonToggledOff
                            )}
                            onClick={onSetStageSmall}
                        >
                            <img
                                alt={props.intl.formatMessage(messages.smallStageSizeMessage)}
                                className={styles.stageButtonIcon}
                                draggable={false}
                                src={smallStageIcon}
                            />
                        </Button>
                    </div>
                    <div>
                        <Button
                            className={classNames(
                                styles.stageButton,
                                styles.stageButtonLast,
                                (stageSizeMode === STAGE_SIZE_MODES.large) ? null : styles.stageButtonToggledOff
                            )}
                            onClick={onSetStageLarge}
                        >
                            <img
                                alt={props.intl.formatMessage(messages.largeStageSizeMessage)}
                                className={styles.stageButtonIcon}
                                draggable={false}
                                src={largeStageIcon}
                            />
                        </Button>
                    </div>
                </div>
            ) : null;
        header = (

            <Row
                justify="center"
                span="24"
                style={{
                    margin: '5px'
                }}
            >
                <Controls
                    vm={vm}
                />
                {showEditCtr}
                {stageControls}
                {/* <div>
                    <Button
                        className={styles.stageButton}
                        onClick={onSetStageFull}
                    >
                        <img
                            alt={props.intl.formatMessage(messages.fullStageSizeMessage)}
                            className={styles.stageButtonIcon}
                            draggable={false}
                            src={fullScreenIcon}
                            title={props.intl.formatMessage(messages.fullscreenControl)}
                        />
                    </Button>
                </div> */}
            </Row>

        );
    }

    return header;
};

const mapStateToProps = state => ({
    // This is the button's mode, as opposed to the actual current state
    stageSizeMode: state.scratchGui.stageSize.stageSize
});

StageHeaderComponent.propTypes = {
    intl: intlShape,
    isFullScreen: PropTypes.bool.isRequired,
    isPlayerOnly: PropTypes.bool.isRequired,
    onKeyPress: PropTypes.func.isRequired,
    onSeeInside: PropTypes.func,
    onSetStageFull: PropTypes.func.isRequired,
    onSetStageLarge: PropTypes.func.isRequired,
    onSetStageSmall: PropTypes.func.isRequired,
    onSetStageUnFull: PropTypes.func.isRequired,
    showBranding: PropTypes.bool.isRequired,
    stageSizeMode: PropTypes.oneOf(Object.keys(STAGE_SIZE_MODES)),
    vm: PropTypes.instanceOf(VM).isRequired
};

const mapDispatchToProps = dispatch => ({
    onSeeInside: () => dispatch(setPlayer(false))
});

StageHeaderComponent.defaultProps = {
    stageSizeMode: STAGE_SIZE_MODES.large
};

export default injectIntl(connect(
    mapStateToProps,
    mapDispatchToProps
)(StageHeaderComponent));
