<template>
  <tr>
    <th v-if="selectable">
      <v-checkbox primary hide-details @click.native="$emit('select-all')" :input-value="iAll"
        :indeterminate="iIndeterminate" :color="color"></v-checkbox>
    </th>
    <th v-for="(header, i) in headers" :key="header.text" :style="header.style"
      :class="thClass(header)"
       style="padding-top: 18px; padding-bottom: 18px;">
      <v-icon v-if="header.sortable !== false" @click="$emit('sort', header.value)">arrow_upward</v-icon>
      {{ header.text }}
      <v-menu v-model="filterMenus[header.value]" :key="'menu-'+i" v-if="header.filterable" offset-y origin="center center" :closeOnContentClick="false">
        <v-icon slot="activator" class="filter-icon"
        :class="{'filter-open': filterMenus[header.value], 'green--text':hasFilter(header.value)}">filter_list</v-icon>
        <div class="small-dialog__content">
          <v-text-field :label="header.value" @input="input(header.value, 'value', $event)"
            :value="iFilters[header.value] ? iFilters[header.value].value : null" single-line hide-details
            type="text" v-if="header.type == 'text' || header.type == 'textarea' ||!header.type"></v-text-field>
          <v-text-field :label="$t('from')" @input="input(header.value, 'from', $event)"
            :value="iFilters[header.value] ? iFilters[header.value].from : null" single-line hide-details
            type="number" v-if="header.type == 'number'"></v-text-field>
          <v-text-field :label="$t('to')" @input="input(header.value, 'to', $event)"
            :value="iFilters[header.value] ? iFilters[header.value].to : null" single-line hide-details
            type="number" v-if="header.type == 'number'"></v-text-field>
          <v-select v-if="header.type == 'enum' || header.type == 'select'" :items="header.items"
            :value="iFilters[header.value] ? iFilters[header.value].value : null" :placeholder="header.value"
              @input="input(header.value, 'value', $event)" auto single-line hide-details />
          <v-menu v-if="header.type == 'date'" lazy offset-y style="display: block">
            <v-text-field slot="activator" label="De" single-line hide-details
              :value="iFilters[header.value] ? iFilters[header.value].from : null" :placeholder="header.value"
              @input="input(header.value, 'from', $event)"
              prepend-icon="event" readonly style="padding-bottom: 0;max-width: 200px;"></v-text-field>
            <v-date-picker no-title scrollable
              :value="iFilters[header.value] ? iFilters[header.value].from : null" :placeholder="header.value"
              @input="input(header.value, 'from', $event)"></v-date-picker>
          </v-menu>
          <v-menu v-if="header.type == 'date'" lazy offset-y>
            <v-text-field slot="activator" label="A" single-line hide-details
              :value="iFilters[header.value] ? iFilters[header.value].to : null" :placeholder="header.value"
              @input="input(header.value, 'to', $event)"
              prepend-icon="event" readonly style="padding-bottom: 0;max-width: 200px;"></v-text-field>
            <v-date-picker no-title scrollable
              :value="iFilters[header.value] ? iFilters[header.value].to : null" :placeholder="header.value"
              @input="input(header.value, 'to', $event)"></v-date-picker>
          </v-menu>
        </div>
        <div class="small-dialog__actions">
          <v-btn outline primary
            @click.native="toggleFilter(header.value, false, getKeys(header.type))">{{ $t('cancel') }}</v-btn>
          <v-btn outline primary @click.native="toggleFilter(header.value, true)">{{ $t('filter') }}</v-btn>
        </div>
      </v-menu>
    </th>
    <slot name="actions">

    </slot>
  </tr>
</template>
<script>

export default {
  name: 'TabularHeaders',
  props: {
    color: {
      type: String,
      default: 'teal'
    },
    headers: {
      type: Array,
      required: true
    },
    pagination: {
      type: Object,
      required: true
    },
    filters: {
      type: Object,
      default: _ => {
        return {}
      }
    },
    all: {
      type: Boolean,
      required: true
    },
    selectable: {
      type: Boolean,
      default: false
    },
    indeterminate: {
      required: true
    }
  },
  data () {
    return {
      iAll: false,
      iIndeterminate: false,
      filterMenus: {
        name: false,
        fat: false
      },
      iFilters: {}
    }
  },
  watch: {
    indeterminate (val) {
      this.iIndeterminate = val
    },
    iIndeterminate (val) {
      this.$emit('update:indeterminate', val)
    },
    all (val) {
      this.iAll = val
    },
    iAll (val) {
      this.$emit('update:all', val)
    },
    pagination (val) {
      this.iPagination = val
    },
    iPagination: {
      handler: function (val) {
        this.$emit('update:pagination', val)
      },
      deep: true
    },
    filters (val) {
      this.iFilters = val
    },
    iFilters: {
      handler: function (val) {
        this.$emit('update:filters', val)
      },
      deep: true
    }
  },
  methods: {
    getKeys (type) {
      if (!type || type === 'text' || type === 'enum' || type === 'select') {
        return ['value']
      } else {
        return ['from', 'to']
      }
    },
    input (name, key, value) {
      if (this.iFilters[name]) {
        this.iFilters[name][key] = value
      } else {
        this.iFilters[name] = {
          [key]: value
        }
      }
    },
    toggleFilter (name, value, keys) {
      this.iFilters[name].active = value
      if (value === false) {
        keys.forEach(key => {
          this.input(name, key, '')
        })
      }
      this.filterMenus[name] = false
      this.$emit('filter')
    },
    hasFilter (name) {
      let filter = this.iFilters[name]
      return filter && filter.active && (filter.value || filter.from || filter.to)
    },
    thClass (header) {
      let sortableClass = header.sortable === false && header.filterable !== true
      return [
        header.thClass ? header.thClass : '',
        'column',
        sortableClass ? '' : 'sortable',
        this.pagination.descending ? 'desc' : 'asc',
        header.value === this.pagination.sortBy ? 'active' : '',
        this.hasFilter(header.value) ? 'filter-applied' : ''
      ]
    }
  },
  mounted () {
    this.iPagination = this.pagination
    this.iAll = this.all
    this.iIndeterminate = this.indeterminate
    this.iFilters = this.filters
  }
}
</script>
<style>
  .datatable thead th.column.sortable {
    cursor: auto;
  }
  .datatable thead th.column.sortable i {
    cursor: pointer;
  }
  .datatable thead th.column {
    overflow: hidden;
  }
  .datatable thead th.column.sortable i.filter-icon.filter-open,
  .datatable thead th.column i.filter-icon.filter-open,
  .datatable thead th.column.sortable.active i.filter-icon.filter-open
   {
    color: rgba(0,0,0,.87);
    opacity: 1;
  }

  .datatable thead th.column.sortable.filter-applied i.filter-icon,
  .datatable thead th.column.filter-applied i.filter-icon,
  .datatable thead th.column.sortable.active.filter-applied i.filter-icon {
    opacity: 1;
  }

  .datatable thead th.column.sortable.active.desc i.filter-icon {
    transform: rotate(0);
  }
  .datatable thead th.column.sortable.active i.filter-icon {
    color: rgba(0,0,0,.38);
    opacity: 0;
  }
  .datatable thead th.column.sortable.active:hover > i.filter-icon {
    opacity: .6;
  }
  .datatable thead th.column.sortable.active.desc i.filter-icon.has-filter {
    transform: rotate(180);
  }

  .menu__content {
    background: white;
    z-index: 100;
  }
</style>
