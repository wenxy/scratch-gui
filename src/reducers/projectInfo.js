import {Message} from '@alifd/next';
import {getProjectInfoService, smileOrCryService} from '../lib/http/service';
import log from '../lib/log';

const initialState = {
    projectInfo: null
};

const updateProjectAction = data => ({
    type: 'update',
    data
});

const smileAction = () => ({
    type: 'smile'
});


const cryAction = () => ({
    type: 'cry'
});

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case 'update':
        return Object.assign({}, state, action.data);
    case 'smile': {
        const newSmile = ++state.smile;
        const newState = {smile: newSmile};
        const rtn = Object.assign({}, state, newState);
        return rtn;
    }
    case 'cry': {
        const newCry = ++state.cry;
        const newState = {cry: newCry};
        return Object.assign({}, state, newState);
    }
    default:
        return state;
    }
};

const getProjectInfo = (projectId, actionFunc) => dispatch => {
    console.log('get project info 111-> ', projectId);

    Message.show({
        title: '请稍后...',
        type: 'loading',
        hasMask: true,
        duration: 0
    });
    getProjectInfoService(projectId).then(data => {
        console.log('get project info ', projectId, data);
        const action = actionFunc(data);
        Message.hide();
        dispatch(action);
    })
        .catch(error => {
            log.error(`get projectInfo fail.${error}`);
            Message.show({
                title: '获取数据失败，请稍后再试.',
                type: 'error',
                hasMask: true,
                duration: 3000
            });
        });
};

const smile = (projectId, actionFunc) => dispatch => {
    smileOrCryService(projectId, 1).then(data => {

        if (data && data === 'true'){
            const action = actionFunc(data);
            Message.hide();
            dispatch(action);
        } else {
            Message.show({
                title: data,
                type: 'notice',
                hasMask: true,
                duration: 3000
            });
        }
    })
        .catch(error => {
            log.error(`smile fail.${error}`);
            Message.show({
                title: `${error}`,
                type: 'error',
                hasMask: true,
                duration: 3000
            });
        });
};

const cry = (projectId, actionFunc) => dispatch => {
    smileOrCryService(projectId, 0).then(data => {
        if (data && data === 'true'){
            const action = actionFunc(data);
            Message.hide();
            dispatch(action);
        } else {
            Message.show({
                title: data,
                type: 'notice',
                hasMask: true,
                duration: 3000
            });
        }

    })
        .catch(error => {
            log.error(`smile fail.${error}`);
            Message.show({
                title: `${error}`,
                type: 'error',
                hasMask: true,
                duration: 3000
            });
        });
};

export {
    reducer as default,
    initialState as projectInfoInitialState,
    getProjectInfo,
    updateProjectAction,
    cry,
    smile,
    smileAction,
    cryAction
};
