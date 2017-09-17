export default {
  methods: {
    tr (name, params, prefix) {
      let text = ''
      if (this[name]) {
        console.log(name, prefix)
        for (let key in params) {
          if (params.hasOwnProperty(key)) {
            let value = params[key]
            text = (text || this[name]).replace('{' + key + '}', value)
          }
        }
        return text || this[name]
      }
      if (this.$t) {
        return this.$t(prefix ? `${prefix}.${name}` : name, params)
      }
      return name
    }
  }
}
