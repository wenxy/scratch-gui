import React from 'react';
import {Button, Dialog, Message} from '@alifd/next';
import PropTypes from 'prop-types';
import log from '../../lib/log';
import {getWeixinLoginQRcodeService, checkWxLoginService} from '../../lib/http/service';
import bindAll from 'lodash.bindall';

const imgStyle = {
    height: '200px',
    width: '200px'
};

const pStyle = {
    fontSize: '14px',
    color: 'orange'
};
class WeixinQRCode extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            qrcodeUrl: '',
            visible: true
        };
        bindAll(this, [
            'okClick'
        ]);
    }


    componentDidMount () {
        getWeixinLoginQRcodeService().then(data => {
            log.info('get weixin qrcode ', data);
            this.setState({
                qrcodeUrl: data.qcodeUrl,
                uuid: data.uuid
            });
        })
            .catch(err => {
                Message.show({
                    title: `登录失败${err}`,
                    type: 'notice',
                    hasMask: true,
                    duration: 3
                });
            });


        this.timerID = setInterval(() => {
            checkWxLoginService(this.state.uuid).then(data => {
                log.info('check wx login', data);
                if (data){
                    this.props.onCheckSession();
                    this.setState({visible: false});
                    clearInterval(this.timerID);
                }
            })
                .catch(err => {
                    log.error(err);
                });
        }, 10000);
    }
    componentWillUnmount () {
        clearInterval(this.timerID);
    }

    okClick () {
        log.debug('i am okClick btn.');
        this.setState({visible: false});

        clearInterval(this.timerID);
    }
    render () {
        const visible = this.state.visible && this.props.needLogin && !!this.state.qrcodeUrl;
        return (
            <Dialog
                closeable={false}
                footer={
                    <Button
                        warning
                        type="primary"
                        onClick={this.okClick}
                    >
                        我已经完成微信授权
                    </Button>}
                height="350px"
                title="微信授权登录"
                visible={visible}
            >
                <img
                    src={this.state.qrcodeUrl}
                    style={imgStyle}
                />
                <p style={pStyle}>请使用购买教程的微信进行授权</p>
            </Dialog>
        );
    }
}


WeixinQRCode.propTypes = {
    needLogin: PropTypes.bool,
    onCheckSession: PropTypes.func
};
export default WeixinQRCode;
