<template>
  <div>
    <van-nav-bar title="新建日程" />
    <van-form @submit="onSubmit">
      <van-field
        v-model="title"
        rows="1"
        autosize
        label="标题"
        type="textarea"
        placeholder="请输入标题"
        name="title"
        :rules="[{ required: true, message: '请输入标题' }]"
      />
      <van-field name="status" v-model="status" label="标签">
        <template #input>
          <van-tag
            :plain="status!=='primary'"
            @click="status='primary'"
            size="large"
            style="margin-right:5px;cursor: pointer;"
            type="primary"
          >一般</van-tag>
          <van-tag
            :plain="status!=='success'"
            @click="status='success'"
            size="large"
            style="margin-right:5px;cursor: pointer;"
            type="success"
          >必须</van-tag>
          <van-tag
            :plain="status!=='danger'"
            @click="status='danger'"
            size="large"
            style="margin-right:5px;cursor: pointer;"
            type="danger"
          >紧急</van-tag>
          <van-tag
            :plain="status!=='warning'"
            @click="status='warning'"
            size="large"
            style="margin-right:5px;cursor: pointer;"
            type="warning"
          >重要</van-tag>
        </template>
      </van-field>
      <van-field name="switch" label="选择多个日期">
        <template #input>
          <van-switch v-model="checked" size="20" />
        </template>
      </van-field>
      <van-field
        readonly
        clickable
        name="calendar"
        :value="calendar | formatTime"
        label="日期"
        placeholder="点击选择日期"
        :rules="[{ required: true, message: '请选择日期' }]"
        @click="showCalendar = true"
      />
      <van-calendar
        v-model="showCalendar"
        :color="status | statusColor"
        allow-same-day
        :type="checked?'multiple':'single'"
        @confirm="onConfirm"
      />
      <van-field
        v-model="desc"
        name="desc"
        rows="2"
        autosize
        label="备注"
        type="textarea"
        maxlength="150"
        placeholder="请输入备注"
        show-word-limit
      />
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit">提交</van-button>
      </div>
    </van-form>
  </div>
</template>
<script>
import dayjs from 'dayjs'
export default {
  data() {
    return {
      checked: false,
      calendar: [],
      title: '',
      status: 'primary',
      desc: '',
      showCalendar: false
    }
  },
  filters: {
    formatTime(val) {
      if (val.length === 1) {
        return dayjs(val[0]).format('YYYY-MM-DD')
      } else {
        return val.length ? `选择了 ${val.length} 个日期` : ''
      }
    },
    statusColor(val) {
      let color = '#1989fa'
      let colorType = [
        {
          type: 'primary',
          text: '一般',
          color: '#1989fa',
          backgroundColor: '#1989fa1a'
        },
        {
          type: 'success',
          text: '必须',
          color: '#07c160',
          backgroundColor: '#ff976a1a'
        },
        {
          type: 'danger',
          text: '紧急',
          color: '#ee0a24',
          backgroundColor: '#ff976a1a'
        },
        {
          type: 'warning',
          text: '重要',
          color: '#ff976a',
          backgroundColor: '#ff976a1a'
        }
      ]
      colorType.map(item => {
        if (item.type === val) {
          color = item.color
        }
      })
      return color
    }
  },
  methods: {
    onConfirm(date) {
      this.calendar = []
      if (this.checked) {
        if (date.length) {
          date.map(item => {
            this.calendar.push(dayjs(item).valueOf())
          })
        }
      } else {
        this.calendar = [dayjs(date).valueOf()]
      }
      this.showCalendar = false
    },
    onSubmit(values) {
      this.$api.putApi({ ...values, calendar: this.calendar }).then(() => {
        this.utools.showNotification('保存成功')
        this.$emit('close')
        this.$emit('refresh')
      })
    }
  }
}
</script>