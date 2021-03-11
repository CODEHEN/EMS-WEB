<template>
  <a-modal
    title="信息修改"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
        <a-form-item v-show="model && model.id > 0" label="学号">
          <a-input v-decorator="['number', { initialValue: 0 }]" disabled />
        </a-form-item>
        <a-form-item label="姓名">
          <a-input v-decorator="['username', {rules: [{required: true, min: 2, message: '姓名至少为两个字'}]}]" />
        </a-form-item>
        <a-form-item label="学院">
          <a-select placeholder="请选择" @select="() => { $emit('selectCollege') }" v-model="model.college">
            <a-select-option v-for = "college in colleges" :key="college.id" :value="college.name">{{college.name}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="专业">
          <a-input v-decorator="['major', {rules: [{required: true, min: 2, message: '姓名至少为两个字'}]}]" />
        </a-form-item>
        <a-form-item label="班级">
          <a-input v-decorator="['classes', {rules: [{required: true, min: 2, message: '姓名至少为两个字'}]}]" />
        </a-form-item>
        <a-form-item label="性别">
          <a-input v-decorator="['sex', {rules: [{required: true, min: 2, message: '姓名至少为两个字'}]}]" />
        </a-form-item>
        <a-form-item label="电话号码">
          <a-input v-decorator="['phone', {rules: [{required: true, min: 2, message: '姓名至少为两个字'}]}]" />
        </a-form-item>
        <a-form-item label="邮箱">
          <a-input v-decorator="['email', {rules: [{required: true, min: 2, message: '姓名至少为两个字'}]}]" />
        </a-form-item>
        <a-form-item label="电话号码">
          <a-input v-decorator="['phone', {rules: [{required: true, min: 2, message: '姓名至少为两个字'}]}]" />
        </a-form-item>
        <a-form-item label="生源地">
          <a-input v-decorator="['origin', {rules: [{required: true, min: 2, message: '姓名至少为两个字'}]}]" />
        </a-form-item>
        <a-form-item label="地址">
          <a-input v-decorator="['address', {rules: [{required: true, min: 2, message: '姓名至少为两个字'}]}]" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'

// 表单字段
const fields = ['number', 'username', 'classes', 'college', 'major', 'sex', 'phone', 'email', 'origin', 'address']

export default {
  props: {
    visible: {
      type: Boolean,
      required: true
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
      type: Array,
      default: () => null
    },
    classes: {
      type: Array,
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
  }
}
</script>
