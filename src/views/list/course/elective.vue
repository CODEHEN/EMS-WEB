<template>
  <page-header-wrapper>
    <a-card :bordered="false" v-if="switchClassInfo">
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
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="queryReset">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <s-table
        ref="table"
        size="default"
        rowKey="number"
        :columns="columns"
        :data="loadData"
        :alert="false"
        showPagination="auto"
      >
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="delEletiveClass(record)"> 退课</a>
          </template>
        </span>
        <span slot="type" slot-scope="text">
          <a-tag
            :color="text === 0 ? 'red' : 'green'"
          >
            {{ text === 0 ? '线上' : '线下' }}
          </a-tag>
        </span>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { Scheduling, getSemesters } from '@/api/classTask'
import { getClassesByCollege } from '@/api/classes'
import { getStudentInfo } from '@/api/admin'
import { getStudentElectiveCourse, delEletiveCourse } from '@/api/course'
const columns = [
  {
    title: 'id',
    dataIndex: 'id'
  },
  {
    title: '编号',
    dataIndex: 'courseId'
  },
  {
    title: '课程名称',
    dataIndex: 'courseName'
  },
  {
    title: '开设学期',
    dataIndex: 'semester'
  },
  {
    title: '上课时间',
    dataIndex: 'classTime'
  },
  {
    title: '上课教室',
    dataIndex: 'className'
  },
  {
    title: '上课教师',
    dataIndex: 'teacherName'
  },
  {
    title: '课程属性',
    dataIndex: 'courseAttr'
  },
  {
    title: '教室编号',
    dataIndex: 'classroomId',
    colSpan: 0,
    customRender: (value, row, index) => {
      const obj = {
        children: value,
        attrs: {}
      }
      obj.attrs.colSpan = 0
      return obj
    }
  },
  {
    title: '课程类型',
    dataIndex: 'type',
    scopedSlots: { customRender: 'type' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
const statusMap = {
}

export default {
  name: 'TableList',
  components: {
    STable,
    Ellipsis
  },
  data () {
    this.columns = columns
    return {
      // create model
      visible: false,
      confirmLoading: false,
      mdl: null,
      // 查询参数
      queryParam: {
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        this.queryParam.studentNumber = this.$store.getters.userInfo.number
        return getStudentElectiveCourse(parameter, this.queryParam)
          .then(res => {
            if (res.data.list.length === 0) {
              this.$message.warning('未查找到匹配目标')
            }
            return res.data
          })
      },
      loadDataClass: parameter => {
        return getStudentInfo(parameter, this.queryParam)
          .then(res => {
            if (res.data.list.length === 0) {
              this.$message.warning('未查找到匹配目标')
            }
            return res.data
          })
      },
      disabled: true,
      classes: [],
      semesters: [],
      switchClassInfo: true
    }
  },
  filters: {
    statusFilter (type) {
      return statusMap[type].text
    },
    statusTypeFilter (type) {
      return statusMap[type].status
    }
  },
  created () {
  },
  mounted () {
    this.getSemesters()
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
