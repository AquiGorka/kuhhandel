import expect from 'expect'
import Kuhhandel, {
  INITIAL_DEAL,
  DECK,
  totalValue,
  FIRST_DONKEY_DEAL,
  SECOND_DONKEY_DEAL,
  THIRD_DONKEY_DEAL,
  FOURTH_DONKEY_DEAL,
  DONKEY,
  ANIMALS
} from 'src/index'

const randomPlayers = () => Math.floor(2 + Math.random() * 3)
const randomKuhhandel = () => {
  const players = randomPlayers()
  const kh = new Kuhhandel({ players })
  return { kh, players }
}
const randomInitiatedKuhhandel = () => {
  const { kh, players } = randomKuhhandel()
  kh.initialDeal()
  kh.initialShuffle()
  return { kh, players }
}
const randomHalfDeckEvenDistributedKuhhandel = () => {
  // we need players < 5 so that ech of them receive one of each card
  const players = 2 + Math.floor(Math.random() * 2)
  const kh = new Kuhhandel({ players })
  kh.initialDeal()
  // this is done on purpose, no shuffle means dealing evenly
  //kh.initialShuffle()
  kh.stack = DECK.concat()
  let current = 0
  const playerLoop = () => {
    const player = kh.players[current]
    current++
    if (current >= players) {
      current = 0
    }
    return player
  }
  for (let i=0; i< DECK.length / 2; i++) {
    const player = playerLoop()
    player.receiveAnimals(kh.draw())
  }
  return { kh, players }
}
const drawUntilNthDonkey = (kh, nth) => {
  let i = 0
  while(i < nth) {
    const animal = kh.draw()
    if (animal === DONKEY){
      i++
    }
  }
}
const INITIAL_DEAL_TOTAL = INITIAL_DEAL.reduce(totalValue, 0)

describe('Kuhhandel', () => {
  it('should default to 2 players', () => {
    const kh = new Kuhhandel()
    expect(kh.players.length).toBe(2)
  })

  it('should throw if num players is less than 2', () => {
    expect(() => new Kuhhandel({ players: 1 })).toThrow()
  })

  it('should throw if num players is more than 5', () => {
    expect(() => new Kuhhandel({ players: 6 })).toThrow()
  })

  it('should instantiate players with unique ids', () => {
    const numPlayers = randomPlayers()
    const kh = new Kuhhandel({ players: numPlayers })
    const set = new Set(kh.players.map(p => p.id))
    expect(Array.from(set).length).toBe(numPlayers)
  })

  it('should deal the same money cards to each player on the initial deal', ()=> {
    const { kh, players } = randomKuhhandel()
    kh.initialDeal()
    kh.players.forEach(p => {
      expect(p.money).toEqual(INITIAL_DEAL)
    })
  })

  it('should shuffle the animal cards on the initial shuffle', () => {
    const { kh } = randomKuhhandel()
    kh.initialShuffle()
    expect(kh.stack).toNotBe(DECK)
  })

  it('should shuffle the deck in the same way using the same seed', () => {
    const seed = Math.random()
    const kh1 = new Kuhhandel({ seed })
    const kh2 = new Kuhhandel({ seed })
    kh1.initialShuffle()
    kh2.initialShuffle()
    expect(kh1.stack).toEqual(kh2.stack)
  })

  it('should shuffle the decks differently using different seeds', () => {
    const seed1 = Math.random()
    const seed2 = Date.now()
    const kh1 = new Kuhhandel({ seed: seed1 })
    const kh2 = new Kuhhandel({ seed: seed2 })
    kh1.initialShuffle()
    kh2.initialShuffle()
    expect(kh1.stack).toNotEqual(kh2.stack)
  })

  it('should draw one card from the stack', () => {
    const { kh } = randomKuhhandel()
    kh.initialShuffle()
    kh.draw()
    expect(kh.stack.length).toBe(DECK.length - 1)
  })

  it('should throw if trying to draw from the stack when there are no more cards left', () => {
    const { kh } = randomKuhhandel()
    kh.initialShuffle()
    DECK.forEach(() => kh.draw())
    expect(kh.draw).toThrow()
  })

  it('should give each player additional money when the first donkey comes out', () => {
    const { kh } = randomInitiatedKuhhandel()
    drawUntilNthDonkey(kh, 1)
    kh.players.forEach(p => {
      const total = p.money.reduce(totalValue, 0)
      expect(total).toEqual(INITIAL_DEAL_TOTAL + FIRST_DONKEY_DEAL)
    })
  })

  it('should give each player additional money when the second donkey comes out', () => {
    const { kh } = randomInitiatedKuhhandel()
    drawUntilNthDonkey(kh, 2)
    kh.players.forEach(p => {
      const total = p.money.reduce(totalValue, 0)
      expect(total).toEqual(INITIAL_DEAL_TOTAL + FIRST_DONKEY_DEAL + SECOND_DONKEY_DEAL)
    })
  })

  it('should give each player additional money when the third donkey comes out', () => {
    const { kh } = randomInitiatedKuhhandel()
    drawUntilNthDonkey(kh, 3)
    kh.players.forEach(p => {
      const total = p.money.reduce(totalValue, 0)
      expect(total).toEqual(INITIAL_DEAL_TOTAL + FIRST_DONKEY_DEAL + SECOND_DONKEY_DEAL + THIRD_DONKEY_DEAL)
    })
  })

  it('should give each player additional money when the fourth donkey comes out', () => {
    const { kh } = randomInitiatedKuhhandel()
    drawUntilNthDonkey(kh, 4)
    kh.players.forEach(p => {
      const total = p.money.reduce(totalValue, 0)
      expect(total).toEqual(INITIAL_DEAL_TOTAL + FIRST_DONKEY_DEAL + SECOND_DONKEY_DEAL + THIRD_DONKEY_DEAL + FOURTH_DONKEY_DEAL)
    })
  })
})

