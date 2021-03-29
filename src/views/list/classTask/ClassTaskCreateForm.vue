<template>
  <a-modal
    title="新建开课任务"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    @ok="() => { $emit('ok',isdisabled) }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <a-form-item label="编号" v-show="false">
          <a-input v-decorator.Number="['id']" placeholder="请输入六位编号"/>
        </a-form-item>
        <a-form-item label="学期" >
          <a-input
            v-decorator="['semester', {rules: [{required: true,pattern: '^[0-9]{4}-[0-9]{4}-[1-2]{1}$', message: '格式：2020-2021-1'}]}]"
            placeholder="格式：2020-2021-1"/>
        </a-form-item>
        <a-form-item label="学院">
          <a-select placeholder="请选择" @select="selectMajor" v-decorator="['college', {rules: [{required: true, message: '请选择学院'}]}]">
            <a-select-option v-for="college in colleges" :key="college.id" :value="college.name">{{ college.name }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="专业">
          <a-select placeholder="请选择" @select="selectClasses" v-decorator="['major', {rules: [{required: true, message: '请选择专业'}]}]">
            <a-select-option v-for="major in majors" :key="major.id" :value="major.majorName">{{ major.majorName }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="班级">
          <a-select placeholder="请选择" v-decorator="['classes', {rules: [{required: true, message: '请选择班级'}]}]">
            <a-select-option v-for="c in classes" :key="c.id" :value="c.name">{{ c.name }}</a-select-option>
          </a-select>
          <a-form-item label="课程类型">
            <a-select placeholder="请选择" v-decorator="['courseAttr', {rules: [{required: true, message: '请选择课程类型'}]}]">
              <a-select-option value="01">专业课</a-select-option>
              <a-select-option value="02">学科基础课</a-select-option>
              <a-select-option value="03">通识教育课</a-select-option>
              <a-select-option value="04">专业选修课</a-select-option>
              <a-select-option value="05">公共选修课</a-select-option>
            </a-select>
          </a-form-item>
        </a-form-item></a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'

// 表单字段
const fields = ['id', 'courseId', 'courseName', 'courseAttr']

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
    loading: {
      type: Boolean,
      default: () => false
    },
    model: {
      type: Object,
      default: () => null
    },
    colleges: {
      type: Array
    },
    classes: {
      type: Array
    },
    majors: {
      type: Array
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
      form: this.$form.createForm(this)
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
  methods: {
    selectMajor (value) {
      this.$emit('selectMajor', value)
      this.form.setFieldsValue({ 'major': '' })
    },
    selectClasses (value) {
      this.$emit('selectClasses', value)
      this.form.setFieldsValue({ 'classes': '' })
    }
  }
}
</script>
