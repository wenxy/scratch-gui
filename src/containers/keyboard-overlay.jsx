import bindAll from 'lodash.bindall';
import React from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';
import VM from 'scratch-vm';
import layout from '../lib/layout-constants';

import {Grid} from '@alifd/next';
const {Row, Col} = Grid;

import iconRight from './icon--right.svg';
import iconLeft from './icon--left.svg';
import iconUp from './icon--up.svg';
import iconDown from './icon--down.svg';
import iconEnter from './icon--enter.svg';

class KeyboardOverlay extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleDown',
            'handleUp',
            'handleLeft',
            'handleRight',
            'handleAttack'
        ]);
    }

    componentDidMount () {
        document.onkeydown = evt => {
            console.log(' key is down ', evt.keyCodeVal);
        };
    }

    /*
     *
     * case 8: keyName = "[退格]"; break;
     case 9: keyName = "[制表]"; break;
     case 13:keyName = "[回车]"; break;
     case 32:keyName = "[空格]"; break;
     case 33:keyName = "[PageUp]";   break;
     case 34:keyName = "[PageDown]";   break;
     case 35:keyName = "[End]";   break;
     case 36:keyName = "[Home]";   break;
     case 37:keyName = "[方向键左]";   break;
     case 38:keyName = "[方向键上]";   break;
     case 39:keyName = "[方向键右]";   break;
     case 40:keyName = "[方向键下]";   break;
     case 46:keyName = "[删除]";   break;
     */
    handleDown (){
        this.fireKeyEvent(this.downKey, 'keydown', 40);
    }
    handleUp (){
        this.fireKeyEvent(this.upKey, 'keydown', 38);
    }
    handleLeft (){
        this.fireKeyEvent(this.leftKey, 'keydown', 37);
    }
    handleRight (){
        this.fireKeyEvent(this.rightKey, 'keydown', 39);
    }
    handleAttack (){
        this.fireKeyEvent(this.attackKey, 'keydown', 32);
    }

    fireKeyEvent (el, evtType, keyCode){
        const doc = el.ownerDocument;
        const win = doc.defaultView || doc.parentWindow;
        let evtObj;
        if (doc.createEvent){
            if (win.KeyEvent) {
                evtObj = doc.createEvent('KeyEvents');
                evtObj.initKeyEvent(evtType, true, true, win, false, false, false, false, keyCode, 0);
            } else {
                evtObj = doc.createEvent('UIEvents');
                Object.defineProperty(evtObj, 'keyCode', {
                    get: function () {
                        return this.keyCodeVal;
                    }
                });
                Object.defineProperty(evtObj, 'which', {
                    get: function () {
                        return this.keyCodeVal;
                    }
                });
                evtObj.initUIEvent(evtType, true, true, win, 1);
                evtObj.keyCodeVal = keyCode;
                if (evtObj.keyCode !== keyCode) {
                    console.log(`keyCode ${evtObj.keyCode} 和 (${evtObj.which}) 不匹配`);
                }
            }
            el.dispatchEvent(evtObj);
        } else if (doc.createEventObject){
            evtObj = doc.createEventObject();
            evtObj.keyCode = keyCode;
            el.fireEvent(`on${evtType}`, evtObj);
        }
    }


    render () {
        if (!this.props.isStarted) return null;
        if (!layout.isMobile) return null;
        return (
            <div>
                <div
                    style={{
                        position: 'absolute',
                        top: `${this.props.stageHeight - 150}px`,
                        left: `0px`,
                        width: `150px`,
                        height: `150px`,
                        overflow: 'hidden',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        background: '#e5f0ff4a',
                        borderRadius: '2rem'
                    }}
                >
                    <div>
                        <Row>
                            <Col
                                span="8"
                            />
                            <Col
                                span="8"
                                style={{

                                }}
                            >
                                <a
                                    ref={upKey => {
                                        this.upKey = upKey;
                                    }}
                                    onClick={this.handleUp}
                                >
                                    <img
                                        src={iconUp}
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            cursor: 'pointer',
                                            opacity: '0.5'
                                        }}
                                    />
                                </a>
                            </Col>
                            <Col
                                span="8"
                            />
                        </Row>
                        <Row>
                            <Col
                                span="8"
                            >
                                <a
                                    ref={leftKey => {
                                        this.leftKey = leftKey;
                                    }}
                                    onClick={this.handleLeft}
                                >
                                    <img
                                        src={iconLeft}
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            cursor: 'pointer',
                                            opacity: '0.5'
                                        }}
                                    />
                                </a>
                            </Col>
                            <Col
                                span="8"
                                style={{

                                }}
                            />
                            <Col
                                span="8"
                            >
                                <a
                                    ref={rightKey => {
                                        this.rightKey = rightKey;
                                    }}
                                    onClick={this.handleRight}
                                >
                                    <img
                                        src={iconRight}
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            cursor: 'pointer',
                                            opacity: '0.5'
                                        }}
                                    />
                                </a>
                            </Col>
                        </Row>
                        <Row>
                            <Col
                                span="8"
                            />
                            <Col
                                span="8"
                                style={{

                                }}
                            >
                                <a
                                    ref={downKey => {
                                        this.downKey = downKey;
                                    }}
                                    onClick={this.handleDown}
                                >
                                    <img
                                        src={iconDown}
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            cursor: 'pointer',
                                            opacity: '0.5'
                                        }}
                                    />
                                </a>
                            </Col>
                            <Col
                                span="8"
                            />
                        </Row>
                    </div>
                </div>
                <div
                    style={{
                        position: 'absolute',
                        top: `${this.props.stageHeight - 70}px`,
                        right: `10px`,
                        width: `60px`,
                        height: `60px`,
                        overflow: 'hidden',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        background: '#e5f0ff4a',
                        borderRadius: '60px'
                    }}
                >
                    <a
                        ref={attackKey => {
                            this.attackKey = attackKey;
                        }}
                        onClick={this.handleAttack}
                    >
                        <img
                            src={iconEnter}
                            style={{
                                width: '60px',
                                height: '60px',
                                cursor: 'pointer',
                                opacity: '0.6'
                            }}
                        />
                    </a>
                </div>
            </div>
        );
    }
}

KeyboardOverlay.propTypes = {
    className: PropTypes.string,
    isStarted: PropTypes.bool,
    stageHeight: PropTypes.number,
    stageWidth: PropTypes.number,
    vm: PropTypes.instanceOf(VM),
    wrapperClass: PropTypes.string
};

const mapStateToProps = state => ({
    isStarted: state.scratchGui.vmStatus.started,
    vm: state.scratchGui.vm
});

const mapDispatchToProps = () => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(KeyboardOverlay);
