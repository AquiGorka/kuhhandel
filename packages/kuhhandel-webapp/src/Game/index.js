import Kuhhandel from 'kuhhandel'
import { EventEmitter } from 'events'
import localForage from 'localforage'

const KH = 'Kuhhandel'
let kh = null
let draw = null
let auction = null
let cowTrade = null

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
      const options = { seed: Date.now(), ...opts }
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
  auctionClose = (_, log = true) => {
    kh.auctionClose(auction)
    this.emit('update')
    if (log) {
      saveState({ method: 'auctionClose', payload: null })
    }
  }

  auctionOffer = (offer, log = true) => {
    const accepted = auction.offer(offer)
    if (accepted) {
      this.emit('update')
      if (log) {
        saveState({ method: 'auctionOffer', payload: offer })
      }
    }
  }

  auctionStart = (playerId, log = true) => {
    const player = kh.players.find(p => p.id === playerId)
    const opts = { player, animal: draw }
    auction = kh.auction(opts)
    this.emit('update')
    if (log) {
      saveState({ method: 'auctionStart', payload: playerId })
    }
  }

  buyBack = (money, log = true) => {
    kh.buyBack(auction, money)
    draw = null
    auction = null
    this.emit('update')
    if (log) {
      saveState({ method: 'buyBack', payload: money })
    }
  }

  cowTradeRespond = (money, log = true) => {
    cowTrade.challenged.response(money)
    kh.settleCowTrade(cowTrade)
    cowTrade = null
    this.emit('update')
    if (log) {
      saveState({ method: 'cowTradeRespond', payload: money })
    }
  }

  cowTradeStart = (opts, log = true) => {
    const { money, animal, initiatorId, challengedId } = opts
    cowTrade = kh.cowTrade({
      initiator: { money, player: kh.players.find(p => p.id === initiatorId) },
      challenged: { player: kh.players.find(p => p.id === challengedId )},
      animal
    })
    this.emit('update')
    if (log) {
      saveState({ method: 'cowTradeStart', payload: opts })
    }
  }

  draw = (playerId, log = true) => {
    draw = kh.draw()
    this.emit('update')
    if (log) {
      saveState({ method: 'draw', payload: playerId })
    }
  }

  exchange = (money, log = true) => {
    if (kh.canThePlayerPay(auction)) {
      kh.exchange(auction, money)
      draw = null
      auction = null
      if (log) {
        saveState({ method: 'exchange', payload: money })
      }
    }
    this.emit('update')
  }

  get cannotPayPlayerMoney() {
    if (this.canThePlayerPay === false) {
      return kh.players.find(p => p.id === auction.highestBid().playerId).money
    }
    return null
  }

  get canThePlayerPay() {
    if (!auction || !auction.closed) {
      return null
    }
    return kh.canThePlayerPay(auction)
  }

  get currentAuction() {
    return auction
  }

  get currentCowTrade() {
    return cowTrade
  }

  get currentDraw() {
    return draw
  }

  get highestBid() {
    return auction && auction.highestBid()
  }

  get players() {
    return kh.players
  }

  get stack() {
    return kh.stack
  }

}

export default new Game()
