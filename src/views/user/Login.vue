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
        <div class="word"><h3 style="font-size: 1.75rem;font-weight: 500">Website Management System</h3><br></div>
        <div class="des">
          本网站处于安全模式下，需要通过学校统一认证平台账号密码认证后，方可访问
        </div>
      </div>
      <div class="login-container">
        <div class="login-form">
          <h3 class="login-h3">认证登录</h3>
          <a-form-model ref="ruleForm" :model="ruleForm" :rules="rules">
            <a-form-model-item has-feedback lable="username" prop="username">
              <a-input v-model="ruleForm.username" class="elInput" placeholder="学工号"/>
            </a-form-model-item>
            <br>
            <a-form-model-item has-feedback lable="password" prop="password">
              <a-input v-model="ruleForm.password" class="elInput" type="password" placeholder="密码"/>
            </a-form-model-item>
            <br>
            <a-form-model-item>
              <!--这里@click不加native也行，因为el-button已经有了处理-->
              <a-button :loading="loading" type="primary" @click.native.prevent="handleLogin('ruleForm')">登录</a-button>
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
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    /*.logo {*/
    /*  */
    /*}*/
  }

  .elInput>>>.a-input__inner {
    border: 0;
    border-bottom: 2px solid #ebedf2;
    background-color: rgba(0,0,0,0);
    width: 25rem;
    height: 3rem;
    margin-top: 2rem;
  }
  .elInput>>>.a-input__inner:focus {
    &::placeholder{
      color: rgb(113,106,202);
    }

    &::-webkit-input-placeholder{
      /* WebKit browsers 适配谷歌 */
      color: rgb(113,106,202);
    }

    &:-moz-placeholder {
      /* Mozilla Firefox 4 to 18 适配火狐 */
      color: rgb(113,106,202);
    }

    &::-moz-placeholder {
      /* Mozilla Firefox 19+ 适配火狐 */
      color: rgb(113,106,202);
    }

    &:-ms-input-placeholder {
      /* Internet Explorer 10+  适配ie*/
      color: rgb(113,106,202);
    }
  }

  .a-button{
    border-color: #9816f4;
    background-color: #9816f4;
    padding: 1.2rem 3rem;
    box-shadow: 0px 5px 10px 2px rgba(152, 22, 244, 0.19) !important;
    border-radius: 60px;
    margin: 3rem 0 0 8rem;
  }
  h3 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    font-family: inherit;
    font-weight: 300;
    color: inherit;
  }
</style>

<!--<template>-->
<!--  <div class="main">-->
<!--    <a-form-->
<!--      id="formLogin"-->
<!--      class="user-layout-login"-->
<!--      ref="formLogin"-->
<!--      :form="form"-->
<!--      @submit="handleSubmit"-->
<!--    >-->
<!--      <a-tabs-->
<!--        :activeKey="customActiveKey"-->
<!--        :tabBarStyle="{ textAlign: 'center', borderBottom: 'unset' }"-->
<!--        @change="handleTabClick"-->
<!--      >-->
<!--        <a-tab-pane key="tab1" :tab="$t('user.login.tab-login-credentials')">-->
<!--          <a-alert v-if="isLoginError" type="error" showIcon style="margin-bottom: 24px;" :message="$t('user.login.message-invalid-credentials')" />-->
<!--          <a-form-item>-->
<!--            <a-input-->
<!--              size="large"-->
<!--              type="text"-->
<!--              :placeholder="$t('user.login.username.placeholder')"-->
<!--              v-decorator="[-->
<!--                'username',-->
<!--                {rules: [{ required: true, message: $t('user.userName.required') }, { validator: handleUsernameOrEmail }], validateTrigger: 'change'}-->
<!--              ]"-->
<!--            >-->
<!--              <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>-->
<!--            </a-input>-->
<!--          </a-form-item>-->

