<template>
  <v-edit-dialog v-if="editable" lazy large @save="maybeEmitChange" @cancel="internalValue = value">
    {{ text }}
    <v-select v-if="isSelect" slot="input" :items="items" hide-details bottom single-line
      v-model="internalValue" :placeholder="label" style="z-index: 999"/>
    <v-text-field v-else slot="input" :label="label" :value="internalValue" single-line
      @change="change" :type="type" :hide-details="true"></v-text-field>
  </v-edit-dialog>
  <div v-else>{{ text }}</div>
</template>

<script>

export default {
  name: 'EditCell',
  props: {
    value: {
      required: true
    },
    type: {
      type: String,
      default: 'text'
    },
    label: {
      type: String,
      required: true
    },
    suffix: {
      type: String,
      default: ''
    },
    items: {
      type: Array,
      default: function () {
        return []
      }
    },
    formatter: {
      type: Function,
      default: undefined
    },
    editable: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      internalValue: '',
      dirty: false
    }
  },
  computed: {
    isSelect () {
      return this.type === 'enum' || this.type === 'select'
    },
    text () {
      if (this.isSelect) {
        let tmp = this.items.filter(item => {
          return item.value === this.internalValue
        })
        if (tmp.length > 0) {
          return this.format(tmp[0].text) + this.suffix
        }
      }
      return this.internalValue ? this.format(this.internalValue) + this.suffix : ''
    }
  },
  watch: {
    value (val) {
      this.internalValue = val
    },
    internalValue (val) {
      this.dirty = true
    }
  },
  methods: {
    format (value) {
      if (this.formatter) {
        return this.formatter(this.type, value)
      }
      return value
    },
    change (e) {
      if (e && e.target) {
        this.internalValue = e.target.value
        this.dirty = true
      }
    },
    maybeEmitChange () {
      if (this.dirty) {
        this.$emit('input', this.internalValue)
        this.$emit('change', this.internalValue)
      }
    }
  },
  mounted () {
    this.internalValue = this.value
  }
}
</script>
<style scoped>
  .menu__content.small-dialog__content {
    background: white;
  }
</style>
