export const INIT = 'INIT';

// action creators
export const actionCreators = {
    init(router) {
        return {
            type: INIT,
            router
        }
    }
};

function initR () {

}

// const boundInit = router => dispatch(init(router));

