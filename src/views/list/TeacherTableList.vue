<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="教师编号">
                <a-input v-model.number="queryParam.number" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="教师姓名">
                <a-input v-model.number="queryParam.username" placeholder=""/>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="所属学院">
                  <a-select placeholder="请选择" v-model="queryParam.college">
                    <a-select-option v-for="college in colleges" :key="college.id" :value="college.name">{{ college.name }}</a-select-option>
                  </a-select>
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
        <a-dropdown>
          <a-menu slot="overlay">
            <a-menu-item key="1" @click="handleAdd"><a-icon type="delete"/>单独新建</a-menu-item>
            <!-- lock | unlock -->
            <a-menu-item key="2" @click="handleOpenModel"><a-icon type="lock" />Excel导入</a-menu-item>
          </a-menu>
          <a-button type="primary" icon="plus">
            新建 <a-icon type="down" />
          </a-button>
        </a-dropdown>
      </div>

      <a-modal
        title="Excel导入"
        :visible="modelVisible"
        @cancel="() => this.modelVisible = false"
        :footer="null"
      >
        <a-upload
          name="file"
          :multiple="true"
          :action="actionUrl"
          :data={roleId:3}
          accept=".xls,.xlsx"
          @change="fileChange"
        >
          <a-button> <a-icon type="upload" />选择文件</a-button>
        </a-upload>
      </a-modal>

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
        :colleges="colleges"
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
import CreateForm from './modules/TeacherCreateForm'
import { getTeacherInfo, updateTeacher, addTeacher } from '@/api/admin'
import { getCollege } from '@/api/college'

const columns = [
  {
    title: '编号',
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
    title: '性别',
    width: 80,
    dataIndex: 'sex',
    scopedSlots: { customRender: 'sex' }
  },
  {
    title: '所属学院',
    dataIndex: 'college',
    scopedSlots: { customRender: 'college' }
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
    title: '家庭地址',
    ellipsis: true,
    dataIndex: 'address'
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
        return getTeacherInfo(parameter, this.queryParam)
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
    handleOpenModel () {
      this.modelVisible = true
    },
    queryReset () {
      this.queryParam = {}
      this.disabled = true
      this.majordisabled = true
    },
    getCollege () {
      getCollege().then(res => {
        this.colleges = res.data
      })
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
    handleOk (model, isdisabled) {
      const form = this.$refs.createModal.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          if (isdisabled === true) {
            updateTeacher(form.getFieldsValue()).then(res => {
              this.visible = false
              this.confirmLoading = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              this.$refs.table.refresh()

              this.$message.info('修改成功')
            })
          } else {
            addTeacher(form.getFieldsValue()).then(res => {
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
