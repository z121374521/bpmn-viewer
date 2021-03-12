import Vue from 'vue';
import App from './App.vue';
import BpmnViewer from '../index.js';
Vue.use(BpmnViewer);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');
