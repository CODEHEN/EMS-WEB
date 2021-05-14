<template>
  <div class="page-header-index-wide page-header-wrapper-grid-content-main">
    <a-row :gutter="24">
      <a-col :md="24" :lg="7">
        <a-card :bordered="false">
          <div class="account-center-avatarHolder">
            <div class="avatar">
              <img :src="avatar">
            </div>
            <div class="username">{{ nickname }}</div>
            <div class="bio">海纳百川，有容乃大</div>
          </div>
          <div class="account-center-detail" style="margin-left: 30%;">
            <p>
              <i class="title"></i>{{ userInfo.college }}
            </p>
            <p>
              <i class="group"></i>{{ userInfo.major }}专业
            </p>
            <p>
              <i class="address"></i>
              <span>{{ userInfo.classes }}</span> <br>
              <span>{{ userInfo.number }}</span>
            </p>
          </div>
          <a-divider/>

          <div class="account-center-tags">

          </div>

          <div class="account-center-team">
          </div>
        </a-card>
      </a-col>
      <a-col :md="24" :lg="17">
        <AccountSettings></AccountSettings>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { PageView, RouteView } from '@/layouts'
import AccountSettings from '@/views/account/settings/Index'
import { mapGetters } from 'vuex'

export default {
  components: {
    RouteView,
    PageView,
    AccountSettings
  },
  data () {
    return {
      tabListNoTitle: [
        {
          key: 'info',
          tab: '基本信息'
        }
      ],
      noTitleKey: 'info'
    }
  },
  computed: {
    ...mapGetters(['nickname', 'avatar']),
    userInfo () {
      return this.$store.getters.userInfo
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
.page-header-wrapper-grid-content-main {
  width: 100%;
  height: 100%;
  min-height: 100%;
  transition: 0.3s;

  .account-center-avatarHolder {
    text-align: center;
    margin-bottom: 24px;

    & > .avatar {
      margin: 0 auto;
      width: 104px;
      height: 104px;
      margin-bottom: 20px;
      border-radius: 50%;
      overflow: hidden;
      img {
        height: 100%;
        width: 100%;
      }
    }

    .username {
      color: rgba(0, 0, 0, 0.85);
      font-size: 20px;
      line-height: 28px;
      font-weight: 500;
      margin-bottom: 4px;
    }
  }

  .account-center-detail {
    p {
      margin-bottom: 8px;
      padding-left: 26px;
      position: relative;
    }

    i {
      position: absolute;
      height: 14px;
      width: 14px;
      left: 0;
      top: 4px;
      background: url(https://gw.alipayobjects.com/zos/rmsportal/pBjWzVAHnOOtAUvZmZfy.svg);
    }

    .title {
      background-position: 0 0;
    }
    .group {
      background-position: 0 -22px;
    }
    .address {
      background-position: 0 -44px;
    }
  }

  .account-center-tags {
    .ant-tag {
      margin-bottom: 8px;
    }
  }

  .account-center-team {
    .members {
      a {
        display: block;
        margin: 12px 0;
        line-height: 24px;
        height: 24px;
        .member {
          font-size: 14px;
          color: rgba(0, 0, 0, 0.65);
          line-height: 24px;
          max-width: 100px;
          vertical-align: top;
          margin-left: 12px;
          transition: all 0.3s;
          display: inline-block;
        }
        &:hover {
          span {
            color: #1890ff;
          }
        }
      }
    }
  }

  .tagsTitle,
  .teamTitle {
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    margin-bottom: 12px;
  }
}
</style>
