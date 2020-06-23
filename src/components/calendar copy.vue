<template>
  <div id="app">
    <!--全局引入需要加上kl前缀-->
    <kl-calendar height="490px" week-title-align="center" />
  </div>
</template>

<script>
import klCalendar from 'himmas-vue-calendar'
export default {
  name: 'Calendar',
  components: {
    klCalendar
  },
  methods: {
    renderMonthChange(year, month) {
      console.log(year, month)
    },
    beforeRender(year, month, next) {
      console.log(year, month)
      next()
    }
  }
}
</script>