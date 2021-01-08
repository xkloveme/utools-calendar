<template>
  <div id="app">
    <!--全局引入需要加上kl前缀-->
    <kl-calendar
      height="490px"
      week-title-align="center"
      :render-content="renderContent"
      :week-title="weekTitle"
      :border="false"
      :before-render="beforeRender"
      @year-change="changeHandle"
      @month-change="changeHandle"
    />
    <van-popup v-model="show" :style="{ height: '50%',width:'50%' }">
      <van-panel class="project-item">
        <template #header class="header-button">
          <van-cell>
            <template #right-icon>
              <van-icon
                name="label"
                :style="[statusColor(schedule.status),{lineHeight:'inherit'}]"
              />
              <span :style="statusColor(schedule.status)">{{schedule.title}}</span>
            </template>
          </van-cell>
        </template>
        <div class="item-content">
          <van-cell value="标签" is-link>
            <template #right-icon>
              <van-tag :type="schedule.status">{{schedule.status  | statusText}}</van-tag>
            </template>
          </van-cell>
          <van-cell value="日期" is-link>
            <template #right-icon>
              <span style="width: 90%;">
                <van-tag
                  :type="schedule.status"
                  style="margin: 0 10px;"
                  v-for="(day,i) in schedule.calendar"
                  :key="i+1"
                >{{day | formatTime}}</van-tag>
              </span>
            </template>
          </van-cell>
          <van-cell value="备注" is-link>
            <template #right-icon>
              <span style="width: 90%;">{{schedule.desc}}</span>
            </template>
          </van-cell>
        </div>
      </van-panel>
    </van-popup>
  </div>
</template>

<script>
import klCalendar from 'himmas-vue-calendar'
import ChineseHolidays from 'chinese-holidays'
import dayjs from 'dayjs'
ChineseHolidays.ready(function(book, err) {
  if (err != null) {
    return
  }
  book.all().forEach(function(holiday) {
    console.log(holiday.name)
    console.log(
      holiday.days().map(function(date) {
        return date
      })
    )
  })
})
export default {
  name: 'Calendar',
  components: {
    klCalendar
  },
  data() {
    return {
      show: false,
      schedule: {},
      weekTitle: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
      holiday: [],
      workday: [],
      list: [],
      HEX: this.getRandomColor()
    }
  },
  mounted() {
    this.getAllHoliday(dayjs().format('YYYY'))
    this.onLoad()
  },
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
    onLoad() {
      // let arr = [
      //   {
      //     calendar: [1593923889175, 1594080000000],
      //     desc:
      //       '备备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注注',
      //     status: 'success',
      //     switch: true,
      //     title: '标标题标题标题标题标题标题标题标题标题标题标题标题标题题',
      //     _id: '2020/7/5/1593923900099/5ecc05890'
      //   },
      //   {
      //     calendar: [1580923889175, 1563113889175],
      //     desc:
      //       '备备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注注',
      //     status: 'danger',
      //     switch: true,
      //     title: '标标题标题标题标题标题标题标题标题标题标题标题标题标题题',
      //     _id: '2020/7/5/1593923900099/5ecc05890'
      //   }
      // ]
      this.$api.allDocsApi().then(res => {
        let allDay = []
        res.map(item => {
          if (item.calendar.length) {
            item.calendar.map(day => {
              allDay.push({ ...item, time: dayjs(day).format('YYYY-MM-DD') })
            })
          }
        })
        this.list = allDay
      })
    },
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
    getRandomColor() {
      return '#' + Math.floor(Math.random() * 16777215).toString(16)
    },
    getAllHoliday(year) {
      let holidayList = []
      let workdayList = []
      // let DAY = 1000 * 60 * 60 * 24
      let self = this
      fetch(`https://raw.githubusercontent.com/NateScarlet/holiday-cn/master/${year}.json`)
        .then(res => {
          return res.json()
        })
        .then(function(list) {
          list.days.map(item=>{
            if (item.isOffDay==true) {
              holidayList = holidayList.concat(item.date)
              self.holiday = holidayList
            }else{
              workdayList = workdayList.concat(item.date)
              self.workday = workdayList
            }
          })

        })
    },
    twoDigit: function(num) {
      return ('000' + num).slice(-2)
    },
    renderContent(h, data) {
      var {
        isToday,
        isWeekend,
        isOtherMonthDay,
        year,
        day,
        month,
        // renderYear,
        // renderMonth,
        lunar,
        date,
        festival,
        term
      } = data
      // 日程信息
      let schedule = {}
      this.list.map(item => {
        if (dayjs(date).format('YYYY-MM-DD') === item.time) {
          schedule = item
        }
      })
      console.log('🐛:: renderContent -> schedule', schedule)

      // 获取假期
      // this.getAllHoliday(year)
      // lunar对象中存有农历数据
      var { lunarDayChiness } = lunar

      //第二行展示的数据的优先级为 节日>节气>农历日
      var secondInfo = festival ? festival : term ? term : lunarDayChiness || ''

      var dateStr = `${year}-${this.twoDigit(month)}-${this.twoDigit(day)}`

      var isHoliday = !!~this.holiday.indexOf(dateStr) || isWeekend
      var isWorkday = !!~this.workday.indexOf(dateStr)
      return h(
        'div',
        {
          class: {
            'date-box': true,
            weekend: isWeekend,
            holiday: isHoliday,
            'other-month': isOtherMonthDay,
            [`date-box-dot-${schedule.status}`]: true
          },
          on: {
            click: () => {
              if (JSON.stringify(schedule) === '{}') {
                this.$toast('暂无日程')
              } else {
                this.schedule = schedule
                this.show = true
              }
            }
          }
        },
        [
          h(
            'div',
            {
              class: {
                'first-info': true,
                today: isToday
              }
            },
            day
          ),
          h(
            'div',
            {
              class: {
                'second-info': true,
                festival: festival
              }
            },
            secondInfo
          ),
          h(
            'div',
            {
              class: {
                sign: true,
                isHoliday: isHoliday,
                isWorkday: isWorkday
              }
            },
            isWorkday ? '班' : '休'
          )
        ]
      )
    },
    beforeRender(year, month, next) {
      console.log('before-render', year, month)
      this.HEX = this.getRandomColor()
      next()
    },
    changeHandle(year) {
      this.getAllHoliday(year)
    }
  }
}
</script>
<style>
.date-box {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  cursor: pointer;
}
.first-info {
  flex: 1;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
}
.today {
  border-radius: 100%;
  font-size: 22px;
  background-color: red;
  color: #fff;
  width: 30px;
  border: 2px solid #fff;
  text-align: center;
  margin: 0 auto;
}

