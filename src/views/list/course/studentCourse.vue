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
            <a-col :md="8" :sm="24">
              <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
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
      </s-table>
      <step-by-step-modal ref="modal" @ok="handleOk"/>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import StepByStepModal from '../modules/StepByStepModal'
import { getClassTask, addClassTask, updateCourse, getSemesters } from '@/api/classTask'
import store from '@/store'
import { getClassesByCollege } from '@/api/classes'
import { getMajorByCollegeName } from '@/api/major'
import { getCollege } from '@/api/college'

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
    title: '课程名称',
    dataIndex: 'courseName'
  },
  {
    title: '周次数',
    dataIndex: 'weeksNumber'
  },
  {
    title: '授课教师',
    dataIndex: 'teacherName'
  },
  {
    title: '课程类型',
    dataIndex: 'courseAttr'
  }
]

const statusMap = {
}

export default {
  name: 'TableList',
  components: {
    STable,
    Ellipsis,
    StepByStepModal
  },
  data () {
    this.columns = columns
    return {
      // create model
      visible: false,
      confirmLoading: false,
      mdl: null,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        this.queryParam.className = this.$store.getters.userInfo.classes
        return getClassTask(parameter, this.queryParam)
          .then(res => {
            if (res.data.list.length === 0) {
              this.$message.warning('未查找到匹配目标')
            }
            return res.data
          })
      },
      disabled: true,
      isdisabled: true,
      semedisabled: true,
      colleges: [],
      classes: [],
      majors: [],
      semesters: []
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
    this.getCollege()
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
    semesterSel (val) {
      this.semedisabled = false
      this.semester = val
    },
    changeSe (val, op) {
      if (op === undefined) {
        this.semedisabled = true
      } else {
        this.semedisabled = false
        this.semester = val
      }
    },
    getCollege () {
      getCollege().then(res => {
        this.colleges = res.data
      })
    },
    onChange (value, dateString) {
      this.queryParam.createdTime = dateString
    },
    queryReset () {
      this.queryParam = {}
      this.disabled = true
    },
    handleAdd () {
      this.mdl = null
      this.isdisabled = false
      this.visible = true
    },
    selectClasses (value) {
      this.queryParam.classes = ''
      getClassesByCollege(value).then(res => {
        this.classes = res.data
        this.disabled = false
      })
    },
    selectMajor (value) {
      this.queryParam.major = ''
      getMajorByCollegeName(value).then(res => {
        this.majors = res.data
        this.majordisabled = false
      })
    },
    handleEdit (record) {
      this.mdl = { ...record }
      this.isdisabled = true
      this.visible = true
    },
    handleOk (isdisabled) {
      console.log('a')
      console.log(isdisabled)
      const form = this.$refs.createModal.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          form.setFieldsValue({ 'createdId': store.getters.userInfo.id })
          if (isdisabled === true) {
            updateCourse(form.getFieldsValue()).then(res => {
              this.visible = false
              this.confirmLoading = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              this.$refs.table.refresh()

              this.$message.info('修改成功')
            })
          } else {
            addClassTask(form.getFieldsValue()).then(res => {
              this.visible = false
              this.confirmLoading = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              this.$refs.table.refresh()

              this.$message.info('添加成功')
            })
          }
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel () {
      this.isdisabled = true
      this.visible = false
      const form = this.$refs.createModal.form
      form.resetFields() // 清理表单数据（可不做）
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    resetSearchForm () {
      this.queryParam = {
        date: moment(new Date())
      }
    }
  }
}
</script>
