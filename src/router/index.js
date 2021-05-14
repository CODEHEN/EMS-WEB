import Vue from 'vue'
import Router from 'vue-router'
import { constantRouterMap } from '@/config/router.config'

Vue.use(Router)

// 获取原型对象上的push函数
const originalPush = Router.prototype.push
// 修改原型对象中的push方法
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
const createRouter = () => new Router({
  mode: 'history',
  routes: constantRouterMap
})
const router = createRouter()
// 导出一个重置路由的办法，退出时革除动静加载的路由
export function resetRoute () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}
export default router
