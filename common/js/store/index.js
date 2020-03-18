import vue from 'vue';
import vuex from 'vuex';

import setLabel from './setLabel';

vue.use(vuex);
export default new vuex.Store({
    'modules': {
        setLabel
    }
});