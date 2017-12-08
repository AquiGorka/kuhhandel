import Kuhhandel from 'kuhhandel'
import { EventEmitter } from 'events'
import localForage from 'localforage'

const KH = 'Kuhhandel'

class Game extends EventEmitter {
  constructor() {
    super()
    this.kh = null
    this.init()
  }

  init = async () => {
    const log = await this.getState()
    if (log && log.length) {
      log.forEach(action => this[action.method](action.payload))
    }
  }

  setup = async opts => {
    if (!this.kh) {
      const options = { ...opts, seed: Date.now() }
      this.kh = new Kuhhandel(options)
      this.saveState('setup', options)
      this.emit('setup')
    }
  }

  /* save & fetch from localstorage */
  getState = async () => {
    return await localForage.getItem(KH)
  }

  saveState = async (method, payload) => {
    if (!this.kh) {
      throw new Error('Cannot save state if game has not been setup')
    }
    const log = await localForage.getItem(KH)
    const state = log ? log : []
    state.push({ method, payload })
    localForage.setItem(KH, state)
  }
}

export default new Game()
