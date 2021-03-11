<template>
  <page-header-wrapper>
    <a-card :bordered="false">
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
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="学院">
                  <a-select placeholder="请选择" @select="selectMajor" v-model="queryParam.college">
                    <a-select-option v-for="college in colleges" :key="college.id" :value="college.name">{{college.name}}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="专业">
                  <a-select placeholder="请选择" :disabled="majordisabled" @select="selectCollege" v-model="queryParam.major">
                    <a-select-option v-for="(m,index) in majors" :key="index" :value="m.majorName">{{m.majorName}}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="班级">
                  <a-select placeholder="请选择" :disabled="disabled" v-model="queryParam.classes">
                    <a-select-option v-for = "(c,index) in classes" :key="index" :value="c.name">{{c.name}}</a-select-option>
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
        :loading="confirmLoading"
        :model="mdl"
        :colleges="colleges"
        :classes="classes"
        @cancel="handleCancel"
        @ok="handleOk"
        @selectCollege="selectCollege"
      />
      <step-by-step-modal ref="modal" @ok="handleOk"/>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'

import StepByStepModal from './modules/StepByStepModal'
import CreateForm from './modules/CreateForm'
import { getStudentInfo } from '@/api/admin'
import { getCollege } from '@/api/college'
import { getClassesByCollege } from '@/api/classes'
import { getMajorByCollegeName } from '@/api/major'

const columns = [
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
        return getStudentInfo(parameter, this.queryParam)
          .then(res => {
            if (res.data.list.length === 0) {
              this.$message.warning('未查找到匹配用户')
            }
            return res.data
          })
      },
      disabled: true,
      majordisabled: true,
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
    queryReset () {
      this.queryParam = {}
      this.disabled = true
    },
    // 鼠标点击根据学院ID来查找该学院下的班级
    selectCollege (value) {
      getClassesByCollege(value).then(res => {
        this.classes = res.data
        this.disabled = false
      })
    },
    selectMajor (value) {
      getMajorByCollegeName(value).then(res => {
        this.majors = res.data
        console.log(this.majors)
        this.majordisabled = false
      })
    },
    getCollege () {
      getCollege().then(res => {
        this.colleges = res.data
      })
    },
    handleAdd () {
      this.mdl = null
      this.visible = true
    },
    handleEdit (record) {
      this.visible = true
      this.mdl = { ...record }
    },
    handleOk () {
      const form = this.$refs.createModal.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
          if (values.id > 0) {
            // 修改 e.g.
            new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve()
              }, 1000)
            }).then(res => {
              this.visible = false
              this.confirmLoading = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              this.$refs.table.refresh()

              this.$message.info('修改成功')
            })
          } else {
            // 新增
            new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve()
              }, 1000)
            }).then(res => {
              this.visible = false
              this.confirmLoading = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              this.$refs.table.refresh()

              this.$message.info('新增成功')
            })
          }
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel () {
      this.visible = false

      const form = this.$refs.createModal.form
      form.resetFields() // 清理表单数据（可不做）
    },
    handleSub (record) {
      if (record.status !== 0) {
        this.$message.info(`${record.no} 订阅成功`)
      } else {
        this.$message.error(`${record.no} 订阅失败，规则已关闭`)
      }
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
