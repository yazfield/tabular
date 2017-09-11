<template>
  <div id="app">
    <img src="./assets/logo.png">
    <div>
      <tabular color="teal" name="skills" selectable deletable flat
          endpoint="/api/skills" :headers="headers" @delete-selection="deleteSkills">
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
import Tabular from './components/Tabular'

export default {
  name: 'app',
  components: {
    Tabular
  },
  methods: {
    showInsertSkill() {

    },
    showSkill(item) {

    },
    deleteSkill(item) {

    },
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
