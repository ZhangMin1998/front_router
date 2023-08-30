import Vue from "vue"
import VueRouter from "vue-router"
import Layout from "@/layout"

Vue.use(VueRouter)

// 解决重复点击路由报错的BUG
// 下面这段代码主要解决这个问题 ：Uncaught (in promise) Error: Redirected when going from "/login" to "/index" via a navigation guard.
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}

// 定义好静态路由
export const constantRoutes = [
  {
    path: "/login",
    name: "login",
    component: () => import("../views/login"),
    hidden: true,
  },
]

// 定义动态路由,以及每个页面对应的roles(写在meta中，不写代表都可以访问)
export const asyncRoutes = [
  {
    id: 1,
    name: "/",
    path: "/",
    component: Layout,
    redirect: "/index",
    hidden: false,
    children: [
      {
        name: "index",
        path: "/index",
        meta: { title: "index" },
        component: () => import("@/views/index"),
      },
    ],
  },
  {
    id: 2,
    name: "/form",
    path: "/form",
    component: Layout,
    redirect: "/form/index",
    hidden: false,
    children: [
      {
        name: "/form/index",
        path: "/form/index",
        meta: { title: "form" },
        component: () => import("@/views/form"),
      },
    ],
  },
  {
    id: 3,
    name: "/example",
    path: "/example",
    component: Layout,
    redirect: "/example/tree",
    meta: { title: "example" },
    hidden: false,
    children: [
      {
        name: "/tree",
        path: "/example/tree",
        meta: { title: "tree" },
        component: () => import("@/views/tree"),
      },
      {
        name: "/copy",
        path: "/example/copy",
        meta: { title: "copy" },
        component: () => import("@/views/tree/copy"),
      },
    ],
  },
  {
    id: 4,
    name: "/table",
    path: "/table",
    component: Layout,
    redirect: "/table/index",
    hidden: false,
    meta: { roles: ["admin"] },
    children: [
      {
        name: "/table/index",
        path: "/table/index",
        meta: { title: "table", roles: ["admin"] },
        component: () => import("@/views/table"),
      },
    ],
  },
  {
    id: 5,
    name: "/admin",
    path: "/admin",
    component: Layout,
    redirect: "/admin/index",
    hidden: false,
    meta: { roles: ["admin"] },
    children: [
      {
        name: "/admin/index",
        path: "/admin/index",
        meta: { title: "admin", roles: ["admin"] },
        component: () => import("@/views/admin"),
      },
    ],
  },
  {
    id: 6,
    name: "/people",
    path: "/people",
    component: Layout,
    redirect: "/people/index",
    hidden: false,
    meta: { roles: ["admin", "common_user"] },
    children: [
      {
        name: "/people/index",
        path: "/people/index",
        meta: { title: "people", roles: ["admin", "common_user"] },
        component: () => import("@/views/people"),
      },
    ],
  },
  {
    id: 7,
    name: "/404",
    path: "/404",
    component: () => import("@/views/404"),
  },
  // 注意404页面要放到最后
  { path: "*", redirect: "/404", hidden: true },
]

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes: constantRoutes,
})

export default router
