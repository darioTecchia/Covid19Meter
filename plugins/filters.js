import Vue from 'vue'
import moment from 'moment-timezone'
moment.locale('it')
moment.tz.setDefault('Europe/Rome')

Vue.filter('formatDate', (value, format) => {
  if (value) {
    return moment(String(value)).format(format)
  }
})