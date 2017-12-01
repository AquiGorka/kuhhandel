import shuffle from 'shuffle-array'

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
  }
}

class Auction {
  constructor(card) {
    this.card = card
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
    this.offers.push(o)
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

  auction(card) {
    return new Auction(card)
  }

  draw() {
    if (!this.stack.length) {
      throw new Error('There are no more cards left')
    }
    return this.stack.pop()
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
