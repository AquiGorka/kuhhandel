import expect from 'expect'
import Kuhhandel from 'src/index'

const randomPlayers = () => Math.floor(2 + Math.random() * 3)

describe('Kuhhandel', () => {
  it('default to 2 players', () => {
    const kh = new Kuhhandel()
    expect(kh.players.length).toBe(2)
  })

  it('should throw if num players is less than 2', () => {
    expect(() => new Kuhhandel({ players: 1 })).toThrow('A minimum of 2 players is required')
  })

  it('should throw if num players if more than 5', () => {
    expect(() => new Kuhhandel({ players: 6 })).toThrow('A maximum of 5 players is allowed')
  })

  it('should instantiate players with unique ids', () => {
    const numPlayers = randomPlayers()
    const kh = new Kuhhandel({ players: numPlayers })
    const set = new Set(kh.players.map(p => p.id))
    expect(Array.from(set).length).toBe(numPlayers)
  })
})
