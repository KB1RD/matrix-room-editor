<template>
  <div style="max-width: 1000px; margin: auto;">
    <h1>Matrix Room Editor</h1>
    <b-card-text v-if="state.error">
      Failed to start core. Make sure your browser can support either service
      or shared workers and ensure that you have <code>iframe</code>s enabled.
    </b-card-text>
    <b-card-text v-else-if="state.context">
      <router-view/>
    </b-card-text>
    <b-card-text v-else>
      <b-spinner
        style="width: 3rem; height: 3rem;"
        variant="primary"
        label="Starting core..."
      />
      <br/>
      <div v-if="loadingissue">
        <p>Not loading?</p>
        <small>
          This load process required the use of <code>iframe</code>s to
          establish a communication channel. Ensure that they are enabled in
          your browser.
        </small>
      </div>
    </b-card-text>

    <b-embed
      class="bs-iframe"
      type="iframe"
      :src="url"
    />
  </div>
</template>

<script>
import { state, setupAutoclearMsgListener } from '../worker-link'

export default {
  data () {
    return { url: '', state, loadingissue: false }
  },
  created () {
    this.url = this.$route.query.return_via
    this.$route.query.return_via = undefined
    setupAutoclearMsgListener(['account_id', 'app_url', 'room_id'])
  },
  mounted () {
    setTimeout(() => (this.loadingissue = true), 3000)
  }
}
</script>

<style type="text/css">
.bs-iframe {
  position: absolute;
  width: 0px;
  height: 0px;
  display: none;
  border: none;
  opacity: 0;
}
</style>