<!--          <a-form-item>-->
<!--            <a-input-password-->
<!--              size="large"-->
<!--              :placeholder="$t('user.login.password.placeholder')"-->
<!--              v-decorator="[-->
<!--                'password',-->
<!--                {rules: [{ required: true, message: $t('user.password.required') }], validateTrigger: 'blur'}-->
<!--              ]"-->
<!--            >-->
<!--              <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>-->
<!--            </a-input-password>-->
<!--          </a-form-item>-->
<!--        </a-tab-pane>-->
<!--        <a-tab-pane key="tab2" :tab="$t('user.login.tab-login-mobile')">-->
<!--          <a-form-item>-->
<!--            <a-input size="large" type="text" :placeholder="$t('user.login.mobile.placeholder')" v-decorator="['mobile', {rules: [{ required: true, pattern: /^1[34578]\d{9}$/, message: $t('user.login.mobile.placeholder') }], validateTrigger: 'change'}]">-->
<!--              <a-icon slot="prefix" type="mobile" :style="{ color: 'rgba(0,0,0,.25)' }"/>-->
<!--            </a-input>-->
<!--          </a-form-item>-->

<!--          <a-row :gutter="16">-->
<!--            <a-col class="gutter-row" :span="16">-->
<!--              <a-form-item>-->
<!--                <a-input size="large" type="text" :placeholder="$t('user.login.mobile.verification-code.placeholder')" v-decorator="['captcha', {rules: [{ required: true, message: $t('user.verification-code.required') }], validateTrigger: 'blur'}]">-->
<!--                  <a-icon slot="prefix" type="mail" :style="{ color: 'rgba(0,0,0,.25)' }"/>-->
<!--                </a-input>-->
<!--              </a-form-item>-->
<!--            </a-col>-->
<!--            <a-col class="gutter-row" :span="8">-->
<!--              <a-button-->
<!--                class="getCaptcha"-->
<!--                tabindex="-1"-->
<!--                :disabled="state.smsSendBtn"-->
<!--                @click.stop.prevent="getCaptcha"-->
<!--                v-text="!state.smsSendBtn && $t('user.register.get-verification-code') || (state.time+' s')"-->
<!--              ></a-button>-->
<!--            </a-col>-->
<!--          </a-row>-->
<!--        </a-tab-pane>-->
<!--      </a-tabs>-->

<!--      <a-form-item>-->
<!--        <a-checkbox v-decorator="['rememberMe', { valuePropName: 'checked' }]">{{ $t('user.login.remember-me') }}</a-checkbox>-->
<!--        <router-link-->
<!--          :to="{ name: 'recover', params: { user: 'aaa'} }"-->
<!--          class="forge-password"-->
<!--          style="float: right;"-->
<!--        >{{ $t('user.login.forgot-password') }}</router-link>-->
<!--      </a-form-item>-->

<!--      <a-form-item style="margin-top:24px">-->
<!--        <a-button-->
<!--          size="large"-->
<!--          type="primary"-->
<!--          htmlType="submit"-->
<!--          class="login-button"-->
<!--          :loading="state.loginBtn"-->
<!--          :disabled="state.loginBtn"-->
<!--        >{{ $t('user.login.login') }}</a-button>-->
<!--      </a-form-item>-->

<!--      <div class="user-login-other">-->
<!--        <span>{{ $t('user.login.sign-in-with') }}</span>-->
<!--        <a>-->
<!--          <a-icon class="item-icon" type="alipay-circle"></a-icon>-->
<!--        </a>-->
<!--        <a>-->
<!--          <a-icon class="item-icon" type="taobao-circle"></a-icon>-->
<!--        </a>-->
<!--        <a>-->
<!--          <a-icon class="item-icon" type="weibo-circle"></a-icon>-->
<!--        </a>-->
<!--        <router-link class="register" :to="{ name: 'register' }">{{ $t('user.login.signup') }}</router-link>-->
<!--      </div>-->
<!--    </a-form>-->

