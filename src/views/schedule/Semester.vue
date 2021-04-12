<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="学年学期">
                <a-select
                  placeholder="请选择"
                  v-model="queryParam.semester"
                  v-decorator="[
                    { rules: [{ required: true, message: 'Please input your username!' }] },
                  ]">
                  <a-select-option v-for="(semester,index) in semesters" :key="index" :value="semester">{{ semester }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="学生学号" >
                <a-input v-model="queryParam.studentNumber" placeholder="请输入学号"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary" @click="selectSchedule">查询</a-button>
                <a-button style="margin-left: 8px" @click="queryReset">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <div id="coursesTable"></div>
    </a-card>
  </page-header-wrapper>
</template>

<script>

import Timetables from 'timetables'

import { studentSchedule } from '@/api/schedule'
import { getSemesters } from '@/api/classTask'

export default {
name: 'Semester',
  data () {
  return {
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
      [{ index: '1', name: '8:30' }, 1],
      [{ index: '2', name: '8:30' }, 1],
      [{ index: '3', name: '8:30' }, 1],
      [{ index: '4', name: '8:30' }, 1],
      [{ index: '5', name: '8:30' }, 1]
    ],
    week: ['一', '二', '三', '四', '五', '六', '日'],
    highlightWeek: new Date().getDay(),
    styles: {
      Gheight: 120,
      leftHandWidth: 40,
      palette: ['#ff6633', '#8f8123']
    },
    Timetable: null,
    queryParam: {},
    advanced: false,
    semesters: []
  }
  },
  created () {
  console.log(this.timetables)
  },
  mounted () {
    this.Timetable = new Timetables({
      el: '#coursesTable',
      timetables: this.timetables,
      week: this.week,
      timetableType: this.timetableType,
      highlightWeek: this.highlightWeek,
      gridOnClick: function (e) {
        alert(e.name + '  ' + '周' + e.week + ', 第' + e.index + '节课, 课长' + e.length + '节')
        console.log(e)
      },
      styles: this.styles
    })
    this.getSemesters()
  },
  methods: {
    selectSchedule () {
      if (this.queryParam.semester === undefined) {
        this.$message.warning('请输入学期')
        return
      }
      if (this.queryParam.studentNumber === undefined) {
        this.$message.warning('请输入学号')
        return
      }
      studentSchedule(this.queryParam).then(res => {
        if (res.code === 200) {
          this.timetables = res.data
          console.log(this.timetables)
          this.Timetable.setOption({
            timetables: res.data
          })
        }
      })
    },
    queryReset () {
      this.queryParam = {}
    },
    getSemesters () {
      getSemesters().then(res => {
        this.semesters = res.data
      })
    }
  }
}
</script>

<style>
  #coursesTable {
    padding: 15px 10px;
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
</style>
