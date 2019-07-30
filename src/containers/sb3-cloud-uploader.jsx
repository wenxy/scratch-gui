import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {projectTitleInitialState} from '../reducers/project-title';
import saveCloudBlob from '../lib/save-cloud-blob';
import {Message, Dialog} from '@alifd/next';
/**
 * Project saver component passes a downloadProject function to its child.
 * It expects this child to be a function with the signature
 *     function (downloadProject, props) {}
 * The component can then be used to attach project saving functionality
 * to any other component:
 *
 * <SB3Downloader>{(downloadProject, props) => (
 *     <MyCoolComponent
 *         onClick={downloadProject}
 *         {...props}
 *     />
 * )}</SB3Downloader>
 */
class SB3SaveCloud extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'saveCloudProject'
        ]);
    }
    saveCloudProject () {
        if (!this.props.isLogined) {
            Message.show({
                title: '请先登录...',
                type: 'notice',
                hasMask: true,
                duration: 3000
            });
            return;
        }
        // console.log('projectId==>', this.props.projectId);
        this.props.saveProjectSb3().then(content => {
            if (this.props.onSaveFinished) {
                this.props.onSaveFinished();
            }
            saveCloudBlob(window.projectId || 0, this.props.projectFilename, content, data => {
                // const search = window.location.search;
                const playCodeUrl = (
                    <img
                        src={data.playQrCodeURl}
                        style={{
                            width: `200px`,
                            height: '200px'
                        }}
                    />
                );

                Dialog.show({
                    title: '请微信扫码，完成打卡',
                    content: playCodeUrl,
                    closeable: false,
                    onOk: () => {
                        Message.hide();
                        if (this.props.projectId === data.projectId) {
                            console.log('地址栏存在projectId参数，不跳转');
                        } else {
                            window.projectId = data.projectId;
                        }
                    },
                    onCancel: () => {
                        Message.hide();
                        if (this.props.projectId === data.projectId) {
                            console.log('地址栏存在projectId参数，不跳转');
                        } else {
                            window.projectId = data.projectId;
                        }
                        /* else {
                            window.onbeforeunload = () => {}
                            const href = window.location.href;
                            if (href.indexOf('?') === -1) {
                                window.location.href = `${href}?projectId=${data.projectId}`;
                            } else {
                                window.location.href = `${href}&projectId=${data.projectId}`;
                            }
                        } */
                    }
                });
            });
        });
    }
    render () {
        const {
            children
        } = this.props;
        return children(
            this.props.className,
            this.saveCloudProject
        );
    }
}
const getProjectId = (curProjectId, defalutProjectId) => {
    let projectId = curProjectId;
    if (!projectId || projectId.length === 0) {
        projectId = defalutProjectId;
    }
    return projectId;
};

const getProjectFilename = (curTitle, defaultTitle) => {
    let filenameTitle = curTitle;
    if (!filenameTitle || filenameTitle.length === 0) {
        filenameTitle = defaultTitle;
    }
    return `${filenameTitle.substring(0, 100)}.sb3`;
};

SB3SaveCloud.propTypes = {
    children: PropTypes.func,
    className: PropTypes.string,
    isLogined: PropTypes.bool,
    onSaveFinished: PropTypes.func,
    projectFilename: PropTypes.string,
    projectId: PropTypes.string,
    saveProjectSb3: PropTypes.func
};
SB3SaveCloud.defaultProps = {
    className: ''
};

const mapStateToProps = state => ({
    saveProjectSb3: state.scratchGui.vm.saveProjectSb3.bind(state.scratchGui.vm),
    isLogined: !!state.session,
    projectId: getProjectId(state.scratchGui.projectId, '0'),
    projectFilename: getProjectFilename(state.scratchGui.projectTitle, projectTitleInitialState)
});
const mapDispatchToProps = dispatch => ({
    // onSetProjectUnchanged: () => dispatch(setProjectUnchanged())
});


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SB3SaveCloud);
