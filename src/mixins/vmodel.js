export default {
  props: ['value'],
  data () {
    return {
      internalValue: ''
    }
  },
  watch: {
    internalValue (val) {
      this.$emit('input', val)
    },
    value (val) {
      this.internalValue = val
    }
  },
  mounted () {
    this.internalValue = this.value
  }
}
