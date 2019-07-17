import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {Form, Input, Grid} from '@alifd/next';

import styles from './login-ui.css';
import bindAll from 'lodash.bindall';

const FormItem = Form.Item;
const {Row, Col} = Grid;

class RegUI extends React.Component {


    constructor (props) {
        super(props);
        bindAll(this, [
            'validateFirstPwd',
            'validateTwicePwd'
        ]);
    }

    componentDidMount () {

    }
    componentWillUnmount () {

    }

    validateFirstPwd (rule, value, callback){
        if (typeof value === 'undefined' || value === ''){
            callback('请输入密码');
        }
        this.firstPwd = value;
        callback();
    }
    validateTwicePwd (rule, value, callback) {
        if (value && value !== this.firstPwd){
            callback('两次密码输入不一致');
        } else {
            callback();
        }

    }


    render () {

        return (
            <React.Fragment>
                <Form
                    className={classNames(styles.form, this.props.className)}
                    labelAlign="top"
                    labelTextAlign="left"
                >
                    <FormItem
                        required
                        asterisk={false}
                        label="账号"
                        requiredMessage="请输入账号"
                    >
                        <Input
                            id="userName"
                            name="userName"
                            placeholder="请输入您的登录账号（支持中文）"
                        />
                    </FormItem>

                    <FormItem
                        required
                        asterisk={false}
                        label="密码"
                        requiredMessage="请输入密码"
                        validator={this.validateFirstPwd}
                    >
                        <Input
                            htmlType="password"
                            id="password"
                            name="password"
                            placeholder="请输入您的登录密码"
                        />
                    </FormItem>

                    <FormItem
                        required
                        asterisk={false}
                        label="再次输入密码"
                        requiredMessage="再次请输入密码"
                        validator={this.validateTwicePwd}
                    >
                        <Input
                            htmlType="password"
                            id="password2"
                            name="password2"
                            placeholder="请输入您的登录密码"
                        />
                    </FormItem>
                    <FormItem label=" ">
                        <Row>
                            <Col>
                                <Form.Submit
                                    validate
                                    className={classNames(styles['form-sumbit'], this.props.className)}
                                    type={'primary'}
                                    onClick={this.props.onRegBtnClick}
                                >
                                    {'注册'}
                                </Form.Submit>
                            </Col>
                            <Col>
                                <Form.Reset
                                    className={classNames(styles['form-cancel'], this.props.className)}
                                >
                                    {'重置'}
                                </Form.Reset>
                            </Col>
                        </Row>
                    </FormItem>
                </Form>

            </React.Fragment>
        );
    }
}

/*
const RegUI = ({
    className,
    onRegBtnClick
}) => (
    <React.Fragment>
        <Form
            className={classNames(styles.form, className)}
            labelAlign="top"
            labelTextAlign="left"
        >
            <FormItem
                required
                asterisk={false}
                label="账号"
                requiredMessage="请输入账号"
            >
                <Input
                    id="userName"
                    name="userName"
                    placeholder="请输入您的登录账号"
                />
            </FormItem>

            <FormItem
                required
                asterisk={false}
                label="密码"
                requiredMessage="请输入密码"
            >
                <Input
                    htmlType="password"
                    id="password"
                    name="password"
                    placeholder="请输入您的登录密码"
                    ref={c => {
                        this.firstPwd = c;
                    }}
                />
            </FormItem>

            <FormItem
                required
                asterisk={false}
                label="再次输入密码"
                requiredMessage="再次请输入密码"
            >
                <Input
                    htmlType="password"
                    id="password"
                    name="password"
                    placeholder="请输入您的登录密码"
                />
            </FormItem>
            <FormItem label=" ">
                <Row>
                    <Col>
                        <Form.Submit
                            validate
                            className={classNames(styles['form-sumbit'], className)}
                            type={'primary'}
                            onClick={onRegBtnClick}
                        >
                            {'注册'}
                        </Form.Submit>
                    </Col>
                    <Col>
                        <Form.Reset
                            className={classNames(styles['form-cancel'], className)}
                        >
                            {'重置'}
                        </Form.Reset>
                    </Col>
                </Row>
            </FormItem>
        </Form>

    </React.Fragment>
);
*/

RegUI.propTypes = {
    className: PropTypes.string,
    onRegBtnClick: PropTypes.func
};
export default RegUI;
