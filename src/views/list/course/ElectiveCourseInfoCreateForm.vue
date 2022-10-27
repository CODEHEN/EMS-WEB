<template>
  <a-modal
    title="新建课程"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    @ok="() => { $emit('ok',isdisabled) }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <a-form-item v-show="false">
          <a-input v-decorator.Number="['id']" placeholder="请输入编号"/>
        </a-form-item>
        <a-form-item label="编号" >
          <a-input v-decorator="['courseId', {rules: [{required: true, message: '请输入编号'}]}]" placeholder="请输入编号"/>
        </a-form-item>
        <a-form-item label="课程名称">
          <a-input v-decorator="['courseName', {rules: [{required: true, message: '请输入课程名称'}]}]" placeholder="请输入课程名称" />
        </a-form-item>
        <a-form-item label="课程类型" v-show="!isdisabled">
          <a-select
            @select="selectTye"
            v-decorator="['type', {
              initialValue: '',
              rules: [{required: true, message: '请选择课程类型'}]}]">
            <a-select-option value="0">线上</a-select-option>
            <a-select-option value="1">线下</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="学期" >
          <a-input
            v-decorator="['semester', {rules: [{required: true,pattern: '^[0-9]{4}-[0-9]{4}-[1-2]{1}$', message: '格式：2020-2021-1'}]}]"
            placeholder="格式：2020-2021-1"/>
        </a-form-item>
        <a-form-item label="上课时间" v-if="isshow || !isdisabled">
          周：
          <a-input-number
            v-decorator="['week', {
              initialValue: 1,
              rules: [{required: true, message: '请选择上课时间'}]}]"
            :min="1"
            :max="7"
          />
          节：
          <a-input-number
            v-decorator="['day', {
              initialValue: 1,
              rules: [{required: true, message: '请选择上课时间'}]}]"
            :min="1"
            :max="5"
          />
        </a-form-item>
        <a-form-item label="上课教室" v-if="isshow">
          <a-select placeholder="教学楼" @select="selectClassRoom" v-decorator="['build',{rules: [{required: true, message: '请选择教学楼'}]}]">
            <a-select-option v-for="build in builds" :key="build.id" :value="build.id">{{ build.buildName }}</a-select-option>
          </a-select>
          <a-select placeholder="教室" v-decorator="['classroomId',{rules: [{required: true, message: '请选择教学楼'}]}]">
            <a-select-option v-for="room in classRoom" :key="room.id" :value="room.id">{{ room.classroomname }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="授课教师" v-if="isshow">
          <a-auto-complete
            v-decorator="['teacherName', {rules: [{required: true, message: '请选择授课教师'}]}]"
            :dataSource="teaSourse"
            placeholder="选择教师"
            @search="onSearchTeacherName"
          />
        </a-form-item>
        <a-form-item label="课程类型">
          <a-select placeholder="请选择" v-decorator="['courseAttr', {rules: [{required: true, message: '请选择课程类型'}]}]">
            <a-select-option value="通识教育课">通识教育课</a-select-option>
            <a-select-option value="专业选修课">专业选修课</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="上课人数">
          <a-input v-decorator="['totalNum', {rules: [{required: true, message: '请输入数字'}]}]" placeholder="上课人数"></a-input>
        </a-form-item>
        <a-form-item label="时间" v-show="false">
          <a-input v-decorator="['classTime']" placeholder="时间"></a-input>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import { getTeaName } from '@/api/user'
import { getTeachBuildInfo2 } from '@/api/teach_build'
import { getClassRoomByTeachBuildId } from '@/api/classroom'
// 表单字段
const fields = ['id', 'courseId', 'week', 'day', 'build', 'classroomId', 'courseName', 'type', 'classTime', 'teacherName', 'courseAttr', 'totalNum', 'semester']
export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    isdisabled: {
      type: Boolean,
      default: () => true
    },
    editPa: {
      type: Object,
      default: () => null
    },
    isshow: {
      type: Boolean,
      default: () => false
    },
    loading: {
      type: Boolean,
      default: () => false
    },
    model: {
      type: Object,
      default: () => null
    }
  },
  data () {
    this.formLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      }
    }
    return {
      form: this.$form.createForm(this),
      teaSourse: [],
      builds: [],
      classRoom: []
    }
  },
  created () {
    // 防止表单未注册
    fields.forEach(v => this.form.getFieldDecorator(v))
    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields))
    })
  },
  watch: {
  },
  mounted () {
    getTeachBuildInfo2().then(res => {
        if (res.data.length === 0) {
          this.$message.warning('未查找到匹配目标')
        }
        this.builds = res.data
      })
  },
  methods: {
    onSearchTeacherName (searchText) {
      getTeaName(searchText).then(res => {
        this.teaSourse = res.data
      })
    },
    selectClassRoom (value) {
      this.form.setFieldsValue({ 'classroomId': '' })
      getClassRoomByTeachBuildId(value)
        .then(res => {
          if (res.data.length === 0) {
            this.$message.warning('未查找到匹配目标')
          }
          this.classRoom = res.data
        })
    },
    selectTye (value) {
      if (value === '0') {
        this.isshow = false
      }
      if (value === '1') {
        this.isshow = true
      }
    }
  }
}
</script>