.second-info {
  flex: 1;
  display: flex;
  justify-content: center;
  color: #999;
  font-size: 12px;
}
.second-info.festival {
  color: #f43;
}
.sign {
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  background: #f43;
  width: 20px;
  height: 20px;
  color: #fff;
  line-height: 20px;
  text-align: center;
}

.isHoliday {
  background: #f43;
}
.isWorkday {
  background: #aba7a7;
}
.date-box.today {
  background: #ccc;
  color: #fff;
}
.date-box.today .second-info {
  color: #fff;
}
.weekend {
  background: #f6f8fa;
}
.holiday .sign {
  display: block;
}
.date-box.other-month .second-info,
.date-box.other-month .first-info {
  color: #999;
}
.date-box:hover {
  border: 2px solid #f0f0f0;
}
.title-box {
  font-size: 20px;
}
.date-box-dot-success {
  background-color: #07c1601a;
}
.date-box-dot-success:after {
  content: '';
  position: absolute;
  right: 0;
  width: 10px;
  height: 10px;
  background-color: #07c160;
  border-radius: 100%;
  margin: 5px;
}
.date-box-dot-primary {
  background-color: #1989fa1a;
}
.date-box-dot-primary:after {
  content: '';
  position: absolute;
  right: 0;
  width: 10px;
  height: 10px;
  background-color: #1989fa;
  border-radius: 100%;
  margin: 5px;
}
.date-box-dot-danger {
  background-color: #ee0a241a;
}
.date-box-dot-danger:after {
  content: '';
  position: absolute;
  right: 0;
  width: 10px;
  height: 10px;
  background-color: #ee0a24;
  border-radius: 100%;
  margin: 5px;
}
.date-box-dot-warning {
  background-color: #ff976a1a;
}
.date-box-dot-warning:after {
  content: '';
  position: absolute;
  right: 0;
  width: 10px;
  height: 10px;
  background-color: #ff976a;
  border-radius: 100%;
  margin: 5px;
}
</style>