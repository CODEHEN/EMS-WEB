<template>
  <a-modal
    title="信息修改"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    @ok="() => { $emit('ok',model, isdisabled) }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <a-form-item v-show="false" label="ID">
          <a-input v-decorator="['id']"/>
        </a-form-item>
        <a-form-item label="学号">
          <a-input v-decorator="['number', {rules: [{required: true, min: 12, message: '学号应为12位数字'}]}]" :disabled="isdisabled" />
        </a-form-item>
        <a-form-item label="姓名">
          <a-input v-decorator="['username', {rules: [{required: true, min: 2, message: '姓名至少为两个字', trigger: 'blur'}]}]" />
        </a-form-item>
        <a-form-item label="学院">
          <a-select placeholder="请选择" @select="selectMajor" v-decorator="['college', {rules: [{required: true, message: '请选择学院'}]}]">
            <a-select-option v-for = "college in colleges" :key="college.id" :value="college.name">{{college.name}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="专业">
          <a-select placeholder="请选择" @select="selectClasses" v-decorator="['major', {rules: [{required: true, message: '请选择专业'}]}]">
            <a-select-option v-for = "major in majors" :key="major.id" :value="major.majorName">{{major.majorName}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="班级">
          <a-select placeholder="请选择" v-decorator="['classes', {rules: [{required: true, message: '请选择班级'}]}]">
            <a-select-option v-for = "c in classes" :key="c.id" :value="c.name">{{c.name}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="性别">
          <a-select placeholder="请选择" v-decorator="['sex', {rules: [{required: true, message: '请选择性别'}]}]">
            <a-select-option value="男">男</a-select-option>
            <a-select-option value="女">女</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="电话号码">
          <a-input v-decorator="['phone', {rules: [{required: true, min: 11, message: '请检查手机号码格式', trigger: 'blur'}]}]" />
        </a-form-item>
        <a-form-item label="邮箱">
          <a-input v-decorator="['email', {rules: [{required: true, message: '请输入邮箱地址',trigger: 'blur'}]}]" />
        </a-form-item>
        <a-form-item label="政治面貌">
          <a-select placeholder="请选择" v-decorator="['political', {rules: [{required: true, message: '请选择政治面貌'}]}]">
            <a-select-option value="共青团员">共青团员</a-select-option>
            <a-select-option value="中共预备党员">中共预备党员</a-select-option>
            <a-select-option value="群众">群众</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="生源地">
          <a-input v-decorator="['origin', {rules: [{required: true, message: '请输入生源地', trigger: 'blur'}]}]" />
        </a-form-item>
        <a-form-item label="地址">
          <a-input v-decorator="['address', {rules: [{required: true,message: '请输入地址', trigger: 'blur'}]}]" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'

// 表单字段
const fields = ['id', 'number', 'username', 'classes', 'college', 'major', 'sex', 'phone', 'email', 'political', 'origin', 'address']

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
    majors: function (newval) {
      this.majors = newval
    },
    classes: function (newval) {
      this.classes = newval
    }
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
