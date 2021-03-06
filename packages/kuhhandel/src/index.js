import shuffle from 'shuffle-array'
import RNG from 'rng'

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
export const FIRST_DONKEY_DEAL = 50
export const SECOND_DONKEY_DEAL = 100
export const THIRD_DONKEY_DEAL = 200
export const FOURTH_DONKEY_DEAL = 500
export const DONKEY = 'donkey'
export const ANIMALS = new Map([
  ['chick', { emoji: '🐤', value: 10 }],
  ['penguin', { emoji: '🐧', value: 40 }],
  ['cat', { emoji: '🐱', value: 90 }],
  ['dog', { emoji: '🐶', value: 160 }],
  ['boar', { emoji: '🐗', value: 250 }],
  ['monkey', { emoji: '🐵', value: 350 }],
  [DONKEY, { emoji: '🐴', value: 500 }],
  ['pig', { emoji: '🐷', value: 650 }],
  ['cow', { emoji: '🐮', value: 800 }],
  ['bear', { emoji: '🐻', value: 1000 }],
])
const keys = Array.from(ANIMALS.keys())
export const DECK = [...keys, ...keys, ...keys, ...keys]

export const totalValue = (p, c) => p + c.value

const reduceArray = (fullArray, itemsToRemove, compareFn) => {
  return fullArray.reduce((p, c) => {
    const exists = itemsToRemove.some(compareFn(c))
    if (exists) {
      const index = itemsToRemove.findIndex(compareFn(c))
      itemsToRemove.splice(index, 1)
    } else {
      p.push(c)
    }
    return p
  }, [])
}

class Player {
  constructor({ id }) {
    this.id = `${id}`
    this.money = []
    this.animals = []
  }

  score() {
    const animalCount = this.animals.reduce((p, c) => {
      if (!p.has(c)) {
        p.set(c, 0)
      }
      p.set(c, p.get(c) + 1)
      return p
    }, new Map())
    const fourOfAKindMap = Array.from(animalCount).filter(([id, count]) => count === 4)
    return fourOfAKindMap.length * fourOfAKindMap.reduce((p, [id, count]) => {
      return p + ANIMALS.get(id).value
    }, 0)
  }

  total() {
    return this.money.reduce(totalValue, 0)
  }

  letGoAnimals(animals) {
    this.animals = reduceArray(this.animals, animals.concat(), c => i => i === c)
  }

  letGoMoney(money) {
    this.money = reduceArray(this.money, money.concat(), c => i => i.value === c.value)
  }

  receiveAnimals(animals) {
    this.animals = this.animals.concat(animals)
  }

  receiveMoney(money) {
    this.money = this.money.concat(money)
  }
}

