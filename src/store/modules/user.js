import { login, getUserInfo, logout } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRoute } from '@/router'
const user = {
  state: {
    info: {},
    status: '',
    code: '',
    token: getToken(),
    id: 0,
    name: '',
    avatar: '',
    introduction: '',
    roles: [],
    menus: [], // 菜单权限
    // 按钮级权限管控 - ①新增 button 全局变量
    buttons: [], // 按钮权限
    setting: {
      articlePlatform: []
    }
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_ID: (state, id) => {
      state.id = id
    },
    SET_NAME: (state, { name }) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername ({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {
          const data = response.data
          commit('SET_TOKEN', data.token)// 将token保存到cookie里 -> 作为前端用户已登录的标识
          setToken(response.data.token)
          resolve()
        }).catch(error => {
          // 登录失败，回传提示信息
          reject(error)
        })
      })
    },
    FedLogOut ({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        // 注销QQ
        // QC.Login.signOut();
        removeToken()
        resolve()
      })
    },

    // 获取用户信息，相关权限数据
    GetInfo ({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.token).then(response => {
          const result = response.data
          commit('SET_ROLES', result.roles)
          commit('SET_INFO', result)
          commit('SET_NAME', { name: result.username })
          commit('SET_AVATAR', result.avatar)

          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    Logout ({ commit, state }) {
      return new Promise((resolve) => {
        logout(state.token).then(() => {
          resolve()
        }).catch(() => {
          resolve()
        }).finally(() => {
          resetRoute()
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
        })
      })
    }

  }
}

export default user