describe('Kuhhandel auction', () => {
  it('should throw if it does not receive a player id and card to start an auction', () => {
    const { kh } = randomInitiatedKuhhandel()
    expect(kh.auction).toThrow()
  })

  it('should start an auction and listen to offers', () => {
    const { kh } = randomInitiatedKuhhandel()
    const animal = kh.draw()
    const player = kh.players[0]
    const auction = kh.auction({ player, animal })
    const offer = { playerId: 1, value: 10 }
    auction.offer(offer)
    expect(auction.offers).toEqual([offer])
  })

  it('should return true after accepting an offer', () => {
    const { kh } = randomInitiatedKuhhandel()
    const animal = kh.draw()
    const player = kh.players[0]
    const auction = kh.auction({ player, animal })
    const offer = { playerId: 1, value: 10 }
    const accepted = auction.offer(offer)
    expect(accepted).toBe(true)
  })

  it('should return false after not accepting an offer', () => {
    const { kh } = randomInitiatedKuhhandel()
    const animal = kh.draw()
    const player = kh.players[0]
    const auction = kh.auction({ player, animal })
    const offer = { playerId: 1, value: 10 }
    auction.offer(offer)
    const rejected = auction.offer(offer)
    expect(rejected).toBe(false)
  })

  it('should not accept offers for value 0', () => {
    const { kh } = randomInitiatedKuhhandel()
    const animal = kh.draw()
    const player = kh.players[0]
    const auction = kh.auction({ player, animal })
    const offer = { playerId: 1, value: 0 }
    const rejected = auction.offer(offer)
    expect(rejected).toBe(false)
  })

  it('should throw if it receives an offer from the auctioneer', () => {
    const { kh } = randomInitiatedKuhhandel()
    const animal = kh.draw()
    const player = kh.players[0]
    const auction = kh.auction({ player, animal })
    const offer = { playerId: 0, value: 10 }
    expect(() => auction.offer(offer)).toThrow()
  })

  it('should not accept offers for less or equal the current highest bid', () => {
    const { kh } = randomInitiatedKuhhandel()
    const animal = kh.draw()
    const player = kh.players[0]
    const auction = kh.auction({ player, animal })
    const offer0 = { playerId: 1, value: 20 }
    const offer1 = { playerId: 2, value: 10 }
    const offer2= { playerId: 2, value: 20 }
    auction.offer(offer0)
    auction.offer(offer1)
    auction.offer(offer2)
    expect(auction.offers.length).toBe(1)
    expect(auction.highestBid()).toEqual(offer0)
  })

  it('should return the highest bid for a card', () => {
    const { kh } = randomInitiatedKuhhandel()
    const animal = kh.draw()
    const player = kh.players[0]
    const auction = kh.auction({ player, animal })
    const offer0 = { playerId: 1, value: 10 }
    const offer1 = { playerId: 2, value: 20 }
    auction.offer(offer0)
    auction.offer(offer1)
    expect(auction.highestBid()).toBe(offer1)
  })

  it('should not accept more offers after the auction has been closed', () => {
    const { kh } = randomInitiatedKuhhandel()
    const animal = kh.draw()
    const player = kh.players[0]
    const auction = kh.auction({ player, animal })
    const offer0 = { playerId: 1, value: 10 }
    const offer1 = { playerId: 2, value: 20 }
    const offer2 = { playerId: 3, value: 30 }
    auction.offer(offer0)
    auction.offer(offer1)
    kh.auctionClose(auction)
    expect(() => auction.offer(offer2)).toThrow()
  })
})

