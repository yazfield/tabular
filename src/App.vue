<template>
  <div id="app">
    <v-app>
      <v-container>
      <h1 class="text-xs-center mt-3 mb-5">Tabular example</h1>
      <tabular style="width: 60%; margin: 0 auto" color="green" name="skills" selectable deletable endpoint="http://localhost:3000/data"
           :headers="headers" @delete-selection="deleteSkills" :actions="actions" searchable>
          <template slot="actions_toolbar">
            <v-btn success outline dark @click.native.stop="showInsertSkill">
              <v-icon success>add</v-icon>
            </v-btn>
          </template>
          <template slot="actions_header" scope="props">
            <th>{{ $t('actions') }}</th>
          </template>
          <template slot="actions_item" scope="props">
            <td>
              <v-btn primary flat icon @click.native.stop="showSkill(props.attributes)">
                <v-icon primary>edit</v-icon>
              </v-btn>
              <v-btn class="red red--text" flat icon @click.native.stop="deleteSkill(props.attributes)">
                <v-icon>delete</v-icon>
              </v-btn>
            </td>
          </template>
        </tabular>
      </v-container>
    </v-app>
  </div>
</template>

<script>

import Tabular from './components/Tabular/Tabular'

export default {
  name: 'app',
  components: {
    Tabular
  },
  data () {
    return {
      actions: [{name: 'test', text: 'test'}, {name: 'test2', text: 'test 2'}],
      headers: [
        {
          text: 'Name',
          value: 'name',
          selects: false,
          editable: true,
          filterable: true,
          sortable: true,
          store: true,
          rules: [val => val || 'Required']
        },
        {
          text: 'Created at',
          selects: false,
          value: 'created_at',
          type: 'date',
          filterable: true,
          sortable: true,
          rules: [val => val || 'Required']
        }
      ]
    }
  },
  methods: {
    test (props) {
      console.log('header props', props)
    },
    showInsertSkill () {
      console.log('showInsertSkill')
    },
    showSkill (item) {
      console.log('showSkill', item)
    },
    deleteSkill (item) {
      console.log('deleteSkill', item)
    },
    deleteSkills (selected) {
      console.log('deleteSkills', selected)
    }
  }
}
</script>
