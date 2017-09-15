<template>
  <div class="tabular-toolbar">
    <transition name="fade">
      <v-card-title v-show="selected > 0" :class="[color]" class="lighten-4 tabular-toolbar__bulk-actions">
        <span :class="color + '--text text--darken-2'">{{ $t(`${name}.selected`, { selected }) }}</span>
        <v-spacer></v-spacer>
        <v-btn icon v-if="deletable" @click.native="$emit('delete-selection')">
          <v-icon>delete</v-icon>
        </v-btn>
        <v-menu v-if="actions.length > 0" offset-y>
          <v-btn icon slot="activator">
            <v-icon>more_vert</v-icon>
          </v-btn>
          <v-list>
            <v-list-tile v-for="(action, i) in actions" :key="i" @click.native="$emit('action', {call: action.name})">
              <v-list-tile-title
              >{{ action.text || $t(`${name}.${action.name}`) }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-card-title>
    </transition>
    <v-card-title class="pt-0 pb-0 tabular__header">
      <h6>{{ $t(`${name}.title`) }}</h6>
      <v-spacer></v-spacer>
      <v-text-field v-if="searchable" append-icon="search" :label="searchableLabel" single-line
        hide-details v-model="iSearch"></v-text-field>
      <slot name="actions">

      </slot>
    </v-card-title>
  </div>
</template>
<script>
export default {
  name: 'TabularToolbar',
  props: {
    name: {
      type: String,
      required: true
    },
    headersLength: {
      type: Number
    },
    color: {
      type: String,
      default: 'teal'
    },
    deletable: {
      type: Boolean,
      default: false
    },
    filterable: {
      type: Boolean,
      default: true
    },
    searchable: {
      type: Boolean,
      default: false
    },
    searchableLabel: {
      type: String,
      required: true
    },
    actions: {
      type: Array,
      default: []
    },
    selectable: {
      type: Boolean,
      default: false
    },
    selected: {
      type: Number,
      default: 0
    },
    search: {
      type: String
    }
  },
  data () {
    return {
      iSearch: '',
      showFilters: false
    }
  },
  watch: {
    search (val) {
      this.iSearch = val
    },
    iSearch (val) {
      this.$emit('update:search', val)
    }
  }
}
</script>
