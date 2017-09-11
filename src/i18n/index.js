import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

import locales from './locales'
// Create VueI18n instance with options
export default new VueI18n({
  locale: 'en', // set locale
  messages: locales // set locale messages
})
