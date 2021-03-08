<template>
  <div class="container">
    <vue-particles
      :particle-opacity="1"
      :particles-number="100"
      :particle-size="4"
      :lines-width="2"
      :line-linked="true"
      :line-opacity="1"
      :lines-distance="170"
      :move-speed="2"
      :hover-effect="true"
      :click-effect="true"
      color="#dedede"
      shape-type="circle"
      lines-color="#dedede"
      hover-mode="grab"
      click-mode="push"
    />
    <div class="smallContainer">
      <div class="logo-container">
        <div class="logo"><img :src="require('@/assets/logo.png')"/></div>
        <div class="word" style="margin-left:15%"><h3 style="font-size: 1.75rem;font-weight: 500">Website Management System</h3><br></div>
        <div class="des" style="margin-left: 17%">
          本网站处于安全模式下，需要通过学校统一认证平台账号密码认证后，方可访问
        </div>
      </div>
      <div class="login-container">
        <div class="login-form">
          <h3 class="login-h3">认证登录</h3>
          <a-form-model ref="ruleForm" :model="ruleForm" :rules="rules">
            <a-form-model-item has-feedback lable="username" prop="username">
              <a-input v-model="ruleForm.username" class="elInput" placeholder="学工号" size="large"/>
            </a-form-model-item>
            <br>
            <a-form-model-item has-feedback lable="password" prop="password">
              <a-input v-model="ruleForm.password" class="elInput" type="password" placeholder="密码" size="large"/>
            </a-form-model-item>
            <br>
            <a-form-model-item>
              <a-button :loading="loading" type="primary" shape="round" size="large" @click.native.prevent="handleLogin('ruleForm')">登录</a-button>
            </a-form-model-item>
          </a-form-model>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { validUsername } from '@/utils/validate'
  export default {
    name: 'Index',
    data () {
      let checkPending
      const checkUsername = (rule, value, callback) => {
        clearTimeout(checkPending)
        if (!value) {
          return callback(new Error('请输入账号'))
        }
        checkPending = setTimeout(() => {
          if (!validUsername(value)) {
            callback(new Error('请输入数字'))
          } else {
            callback()
          }
        }, 1000)
      }
      const validatePassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else {
          if (value.length < 6) {
            callback(new Error('密码长度最小6位'))
          } else {
            callback()
          }
        }
      }
      return {
        ruleForm: {
          username: '',
          password: ''
        },
        rules: {
          username: [
            { validator: checkUsername, trigger: 'blur' }
          ],
          password: [
            { validator: validatePassword, trigger: 'blur' }
          ]
        },
        loading: false,
        redirect: undefined // url原本要访问的地址  xxx?redirect=xxx 通过watch监控
      }
    },
    watch: {
      $route: {
        handler: function (route) {
          this.redirect = route.query && route.query.redirect
        },
        immediate: true
      }
    },
    methods: {
      handleLogin (formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.loading = true
            this.$store.dispatch('LoginByUsername', this.ruleForm).then(() => { // dispatch异步 commit同步
              this.loading = false
              // console.log(this.redirect)
              this.$router.push({ path: '/dashboard/workplace' }, onComplete => {}, onAbort => {})
            }).catch(() => {
              this.loading = false
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .container {
    height: 100%;
    position: relative;
  }
  .smallContainer {
    display: flex;
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
  }
  .login-container {
    width: 50%;
    height: 80%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .login-form {
      h3 {
        text-align: center;
        width: 25rem;
      }
    }
  }

  .logo-container {
    width: 50%;
    height: 70%;
    margin-left: 5%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .ant-btn-round {
    margin-left: 40%;
  }

  h3 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    font-family: inherit;
    font-weight: 300;
    color: inherit;
  }
</style>
