<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="学期">
                <a-select v-model="queryParam.semester">
                  <a-select-option v-for="(semester,index) in semesters" :key="index" :value="semester">{{ semester }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="16" :sm="24">
              <span class="table-page-search-submitButtons" style="float: right">
                <a-button type="primary" @click="getGrade">查询</a-button>
                <a-button style="margin-left: 8px" @click="queryReset">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <a-table :columns="columns" :data-source="studentGrade">
        <template slot="type" slot-scope="text">
         <span v-if="text === 0"> 正常考试</span>
         <span v-if="text === 1"> 缺考</span>
         <span v-if="text === 2"> 违纪</span>
        </template>
      </a-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { Scheduling, getSemesters } from '@/api/classTask'
import { getClassesByCollege } from '@/api/classes'
import { delEletiveCourse } from '@/api/course'
import { getStudentCourseGrade } from '@/api/grade'
const columns = [
  {
    title: 'id',
    dataIndex: 'id',
    sorter: true,
    scopedSlots: { customRender: 'id' }
  },
  {
    title: '课程名称',
    dataIndex: 'course',
    scopedSlots: { customRender: 'course' }
  },
  {
    title: '分数',
    dataIndex: 'grade'
  },
  {
    title: '考试性质',
    dataIndex: 'type',
    scopedSlots: { customRender: 'type' }
  }
]

export default {
  name: 'TableList',
  components: {
    STable,
    Ellipsis
  },
  data () {
    return {
      columns,
      // 查询参数
      studentGrade: [],
      queryParam: {
      },
      disabled: true,
      classes: [],
      semesters: [],
      switchClassInfo: true
    }
  },
  created () {
  },
  mounted () {
    this.getSemesters()
    this.queryParam.semester = '2020-2021-1'
    this.getGrade()
  },
  computed: {
    rowSelection () {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    }
  },
  methods: {
    getGrade () {
      this.queryParam.number = this.$store.getters.userInfo.number
      getStudentCourseGrade(this.queryParam).then(res => {
        if (res.data.length === 0) {
          this.$message.warning('未查找到匹配目标')
        }
        this.studentGrade = res.data
        console.log(this.studentGrade)
      })
    },
    delEletiveClass (record) {
      delEletiveCourse(record).then(res => {
        if (res.code === 200) {
          this.$refs.table.refresh()
          this.$message.success(res.message)
        }
      })
    },
    getSemesters () {
      getSemesters().then(res => {
        this.semesters = res.data
      })
    },
    fileChange (event) {
      if (event.file.status === 'done') {
        if (event.file.response.code === 200) {
          // 刷新表格
          this.$refs.table.refresh()
          this.$message.success('添加成功')
        } else {
          this.$message.error(event.file.response.message)
        }
      }
    },
    classScheduling () {
      Scheduling(this.que).then(res => {
        if (res.code === 200) {
          this.$message.success(res.message)
        } else {
          this.$message.error(res.message)
        }
      })
    },
    semesterSel (val) {
      this.semester = val
    },
    changeSe (val, op) {
      if (op === undefined) {
      } else {
        this.semester = val
      }
    },
    onChange (value, dateString) {
      this.queryParam.createdTime = dateString
    },
    queryReset () {
      this.queryParam = {}
    },
    back () {
      this.switchClassInfo = true
    },
    selectClasses (value) {
      this.queryParam.classes = ''
      getClassesByCollege(value).then(res => {
        this.classes = res.data
      })
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    resetSearchForm () {
      this.queryParam = {
        date: moment(new Date())
      }
    }
  }
}
</script>
