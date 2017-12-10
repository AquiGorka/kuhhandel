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
export const DONKEY = { animal: 'donkey', value: 500 }
export const ANIMALS = [
  { animal: 'chicken', value: 10 },
  { animal: 'goose', value: 40 },
  { animal: 'cat', value: 90 },
  { animal: 'dog', value: 160 },
  { animal: 'sheep', value: 250 },
  { animal: 'goat', value: 350 },
  DONKEY,
  { animal: 'pig', value: 650 },
  { animal: 'cow', value: 800 },
  { animal: 'horse', value: 1000 },
]
export const DECK = [...ANIMALS, ...ANIMALS, ...ANIMALS, ...ANIMALS]

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
    this.id = id
    this.money = []
    this.animals = []
  }

  score() {
    const animalMap = this.animals.reduce((p, c) => {
      if (!p.has(c.animal)) {
        p.set(c.animal, { count: 0 })
      }
      p.set(c.animal, { value: c.value, count: p.get(c.animal).count + 1 })
      return p
    }, new Map())
    const fourOfAKindMap = Array.from(animalMap).filter(arr => arr[1].count === 4)
    return fourOfAKindMap.length * fourOfAKindMap.reduce((p, c) => {
      return p + c[1].value
    }, 0)
  }

  total() {
    return this.money.reduce(totalValue, 0)
  }

  letGoAnimals(animals) {
    this.animals = reduceArray(this.animals, animals.concat(), c => i => i.value === c.value)
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
  constructor({ player, animal } = {}) {
    if (!player || !animal) {
      throw new Error('Provide a player id and an animal to start an auction')
    }
    this.animal = animal
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
  constructor({ player, money }) {
    if (!player || !money.length) {
      throw new Error('Provide an initiator player and money to start a Cow Trade')
    }
    this.player = player
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
  constructor({ player }) {
    if (!player) {
      throw new Error('Provide a challenged player to start a Cow Trade')
    }
    this.player = player
  }

  response(money) {
    this.money = money
  }

  total() {
    return this.money.reduce(totalValue, 0)
  }

  visibleMoney() {
    return this.money.length
  }
}

class CowTrade {
  constructor({ initiator, challenged, animal }) {
    if (!initiator || !challenged || !animal) {
      throw new Error('Provide an initiator a challengerd and an animal to start a Cow Trade')
    }
    this.initiator = new Initiator(initiator)
    this.challenged = new Challenged(challenged)
    this.animal = animal
  }
}


class Kuhhandel {
  constructor({ players = 2, seed = Math.random() } = {}) {
    if (players < 2) {
      throw new Error('A minimum of 2 players is required')
    }
    if (players > 5) {
      throw new Error('A maximum of 5 players is allowed')
    }
    this.seed = seed
    this.players = []
    for (let i=0; i < players; i++) {
      this.players.push(new Player({ id: i }))
    }
    this.stack = []
  }

  auction(opts) {
    return new Auction(opts)
  }

  buyBack(auction, money) {
    const { playerId, value } = auction.highestBid()
    const player = this.players.find(p => p.id === playerId)
    auction.auctioneer.letGoMoney(money)
    player.receiveMoney(money)
    auction.auctioneer.receiveAnimals(auction.animal)
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
    const animal = this.stack.pop()
    if (animal === DONKEY) {
      const value = this.computeValueForDonkeyDraw()
      this.players.forEach(p => p.receiveMoney({ value }))
    }
    return animal
  }

  cowTrade(opts) {
    return new CowTrade(opts)
  }

  exchange(auction, money) {
    const { playerId, value } = auction.highestBid()
    const player = this.players.find(p => p.id === playerId)
    player.letGoMoney(money)
    auction.auctioneer.receiveMoney(money)
    player.receiveAnimals(auction.animal)
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
    const winner = (initiator.total() > challenged.total()) ? initiator : challenged
    const loser  = (initiator.total() < challenged.total()) ? initiator : challenged
    // the winner gets the animal card(s)
    const winnerNumberOfAnimal = winner.player.animals.filter(a => a.animal === cowTrade.animal.animal).length
    const loserNumberOfAnimal = loser.player.animals.filter(a => a.animal === cowTrade.animal.animal).length
    const numberOfAnimalsToReceive = (winnerNumberOfAnimal === 2 && loserNumberOfAnimal === 2) ? 2 : 1
    for (let i = 0; i < numberOfAnimalsToReceive; i++) {
      winner.player.receiveAnimals([cowTrade.animal])
      loser.player.letGoAnimals([cowTrade.animal])
    }
    // exchange money cards
    initiator.player.letGoMoney(initiator.money)
    initiator.player.receiveMoney(challenged.money)
    challenged.player.letGoMoney(challenged.money)
    challenged.player.receiveMoney(initiator.money)
    // success
    return true
  }
}

export default Kuhhandel
