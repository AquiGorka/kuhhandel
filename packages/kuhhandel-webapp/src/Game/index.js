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
    this.currentDraw = null
    this.currentAuction = null
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
      kh.initialShuffle()
      kh.initialDeal()
      this.emit('setup')
      if (log) {
        saveState({ method: 'setup', payload: options })
      }
    }
  }

  /* this layer exists to persist actions, some methods are simple pass-by handlers */
  auction = (playerId, log = true) => {
    const player = kh.players.find(p => p.id === playerId)
    const opts = { player, animal: this.currentDraw }
    this.currentAuction = kh.auction(opts)
    this.emit('auction')
    if (log) {
      saveState({ method: 'auction', payload: playerId })
    }
  }

  auctionOffer = (offer, log = true) => {
    const accepted = this.currentAuction.offer(offer)
    if (accepted) {
      this.emit('auctionOffer')
      if (log) {
        saveState({ method: 'auctionOffer', payload: offer })
      }
    }
  }

  draw = (playerId, log = true) => {
    this.currentDraw = kh.draw()
    this.emit('draw')
    if (log) {
      saveState({ method: 'draw', payload: playerId })
    }
  }

  get players() {
    return kh.players
  }

  get stack() {
    return kh.stack
  }

}

export default new Game()
