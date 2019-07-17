const SET_PROJECT_ID = 'projectTitle/SET_PROJECT_ID';

// we are initializing to a blank string instead of an actual title,
// because it would be hard to localize here
const initialState = '';

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case SET_PROJECT_ID:
        return action.projectId;
    default:
        return state;
    }
};

const setProjectId = projectId => ({
    type: SET_PROJECT_ID,
    projectId: projectId
});

export {
    reducer as default,
    initialState as projectIdInitialState,
    setProjectId
};
