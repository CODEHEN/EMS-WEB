<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="学期">
                <a-input v-model="queryParam.semester" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="课程名称">
                <a-input v-model="queryParam.courseName" placeholder=""/>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="课程类型">
                  <a-select placeholder="请选择" v-model="queryParam.courseAttr">
                    <a-select-option value="01">专业课</a-select-option>
                    <a-select-option value="02">学科基础课</a-select-option>
                    <a-select-option value="03">通识教育课</a-select-option>
                    <a-select-option value="04">专业选修课</a-select-option>
                    <a-select-option value="05">公共选修课</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="班级">
                  <a-input v-model="queryParam.className" placeholder=""/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="授课教师">
                  <a-input v-model="queryParam.teacherName" placeholder=""/>
                </a-form-item>
              </a-col>
            </template>
            <a-col :md="!advanced && 8 || 24" :sm="24">
              <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="queryReset">重置</a-button>
                <a @click="toggleAdvanced" style="margin-left: 8px">
                  {{ advanced ? '收起' : '展开' }}
                  <a-icon :type="advanced ? 'up' : 'down'"/>
                </a>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="handleAdd">
          新建
        </a-button>
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
            <a @click="handleEdit(record)"> 修改</a>
          </template>
        </span>
      </s-table>

      <create-form
        ref="createModal"
        :visible="visible"
        :isdisabled="isdisabled"
        :loading="confirmLoading"
        :model="mdl"
        :colleges="colleges"
        :majors="majors"
        :classes="classes"
        @cancel="handleCancel"
        @ok="handleOk"
        @selectClasses="selectClasses"
        @selectMajor="selectMajor"
      />
      <step-by-step-modal ref="modal" @ok="handleOk"/>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import StepByStepModal from '../modules/StepByStepModal'
import CreateForm from './ClassTaskCreateForm'
import { getClassTask, addCourse, updateCourse } from '@/api/classTask'
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
    title: '班级',
    dataIndex: 'className'
  },
  {
    title: '课程名称',
    dataIndex: 'courseName'
  },
  {
    title: '授课教师',
    dataIndex: 'teacherName'
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

const statusMap = {
}

export default {
  name: 'TableList',
  components: {
    STable,
    Ellipsis,
    CreateForm,
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
      modelVisible: false,
      colleges: [],
      classes: [],
      majors: []
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
    fileChange (event) {
      if (event.file.status === 'done') {
        if (event.file.response.code === 200) {
          // 刷新表格
          this.$refs.table.refresh()
          this.modelVisible = false
          this.$message.success('添加成功')
        } else {
          this.$message.error(event.file.response.message)
        }
      }
    },
    getCollege () {
      getCollege().then(res => {
        this.colleges = res.data
      })
    },
    handleOpenModel () {
      this.modelVisible = true
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
            addCourse(form.getFieldsValue()).then(res => {
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
