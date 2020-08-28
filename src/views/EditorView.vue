<template>
  <b-card bg-variant="light">
    <template v-slot:header>
      <AssignInputField v-model="title" size="lg" placeholder="Untitled Room"/>
    </template>
  </b-card>
</template>

<script>
import { state } from '../worker-link'

import AssignInputField from '../components/AssignInputField'

export default {
  components: { AssignInputField },
  genbind: {
    rooms: {
      apply: ['account_id'],
      address: (id) =>
        ['net', 'kb1rd', 'mxbindings', 'v0', id, 'listenRoomList'],
      default: []
    }
  },
  data () {
    return {
      context: state.context,
      title: 'room title here'
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
    }
  }
}
</script>
