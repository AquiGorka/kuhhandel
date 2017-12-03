import shuffle from 'shuffle-array'

// total: 100
export const INITIAL_DEAL = [
 { value: 0 },
 { value: 0 },
 { value: 10 },
 { value: 10 },
 { value: 10 },
 { value: 20 },
 { value: 50 },
]
const ANIMALS = [
  { animal: 'chicken', value: 10 },
  { animal: 'goose', value: 40 },
  { animal: 'cat', value: 90 },
  { animal: 'dog', value: 160 },
  { animal: 'sheep', value: 250 },
  { animal: 'goat', value: 350 },
  { animal: 'donkey', value: 500 },
  { animal: 'pig', value: 650 },
  { animal: 'cow', value: 800 },
  { animal: 'horse', value: 1000 },
]
export const DECK = [...ANIMALS, ...ANIMALS, ...ANIMALS, ...ANIMALS]

class Player {
  constructor({ id }) {
    this.id = id
    this.money = []
    this.cards = []
  }

  get total() {
    return this.money.reduce((p, c) => p + c.value, 0)
  }

  pay(cards) {
    const cardsCopy = cards.concat()
    this.money = this.money.reduce((p, c) => {
      const compareValue = card => card.value === c.value
      const exists = cardsCopy.some(compareValue)
      if (exists) {
        const index = cardsCopy.findIndex(compareValue)
        cardsCopy.splice(index, 1)
      } else {
        p.push(c)
      }
      return p
    }, [])
  }

  receiveCards(cards) {
    this.cards = this.cards.concat(cards)
  }

  receiveMoney(cards) {
    this.money = this.money.concat(cards)
  }
}

class Auction {
  constructor({ player, card } = {}) {
    if (!player || !card) {
      throw new Error('Provide a player id and a card to start an auction')
    }
    this.card = card
    this.auctioneer = player
    this.closed = false
    this.offers = []
  }

  close() {
    this.closed = true
  }

  highestBid() {
    return this.offers.sort((a, b) => b.value - a.value)[0]
  }

  offer(o) {
    if (this.closed) {
      throw new Error('Auction has been closed and cannot accept more offers')
    }
    if (this.auctioneer.id === o.playerId) {
      throw new Error('The auctioneer can not place an offer')
    }
    if (o.value === 0) {
      return false
    }
    if (this.offers.length && this.highestBid().value >= o.value) {
      return false
    }
    this.offers.push(o)
    return true
  }
}

class Initiator {
  constructor({ player, cards }) {
    if (!player || !cards.length) {
      throw new Error('Provide an initiator player and cards to start a Cow Trade')
    }
    this.player = player
    this.cards = cards
  }

  visibleCards() {
    return this.cards.length
  }
}

class Challenged {
  constructor({ player }) {
    if (!player) {
      throw new Error('Provide a challenged player to start a Cow Trade')
    }
    this.player = player
  }

  response(cards) {
    this.cards = cards
  }

  visibleCards() {
    return this.cards.length
  }
}

class CowTrade {
  constructor({ initiator, challenged, card }) {
    if (!initiator || !challenged || !card) {
      throw new Error('Provide an initiator a challenger and a card to start a Cow Trade')
    }
    this.initiator = new Initiator(initiator)
    this.challenged = new Challenged(challenged)
    this.card = card
  }
}


class Kuhhandel {
  constructor({ players = 2 } = {}) {
    if (players < 2) {
      throw new Error('A minimum of 2 players is required')
    }
    if (players > 5) {
      throw new Error('A maximum of 5 players is allowed')
    }
    this.players = Array(players).fill(0).map((item, index) => new Player({ id: index }))
    this.stack = []
  }

  auction(opts) {
    return new Auction(opts)
  }

  buyBack(auction, cards) {
    const { playerId, value } = auction.highestBid()
    const player = this.players.find(p => p.id === playerId)
    auction.auctioneer.pay(cards)
    player.receiveMoney(cards)
    auction.auctioneer.receiveCards(auction.card)
  }

  canThePlayerPay(auction) {
    const { playerId, value } = auction.highestBid()
    const player = this.players.find(p => p.id === playerId)
    if (!player) {
      throw new Error('The player with such id does not exist')
    }
    return player.total >= value
  }

  draw() {
    if (!this.stack.length) {
      throw new Error('There are no more cards left')
    }
    return this.stack.pop()
  }

  cowTrade(opts) {
    return new CowTrade(opts)
  }

  exchange(auction, cards) {
    const { playerId, value } = auction.highestBid()
    const player = this.players.find(p => p.id === playerId)
    player.pay(cards)
    auction.auctioneer.receiveMoney(cards)
    player.receiveCards(auction.card)
  }

  initialDeal() {
    this.players.forEach(p => {
      p.money = Array.from(INITIAL_DEAL)
    })
  }

  initialShuffle() {
    this.stack = shuffle(DECK, { copy: true })
  }
}

export default Kuhhandel
