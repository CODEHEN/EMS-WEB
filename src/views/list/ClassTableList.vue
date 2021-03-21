<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="班级名称">
                <a-input v-model.number="queryParam.name" placeholder=""/>
              </a-form-item>
            </a-col>
            <template>
              <a-col :md="8" :sm="24">
                <a-form-item label="学院">
                  <a-select placeholder="请选择" @select="selectMajor" v-model="queryParam.college">
                    <a-select-option v-for="college in colleges" :key="college.id" :value="college.name">{{ college.name }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="专业">
                  <a-select placeholder="请选择" :disabled="majordisabled" @select="selectClasses" v-model="queryParam.major">
                    <a-select-option v-for="(m,index) in majors" :key="index" :value="m.majorName">{{ m.majorName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </template>
            <a-col :md="23" :sm="24">
              <span class="table-page-search-submitButtons" style="float:right; overflow:hidden">
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="queryReset">重置</a-button>
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
          :data={roleId:2}
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

import StepByStepModal from './modules/StepByStepModal'
import CreateForm from './modules/CreateForm'
import { getCollege } from '@/api/college'
import { getClassesByCollege, getClassInfo } from '@/api/classes'
import { getMajorByCollegeName } from '@/api/major'

const columns = [
  {
    title: '编号',
    dataIndex: 'id',
    scopedSlots: { customRender: 'id' }
  },
  {
    title: '班级名称',
    dataIndex: 'name',
    scopedSlots: { customRender: 'name' }
  },
  {
    title: '专业',
    dataIndex: 'major',
    scopedSlots: { customRender: 'major' }
  },
  {
    title: '学生人数',
    dataIndex: 'studentNum',
    scopedSlots: { customRender: 'studentNum' }
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
      // 查询参数
      queryParam: {
        classes: ''
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getClassInfo(parameter, this.queryParam)
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
      classes: [],
      majors: [],
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
    // 鼠标点击根据学院ID来查找该学院下的班级
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
    getCollege () {
      getCollege().then(res => {
        this.colleges = res.data
      })
    },
    handleAdd () {
      this.mdl = null
      this.isdisabled = false
      this.classes = []
      this.majors = []
      this.visible = true
    },
    handleEdit (record) {
      this.mdl = { ...record }
      this.selectMajor(this.mdl.college)
      this.selectClasses(this.mdl.major)
      this.visible = true
    },
    handleOk (model, isdisabled) {
      // const form = this.$refs.createModal.form
      // console.log('form', JSON.stringify(form.getFieldsValue()))
      // this.confirmLoading = true
      // form.validateFields((errors, values) => {
      //   if (!errors) {
      //     if (isdisabled === true) {
      //       updateStudent(form.getFieldsValue()).then(res => {
      //         this.visible = false
      //         this.confirmLoading = false
      //         // 重置表单数据
      //         form.resetFields()
      //         // 刷新表格
      //         this.$refs.table.refresh()
      //
      //         this.$message.info('修改成功')
      //       })
      //     } else {
      //       addStudent(form.getFieldsValue()).then(res => {
      //         this.visible = false
      //         this.confirmLoading = false
      //         // 重置表单数据
      //         form.resetFields()
      //         // 刷新表格
      //         this.$refs.table.refresh()
      //
      //         this.$message.info('添加成功')
      //       })
      //     }
      //   } else {
      //     this.confirmLoading = false
      //   }
      // })
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
