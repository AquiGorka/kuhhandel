import expect from 'expect'

import Kuhhandel from 'src/index'

describe('Kuhhanel', () => {
  it('default to 2 players', () => {
    const kh = new Kuhhandel()
    expect(kh.numPlayers).toBe(2)
  })
})
