class Kuhhandel {
  constructor({ numPlayers = 2 } = {}) {
    if (numPlayers < 2) {
      throw new Error('A minimum of 2 players is required')
    }
    if (numPlayers > 5) {
      throw new Error('A maximum of 5 players is allowed')
    }
    this.numPlayers = numPlayers
  }
}

export default Kuhhandel
