<template>
  <div id="app">
    <Title @handleAdd="show = !show" @handleList="showList = !showList"></Title>
    <van-popup
      v-model="show"
      position="left"
      :style="{ height: '100%', width: '40%' }"
    >
      <schedule v-if="show" @close="show = false" @refresh="refresh" />
    </van-popup>
    <van-popup
      v-model="showList"
      position="right"
      :style="{ height: '100%', width: '40%' }"
    >
      <list v-if="showList" @close="showList = false" @refresh="refresh" />
    </van-popup>
    <div class="mdui-container-fluid" @click="showClass = false">
      <div class="mdui-row" v-if="showCla">
        <calendar ref="calendar"></calendar>
      </div>
    </div>
  </div>
</template>

<script>
import Title from './components/title.vue'
import calendar from './components/calendar'
import schedule from './components/schedule'
import list from './components/list'
export default {
  name: 'App',
  components: {
    Title,
    calendar,
    schedule,
    list,
  },
  data() {
    return {
      show: false,
      showList: false,
      showCla: true,
    }
  },
  mounted() {
    window.utools.onPluginReady(() => {
      this.showCla = false
      window.utools.onPluginEnter(({ code, type, payload }) => {
        console.log('用户进入插件', code, type, payload)
        this.showCla = true
      })
    })
  },
  methods: {
    refresh() {
      this.$refs['calendar'].onLoad()
    },
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.app-bg {
  /* color: #fff !important; */
  position: absolute;
  width: 100%;
  height: 100%;
  -moz-background-size: 100% 100%; /*  Firefox 3.6 */
  -o-background-size: 100% 100%; /* Opera 9.5 */
  -webkit-background-size: 100% 100%; /* Safari 3.0 */
  background-size: 100% 100%; /*  Firefox 4.0 and other CSS3-compliant browsers */
  background-repeat: no-repeat;
}
.me-toast {
  z-index: 99999999 !important;
}
</style>
