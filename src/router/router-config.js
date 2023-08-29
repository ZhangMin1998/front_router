import router from "./index"
import NProgress from "nprogress" // progress bar
import store from "@/store"
import menu from "@/mock/menu.js"

NProgress.configure({ showSpinner: false }) // NProgress Configuration

// 白名单页面直接进入
const whiteList = ["/login"]

router.beforeEach((to, from, next) => {
  NProgress.start()
  // 白名单页面，不管是否有token，是否登录都直接进入
  if (whiteList.indexOf(to.path) !== -1) {
    next()
    return false
  }
  // 有token（代表了有用户信息，但是不确定有没有角色权限数组）
  if (store.state.User.token) {
    // 判断当前用户是否有角色权限数组， 是登录状态则一定有路由，直接放行，不是登录状态则去获取路由菜单登录
    // 刷新时hasRoles会重置为false，重新去获取 用户的角色列表
    const hasRoles = store.state.permission.roles && store.state.permission.roles.length > 0
    if (!hasRoles) {
      setTimeout(async () => {
        const roles = menu.filter((item) => item.token === store.state.User.token)[0].roles
        // 将该角色权限数组存储到vuex中
        store.commit("permission/setRoles", roles)
        // 根据返回的角色信息去过滤异步路由中该角色可访问的页面
        const accessRoutes = await store.dispatch("permission/generateRoutes", roles)
        // dynamically add accessible routes
        router.addRoutes(accessRoutes)
        // hack方法
        next({ ...to, replace: true })
      }, 500)
    } else {
      next() //当有用户权限的时候，说明所有可访问路由已生成 如访问没权限的全面会自动进入404页面
    }
  } else {
    next({ path: "/login" })
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
