<template>
  <div id="app">
    <div style="width: 75%; margin: 1px auto">
      <tabular :flat="false" color="teal" name="skills" selectable deletable
          endpoint="http://localhost:3000/data" :headers="headers" @delete-selection="deleteSkills">
          <template slot="actions_toolbar">
            <v-btn success outline dark @click.native.stop="showInsertSkill">
              <v-icon success>add</v-icon>
            </v-btn>
          </template>
          <template slot="actions_header">
            <th><p>{{ $t('actions') }}</p></th>
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
    </div>
  </div>
</template>

<script>
import './app.scss'

import Tabular from './components/Tabular/Tabular'

export default {
  name: 'app',
  components: {
    Tabular
  },
  data () {
    return {
      headers: [
        {
          text: 'Name',
          value: 'name',
          selects: false,
          tdclass: 'text-xs-left',
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
          tdclass: 'text-xs-left',
          type: 'date',
          filterable: true,
          sortable: true,
          rules: [val => val || 'Required']
        }
      ]
    }
  },
  methods: {
    showInsertSkill () {

    },
    showSkill (item) {

    },
    deleteSkill (item) {

    },
    deleteSkills () {

    }
  }
}
</script>

<style>
#app {
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
