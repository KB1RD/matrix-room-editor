<template>
  <b-card bg-variant="light">
    <template v-slot:header v-if="!loading">
      <div class="spaced-bar d-flex flex-row align-items-center">
        <b-avatar variant="secondary" :src="room.avatar_url" icon="file-earmark">
        </b-avatar>
        <AssignInputField
          :value="room.name"
          size="lg"
          disabled
          placeholder="Untitled Room"
        />
      </div>
    </template>
    <b-spinner
      v-if="loading"
      style="width: 3rem; height: 3rem;"
      variant="primary"
      label="Starting core..."
    />
    <template v-if="!loading">
      <p class="attrib-header">
        <b-badge>{{ room.id }}</b-badge>
        <b-badge v-if="room.canon_alias" variant="primary">
          {{ room.canon_alias }}
        </b-badge>
        <b-badge v-if="room.type" variant="success">
          {{ room.type }}
        </b-badge>
      </p>
      <small class="text-muted">
        The ability to edit state will be added soon!
      </small>
    </template>
  </b-card>
</template>

<script>
import { state } from '../worker-link'

import AssignInputField from '../components/AssignInputField'

export default {
  components: { AssignInputField },
  genbind: {
    room: {
      apply: ['account_id', 'context'],
      address: (id, { room_id }) =>
        ['net', 'kb1rd', 'mxbindings', 'v0', id, 'room', room_id, 'listenDetails'],
      default: 'LOADING'
    }
  },
  data () {
    return {
      context: state.context
    }
  },
  computed: {
    account_id () {
      return this.context.account_id
    },
    app_url () {
      return this.context.app_url
    },
    room_id () {
      return this.context.room_id
    },
    loading () {
      return this.room === 'LOADING'
    }
  }
}
</script>

<style scoped>
  .attrib-header {
    margin-top: -1.2em;
  }
  .attrib-header > *, .spaced-bar > * {
    margin: 0em 0.25em;
  }
</style>
