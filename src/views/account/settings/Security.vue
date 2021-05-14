<template>
  <a-list
    itemLayout="horizontal"
  >
    <a-form layout="vertical">
      <a-form-item
        label="原密码"
      >
        <a-input placeholder="请输入旧密码" v-model="oldPwd"/>
      </a-form-item>
      <a-form-item
        label="新密码"
      >
        <a-input placeholder="请输入新密码" v-model="newPwd" />
      </a-form-item>

      <a-form-item>
        <a-button @click="updateUserPwd" type="primary">更新密码</a-button>
      </a-form-item>
    </a-form>
  </a-list>
</template>

<script>
import { updatePwd } from '@/api/user'
import store from '@/store'

export default {
  data () {
    return {
      oldPwd: '',
      newPwd: ''
    }
  },
  methods: {
    updateUserPwd () {
      if (this.oldPwd === this.newPwd) {
        this.$message.error('新旧密码不能相同')
      } else {
        updatePwd(this.oldPwd, this.newPwd, this.$store.getters.userInfo.number).then(res => {
          if (res.code === 200) {
            this.$notification.error({
              message: res.message,
              description: '即将跳至登录页'
            })
            store.dispatch('Logout').then(() => {
              window.location.reload(true)
            })
          }
          if (res.code === 201) {
            this.$message.error('旧密码错误')
          }
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
