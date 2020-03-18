import Vue from 'vue';
import App from './App';
import base from './common/js/base';
import NoData from './components/NoData';
import Update from './components/Update';

Vue.use(base);
Vue.config.productionTip = false;

Vue.component('NoData', NoData);
Vue.component('Update', Update);

App.mpType = 'app';

const app = new Vue({
    ...App
})
app.$mount()
