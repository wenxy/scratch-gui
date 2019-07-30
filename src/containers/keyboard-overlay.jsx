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
            <div
                id={'keyboard-control-id'}
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '100%',
                    alignItems: 'center',
                    alignContent: 'center'
                }}
            >
                <div
                    style={{
                        margin: '10px'
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

                                <img
                                    ref={upKey => {
                                        this.upKey = upKey;
                                    }}
                                    src={iconUp}
                                    style={{
                                        width: '60px',
                                        height: '60px',
                                        cursor: 'pointer',
                                        opacity: '1'
                                    }}
                                    onClick={this.handleUp}
                                />

                            </Col>
                            <Col
                                span="8"
                            />
                        </Row>
                        <Row>
                            <Col
                                span="8"
                            >
                                <img
                                    ref={leftKey => {
                                        this.leftKey = leftKey;
                                    }}
                                    src={iconLeft}
                                    style={{
                                        width: '60px',
                                        height: '60px',
                                        cursor: 'pointer',
                                        opacity: '1',
                                        marginRight: '40px'
                                    }}
                                    onClick={this.handleLeft}
                                />
                            </Col>
                            <Col
                                span="8"
                                style={{

                                }}
                            />
                            <Col
                                span="8"
                            >
                                <img
                                    ref={rightKey => {
                                        this.rightKey = rightKey;
                                    }}
                                    src={iconRight}
                                    style={{
                                        width: '60px',
                                        height: '60px',
                                        cursor: 'pointer',
                                        opacity: '1'
                                    }}
                                    onClick={this.handleRight}
                                />
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
                                <img
                                    ref={downKey => {
                                        this.downKey = downKey;
                                    }}
                                    src={iconDown}
                                    style={{
                                        width: '60px',
                                        height: '60px',
                                        cursor: 'pointer',
                                        opacity: '1'
                                    }}
                                    onClick={this.handleDown}
                                />

                            </Col>
                            <Col
                                span="8"
                            />
                        </Row>
                    </div>
                </div>
                <div
                    style={{
                        margin: '10px'
                    }}
                >

                    <img
                        ref={attackKey => {
                            this.attackKey = attackKey;
                        }}
                        src={iconEnter}
                        style={{
                            width: '80px',
                            height: '80px',
                            cursor: 'pointer',
                            opacity: '1'
                        }}
                        onClick={this.handleAttack}
                    />
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