<!--    <two-step-captcha-->
<!--      v-if="requiredTwoStepCaptcha"-->
<!--      :visible="stepCaptchaVisible"-->
<!--      @success="stepCaptchaSuccess"-->
<!--      @cancel="stepCaptchaCancel"-->
<!--    ></two-step-captcha>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--import md5 from 'md5'-->
<!--import TwoStepCaptcha from '@/components/tools/TwoStepCaptcha'-->
<!--import { mapActions } from 'vuex'-->
<!--import { timeFix } from '@/utils/util'-->
<!--import { getSmsCaptcha, get2step } from '@/api/login'-->

<!--export default {-->
<!--  components: {-->
<!--    TwoStepCaptcha-->
<!--  },-->
<!--  data () {-->
<!--    return {-->
<!--      customActiveKey: 'tab1',-->
<!--      loginBtn: false,-->
<!--      // login type: 0 email, 1 username, 2 telephone-->
<!--      loginType: 0,-->
<!--      isLoginError: false,-->
<!--      requiredTwoStepCaptcha: false,-->
<!--      stepCaptchaVisible: false,-->
<!--      form: this.$form.createForm(this),-->
<!--      state: {-->
<!--        time: 60,-->
<!--        loginBtn: false,-->
<!--        // login type: 0 email, 1 username, 2 telephone-->
<!--        loginType: 0,-->
<!--        smsSendBtn: false-->
<!--      }-->
<!--    }-->
<!--  },-->
<!--  created () {-->
<!--    get2step({ })-->
<!--      .then(res => {-->
<!--        this.requiredTwoStepCaptcha = res.result.stepCode-->
<!--      })-->
<!--      .catch(() => {-->
<!--        this.requiredTwoStepCaptcha = false-->
<!--      })-->
<!--    // this.requiredTwoStepCaptcha = true-->
<!--  },-->
<!--  methods: {-->
<!--    ...mapActions(['Login', 'Logout']),-->
<!--    // handler-->
<!--    handleUsernameOrEmail (rule, value, callback) {-->
<!--      const { state } = this-->
<!--      const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/-->
<!--      if (regex.test(value)) {-->
<!--        state.loginType = 0-->
<!--      } else {-->
<!--        state.loginType = 1-->
<!--      }-->
<!--      callback()-->
<!--    },-->
<!--    handleTabClick (key) {-->
<!--      this.customActiveKey = key-->
<!--      // this.form.resetFields()-->
<!--    },-->
<!--    handleSubmit (e) {-->
<!--      e.preventDefault()-->
<!--      const {-->
<!--        form: { validateFields },-->
<!--        state,-->
<!--        customActiveKey,-->
<!--        Login-->
<!--      } = this-->

<!--      state.loginBtn = true-->

<!--      const validateFieldsKey = customActiveKey === 'tab1' ? ['username', 'password'] : ['mobile', 'captcha']-->

<!--      validateFields(validateFieldsKey, { force: true }, (err, values) => {-->
<!--        if (!err) {-->
<!--          console.log('login form', values)-->
<!--          const loginParams = { ...values }-->
<!--          delete loginParams.username-->
<!--          loginParams[!state.loginType ? 'email' : 'username'] = values.username-->
<!--          loginParams.password = md5(values.password)-->
<!--          Login(loginParams)-->
<!--            .then((res) => this.loginSuccess(res))-->
<!--            .catch(err => this.requestFailed(err))-->
<!--            .finally(() => {-->
<!--              state.loginBtn = false-->
<!--            })-->
<!--        } else {-->
<!--          setTimeout(() => {-->
<!--            state.loginBtn = false-->
<!--          }, 600)-->
<!--        }-->
<!--      })-->
<!--    },-->
<!--    getCaptcha (e) {-->
<!--      e.preventDefault()-->
<!--      const { form: { validateFields }, state } = this-->

<!--      validateFields(['mobile'], { force: true }, (err, values) => {-->
<!--        if (!err) {-->
<!--          state.smsSendBtn = true-->

<!--          const interval = window.setInterval(() => {-->
<!--            if (state.time&#45;&#45; <= 0) {-->
<!--              state.time = 60-->
<!--              state.smsSendBtn = false-->
<!--              window.clearInterval(interval)-->
<!--            }-->
<!--          }, 1000)-->

<!--          const hide = this.$message.loading('验证码发送中..', 0)-->
<!--          getSmsCaptcha({ mobile: values.mobile }).then(res => {-->
<!--            setTimeout(hide, 2500)-->
<!--            this.$notification['success']({-->
<!--              message: '提示',-->
<!--              description: '验证码获取成功，您的验证码为：' + res.result.captcha,-->
<!--              duration: 8-->
<!--            })-->
<!--          }).catch(err => {-->
<!--            setTimeout(hide, 1)-->
<!--            clearInterval(interval)-->
<!--            state.time = 60-->
<!--            state.smsSendBtn = false-->
<!--            this.requestFailed(err)-->
<!--          })-->
<!--        }-->
<!--      })-->
<!--    },-->
<!--    stepCaptchaSuccess () {-->
<!--      this.loginSuccess()-->
<!--    },-->
<!--    stepCaptchaCancel () {-->
<!--      this.Logout().then(() => {-->
<!--        this.loginBtn = false-->
<!--        this.stepCaptchaVisible = false-->
<!--      })-->
<!--    },-->
<!--    loginSuccess (res) {-->
<!--      console.log(res)-->
<!--      // check res.homePage define, set $router.push name res.homePage-->
<!--      // Why not enter onComplete-->
<!--      /*-->
<!--      this.$router.push({ name: 'analysis' }, () => {-->
<!--        console.log('onComplete')-->
<!--        this.$notification.success({-->
<!--          message: '欢迎',-->
<!--          description: `${timeFix()}，欢迎回来`-->
<!--        })-->
<!--      })-->
<!--      */-->
<!--      this.$router.push({ path: '/' })-->
<!--      // 延迟 1 秒显示欢迎信息-->
<!--      setTimeout(() => {-->
<!--        this.$notification.success({-->
<!--          message: '欢迎',-->
<!--          description: `${timeFix()}，欢迎回来`-->
<!--        })-->
<!--      }, 1000)-->
<!--      this.isLoginError = false-->
<!--    },-->
<!--    requestFailed (err) {-->
<!--      this.isLoginError = true-->
<!--      this.$notification['error']({-->
<!--        message: '错误',-->
<!--        description: ((err.response || {}).data || {}).message || '请求出现错误，请稍后再试',-->
<!--        duration: 4-->
<!--      })-->
<!--    }-->
<!--  }-->
<!--}-->
<!--</script>-->

<!--<style lang="less" scoped>-->
<!--.user-layout-login {-->
<!--  label {-->
<!--    font-size: 14px;-->
<!--  }-->

<!--  .getCaptcha {-->
<!--    display: block;-->
<!--    width: 100%;-->
<!--    height: 40px;-->
<!--  }-->

<!--  .forge-password {-->
<!--    font-size: 14px;-->
<!--  }-->

<!--  button.login-button {-->
<!--    padding: 0 15px;-->
<!--    font-size: 16px;-->
<!--    height: 40px;-->
<!--    width: 100%;-->
<!--  }-->

<!--  .user-login-other {-->
<!--    text-align: left;-->
<!--    margin-top: 24px;-->
<!--    line-height: 22px;-->

<!--    .item-icon {-->
<!--      font-size: 24px;-->
<!--      color: rgba(0, 0, 0, 0.2);-->
<!--      margin-left: 16px;-->
<!--      vertical-align: middle;-->
<!--      cursor: pointer;-->
<!--      transition: color 0.3s;-->

<!--      &:hover {-->
<!--        color: #1890ff;-->
<!--      }-->
<!--    }-->

<!--    .register {-->
<!--      float: right;-->
<!--    }-->
<!--  }-->
<!--}-->
<!--</style>-->
