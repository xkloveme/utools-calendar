<template>
  <div id="app">
    <Title></Title>
    <div class="mdui-container-fluid" @click="showClass=false">
      <div class="mdui-row">
        <calendar ref="calendar"></calendar>
      </div>
    </div>
  </div>
</template>

<script>
import Title from './components/title.vue'
import calendar from './components/calendar'
export default {
  name: 'App',
  components: {
    Title,
    calendar
  },
  data() {
    return {
    }
  },
  methods: {
  }
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
