<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="学院名称">
                <a-input v-model="queryParam.name" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="!advanced && 8" :sm="24">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="queryReset">重置</a-button>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="handleAdd">新建</a-button>
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
            <a @click="handleEdit(record)">修改</a>
          </template>
        </span>
      </s-table>

      <create-form
        ref="createModal"
        :visible="visible"
        :isdisabled="isdisabled"
        :loading="confirmLoading"
        :model="mdl"
        @cancel="handleCancel"
        @ok="handleOk"
      />
      <step-by-step-modal ref="modal" @ok="handleOk"/>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'

import StepByStepModal from './modules/StepByStepModal'
import CreateForm from './modules/CollegeCreateForm'
import { getCollegeInfo, updateCollege, addCollege } from '@/api/admin'

const columns = [
  {
    title: '编号',
    dataIndex: 'id',
    scopedSlots: { customRender: 'id' }
  },
  {
    title: '学院名称',
    dataIndex: 'name',
    scopedSlots: { customRender: 'name' }
  },
  {
    title: '学生人数',
    dataIndex: 'studentNum',
    scopedSlots: { customRender: 'studentNum' }
  },
  {
    title: '教师人数',
    dataIndex: 'teacherNum',
    scopedSlots: { customRender: 'teacherNum' }
  },
  {
    title: '创建时间',
    dataIndex: 'createdTime',
    scopedSlots: { customRender: 'createdTime' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

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
      queryParam: {
        classes: ''
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getCollegeInfo(parameter, this.queryParam)
          .then(res => {
            if (res.data.list.length === 0) {
              this.$message.warning('未查找到匹配用户')
            }
            return res.data
          })
      },
      disabled: true,
      majordisabled: true,
      isdisabled: true,
      modelVisible: false,
      colleges: [],
      actionUrl: process.env.VUE_APP_API_BASE_URL + '/user/userInfoExcel'
    }
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
    handleOpenModel () {
      this.modelVisible = true
    },
    queryReset () {
      this.queryParam = {}
      this.disabled = true
      this.majordisabled = true
    },
    handleAdd () {
      this.mdl = null
      this.isdisabled = false
      this.visible = true
    },
    handleEdit (record) {
      this.mdl = { ...record }
      this.visible = true
    },
    handleOk (time, isdisabled) {
      const form = this.$refs.createModal.form
      this.confirmLoading = true
      form.setFieldsValue({ 'createdTime': time })
      form.validateFields((errors, values) => {
        if (!errors) {
          if (isdisabled === true) {
            updateCollege(form.getFieldsValue()).then(res => {
              this.visible = false
              this.confirmLoading = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              this.$refs.table.refresh()

              this.$message.info('修改成功')
            })
          } else {
            console.log(form.getFieldsValue())
            addCollege(form.getFieldsValue()).then(res => {
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
