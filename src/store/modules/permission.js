import { asyncRoutes, constantRoutes } from '@/router'
/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })
  return res
}

function hasPermission(roles, route) {
  console.log(roles)
  console.log(route)
  if (route.meta && route.meta.roles) {
    console.log(roles.some(role => route.meta.roles.includes(role)))
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

const state = {
  roles: [],
  routes: [],
  addRoutes: [],
}
const mutations = {
  setRoles(state, val) {
    state.roles = val
  },
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
}
const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      if (roles.includes('admin')) { // admin直接添加所有权限
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  },
}
export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
