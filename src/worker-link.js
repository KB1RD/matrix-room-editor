import * as rpc from 'rpcchannel'

const state = {
  error: undefined,
  context: undefined,
  port: undefined,
  channel: undefined
}

function setupRpcChannel () {
  state.channel = new rpc.RpcChannel((m, x) => state.port.postMessage(m, x))
  state.port.onmessage = (e) => state.channel.receive(e.data)
  console.log('Set up RPC channel')
}

function setupAutoclearMsgListener (ctx_required = []) {
  const func = ({ data }) => {
    if (data[0] === 'ctx') {
      try {
        if (data[1]) {
          console.log('Received channel setup result')
          if (!ctx_required.every((req) => data[1].context[req])) {
            throw new TypeError('Missing required fields in context')
          }
          state.context = data[1].context
          state.port = data[1].port
          setupRpcChannel()
          window.removeEventListener('message', func)
        } else if (data[2]) {
          throw Object.assign(new Error(), data[2])
        }
      } catch (e) {
        console.error('Received channel setup error', e)
        state.error = e
        window.removeEventListener('message', func)
      }
    }
  }
  window.addEventListener('message', func)
}

export { state, setupAutoclearMsgListener }
