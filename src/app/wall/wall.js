import Vue from 'vue'
import VueRouter from 'vue-router'
import VueValidator from 'vue-validator'
import { sync } from 'vuex-router-sync'
import store from '../../vuex/store'

import configRouter from '../../router/wall'

import filters from '../../utils/filters'
import App from '../../components/Wall/App'

window.$ = window.jQuery = require('jquery');
var Bootstrap = require('bootstrap');
Bootstrap.$ = $
window._=require("lodash");
require('../../global/js/core.min');
import '../../lib/wall'
 
Vue.use(VueRouter)
Vue.use(VueValidator)
//Vue.use(require('vue-moment'));
Object.keys(filters).forEach(k => Vue.filter(k, filters[k]))

const router = new VueRouter({
  history: false,
  saveScrollPosition: true,
  suppressTransitionError: true
});

configRouter(router)
sync(store, router)

router.start(Vue.extend(App), '#root') 
window.router = router