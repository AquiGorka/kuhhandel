class Kuhhandel {
  constructor({ numPlayers = 2 } = {}) {
    if (numPlayers < 2) {
      throw new Error('A minimum of 2 players is required')
    }
    this.numPlayers = numPlayers
  }
}

export default Kuhhandel
