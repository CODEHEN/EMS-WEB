<template>
  <page-header-wrapper>
    <template v-slot:content>
      <div class="page-header-content">
        <div class="avatar">
          <a-avatar size="large" :src="user.avatar"/>
        </div>
        <div class="content">
          <div class="content-title">
            {{ timeFix }}，{{ user.username }}
          </div>
          <div v-if="role === 'student'">{{ user.classes }} | {{ user.college }} - {{ user.major }}</div>
          <div v-if="role === 'teacher'">{{ user.college }} - {{ user.number }}</div>
          <div v-if="role === 'admin'">{{ user.number }} | {{ user.email }} - {{ user.phone }}</div>
        </div>
      </div>
    </template>
    <div>
      <a-row :gutter="24" v-if="role !== 'admin'">
        <a-col :xl="16" :lg="24" :md="24" :sm="24" :xs="24" >
          <a-card
            class="project-list"
            :loading="loading"
            :bordered="false"
            title="我的课表"
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
          <a-card title="常用操作" style="margin-bottom: 24px" :bordered="false" v-if="role === 'student'">
            <div class="members">
              <a-row>
                <a-col :span="12" style="margin-top: 10px" v-for="(op,index) in this.operations " :key="index">
                  <a>
                    <a-avatar size="small" :src="user.avatar"/>
<!--                      <span class="member">{{ op.name }}</span>-->
                    <router-link :to="{ name: op.pathName }">
                      <span class="member">{{ op.name }}</span>
                    </router-link>
                    </a>

                </a-col>
              </a-row>
            </div>
          </a-card>

          <a-card title="公告栏" :bordered="false">
            <a-list>
              <a-list-item v-for="(not,index) in notice " :key="index">
                <a-list-item-meta :description="not.content">
                  <a-avatar slot="avatar" :src="user.avatar"/>
                  <a slot="title" style="color:red" @click.prevent="noticeTip(not)">{{ not.title }}</a>
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
import { studentSchedule, teacherSchedule } from '@/api/schedule'
import store from '@/store'
import { getNotice } from '@/api/notice'

export default {
  name: 'Workplace',
  components: {
    PageHeaderWrapper
  },
  data () {
    return {
      timeFix: timeFix(),
      user: {},
      operations: [
        {
        name: '成绩查询',
        pathName: 'StudentGrade'
      },
        {
          name: '选课中心',
          pathName: 'electiveCourseCenter'
        },
        {
          name: '课表查询',
          pathName: 'Teacher'
        },
        {
          name: '我的课程',
          pathName: 'studentCourseSemester'
        }
      ],
      loading: true,
      // data
      timetables: [
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', '']
      ],
      timetableType: [
        [{ index: '1', name: '8:20-10:00' }, 1],
        [{ index: '2', name: '10:20-12:00' }, 1],
        [{ index: '3', name: '14:00-15:40' }, 1],
        [{ index: '4', name: '15:50-17:30' }, 1],
        [{ index: '5', name: '19:00-20:30' }, 1]
      ],
      week: ['一', '二', '三', '四', '五', '六', '日'],
      highlightWeek: new Date().getDay(),
      styles: {
        Gheight: 160,
        leftHandWidth: 80,
        palette: ['#ff6633', '#8f8123']
      },
      Timetable: null,
      queryParam: {},
      notice: []
    }
  },
  computed: {
    ...mapState({
      nickname: (state) => state.user.username
    }),
    userInfo () {
      return this.$store.getters.userInfo
    },
    role () {
      return this.$store.getters.roles[0]
    }
  },
  created () {
    this.user = this.userInfo
    this.avatar = this.userInfo.avatar
    this.getNotice()
  },
  mounted () {
    console.log('we')
    console.log(document.querySelector('#coursesTable'))
    const _this = this
    if (this.role === 'student') {
      this.queryParam.studentNumber = this.userInfo.number
      studentSchedule(this.queryParam).then(res => {
        if (res.code === 200) {
          this.timetables = res.data
          this.Timetable = new Timetables({
            el: '#coursesTable',
            timetables: this.timetables,
            week: this.week,
            timetableType: this.timetableType,
            highlightWeek: this.highlightWeek,
            gridOnClick: function (e) {
              _this.$notification.open({
                message: '课程详情',
                description:
                  e.name + '  ' + '周' + e.week + ', 第' + e.index + '节课, 课长' + e.length + '节',
                icon: <a-icon type="smile" style="color: #108ee9" />,
                onClick: () => {
                  console.log('Notification Clicked!')
                }
              })
            },
            styles: this.styles
          })
        }
      })
    } else {
      this.queryParam.teacherName = store.getters.userInfo.username
      teacherSchedule(this.queryParam).then(res => {
        if (res.code === 200) {
          this.timetables = res.data
          this.Timetable = new Timetables({
            el: '#coursesTable',
            timetables: this.timetables,
            week: this.week,
            timetableType: this.timetableType,
            highlightWeek: this.highlightWeek,
            gridOnClick: function (e) {
              alert(e.name + '  ' + e.week + ', 第' + e.index + '节课, 课长' + e.length + '节')
            },
            styles: this.styles
          })
        }
      })
    }
  },
  methods: {
    getNotice () {
      const parameter = {}
      parameter.pageSize = 10
      parameter.pageNum = 1
      getNotice(parameter, this.queryParam)
        .then(res => {
          if (res.data.list.length === 0) {
            this.$message.warning('未查找到匹配目标')
          }
          this.notice = res.data.list
        })
    },
    noticeTip (not) {
      const h = this.$createElement
      this.$notification.open({
        message: not.title,
        description: h('div', null, [
          h('p', { domProps: { innerHTML: '\n' + not.content + '\n' + '\n' + '由' + '<span style="color:red;">' + not.createdName + '</span>' + '发布于' + not.createdTime } }, null)
        ]),
        duration: 7,
        class: 'ant-notice-self'
      })
    }
  }
}
</script>

