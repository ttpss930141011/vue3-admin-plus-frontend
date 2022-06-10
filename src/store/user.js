import { loginReq, logoutReq, getInfoReq, setEmailReq } from '@/api/user'
import { setToken, removeToken } from '@/utils/auth'
import router, { asyncRoutes } from '@/router'
import { defineStore } from 'pinia'
import { usePermissionStore } from '@/store/permission'
import { useTagsViewStore } from '@/store/tagsView'

const resetRouter = () => {
  const asyncRouterNameArr = asyncRoutes.map((mItem) => mItem.name)
  asyncRouterNameArr.forEach((name) => {
    if (router.hasRoute(name)) {
      router.removeRoute(name)
    }
  })
}

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      username: '',
      avatar: '',
      roles: []
    }
  },

  actions: {
    M_username(username) {
      this.$patch((state) => {
        state.username = username
      })
    },
    M_roles(roles) {
      this.$patch((state) => {
        state.roles = roles
      })
    },
    M_avatar(avatar) {
      this.$patch((state) => {
        state.avatar = avatar
      })
    },

    login(data) {
      return new Promise((resolve, reject) => {
        loginReq(data)
          .then((res) => {
            console.log(res)
            const { code, data } = res
            if (code === 20000) {
              //commit('SET_Token', res.data?.token)
              setToken(data?.token)
              resolve(null)
            } else {
              reject(res)
            }
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    // get user info
    getInfo() {
      return new Promise((resolve, reject) => {
        getInfoReq()
          .then((response) => {
            const { data } = response
            console.log('getinfo', data)
            if (!data) {
              return reject('Verification failed, please Login again.')
            }

            const rolesArr = localStorage.getItem('roles')
            console.log(localStorage)
            console.log(rolesArr)
            if (rolesArr) {
              data.roles = JSON.parse(rolesArr)
            } else {
              // data.roles = ['admin']
              localStorage.setItem('roles', JSON.stringify(data.roles))
            }
            const { avatar, roles, username } = data
            this.M_username(username)
            this.M_roles(roles)
            this.M_avatar(avatar)
            resolve(data)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    // user set email
    setEmail(email) {
      return new Promise((resolve, reject) => {
        setEmailReq({ email: email.trim(), account: this.$state.username})
          .then((response) => {
            const { data } = response
            if (!data) {
              return reject(new Error('Verification failed, please Login again.'))
            }
            resolve(data)
          })
          .catch((error) => {
            console.log(error)
            reject(error)
          })
      })
    },
    // user logout
    logout() {
      return new Promise((resolve, reject) => {
        logoutReq()
          .then(() => {
            this.resetState()
            resolve(null)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    resetState() {
      return new Promise((resolve) => {
        this.M_username('')
        this.M_roles([])
        removeToken() // must remove  token  first
        resetRouter() // reset the router
        const permissionStore = usePermissionStore()
        permissionStore.M_isGetUserInfo(false)
        const tagsViewStore = useTagsViewStore()
        tagsViewStore.delAllViews()
        localStorage.removeItem('roles')
        resolve(null)
      })
    }
  }
})
