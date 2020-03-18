export default {
    state: {
        labels: {
            label: '',
            status: 'done',
            types: 'label',
        },
    },
    getters: {
        getLabel(state) {
            return state.labels;
        }
    },
    mutations: {
        setLabel(state, labels) {
            state.labels = labels;
        }
    },
    actions: {
        setLabelAsync({commit}, labels) {
            commit('setLabel', labels);
        }
    }
};