describe('Kuhhandel closed auction exchange', () => {
  it('should return true if the exchange can take place', () => {
    const { kh } = randomInitiatedKuhhandel()
    const animal = kh.draw()
    const player = kh.players[0]
    const auction = kh.auction({ player, animal })
    const offer0 = { playerId: kh.players[1].id, value: 10 }
    auction.offer(offer0)
    kh.auctionClose(auction)
    const accepted = kh.canThePlayerPay(auction)
    expect(accepted).toBe(true)
  })

  it('should return false if the exchange can not take place', () => {
    const { kh } = randomInitiatedKuhhandel()
    const animal = kh.draw()
    const player = kh.players[0]
    const auction = kh.auction({ player, animal })
    const offer0 = { playerId: kh.players[1].id, value: Infinity }
    auction.offer(offer0)
    kh.auctionClose(auction)
    const accepted = kh.canThePlayerPay(auction)
    expect(accepted).toBe(false)
  })

  it('should throw if trying to execute an exchange if the auction is not closed', () => {
    const { kh } = randomInitiatedKuhhandel()
    const animal = kh.draw()
    const player = kh.players[0]
    const auction = kh.auction({ player, animal })
    const offer0 = { playerId: kh.players[1].id, value: Infinity }
    auction.offer(offer0)
    expect(() => kh.exchange(auction, [])).toThrow()
  })

  it('should throw if exchange is not given equal or more money for the highest offer', () => {
    const { kh } = randomInitiatedKuhhandel()
    const animal = kh.draw()
    const auctioneer = kh.players[0]
    const auction = kh.auction({ player: auctioneer, animal })
    const player = kh.players[1]
    const offeredValue = 10
    const offer0 = { playerId: player.id, value: offeredValue }
    auction.offer(offer0)
    kh.auctionClose(auction)
    const accepted = kh.canThePlayerPay(auction)
    expect(accepted).toBe(true)
    expect(() => kh.exchange(auction, [{ value: 0 }])).toThrow()
  })

  it('should execute the exchange successfully', () => {
    const { kh } = randomInitiatedKuhhandel()
    const animal = kh.draw()
    const auctioneer = kh.players[0]
    const auction = kh.auction({ player: auctioneer, animal })
    const player = kh.players[1]
    const offeredValue = 10
    const offer0 = { playerId: player.id, value: offeredValue }
    auction.offer(offer0)
    kh.auctionClose(auction)
    const accepted = kh.canThePlayerPay(auction)
    // the draw might be a donkey and players receive extra money if that happens
    const auctioneerOriginalMoneyTotal = auctioneer.money.reduce(totalValue, 0)
    const playerOriginalMoneyTotal = player.money.reduce(totalValue, 0)
    kh.exchange(auction, [{ value: 10 }])
    expect(accepted).toBe(true)
    expect(kh.players[0].total()).toBe(auctioneerOriginalMoneyTotal + offeredValue)
    expect(kh.players[1].total()).toBe(playerOriginalMoneyTotal - offeredValue)
    expect(kh.players[1].animals).toEqual([animal])
  })

  it('should give the animal card directly to the auctioneer if there where no offers when the auction closes', () => {
    const { kh } = randomInitiatedKuhhandel()
    const animal = kh.draw()
    const auctioneer = kh.players[0]
    const auction = kh.auction({ player: auctioneer, animal })
    kh.auctionClose(auction)
    // the draw might be a donkey and players receive extra money if that happens
    const auctioneerOriginalMoneyTotal = auctioneer.money.reduce(totalValue, 0)
    expect(kh.players[0].total()).toBe(auctioneerOriginalMoneyTotal)
    expect(kh.players[0].animals).toEqual([animal])
  })

  it('should throw if trying to buyback and the auction is not closed', () => {
    const { kh } = randomInitiatedKuhhandel()
    const animal = kh.draw()
    const auctioneer = kh.players[0]
    const auction = kh.auction({ player: auctioneer, animal })
    const player = kh.players[1]
    const offeredValue = 10
    const offer0 = { playerId: player.id, value: offeredValue }
    auction.offer(offer0)
    expect(() => kh.buyBack(auction, [])).toThrow()
  })

  it('should throw if buyback is not given equal or more money for the highest offer', () => {
    const { kh } = randomInitiatedKuhhandel()
    const animal = kh.draw()
    const auctioneer = kh.players[0]
    const auction = kh.auction({ player: auctioneer, animal })
    const player = kh.players[1]
    const offeredValue = 10
    const offer0 = { playerId: player.id, value: offeredValue }
    auction.offer(offer0)
    kh.auctionClose(auction)
    expect(() => kh.buyBack(auction, [{ value: 0 }])).toThrow()
  })

  it('should execute the buyBack successfully', () => {
    const { kh } = randomInitiatedKuhhandel()
    const animal = kh.draw()
    const auctioneer = kh.players[0]
    const auction = kh.auction({ player: auctioneer, animal })
    const player = kh.players[1]
    const offeredValue = 10
    const offer0 = { playerId: player.id, value: offeredValue }
    auction.offer(offer0)
    kh.auctionClose(auction)
    // the draw might be a donkey and players receive extra money if that happens
    const auctioneerOriginalMoneyTotal = auctioneer.money.reduce(totalValue, 0)
    const playerOriginalMoneyTotal = player.money.reduce(totalValue, 0)
    kh.buyBack(auction, [{ value: 10 }])
    expect(kh.players[0].total()).toBe(auctioneerOriginalMoneyTotal - offeredValue)
    expect(kh.players[0].animals).toEqual([animal])
    expect(kh.players[1].total()).toBe(playerOriginalMoneyTotal + offeredValue)
  })
})

