<template>
  <page-header-wrapper>
    <template v-slot:content>
      <div class="page-header-content">
        <div class="avatar">
          <a-avatar size="large" :src="user.avatar"/>
        </div>
        <div class="content">
          <div class="content-title">
            {{ timeFix }}，{{ user.username }}<span class="welcome-text">，{{ welcome }}</span>
          </div>
          <div>{{ user.classes }} | {{ user.college }} - {{ user.major }}</div>
        </div>
      </div>
    </template>
    <div>
      <a-row :gutter="24">
        <a-col :xl="16" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card
            class="project-list"
            :loading="loading"
            :bordered="false"
            title="学期课表"
            :body-style="{ padding: 0 }">
          </a-card>
          <div id="coursesTable"></div>
        </a-col>
        <a-col
          style="padding: 0 12px"
          :xl="8"
          :lg="24"
          :md="24"
          :sm="24"
          :xs="24">
          <a-card title="常用操作" style="margin-bottom: 24px" :bordered="false">
            <div class="members">
              <a-row>
                <a-col :span="12" v-for="(op,index) in this.operations " :key="index">
                  <a>
                    <a-avatar size="small" :src="user.avatar"/>
                    <span class="member">{{ op }}</span>
                  </a>
                </a-col>
              </a-row>
            </div>
          </a-card>

          <a-card title="公告栏" :bordered="false">
            <a-list>
              <a-list-item :key="index" v-for="index of 10">
                <a-list-item-meta>
                  <a-avatar slot="avatar" :src="user.avatar"/>
                  <div slot="title">
                    <span>{{ user.username }}</span>&nbsp;
                    在&nbsp;<a href="#">{{ user.classes }}</a>&nbsp;
                    <span>{{ user.classes }}</span>&nbsp;
                    <a href="#">{{ user.major }}</a>
                  </div>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </page-header-wrapper>
</template>

<script>
import { timeFix } from '@/utils/util'
import { mapState } from 'vuex'
import { PageHeaderWrapper } from '@ant-design-vue/pro-layout'
import Timetables from 'timetables'

export default {
  name: 'Workplace',
  components: {
    PageHeaderWrapper
  },
  data () {
    return {
      timeFix: timeFix(),
      user: {},
      operations: ['成绩查询', '学期选课', '课程查询', '选课中心'],
      loading: true,
      // data
      timetables: [
        ['软件开发项目实训（JAVA开发方向）\n' +
        '甄春成\n' +
        '9(周)' +
        '知行楼502Web前端开发技术实验（训）室', '', '', '毛概', '选修'],
        ['信号与系统', '', '模拟电子技术基础', '', '模拟电子技术基础'],
        ['大学体育(Ⅳ)', '形势与政策(Ⅳ)', '', '', '电路、信号与系统实验'],
        ['', '', '', '', '电装实习'],
        ['', '', '数据结构与算法分析', '信号与系统', '']
      ],
      timetableType: [
        [{ index: '第一二节', name: '8:20-10:00' }, 1],
        [{ index: '第三四节', name: '10:20-12:00' }, 1],
        [{ index: '第五六节', name: '14:00-15:40' }, 1],
        [{ index: '第七八节', name: '15:50-17:30' }, 1],
        [{ index: '第九十节', name: '19:00-20:30' }, 1]
      ],
      week: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      highlightWeek: new Date().getDay(),
      styles: {
        Gheight: 180,
        leftHandWidth: 80,
        palette: ['#ff6633', '#8f8123']
      },
      Timetable: null
    }
  },
  computed: {
    ...mapState({
      nickname: (state) => state.user.username,
      welcome: (state) => state.user.welcome
    }),
    userInfo () {
      return this.$store.getters.userInfo
    }
  },
  created () {
    this.user = this.userInfo
    this.avatar = this.userInfo.avatar
  },
  mounted () {
    this.Timetable = new Timetables({
      el: '#coursesTable',
      timetables: this.timetables,
      week: this.week,
      timetableType: this.timetableType,
      highlightWeek: this.highlightWeek,
      gridOnClick: function (e) {
        alert(e.name + '  ' + e.week + ', 第' + e.index + '节课, 课长' + e.length + '节')
        console.log(e)
      },
      styles: this.styles
    })
  },
  methods: {
  }
}
</script>

<style lang="less">
  @import "./Workplace.less";

  #coursesTable {
    background-color: white;
    .Courses-leftHand {
      text-align: center;
      line-height: 6;
    }
    .Courses-content {
      li {
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
    }

  }
  .project-list {

    .card-title {
      font-size: 0;

      a {
        color: rgba(0, 0, 0, 0.85);
        margin-left: 12px;
        line-height: 24px;
        height: 24px;
        display: inline-block;
        vertical-align: top;
        font-size: 14px;

        &:hover {
          color: #1890ff;
        }
      }
    }

    .card-description {
      color: rgba(0, 0, 0, 0.45);
      height: 44px;
      line-height: 22px;
      overflow: hidden;
    }

    .project-item {
      display: flex;
      margin-top: 8px;
      overflow: hidden;
      font-size: 12px;
      height: 20px;
      line-height: 20px;

      a {
        color: rgba(0, 0, 0, 0.45);
        display: inline-block;
        flex: 1 1 0;

        &:hover {
          color: #1890ff;
        }
      }

      .datetime {
        color: rgba(0, 0, 0, 0.25);
        flex: 0 0 auto;
        float: right;
      }
    }

    .ant-card-meta-description {
      color: rgba(0, 0, 0, 0.45);
      height: 44px;
      line-height: 22px;
      overflow: hidden;
    }
  }

  .item-group {
    padding: 20px 0 8px 24px;
    font-size: 0;

    a {
      color: rgba(0, 0, 0, 0.65);
      display: inline-block;
      font-size: 14px;
      margin-bottom: 13px;
    }
  }

  .members {
    a {
      display: block;
      margin: 12px 0;
      line-height: 24px;
      height: 24px;

      .member {
        font-size: 14px;
        color: rgba(0, 0, 0, .65);
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

  .mobile {

    .project-list {

      .project-card-grid {
        width: 100%;
      }
    }

    .more-info {
      border: 0;
      padding-top: 16px;
      margin: 16px 0 16px;
    }

    .headerContent .title .welcome-text {
      display: none;
    }
  }

</style>