class Auction {
  constructor({ playerId, animalId } = {}) {
    if (!playerId || !animalId) {
      throw new Error('Provide a player id and an animal to start an auction')
    }
    this.animalId = animalId
    this.auctioneerId = playerId
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
    if (this.auctioneerId === o.playerId) {
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
  constructor({ playerId, money }) {
    if (!playerId || !money.length) {
      throw new Error('Provide an initiator player id and money to start a Cow Trade')
    }
    this.playerId = playerId
    this.money = money
  }

  visibleMoney() {
    return this.money.length
  }

  total() {
    return this.money.reduce(totalValue, 0)
  }
}

class Challenged {
  constructor({ playerId }) {
    if (!playerId) {
      throw new Error('Provide a challenged player id to start a Cow Trade')
    }
    this.playerId = playerId
  }

  total() {
    return this.money.reduce(totalValue, 0)
  }

  visibleMoney() {
    return this.money.length
  }
}

class CowTrade {
  constructor({ initiator, challenged, animalId }) {
    if (!initiator || !challenged || !animalId) {
      throw new Error('Provide an initiator, a challenger and an animal to start a Cow Trade')
    }
    this.initiator = new Initiator(initiator)
    this.challenged = new Challenged(challenged)
    this.animalId = animalId
  }

  respond(money) {
    this.challenged.money = money
  }
}


class Kuhhandel {
  constructor({ players = ['1', '2'], seed = Math.random() } = {}) {
    if (players.length < 2) {
      throw new Error('A minimum of 2 players is required')
    }
    if (players.length > 6) {
      throw new Error('A maximum of 6 players is allowed')
    }
    this.seed = seed
    this.players = players.map(id => new Player({ id }))
    this.stack = []
  }

  auction(opts) {
    return new Auction(opts)
  }

  auctionClose(auction) {
    auction.close()
    if (!auction.offers.length) {
      this.players
        .find(p => p.id === auction.auctioneerId)
        .receiveAnimals(auction.animalId)
    }
  }

  buyBack(auction, money) {
    if (!auction.closed) {
      throw new Error('Cannot buyback if the auction is not closed')
    }
    if (auction.highestBid().value > money.reduce(totalValue, 0)) {
      throw new Error('Cannot buyback if money is not equal or more than highest offer')
    }
    const { playerId, value } = auction.highestBid()
    const player = this.players.find(p => p.id === playerId)
    const auctioneer = this.players.find(p => p.id === auction.auctioneerId)
    auctioneer.letGoMoney(money)
    player.receiveMoney(money)
    auctioneer.receiveAnimals(auction.animalId)
  }

  canThePlayerPay(auction) {
    const { playerId, value } = auction.highestBid()
    const player = this.players.find(p => p.id === playerId)
    if (!player) {
      throw new Error('The player with such id does not exist')
    }
    return player.total() >= value
  }

  computeValueForDonkeyDraw() {
    const values = new Map([
      [0, FOURTH_DONKEY_DEAL],
      [1, THIRD_DONKEY_DEAL],
      [2, SECOND_DONKEY_DEAL],
      [3, FIRST_DONKEY_DEAL]
    ])
    const remainingDonkeysInDeck = this.stack.reduce((p, c) => {
      if (c === DONKEY) {
        p++
      }
      return p
    }, 0)
    return values.get(remainingDonkeysInDeck)
  }

  draw() {
    if (!this.stack.length) {
      throw new Error('There are no more cards left')
    }
    const animalId = this.stack.pop()
    if (animalId === DONKEY) {
      const value = this.computeValueForDonkeyDraw()
      this.players.forEach(p => p.receiveMoney({ value }))
    }
    return animalId
  }

  cowTrade(opts) {
    return new CowTrade(opts)
  }

  exchange(auction, money) {
    if (!auction.closed) {
      throw new Error('Cannot exchange if the auction is not closed')
    }
    if (auction.highestBid().value > money.reduce(totalValue, 0)) {
      throw new Error('Cannot exchange if money is not equal or more than highest offer')
    }
    auction.exchange = money
  }

  exchangeAccept(auction) {
    const money = auction.exchange
    const { playerId, value } = auction.highestBid()
    const player = this.players.find(p => p.id === playerId)
    const auctioneer = this.players.find(p => p.id === auction.auctioneerId)
    player.letGoMoney(money)
    auctioneer.receiveMoney(money)
    player.receiveAnimals(auction.animalId)
  }

  initialDeal() {
    this.players.forEach(p => {
      p.money = Array.from(INITIAL_DEAL)
    })
  }

  initialShuffle() {
    const rng = new RNG.MT(this.seed)
    this.stack = shuffle(DECK, { copy: true, rng: rng.random.bind(rng) })
  }

  settleCowTrade(cowTrade) {
    const { initiator, challenged } = cowTrade
    if (initiator.total() === challenged.total()) {
      return false
    }
    const winnerId = (initiator.total() > challenged.total()) ? initiator.playerId : challenged.playerId
    const loserId  = (initiator.total() < challenged.total()) ? initiator.playerId : challenged.playerId
    const winner = this.players.find(p => p.id === winnerId)
    const loser = this.players.find(p => p.id === loserId)
    // the winner gets the animals
    const winnerNumberOfAnimal = winner.animals.filter(a => a === cowTrade.animalId).length
    const loserNumberOfAnimal = loser.animals.filter(a => a === cowTrade.animalId).length
    const numberOfAnimalsToReceive = (winnerNumberOfAnimal === 2 && loserNumberOfAnimal === 2) ? 2 : 1
    for (let i = 0; i < numberOfAnimalsToReceive; i++) {
      winner.receiveAnimals([cowTrade.animalId])
      loser.letGoAnimals([cowTrade.animalId])
    }
    const initiatorPlayer = this.players.find(p => p.id === initiator.playerId)
    const challengedPlayer = this.players.find(p => p.id === challenged.playerId)
    // exchange money cards
    initiatorPlayer.letGoMoney(initiator.money)
    initiatorPlayer.receiveMoney(challenged.money)
    challengedPlayer.letGoMoney(challenged.money)
    challengedPlayer.receiveMoney(initiator.money)
    // success
    return true
  }
}

export default Kuhhandel
