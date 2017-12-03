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

  get total() {
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
    this.stack = shuffle(DECK, { copy: true })
  }

  settleCowTrade(cowTrade) {
    const { initiator, challenged } = cowTrade
    if (initiator.total === challenged.total) {
      return false
    }
    const winner = (initiator.total() > challenged.total()) ? initiator : challenged
    const loser  = (initiator.total() < challenged.total()) ? initiator : challenged
    // the winner gets the animal card
    winner.player.receiveAnimals([cowTrade.animal])
    loser.player.letGoAnimals([cowTrade.animal])
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
