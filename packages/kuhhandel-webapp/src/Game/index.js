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
    const state = await this.getState()
    if (state && state.setup) {
      this.setup({ players: state.players })
    }
  }

  setup = async ({ players }) => {
    this.kh = new Kuhhandel({ players })
    await this.saveState()
    this.emit('setup')
  }

  /* save & fetch from localstorage */
  getState = async () => {
    return await localForage.getItem(KH)
  }

  saveState = async () => {
    if (!this.kh) {
      throw new Error('Cannot save state if game has not been setup')
    }
    await localForage.setItem(KH, {
      setup: { players: this.kh.players }
    })
  }
}

export default new Game()