describe('Kuhhandel cow trade', () => {
  it('should throw if the proper options are not sent to start a cow trade', () => {
    const { kh } = randomKuhhandel()
    expect(kh.cowTrade).toThrow()
  })

  it('should initiate a cow trade and see how many money cards the challenger submitted', () => {
    const { kh } = randomHalfDeckEvenDistributedKuhhandel()
    const animal = kh.players[0].animals[0]
    const cowTrade = kh.cowTrade({
      initiator: { player: kh.players[0], money: [{ value: 0 }] },
      challenged: { player: kh.players[1] },
      animal
    })
    expect(cowTrade.initiator.visibleMoney()).toBe(1)
  })

  it('should settle a cow trade after the challenged player submits their cards', () => {
    const { kh } = randomInitiatedKuhhandel()
    const animal = kh.draw()
    const initiator = { player: kh.players[0], money: [{ value: 10 }] }
    initiator.player.receiveAnimals(animal)
    const challenged = { player: kh.players[1] }
    challenged.player.receiveAnimals(animal)
    const cowTrade = kh.cowTrade({ initiator, challenged, animal })
    cowTrade.challenged.response([{ value: 0 }])
    // the draw might be a donkey and players receive extra money if that happens
    const initiatorOriginalMoneyTotal = initiator.player.money.reduce(totalValue, 0)
    const challengedOriginalMoneyTotal = challenged.player.money.reduce(totalValue, 0)
    const settled = kh.settleCowTrade(cowTrade)
    expect(settled).toBe(true)
    expect(initiator.player.money.reduce(totalValue, 0)).toBe(initiatorOriginalMoneyTotal - 10)
    expect(initiator.player.animals).toEqual([animal, animal])
    expect(challenged.player.money.reduce(totalValue, 0)).toBe(challengedOriginalMoneyTotal + 10)
    expect(challenged.player.animals).toEqual([])
  })

  it('should settle the cow trade for one card when the initiator only owns one item', () => {
    const { kh } = randomInitiatedKuhhandel()
    const animal = kh.draw()
    const initiator = { player: kh.players[0], money: [{ value: 10 }] }
    initiator.player.receiveAnimals(animal)
    const challenged = { player: kh.players[1] }
    challenged.player.receiveAnimals(animal)
    challenged.player.receiveAnimals(animal)
    const cowTrade = kh.cowTrade({ initiator, challenged, animal })
    cowTrade.challenged.response([{ value: 0 }])
    // the draw might be a donkey and players receive extra money if that happens
    const initiatorOriginalMoneyTotal = initiator.player.money.reduce(totalValue, 0)
    const challengedOriginalMoneyTotal = challenged.player.money.reduce(totalValue, 0)
    const settled = kh.settleCowTrade(cowTrade)
    expect(settled).toBe(true)
    expect(initiator.player.money.reduce(totalValue, 0)).toBe(initiatorOriginalMoneyTotal - 10)
    expect(initiator.player.animals).toEqual([animal, animal])
    expect(challenged.player.money.reduce(totalValue, 0)).toBe(challengedOriginalMoneyTotal + 10)
    expect(challenged.player.animals).toEqual([animal])
  })

  it('should settle the cow trade for one card when the challenger only owns one item', () => {
    const { kh } = randomInitiatedKuhhandel()
    const animal = kh.draw()
    const initiator = { player: kh.players[0], money: [{ value: 10 }] }
    initiator.player.receiveAnimals(animal)
    initiator.player.receiveAnimals(animal)
    const challenged = { player: kh.players[1] }
    challenged.player.receiveAnimals(animal)
    const cowTrade = kh.cowTrade({ initiator, challenged, animal })
    cowTrade.challenged.response([{ value: 0 }])
    // the draw might be a donkey and players receive extra money if that happens
    const initiatorOriginalMoneyTotal = initiator.player.money.reduce(totalValue, 0)
    const challengedOriginalMoneyTotal = challenged.player.money.reduce(totalValue, 0)
    const settled = kh.settleCowTrade(cowTrade)
    expect(settled).toBe(true)
    expect(initiator.player.money.reduce(totalValue, 0)).toBe(initiatorOriginalMoneyTotal - 10)
    expect(initiator.player.animals).toEqual([animal, animal, animal])
    expect(challenged.player.money.reduce(totalValue, 0)).toBe(challengedOriginalMoneyTotal + 10)
    expect(challenged.player.animals).toEqual([])
  })

  it('should settle the cow trade for two cards when people owns two items', () => {
    const { kh } = randomInitiatedKuhhandel()
    const animal = kh.draw()
    const initiator = { player: kh.players[0], money: [{ value: 10 }] }
    initiator.player.receiveAnimals(animal)
    initiator.player.receiveAnimals(animal)
    const challenged = { player: kh.players[1] }
    challenged.player.receiveAnimals(animal)
    challenged.player.receiveAnimals(animal)
    const cowTrade = kh.cowTrade({ initiator, challenged, animal })
    cowTrade.challenged.response([{ value: 0 }])
    // the draw might be a donkey and players receive extra money if that happens
    const initiatorOriginalMoneyTotal = initiator.player.money.reduce(totalValue, 0)
    const challengedOriginalMoneyTotal = challenged.player.money.reduce(totalValue, 0)
    const settled = kh.settleCowTrade(cowTrade)
    expect(settled).toBe(true)
    expect(initiator.player.money.reduce(totalValue, 0)).toBe(initiatorOriginalMoneyTotal - 10)
    expect(initiator.player.animals).toEqual([animal, animal, animal, animal])
    expect(challenged.player.money.reduce(totalValue, 0)).toBe(challengedOriginalMoneyTotal + 10)
    expect(challenged.player.animals).toEqual([])
  })
})

