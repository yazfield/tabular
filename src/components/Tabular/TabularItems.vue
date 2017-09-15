<template>
  <tr :active="attr.selected">
    <td v-if="selectable"><v-checkbox primary hide-details v-model="attr.selected" :color="color"></v-checkbox></td>
    <td v-for="(header, i) in headers" :key="i" :class="header.tdclass" style="position: relative">
      <edit-cell :editable="header.editable" :label="$t(`${name}.${header.value}`)" :color="color"
        :value="attr.item[header.value]" @input="setInput(header.value, $event)"
        :type="header.type" :suffix="header.suffix" :items="header.items"
        @change="itemChange(attr.index, header.value, $event)" :formatter="formatter"></edit-cell>
    </td>
    <slot name="actions" :attributes="attr" >

    </slot>
  </tr>
</template>

<script>
import moment from 'moment'
import EditCell from './EditCell.vue'

export default {
  name: 'TabularItems',
  props: {
    name: {
      type: String,
      required: true
    },
    color: {
      type: String,
      default: 'teal'
    },
    selectable: {
      type: Boolean,
      default: false
    },
    headers: {
      type: Array
    },
    attributes: {
      type: Object,
      required: true
    },
    dateFormat: String
  },
  data () {
    return {
      attr: {
        index: 0,
        item: {},
        selected: undefined
      }
    }
  },
  watch: {
    attr: {
      handler: function (val) {
        this.$emit('update:attributes', val)
      },
      deep: true
    },
    attributes (val) {
      this.attr = val
    }
  },
  methods: {
    formatter (type, value) {
      if (type === 'date') {
        return moment(value, this.dateFormat).format('DD-MM-YYYY')
      }
      return value
    },
    setInput (key, value) {
      if (value !== undefined) {
        this.attr.item[key] = value
      }
    },
    itemChange (index, key, value) {
      this.$emit('item-change', { index, key, value })
    }
  },
  mounted () {
    this.attr = this.attributes
  },
  components: {
    EditCell
  }
}
</script>
