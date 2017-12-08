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
      log.forEach(action => this[action.method](action.payload, false))
    }
  }

  setup = async (opts, log = true) => {
    if (!this.kh) {
      const options = { ...opts, seed: Date.now() }
      this.kh = new Kuhhandel(options)
      this.emit('setup')
      if (log) {
        this.saveState({ method: 'setup', payload: options })
      }
    }
  }

  /* save & fetch from localstorage */
  getState = async () => {
    return await localForage.getItem(KH)
  }

  saveState = async (action) => {
    if (!this.kh) {
      throw new Error('Cannot save state if game has not been setup')
    }
    const log = await localForage.getItem(KH)
    const state = log ? log : []
    state.push(action)
    localForage.setItem(KH, state)
  }
}

export default new Game()
