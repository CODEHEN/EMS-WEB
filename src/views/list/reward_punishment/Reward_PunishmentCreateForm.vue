<template>
  <a-modal
    title="通知发布"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <a-form-item label="创建人ID" v-show="false">
          <a-input v-decorator="['createdId']"/>
        </a-form-item>
        <a-form-item label="通知标题">
          <a-input v-decorator="['title', {rules: [{required: true, message: '请输入通知标题'}]}]" />
        </a-form-item>
        <a-form-item label="通知内容">
          <a-input v-decorator="['content', {rules: [{required: true, message: '请输入通知内容 '}]}]" type="textarea" :autosize="{ minRows: 10, maxRows: 25}" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'

// 表单字段
const fields = ['title', 'content', 'createdId']

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
