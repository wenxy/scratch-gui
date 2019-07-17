import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {Form, Input, Grid} from '@alifd/next';

import styles from './login-ui.css';

const FormItem = Form.Item;
const {Row, Col} = Grid;

const LoginUI = ({
    className,
    onLoginBtnClick
}) => (
    <React.Fragment>
        <Form
            className={classNames(styles.form, className)}
            labelAlign="inset"
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
                />
            </FormItem>
            <FormItem label=" ">
                <Row>
                    <Col>
                        <Form.Submit
                            validate
                            className={classNames(styles['form-sumbit'], className)}
                            type={'primary'}
                            onClick={onLoginBtnClick}
                        >
                            {'登录'}
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

LoginUI.propTypes = {
    className: PropTypes.string,
    onLoginBtnClick: PropTypes.func
};
export default LoginUI;
