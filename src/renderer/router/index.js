import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      mode: 'hash',
      component: require('@/components/index').default
    },
    {
      mode: 'hash',
      path: '*',
      redirect: '/'
    }
  ]
})
