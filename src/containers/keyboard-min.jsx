import React from 'react';
import bindAll from 'lodash.bindall';
import connect from 'react-redux/es/connect/connect';

import iconLeft from './icon--left.svg';
import {Button, Icon} from '@alifd/next';

import {Grid} from '@alifd/next';
import styles from '../components/gui/gui.css';
const {Row, Col} = Grid;

class Keyboard extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'fireKeyEvent',
            'handleLeftDown'
        ]);
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

    componentDidMount () {
        document.onkeydown = evt => {
            console.log(' key is down ', evt.keyCodeVal);
        };
    }

    handleLeftDown (){
        console.log('this.leftKey-->', this.leftKey);
        this.fireKeyEvent(this.leftKey, 'keydown', 13);
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
        return (
            <Row
                align="center"
                justify="center"
            >
                <Col
                    align="center"
                    xs={12}
                    xxs={24}
                >

                    <Row>
                        <Col
                            span={1}
                        />
                        <Col>
                            <button
                                className={styles.extensionButton}
                                ref={leftKey => {
                                    this.leftKey = leftKey;
                                }}
                                onClick={this.handleLeftDown}
                            >
                                <img
                                    src={iconLeft}
                                    style={{
                                        width: '60px',
                                        height: '60px'
                                    }}
                                />
                            </button>
                        </Col>
                        <Col
                            span={1}
                        />
                    </Row>
                    <Row>
                        <Col
                            span={1}
                        />
                        <Col>
                            <button
                                className={styles.extensionButton}
                                ref={leftKey => {
                                    this.leftKey = leftKey;
                                }}
                                onClick={this.handleLeftDown}
                            >
                                <img
                                    src={iconLeft}
                                    style={{
                                        width: '60px',
                                        height: '60px'
                                    }}
                                />
                            </button>
                            <button
                                className={styles.extensionButton}
                                ref={leftKey => {
                                    this.leftKey = leftKey;
                                }}
                                onClick={this.handleLeftDown}
                            >
                                <img
                                    src={iconLeft}
                                    style={{
                                        width: '60px',
                                        height: '60px'
                                    }}
                                />
                            </button>
                        </Col>
                        <Col
                            span={1}
                        />
                    </Row>
                </Col>
            </Row>
        );
    }
}

Keyboard.propTypes = {

};

Keyboard.defaultProps = {

};

const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({

});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Keyboard);
