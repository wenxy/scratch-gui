/*
NOTE: this file only temporarily resides in scratch-gui.
Nearly identical code appears in scratch-www, and the two should
eventually be consolidated.
*/

import {injectIntl} from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';

import AccountNavComponent from '../components/menu-bar/account-nav.jsx';
import {loginOut, loginOutAction} from '../reducers/session';

const AccountNav = function (props) {
    const {
        ...componentProps
    } = props;
    return (
        <AccountNavComponent
            {...componentProps}
        />
    );
};

AccountNav.propTypes = {
    classroomId: PropTypes.string,
    isEducator: PropTypes.bool,
    isRtl: PropTypes.bool,
    isStudent: PropTypes.bool,
    profileUrl: PropTypes.string,
    thumbnailUrl: PropTypes.string,
    username: PropTypes.string
};

const mapStateToProps = state => ({
    classroomId: state.session && state.session.session && state.session.session.userInfo ?
        state.session.session.userInfo.classroomId : '',
    // isEducator: state.auth && state.auth.permissions && state.auth.permissions.educator,
    // isStudent: state.auth && state.auth.permissions && state.auth.permissions.student,
    profileUrl: state.session && state.session.session ? `/users/${state.session.userInfo.userName}` : '',
    thumbnailUrl: state.session && state.session.userInfo.avatarUrl ? state.session.userInfo.avatarUrl : null,
    username: state.session && state.session.userInfo.userName ? state.session.userInfo.userName : null
});

const mapDispatchToProps = dispatch => ({
    onLogOut: () => {
        // logOut
        dispatch(loginOut(loginOutAction));
    }
});

export default injectIntl(connect(
    mapStateToProps,
    mapDispatchToProps
)(AccountNav));
