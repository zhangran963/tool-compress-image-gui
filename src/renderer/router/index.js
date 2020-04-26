import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)



export default new Router({
  // mode: 'hash', /* 在Electron中, 只能使用hash模式 */
  routes: [
    {
      path: '/landing',
      name: 'landing-page',
      component: () => import('../pages/LandingPage/LandingPage.vue')
    },
    {
      path: '/drag',
      name: 'drag-page',
      component: () => import('../pages/home/drag')
    },
    {
      path: '/',
      component: require('../pages/home/index.vue').default,
    },
    {
      path: '*',
      redirect: '/'
    },
  ]
})
