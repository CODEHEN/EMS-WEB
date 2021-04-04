<template>
  <a-modal
    title="信息修改"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    @ok="() => { $emit('ok', isdisabled) }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <a-form-item v-show="false" label="ID">
          <a-input v-decorator="['id']"/>
        </a-form-item>
        <a-form-item label="编号" v-show="isdisabled">
          <a-input v-decorator="['id']" :disabled="isdisabled" />
        </a-form-item>
        <a-form-item label="教学楼" v-if="!isdisabled">
          <a-select placeholder="请选择" v-decorator="['buildName', {rules: [{required: true, message: '请选择教学楼'}]}]">
            <a-select-option v-for = "build in builds" :key="build.id" :value="build.buildName">{{build.buildName}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="教室名称" >
          <a-input v-decorator="['classroomname', {rules: [{required: true, message: '请输入学院名称'}]}]" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
// 表单字段
const fields = ['id', 'buildName', 'classroomname']

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
    builds: {
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
  }
}
</script>
