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
            <a-col :md="8" :sm="24">
              <a-form-item label="课程名称">
                <a-input v-model="queryParam.courseName" placeholder=""/>
              </a-form-item>
            </a-col>
            <template>
              <a-col :md="8" :sm="24">
                <a-form-item label="课程类型">
                  <a-select placeholder="请选择" v-model="queryParam.courseAttr">
                    <a-select-option value="01">专业课</a-select-option>
                    <a-select-option value="02">学科基础课</a-select-option>
                    <a-select-option value="03">通识教育课</a-select-option>
                    <a-select-option value="04">专业选修课</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="班级">
                  <a-input v-model="queryParam.className" placeholder=""/>
                </a-form-item>
              </a-col>
            </template>
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
            <a @click="ClassInfo(record)"> 班级信息</a>
          </template>
        </span>
      </s-table>
    </a-card>
    <a-card :bordered="false" v-if="!switchClassInfo">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="学生编号">
                <a-input v-model.number="queryParam.number" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="学生姓名">
                <a-input v-model.number="queryParam.username" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="switchClassInfo?16:8" :sm="24">
              <span class="table-page-search-submitButtons" style="float: right">
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="queryReset">重置</a-button>
                <a-button style="margin-left: 8px" @click="back">返回</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <s-table
        :key="switchClassInfo"
        ref="table"
        size="default"
        rowKey="number"
        :columns="ClassInfoColumns"
        :data="loadDataClass"
        :alert="false"
        showPagination="auto"
      >
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { getClassTask, Scheduling, getSemesters } from '@/api/classTask'
import { getClassesByCollege } from '@/api/classes'
import { getStudentInfo } from '@/api/admin'

const columns = [
  {
    title: 'id',
    dataIndex: 'id'
  },
  {
    title: '学期',
    dataIndex: 'semester'
  },
  {
    title: '学院',
    dataIndex: 'collegeName'
  },
  {
    title: '专业',
    dataIndex: 'majorName'
  },
  {
    title: '班级',
    dataIndex: 'className'
  },
  {
    title: '课程名称',
    dataIndex: 'courseName'
  },
  {
    title: '周次数',
    dataIndex: 'weeksNumber'
  },
  {
    title: '课程类型',
    dataIndex: 'courseAttr'
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
const ClassInfoColumns = [
  {
    title: '学号',
    width: 140,
    dataIndex: 'number',
    scopedSlots: { customRender: 'usernumber' }
  },
  {
    title: '姓名',
    width: 80,
    dataIndex: 'username',
    scopedSlots: { customRender: 'username' }
  },
  {
    title: '班级',
    width: 130,
    dataIndex: 'classes'
  },
  {
    title: '性别',
    width: 80,
    dataIndex: 'sex',
    scopedSlots: { customRender: 'sex' }
  },
  {
    title: '电话号码',
    dataIndex: 'phone'
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    scopedSlots: { customRender: 'email' }
  },
  {
    title: '生源地',
    dataIndex: 'origin'
  },
  {
    title: '家庭地址',
    ellipsis: true,
    dataIndex: 'address'
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
    this.ClassInfoColumns = ClassInfoColumns
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
        this.queryParam.teacherName = this.$store.getters.userInfo.username
        return getClassTask(parameter, this.queryParam)
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
    ClassInfo (record) {
      this.switchClassInfo = false
      this.queryParam = {}
      this.queryParam.classes = record.className
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
