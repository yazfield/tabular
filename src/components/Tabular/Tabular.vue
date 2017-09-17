<template>
  <v-card :flat="flat" class="tabular">
    <tabular-toolbar :name="name" :deletable="deletable" :searchable="searchable"
      :actions="actions" :selected="selected.length" :headers-length="iHeaders.length - 1"
      @delete-selection="deleteSelection" @action="actionEvent" :selectable="selectable"
      :searchableLabel="tr('searchableLabel')" :search.sync="search" :color="color" >
      <template slot="actions">
        <slot name="actions_toolbar"></slot>
      </template>
    </tabular-toolbar>

    <v-data-table :headers="iHeaders" :items="items" v-model="selected" :selected-key="selectedKey"
      :select-all="selectable" :pagination.sync="pagination" :total-items="totalItems"
      :loading="loading" :search="search" :rows-per-page-text="tr('rowsPerPageText')">
      <template slot="headers" scope="props">
        <tabular-headers :selectable="selectable" :headers="iHeaders" :pagination.sync="pagination" :all.sync="props.all"
          :indeterminate.sync="props.indeterminate" @select-all="toggleAll" @sort="changeSort"
          :filters.sync="filters" @filter="applyFilters" :color="color">
          <template slot="actions">
            <slot name="actions_header"></slot>
          </template>
        </tabular-headers>
      </template>

      <template slot="items" scope="props">
        <tabular-items :attributes.sync="props" :headers="iHeaders" :color="color" :name="name"
          :selectable="selectable" @item-change="itemChange" :date-format="dateFormat">
          <template slot="actions" scope="props">
            <slot name="actions_item" :attributes="props.attributes" scope="props">

            </slot>
          </template>
        </tabular-items>
      </template>

      <template slot="pageText" scope="{ pageStart, pageStop }">
        {{ tr('fromToText', {from: pageStart, to: pageStop}) }}
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
  let axios = window.axios || require('axios')

  import {encodeQueryData} from '../../helpers.js'
  import tr from './translate.js'
  import TabularHeaders from './TabularHeaders.vue'
  import TabularToolbar from './TabularToolbar.vue'
  import TabularItems from './TabularItems.vue'

  export default {
    name: 'Tabular',
    components: {
      TabularItems,
      TabularHeaders,
      TabularToolbar
    },
    mixins: [tr],
    props: {
      dontLoad: {
        type: Boolean,
        default: false
      },
      searchableLabel: String,
      color: {
        type: String,
        default: 'red'
      },
      name: {
        type: String,
        required: true
      },
      flat: {
        type: Boolean,
        default: false
      },
      selectable: {
        type: Boolean,
        default: false
      },
      searchable: {
        type: Boolean,
        default: false
      },
      deletable: {
        type: Boolean,
        default: false
      },
      actions: {
        type: Array,
        default: _ => { return [] }
      },
      selectedKey: {
        default: 'id'
      },
      endpoint: {
        type: String,
        required: true
      },
      headers: {
        type: Array,
        default: []
      },
      query: {
        type: Object
      },
      dateFormat: {
        type: String,
        default: 'YYYY-MM-DD'
      },
      dateDisplayFormat: {
        type: String,
        default: 'DD-MM-YYYY'
      }
    },
    data () {
      return {
        loaded: false,
        filters: this.query,
        loading: true,
        selected: [],
        search: '',
        items: [],
        totalItems: 0,
        pagination: {
          sortBy: '',
          descending: true,
          rowsPerPage: 5,
          page: 1
        },
        iHeaders: []
      }
    },
    watch: {
      pagination: {
        handler () {
          if (!this.dontLoad) {
            this.getDataFromApi()
              .then(data => {
                this.items = data.data
                this.totalItems = data.total
                this.$emit('loaded', data.data)
              })
          }
        },
        deep: true
      },
      headers: {
        handler (val) {
          this.iHeaders = val
        },
        deep: true
      },
      dontLoad (val) {
        if (!this.loaded) {
          this.getDataFromApi()
            .then(data => {
              this.items = data.data
              this.totalItems = data.total
              this.$emit('loaded', data.data)
            })
        }
      }
    },
    methods: {
      applyFilters () {
        if (!this.dontLoad) {
          this.getDataFromApi()
            .then(data => {
              this.items = data.data
              this.totalItems = data.total
            })
        }
      },
      itemChange ({ index, key, value }) {
        this.loading = true
        let id = this.items[index].id
        key = key.replace(/\./, '__')
        return axios.put(`${this.endpoint}/${id}`, {
          [key]: value
        }).then(response => {
          this.loading = false
        }).catch(_ => {
          this.loading = false
        })
      },
      actionEvent (e) {
        console.log('actionEvent', e)
      },
      toggleAll () {
        if (this.selected.length) this.selected = []
        else this.selected = this.items.slice()
      },
      changeSort (column) {
        if (this.pagination.sortBy === column) {
          this.pagination.descending = !this.pagination.descending
        } else {
          this.pagination.sortBy = column
          this.pagination.descending = false
        }
      },
      selectedColumns () {
        let columns = []
        this.iHeaders.forEach(header => {
          if (header.selects) {
            columns = columns.concat(header.selects)
          } else if (header.selects === false) {

          } else {
            columns = columns.concat(header.value)
          }
        })

        if (columns.length) {
          columns.push('id')
          return columns.join(',')
        }
        return ''
      },
      makeUrl () {
        let url = this.endpoint + '?'
        let query = {}
        // FIXME: reconstruct query from page url
        for (let filterName in this.filters) {
          if (this.filters.hasOwnProperty(filterName)) {
            let filter = this.filters[filterName]
            query = this.addFilterToQuery(filterName, filter, query)
          }
        }
        let {sortBy, descending, rowsPerPage, page} = this.pagination
        query['columns'] = this.selectedColumns()
        query['page'] = page
        query['per_page'] = rowsPerPage
        query['order'] = sortBy
        query['direction'] = descending ? 'desc' : 'asc'
        url += encodeQueryData(query)

        return url
      },
      addFilterToQuery (filterName, filter, query) {
        if (filterName.indexOf('.') !== false) {
          filterName = filterName.replace(/\./gi, '__')
        }
        if (filter.active) {
          if (filter.value) {
            query[filterName] = filter.value
          }
          if (filter.from) {
            query[`${filterName}_from`] = filter.from
          }
          if (filter.to) {
            query[`${filterName}_to`] = filter.to
          }
        }
        return query
      },
      getDataFromApi () {
        this.loading = true
        return axios.get(this.makeUrl())
          .then(response => {
            this.loaded = true
            this.loading = false
            return Promise.resolve(response.data)
          })
      },
      deleteSelection () {
        this.$emit('delete-selection', this.selected)
      }
    },
    mounted () {
      this.iHeaders = this.headers
    }
  }
</script>

<style>
  .fade-enter-active, .fade-leave-active {
    transition: opacity .4s
  }
  .fade-enter, .fade-leave-to {
    opacity: 0
  }
  table.table thead th>div {
    width: auto;
  }
  table.table td {
    text-align: center;
  }
</style>
