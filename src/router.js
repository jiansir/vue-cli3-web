import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)
let base = process.env.BASE_URL
const router = new Router({
  mode: 'hash',
  base: base,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        title: '首页',
        auth: false, // 是否需要登录
        keepAlive: true // 是否缓存组件
      }
    },
    {
      path: '/about',
      name: 'about',
      component: () =>
        import(/* webpackChunkName: "about" */ './views/About.vue'),
      meta: {
        title: '登录',
        auth: true,
        keepAlive: true
      }
    },
    {
      path: '*', // 未匹配到路由时重定向
      redirect: '/',
      meta: {}
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})
export default router
