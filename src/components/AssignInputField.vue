<template>
  <b-input-group>
    <b-form-input
      class="input-text-unless-focus"
      :size="size"
      :placeholder="placeholder"
      v-model="internal"
      @blur="(e) => e.target.focus()"
      @keyup="onTitleInputKeyEvent"
    />
    <b-input-group-append v-if="internal !== value">
      <b-button variant="success" @click="onTitleChangeRequested()">
        <BIconCheck/>
      </b-button>
      <b-button variant="danger" @click="() => (internal = value)">
        <BIconX/>
      </b-button>
    </b-input-group-append>
  </b-input-group>
</template>

<script>
import { BIconCheck, BIconX } from 'bootstrap-vue'

export default {
  components: { BIconCheck, BIconX },
  props: {
    value: String,
    placeholder: String,
    size: String
  },
  data () {
    return {
      internal: ''
    }
  },
  watch: {
    value () {
      this.internal = this.value
    }
  },
  mounted () {
    this.internal = this.value
  },
  methods: {
    onTitleChangeRequested () {
      this.$emit('input', this.internal)
    },
    onTitleInputKeyEvent (e) {
      switch (e.keyCode) {
        case 13:
          this.onTitleChangeRequested()
          e.target.blur()
          break
        case 27:
          e.target.blur()
          break
      }
    }
  }
}
</script>
