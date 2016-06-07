import Vue from 'vue'
import VueRouter from 'vue-router'
import VueValidator from 'vue-validator'
import { sync } from 'vuex-router-sync'
import store from '../../vuex/store'
import configRouter from '../../router/admin'
import filters from '../../utils/filters'
import App from '../../components/App.vue'


window.$ = window.jQuery = require('jquery');
var Bootstrap = require('bootstrap');
Bootstrap.$ = $ 
require('../../global/js/core.min');
import '../../lib/site'
//import animsition from 'animsition'

// import 'font-awesome/css/font-awesome.css'
// import 'bootstrap/dist/css/bootstrap.css'
// import 'jackblog-sass/dist/index.css'
// import 'vue-toast/dist/vue-toast.min.css'
// import './assets/styles/index.css'

Vue.use(VueRouter)
Vue.use(VueValidator)
//Vue.use(require('vue-moment'));
Object.keys(filters).forEach(k => Vue.filter(k, filters[k]))

const router = new VueRouter({
  history: false,
  saveScrollPosition: true,
  suppressTransitionError: true
})
configRouter(router)
sync(store, router)

router.start(Vue.extend(App), '#root') 
window.router = router