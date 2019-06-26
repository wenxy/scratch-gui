import PropTypes from 'prop-types';
import React from 'react';
import VM from 'scratch-vm';

import {STAGE_DISPLAY_SIZES} from '../../lib/layout-constants.js';
import StageHeader from '../../containers/stage-header.jsx';
import Stage from '../../containers/stage.jsx';
import Loader from '../loader/loader.jsx';

import styles from './stage-wrapper.css';

import {Grid} from '@alifd/next';
const {Row, Col} = Grid;

const StageWrapperComponent = function (props) {
    const {
        isFullScreen,
        isRtl,
        isRendererSupported,
        loading,
        stageSize,
        vm,
        showBranding
    } = props;
    return (
        <div className={styles['stage-wrap']}>
            {/* <Row
                align="center"
                justify="center"
                style={{
                    background: '#fff',
                    margin: '5px 5px'
                }}
            >
                <Col
                    xs={6}
                    xxs={0}
                />
                <Col
                    align="center"
                    justify="center"
                    xs={12}
                    xxs={24}
                >
                    <h2>作品标题</h2>
                </Col>
                <Col
                    xs={6}
                    xxs={0}
                />
            </Row>*/}
            <Row
                justify="start"
                style={{
                    background: '#e5f0ff',
                    marginTop: '1px'
                }}
            >
                <Col
                    xs={6}
                    xxs={0}
                />
                <Col
                    align="center"
                    justify="center"
                    xs={12}
                    xxs={24}
                >
                    <StageHeader
                        showBranding={showBranding}
                        stageSize={stageSize}
                        vm={vm}
                    />
                </Col>
                <Col
                    xs={6}
                    xxs={0}
                />
            </Row>
            <Row
                align="center"
                justify="center"
            >
                <Col
                    xs={6}
                    xxs={0}
                />
                <Col
                    align="center"
                    data="124"
                    style={{
                        background: '#fffff'
                    }}
                    xs={12}
                    xxs={24}
                >
                    {
                        isRendererSupported ?
                            <Stage
                                stageSize={stageSize}
                                vm={vm}
                            /> :
                            null
                    }
                </Col>
                <Col
                    xs={6}
                    xxs={0}
                />
            </Row>


            {loading ? (
                <Loader isFullScreen={isFullScreen} />
            ) : null}
        </div>

    );
};

StageWrapperComponent.propTypes = {
    isFullScreen: PropTypes.bool,
    isRendererSupported: PropTypes.bool.isRequired,
    isRtl: PropTypes.bool.isRequired,
    loading: PropTypes.bool,
    showBranding: PropTypes.bool,
    stageSize: PropTypes.oneOf(Object.keys(STAGE_DISPLAY_SIZES)).isRequired,
    vm: PropTypes.instanceOf(VM).isRequired
};

export default StageWrapperComponent;
