import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {projectTitleInitialState} from '../reducers/project-title';
import saveCloudBlob from '../lib/save-cloud-blob';
import {Message} from '@alifd/next';
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
                duration: 3
            });
            return;
        }
        // console.log('projectId==>', this.props.projectId);
        this.props.saveProjectSb3().then(content => {
            if (this.props.onSaveFinished) {
                this.props.onSaveFinished();
            }
            saveCloudBlob(this.props.projectId, this.props.projectFilename, content);
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
    projectId: getProjectId(state.scratchGui.projectId,'0'),
    projectFilename: getProjectFilename(state.scratchGui.projectTitle, projectTitleInitialState)
});

export default connect(
    mapStateToProps,
    () => ({}) // omit dispatch prop
)(SB3SaveCloud);
