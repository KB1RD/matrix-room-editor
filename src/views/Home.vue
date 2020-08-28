<template>
  <div>
    <h1>Matrix Room Editor</h1>
    <p>A Matrix App that edits room state and sends custom events</p>
    <p>Add to Matrix Apps: <code>{{ url }}</code></p>
  </div>
</template>

<script>
export default {
  computed: {
    url () {
      return `${window.location.origin}/manifest.mxapp.json`
    }
  }
}
</script>
