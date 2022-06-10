<template>
  <div class="navbar rowBC reset-el-dropdown">
    <div class="rowSC">
      <hamburger
        v-if="settings.showHamburger"
        :is-active="opened"
        class="hamburger-container"
        @toggleClick="toggleSideBar"
      />
      <span class="svg-container">
        <svg-icon class="refresh" @click="refresh" icon-class="refresh" />
      </span>
      <breadcrumb class="breadcrumb-container" />
    </div>
    <!--nav title-->
    <div v-if="settings.showNavbarTitle" class="heardCenterTitle">{{ settings.showNavbarTitle }}</div>
    <div v-if="settings.ShowDropDown" class="right-menu rowSC">
      <ScreenFull />
      <SizeSelect />
      <LangSelect />
      <el-dropdown trigger="click" size="medium">
        <div class="avatar-wrapper">
          <div class="user-name">Hi, {{ username }}</div>
          <img :src="avatar" class="user-avatar" />
          <CaretBottom style="width: 1em; height: 1em; margin-left: 4px" />
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <router-link to="/">
              <el-dropdown-item>Home</el-dropdown-item>
            </router-link>
            <a target="_blank" href="https://github.com/jzfai/vue3-admin-ts">
              <el-dropdown-item>Github</el-dropdown-item>
            </a>
            <a target="_blank" href="https://juejin.cn/post/7036302298435289095">
              <el-dropdown-item>Docs</el-dropdown-item>
            </a>
            <!--<el-dropdown-item>修改密码</el-dropdown-item>-->
            <el-dropdown-item divided @click="loginOut">login out</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import SizeSelect from '@/components/SizeSelect/index.vue'
import LangSelect from '@/components/LangSelect/index.vue'
import ScreenFull from '@/components/ScreenFull/index.vue'

import { CaretBottom } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import Breadcrumb from './Breadcrumb'
import Hamburger from './Hamburger'

import { useAppStore } from '@/store/app'
import { useUserStore } from '@/store/user'

const settings = computed(() => {
  return appStore.settings
})
const opened = computed(() => {
  return appStore.sidebar.opened
})
const appStore = useAppStore()
const userStore = useUserStore()

const toggleSideBar = () => {
  appStore.M_toggleSideBar()
}
const avatar = computed(() => {
  return userStore.avatar
})
const username = userStore.username
/*
 * 退出登录
 * */
const router = useRouter()
const route = useRoute()
const loginOut = () => {
  userStore.logout().then(() => {
    ElMessage({ message: '退出登录成功', type: 'success' })
    console.log(route.fullPath)
    router.push(`/login?redirect=${route.fullPath}`)
  })
}
// 刷新layout
const refresh = async () => {
  const { fullPath } = route
  router.replace({
    path: '/redirect' + fullPath
  })
}
</script>

<style lang="scss" scoped>
.navbar {
  height: $navBarHeight;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

//logo
.avatar-wrapper {
  margin-top: 5px;
  position: relative;
  display: flex;
  cursor: pointer;
  align-items: center;

  .user-avatar {
    cursor: pointer;
    width: 40px;
    height: 40px;
    border-radius: 10px;
  }
  .user-name {
    margin-right: 20px;
  }
  .el-icon-caret-bottom {
    cursor: pointer;
    margin-left: 5px;
    font-size: 12px;
  }
}

//center-title
.heardCenterTitle {
  text-align: center;
  position: absolute;
  top: 50%;
  left: 46%;
  font-weight: 600;
  font-size: 20px;
  transform: translate(-50%, -50%);
}

//drop-down
.right-menu {
  cursor: pointer;
  margin-right: 40px;
}

.refresh {
  line-height: 52px;
  font-size: 20px;
  padding-top: 2px;
  height: 100%;
  color: rgb(133, 133, 133);
  float: left;
  cursor: pointer;
  transition: background 0.3s;
  -webkit-tap-highlight-color: transparent;
  margin: 0 10px;
}
</style>
