<template>
  <div class="project">
    <van-nav-bar title="所有日程" />
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <van-panel class="project-item" v-for="item in list" :key="item.id">
        <template #header class="header-button">
          <van-cell>
            <template #right-icon>
              <van-icon name="label" :style="[statusColor(item.status),{lineHeight:'inherit'}]" />
              <span :style="statusColor(item.status)">{{item.title}}</span>
            </template>
          </van-cell>
        </template>
        <div class="item-content">
          <van-cell value="标签" is-link>
            <template #right-icon>
              <van-tag :type="item.status">{{item.status | statusText}}</van-tag>
            </template>
          </van-cell>
          <van-cell value="日期" is-link>
            <template #right-icon>
              <span style="width: 80%;">
                <van-tag
                  :type="item.status"
                  style="margin: 0 10px;"
                  v-for="(day,i) in item.calendar"
                  :key="i+1"
                >{{day | formatTime}}</van-tag>
              </span>
            </template>
          </van-cell>
          <van-cell value="备注" is-link>
            <template #right-icon>
              <span style="width: 80%;">{{item.desc}}</span>
            </template>
          </van-cell>
        </div>
        <template #footer class="footer-button">
          <van-button
            @click="del(item['_id'])"
            plain
            hairline
            size="small"
            type="danger"
            style="width:100%"
          >删除</van-button>
        </template>
      </van-panel>
    </van-list>
  </div>
</template>

<script>
import dayjs from 'dayjs'
export default {
  data() {
    return {
      list: [],
      pageNum: 1,
      pageSize: 10,
      loading: false,
      finished: false
    }
  },
  mounted() {},
  filters: {
    formatTime(val) {
      return dayjs(val).format('YYYY-MM-DD')
    },
    statusText(val) {
      let color = '#1989fa'
      let colorType = [
        {
          type: 'primary',
          text: '一般',
          color: '#1989fa',
          backgroundColor: '#1989fa80'
        },
        {
          type: 'success',
          text: '必须',
          color: '#07c160',
          backgroundColor: '#ff976a80'
        },
        {
          type: 'danger',
          text: '紧急',
          color: '#ee0a24',
          backgroundColor: '#ff976a80'
        },
        {
          type: 'warning',
          text: '重要',
          color: '#ff976a',
          backgroundColor: '#ff976a80'
        }
      ]
      colorType.map(item => {
        if (item.type === val) {
          color = item.text
        }
      })
      return color
    }
  },
  methods: {
    statusColor(val) {
      let color = '#1989fa'
      let colorType = [
        {
          type: 'primary',
          text: '一般',
          color: '#1989fa',
          backgroundColor: '#1989fa80'
        },
        {
          type: 'success',
          text: '必须',
          color: '#07c160',
          backgroundColor: '#ff976a80'
        },
        {
          type: 'danger',
          text: '紧急',
          color: '#ee0a24',
          backgroundColor: '#ff976a80'
        },
        {
          type: 'warning',
          text: '重要',
          color: '#ff976a',
          backgroundColor: '#ff976a80'
        }
      ]
      colorType.map(item => {
        if (item.type === val) {
          color = item.color
        }
      })
      return { color: color }
    },
    onLoad() {
      this.$api.allDocsApi().then(res => {
        console.log('🐛:: onLoad -> res', res)
        this.list = res.reverse()
        this.loading = false
        this.finished = true
      })
    },
    del(id) {
      this.$api.removeApi(id).then(() => {
        this.utools.showNotification('删除成功')
        this.$emit('refresh')
        this.onLoad()
      })
    }
  }
}
</script>

<style scoped>
.project {
  font-size: 14px;
}
.project-item {
  margin: 10px;
  background-color: #fff;
}
.item-content {
  font-size: 14px;
  color: #999999;
}
</style>
