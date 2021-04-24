<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <template>
              <a-col :md="8" :sm="24">
                <a-form-item label="学期">
                  <a-select v-model="queryParam.semester">
                    <a-select-option v-for="(semester,index) in semesters" :key="index" :value="semester">{{ semester }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
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
              <a-col :md="8" :sm="24">
                <a-form-item label="班级">
                  <a-select placeholder="请选择" :disabled="disabled" v-model="queryParam.classes">
                    <a-select-option v-for="(c,index) in classes" :key="index" :value="c.name">{{ c.name }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </template>
            <a-col :md="23" :sm="24">
              <span class="table-page-search-submitButtons" style="float:right; overflow:hidden">
                <a-button type="primary" @click="gradeRanking">查询</a-button>
                <a-button style="margin-left: 8px" @click="queryReset">重置</a-button>
                <a-button type="primary" @click="ExcelExport">导出EXCEL</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>

        <div class="table-wrapper">
          <div class="ant-table-wrapper">
            <div class="ant-spin-nested-loading">
              <div class="ant-spin-container">
                <div class="ant-table ant-table-scroll-position-left ant-table-layout-fixed ant-table-default">
                  <div class="ant-table-content">
                    <div class="ant-table-body">
                      <table>
                        <thead class="ant-table-thead">
                          <tr>
                            <th class="ant-table-row-cell-break-word" v-for="(head,index) in gradeTable[0]" :key="index">{{ head }}</th>
                            <th class="ant-table-row-cell-break-word">排名</th>
                          </tr>
                        </thead>
                        <tbody class="ant-table-tbody">
                          <tr class="ant-table-row ant-table-row-level-0" v-for="(grade,index) in gradeTable" :key="index" v-if="index >=1">
                            <th class="ant-table-row-cell-break-word" v-for="(m,index2) in grade" :key="index2">{{ m }}</th>
                            <th class="ant-table-row-cell-break-word">{{ index }}</th>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--        <hot-table :data="hotSettings" :rowHeaders="true" :colHeaders="true"></hot-table>-->
      </div>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { getMajorByCollegeName } from '@/api/major'
import { getCollege } from '@/api/college'
import { getClassesByCollege } from '@/api/classes'
import { RankExcelExport, ranking } from '@/api/grade'
import { getSemesters } from '@/api/classTask'
import JsonExcel from 'vue-json-excel'

export default {
  name: 'Ranking',
  components: {
    JsonExcel
  },
  data () {
    return {
      json_fields: [],
      json_data: {},
      queryParam: {
        classes: ''
      },
      majors: [],
      semesters: [],
      gradeTable: {},
      colleges: [],
      classes: [],
      disabled: true,
      majordisabled: true
    }
  },
  mounted () {
    this.getCollege()
    this.getSemesters()
  },
  methods: {
    ExcelExport () {
      RankExcelExport(this.queryParam).then(res => {
        const fileName = '排名.xlsx' // 表格名字
        const blob = new Blob([res.data])
        const linkNode = document.createElement('a')

        linkNode.download = fileName
        linkNode.style.display = 'none'
        linkNode.href = URL.createObjectURL(blob) // 生成一个Blob URL
        document.body.appendChild(linkNode)
        linkNode.click() // 模拟在按钮上的一次鼠标单击

        URL.revokeObjectURL(linkNode.href) // 释放URL 对象
        document.body.removeChild(linkNode)
      }).catch(e => {
        console.log(e)
      })
    },
    gradeRanking () {
      ranking(this.queryParam).then(res => {
        this.gradeTable = res.data
        this.json_fields = res.data[0]
        this.json_data = res.data
        console.log(this.json_data)
        console.log(this.json_fields)
        console.log(this.gradeTable)
      })
    },
    getCollege () {
      getCollege().then(res => {
        this.colleges = res.data
      })
    },
    getSemesters () {
      getSemesters().then(res => {
        this.semesters = res.data
      })
    },
    queryReset () {
      this.queryParam = {}
      this.disabled = true
      this.majordisabled = true
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
    }
  }
  }
</script>

<style scoped>
.ant-table-thead > tr > th, .ant-table-tbody > tr > td {
  padding: 16px 16px;
  overflow-wrap: break-word;
}
.ant-table-row-cell-break-word {
  padding: 16px 16px;
  overflow-wrap: break-word;
}
</style>