describe('Kuhhandel scoring', () => {
  it('should add an animals value to a players score if the players has the four cards', () => {
    const { kh } = randomInitiatedKuhhandel()
    const animal = kh.draw()
    for(let i = 0; i < 4; i++) {
      kh.players[0].receiveAnimals(animal)
    }
    expect(kh.players[0].score()).toBe(animal.value)
  })

  it('should not add an animals value to a players score if the players does not have the four cards', () => {
    const { kh } = randomInitiatedKuhhandel()
    for(let i = 0; i < 3; i++) {
      const animal = kh.draw()
      kh.players[0].receiveAnimals(animal)
    }
    expect(kh.players[0].score()).toBe(0)
  })

  it('should multiply the players score times the number of four of a kind animals the player has', () => {
    const { kh } = randomKuhhandel()
    kh.stack = DECK.concat().sort((a , b) => b.value - a.value)
    let total = 0
    const howMany = 2 + Math.floor(Math.random() * ANIMALS.length - 2)
    for( let i = 0; i < howMany; i++) {
      const animal = kh.draw()
      total += animal.value
      kh.players[0].receiveAnimals(animal)
      for (let j = 1; j < 4; j++) {
        const animal = kh.draw()
        kh.players[0].receiveAnimals(animal)
      }
    }
    expect(kh.players[0].score()).toBe(total * howMany)
  })
})
