export default {
  methods: {
    tr (name, params) {
      let text = ''
      if (this[name]) {
        for (let key in params) {
          if (params.hasOwnProperty(key)) {
            let value = params[key]
            text = (text || this[name]).replace('{' + key + '}', value)
          }
        }
        return text || this[name]
      }
      if (this.$t) {
        return this.$t(name, params)
      }
    }
  }
}
