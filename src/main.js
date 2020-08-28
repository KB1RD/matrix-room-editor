import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'

import { BootstrapVue } from 'bootstrap-vue'

import { state } from './worker-link'

Vue.use(BootstrapVue)

Vue.config.productionTip = false

const ActiveGenerators = Symbol('ActiveRpcGenerators')
Vue.mixin({
  data () {
    // Setup defaults here
    const data = {}
    const genbind = this.$options.genbind
    if (genbind) {
      Object.keys(genbind).forEach((k) => (data[k] = genbind[k].default))
    }
    return data
  },
  methods: {
    /**
     * Binds a generator to a Vue component data property.
     * @param {string} to Property name to use
     * @param {import('rpcchannel').MultistringAddress} addr RPC address to use
     * @param {any[]} args Arguments to pass through
     * @param {any} def Default value of the property
     * @param {any} err Default value of the property when error thrown
     */
    $bind_generate (to, addr, args = [], def = undefined, err = def) {
      // Ensure the ActiveGenerators key exists
      if (!this[ActiveGenerators]) {
        this[ActiveGenerators] = {}
      }
      // Ensure existing generator streams are stopped
      if (this[ActiveGenerators][to]) {
        this[ActiveGenerators][to].shutdown()
      }

      // Assign default
      this[to] = def

      // Start generator & store instance
      const instance = state.channel.generate(addr.map((s) => `${s}`), args)
      this[ActiveGenerators][to] = {
        instance,
        address: addr,
        default: def,
        shutdown: () => instance.return(def)
      }

      // Assign generator values to data
      const self = this
      ;(async function () {
        try {
          for await (const value of instance) {
            Object.assign(self, { [to]: value })
          }
        } catch (e) {
          console.warn('Caught error populating component RPC data', e)
          Object.assign(self, { [to]: err })
        }
      })()
    }
  },
  created () {
    const genbind = this.$options.genbind
    if (genbind) {
      // Called each time the computed generator address changes
      const updateAddress = (i, k, v) => {
        let addr
        if (typeof v.address === 'function') {
          // The address is a function; Call it w/ `apply`ed arguments
          addr = v.address(...((v.apply || []).map((a) => i[a])))
        } else {
          // The address is static
          addr = v.address
        }

        const arrayeq = (a, b) =>
          a.length === b.length && a.every((v, i) => b[i] === v)

        const current = i[ActiveGenerators] && i[ActiveGenerators][k]
        if (!current || !arrayeq(current.address, addr)) {
          // If there's no generator or a gen w/ a different address...
          this.$bind_generate(k, addr, [], v.default, v.error || v.default)
        }
      }

      Object.keys(genbind).map((k) => [k, genbind[k]]).forEach(([k, v]) => {
        // Watch the `apply`ed arguments for changes
        if (v.apply && v.apply.length) {
          v.apply.forEach((a) => {
            this.$watch(a, () => updateAddress(this, k, v))
          })
        }
        // Trigger an initial update
        updateAddress(this, k, v)
      })
    }
  },
  beforeDestroy () {
    const gens = this[ActiveGenerators]
    if (gens) {
      // If RPC generators are not freed, a memory leak will be created
      Object.keys(gens).forEach((k) => gens[k].shutdown())
    }
  }
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
