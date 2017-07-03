// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import App from './App';
import goods from 'components/goods/goods.vue';
import ratings from 'components/ratings/ratings.vue';
import seller from './components/seller/seller.vue';

import './common/stylus/index.styl';

Vue.use(VueRouter);
Vue.use(VueResource);

const routes = [
  { path: '/goods', component: goods },
  { path: '/ratings', component: ratings },
  { path: '/seller', component: seller }
];
const router = new VueRouter({
  linkActiveClass: 'active',
  routes
});
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
});
/*
* 视频中是router.go(''),但是会导致不停的刷新页面，换成push即可
* https://segmentfault.com/q/1010000007569151
*
*
 // router.push('/goods');

 //加这个后面会不太合理，就是在切换tab的时候，要不刷新的时候就又跑回goods组件了
* */
