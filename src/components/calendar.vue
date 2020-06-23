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
      weekTitle: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
      holiday: [],
      workday: []
    }
  },
  mounted() {
    this.getAllHoliday(dayjs().format('YYYY'))
  },
  methods: {
    getAllHoliday(year) {
      let holidayList = []
      let workdayList = []
      let DAY = 1000 * 60 * 60 * 24
      let self = this
      fetch(`https://www.jixiaokang.com/chinese-holidays-data/${year}.json`)
        .then(res => {
          return res.json()
        })
        .then(function(list) {
          list.data.map(item => {
            if (item.freedays_range.length < 2) {
              holidayList = holidayList.concat(item.freedays_range)
            } else {
              let days_passed = Math.round(
                (dayjs(item.freedays_range[1]).valueOf() -
                  dayjs(item.freedays_range[0]).valueOf()) /
                  DAY
              )
              for (let index = 0; index < days_passed + 1; index++) {
                holidayList.push(
                  dayjs(item.freedays_range[0])
                    .add(index, 'day')
                    .format('YYYY-MM-DD')
                )
              }
              self.holiday = holidayList
            }
            if (item.workdays.length < 2) {
              workdayList = workdayList.concat(item.workdays)
            } else {
              let days_work_passed = Math.round(
                (dayjs(item.workdays[1]).valueOf() - dayjs(item.workdays[0]).valueOf()) / DAY
              )
              for (let index = 0; index < days_work_passed + 1; index++) {
                workdayList.push(
                  dayjs(item.workdays[0])
                    .add(index, 'day')
                    .format('YYYY-MM-DD')
                )
              }
              self.workday = workdayList
            }
          })
          console.log(
            list,
            dayjs()
              .add(1, 'day')
              .format('YYYY-MM-DD')
          )
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
        // weekDay,
        festival,
        term
      } = data

      // 获取假期
      // this.getAllHoliday(year)
      // lunar对象中存有农历数据
      var { lunarDayChiness } = lunar

      //第二行展示的数据的优先级为 节日>节气>农历日
      var secondInfo = festival ? festival : term ? term : lunarDayChiness || ''

      var dateStr = `${year}-${this.twoDigit(month)}-${this.twoDigit(day)}`

      var isHoliday = !!~this.holiday.indexOf(dateStr) || isWeekend
      var isWorkday = isWeekend ? !!~this.workday.indexOf(dateStr) : false
      // console.log('🐛:: renderContent -> isHoliday', dayjs(dateStr).subtract(1, 'day').format('YYYY-MM-DD'),isWeekend, dateStr, isHoliday)
      return h(
        'div',
        {
          class: {
            'date-box': true,
            today: isToday,
            weekend: isWeekend,
            holiday: isHoliday,
            'other-month': isOtherMonthDay
          }
        },
        [
          h(
            'div',
            {
              class: {
                'first-info': true
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
      next()
    },
    changeHandle(year, month) {
      this.getAllHoliday(year)
      console.log('change', year, month)
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
.isWorkday {
  background: #aba7a7;
}
.date-box.today {
  background: #fb0;
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
  border: 3px solid #fb0;
}
.title-box {
  font-size: 20px;
}
</style>