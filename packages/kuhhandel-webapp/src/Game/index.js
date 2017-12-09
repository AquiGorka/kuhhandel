import Kuhhandel from 'kuhhandel'
import { EventEmitter } from 'events'
import localForage from 'localforage'

const KH = 'Kuhhandel'
let kh = null

/* save & fetch from localstorage */
const getState = async () => {
  return await localForage.getItem(KH)
}

const saveState = async action => {
  if (!kh) {
    throw new Error('Cannot save state if game has not been setup')
  }
  const log = await localForage.getItem(KH)
  const state = log ? log : []
  state.push(action)
  localForage.setItem(KH, state)
}

class Game extends EventEmitter {
  constructor() {
    super()
    this.init()
  }

  init = async () => {
    const log = await getState()
    if (log && log.length) {
      log.forEach(action => this[action.method](action.payload, false))
    }
  }

  setup = async (opts, log = true) => {
    if (!kh) {
      const options = { ...opts, seed: Date.now() }
      kh = new Kuhhandel(options)
      this.emit('setup')
      if (log) {
        saveState({ method: 'setup', payload: options })
      }
    }
  }

  /* this layer exists to persist actions, some methods are simple pass-by handlers */
  draw() {
    this.lastDraw = kh.draw()
    this.emit('draw')
  }

  get players() {
    return kh.players
  }

  get stack() {
    return kh.stack
  }

}

export default new Game()
