<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="发布管理员">
                <a-select placeholder="请选择" v-model="queryParam.createdId">
                  <a-select-option v-for="a in admin" :key="a.id" :value="a.id">{{ a.username }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="发布时间">
                <a-date-picker
                  format="YYYY-MM-DD HH:mm:ss"
                  @change="onChange"
                  show-time
                  placeholder="Select Time"/>
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
            <a @click="handleEdit(record)">删除</a>
          </template>
        </span>

        <p slot="expandedRowRender" slot-scope="record" style="margin: 0">
          通知内容：{{ record.content }}
        </p>
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
import StepByStepModal from '../modules/StepByStepModal'
import CreateForm from './Reward_PunishmentCreateForm'
import { getAdmin } from '@/api/admin'
import { getNotice, addNotice, delNotice } from '@/api/notice'
import store from '@/store'

const columns = [
  {
    title: '编号',
    dataIndex: 'id'
  },
  {
    title: '标题',
    dataIndex: 'title'
  },
  {
    title: '创建人ID',
    dataIndex: 'createdId'
  },
  {
    title: '发布时间',
    dataIndex: 'createdTime'
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
      queryParam: {
        classes: ''
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getNotice(parameter, this.queryParam)
          .then(res => {
            if (res.data.list.length === 0) {
              this.$message.warning('未查找到匹配目标')
            }
            return res.data
          })
      },
      disabled: true,
      majordisabled: true,
      isdisabled: true,
      modelVisible: false,
      admin: []
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
    getAdmin().then(res => {
      this.admin = res.data
    })
  },
  mounted () {
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
    onChange (value, dateString) {
      this.queryParam.createdTime = dateString
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
      delNotice(record.id).then(res => {
        if (res.code === 200) {
          this.$message.info(res.message)
        }
        // 刷新表格
        this.$refs.table.refresh()
      })
    },
    handleOk () {
      const form = this.$refs.createModal.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          form.setFieldsValue({ 'createdId': store.getters.userInfo.id })
          addNotice(form.getFieldsValue()).then(res => {
            this.visible = false
            this.confirmLoading = false
            // 重置表单数据
            form.resetFields()
            // 刷新表格
            this.$refs.table.refresh()

            this.$message.info('发布成功')
          })
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
