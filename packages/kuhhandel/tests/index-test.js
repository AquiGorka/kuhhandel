import expect from 'expect'

import Kuhhandel from 'src/index'

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
})