<style lang="less">
  @import "./Workplace.less";

  #coursesTable {
    padding: 15px 10px;
    background-color: white;
  }

  .Courses-head {
    background-color: #edffff;
  }

  .Courses-head > div {
    text-align: center;
    font-size: 14px;
    line-height: 28px;
  }

  .left-hand-TextDom, .Courses-head {
    background-color: #f2f6f7;
  }

  .Courses-leftHand {
    background-color: #f2f6f7;
    font-size: 12px;
  }

  .Courses-leftHand .left-hand-index {
    color: #9c9c9c;
    margin-bottom: 4px !important;
  }

  .Courses-leftHand .left-hand-name {
    color: #666;
  }

  .Courses-leftHand p {
    text-align: center;
    font-weight: 900;
  }

  .Courses-head > div {
    border-left: none !important;
  }

  .Courses-leftHand > div {
    padding-top: 5px;
    border-bottom: 1px dashed rgb(219, 219, 219);
    display: flex;
    direction: inherit;
    flex-direction: column;
    justify-content: center;
  }

  .Courses-leftHand > div:last-child {
    border-bottom: none !important;
  }

  .left-hand-TextDom, .Courses-head {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
  }

  .Courses-content > ul {
    border-bottom: 1px dashed rgb(219, 219, 219);
    box-sizing: border-box;
  }

  .Courses-content > ul:last-child {
    border-bottom: none !important;
  }

  .highlight-week {
    color: #02a9f5 !important;
  }

  .Courses-content li {
    text-align: center;
    color: #666666;
    border-radius: 4px;
    font-size: 14px;
    flex-direction: column;
    justify-content: center;
    display: flex;
  }

  .Courses-content li span {
    padding: 6px 2px;
    box-sizing: border-box;
    line-height: 18px;
    border-radius: 4px;
    white-space: normal;
    word-break: break-all;
    cursor: pointer;
  }

  .grid-active {
    z-index: 9999;
  }

  .grid-active span {
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
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
  .ant-notice-self {
    word-wrap: break-word;
    word-break: break-all;
    white-space:pre
  }

</style>
