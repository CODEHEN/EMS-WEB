<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper" style="text-align: center;margin-bottom: 20px;">
        <span class="parm_sn">英语四六级等级考试成绩查询</span>
      </div>
      <a-form
        :form="form"
        v-if="!visible"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
        @submit="handleSubmit"
        style="width: 50%;text-align: center;margin: 0 auto;">
        <a-form-item label="准考证号">
          <a-input
            class="zkz"
            v-decorator="['ticketNumber', { rules: [{ required: true,min:15, max:15, message: '请输入正确的准考证号!' }] }]"
            placeholder="请输入15位笔试或口试准考证号"
          />
        </a-form-item>
        <a-form-item label="姓名">
          <a-input
            class="zkz"
            v-decorator="[
              'name',
              { rules: [{ required: true, message: '请输入姓名!' }] },
            ]"
            placeholder="请输入姓名"
          >
          </a-input>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
          <a-button type="primary" html-type="submit" style="background-color: #01ADEF;border-color: #01ADEF">
            查询
          </a-button>
        </a-form-item>
      </a-form>

      <a-result
        v-if="visible"
        :title="LevelGrade.s >= 425?'考试通过!':'再接再厉!'"
      >
        <template #icon>
          <a-icon type="smile" theme="twoTone" v-if="LevelGrade.s >= 425"/>
          <a-icon type="frown" theme="twoTone" two-tone-color="#eb2f96" v-else/>
        </template>
        <template #extra>
          <a-descriptions title="成绩详情" :column="1">
            <a-descriptions-item label="姓名">
              <span class="decs">{{ LevelGrade.n }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="学校">
              <span class="decs">{{ LevelGrade.x }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="准考证号">
              <span class="decs">{{ LevelGrade.z }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="总分">
              <span class="decs" style="color: red;">{{ LevelGrade.s }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="听力">
              <span class="decs">{{ LevelGrade.l }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="阅读">
              <span class="decs">{{ LevelGrade.r }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="写作和翻译">
              <span class="decs">{{ LevelGrade.w }}</span>
            </a-descriptions-item>
          </a-descriptions>
          <a-button key="console" type="primary" @click="back">
            返回
          </a-button>
        </template>
      </a-result>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { getLevelGrade } from '@/api/grade'
export default {
  name: 'TableList',
  components: {
  },
  data () {
    return {
      // create model
      form: this.$form.createForm(this, { name: 'coordinated' }),
      visible: false,
      confirmLoading: false,
      mdl: null,
      // 查询参数
      queryParam: {
      },
      LevelGrade: {}
    }
  },
  created () {
  },
  mounted () {
  },
  computed: {
  },
  methods: {
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          getLevelGrade(values).then(res => {
            if (res.code === 200) {
              this.visible = true
              this.LevelGrade = res.data
              console.log(res.data)
            }
          })
        }
      })
    },
    back () {
      this.visible = false
    }
  }
}
</script>

<style scoped lang="scss">
  .parm_sn {
    color: #3083c7;
    font-size: 22px;
    margin: 40px;
  }
  .zkz {
    height: 32px;
    border-radius: 5px;
    border: solid 1px #a9a9a9;
    padding: 0 5px;
    margin-left: 45px;
    width: 340px;
  }
  .decs{
    font-weight: bold;
  }
</style>
