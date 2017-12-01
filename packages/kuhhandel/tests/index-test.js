import expect from 'expect'
import Kuhhandel, {
  INITIAL_DEAL,
  DECK,
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
    setTimeout(() => expect(kh.draw()).toThrow(), 0)
  })

  it('should start an auction and listen to offers', () => {
    const { kh } = randomInitiatedKuhhandel()
    const card = kh.draw()
    const auction = kh.auction(card)
    const offer = { playerId: 0, value: 0 }
    auction.offer(offer)
    expect(auction.offers).toEqual([offer])
  })

  it('should not accept offers for less or equal the current highest bid', () => {
    const { kh } = randomInitiatedKuhhandel()
    const card = kh.draw()
    const auction = kh.auction(card)
    const offer0 = { playerId: 0, value: 10 }
    const offer1 = { playerId: 1, value: 10 }
    const offer2= { playerId: 2, value: 0 }
    auction.offer(offer0)
    auction.offer(offer1)
    auction.offer(offer2)
    expect(auction.offers.length).toBe(1)
    expect(auction.highestBid()).toEqual(offer0)
  })

  it('should return the highest bid for a card', () => {
    const { kh } = randomInitiatedKuhhandel()
    const card = kh.draw()
    const auction = kh.auction(card)
    const offer0 = { playerId: 0, value: 0 }
    const offer1 = { playerId: 1, value: 10 }
    auction.offer(offer0)
    auction.offer(offer1)
    expect(auction.highestBid()).toBe(offer1)
  })

  it('should not accept more offers after the auction has been closed', () => {
    const { kh } = randomInitiatedKuhhandel()
    const card = kh.draw()
    const auction = kh.auction(card)
    const offer0 = { playerId: 0, value: 0 }
    const offer1 = { playerId: 1, value: 10 }
    const offer2 = { playerId: 2, value: 20 }
    auction.offer(offer0)
    auction.offer(offer1)
    auction.close()
    setTimeout(() => expect(auction.offer(offer2)).toThrow(), 1)
  })
})
