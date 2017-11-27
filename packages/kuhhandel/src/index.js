/*
40 Animal cards
10 Pedigree cards (one of each animal)
4 Rat cards
55 money cards [10x0, 20x10, 10x50, 5x100, 5x200, 5x500]
*/

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

class Player {
  constructor({ id }) {
    this.id = id
    this.money = []
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
  }

  initialDeal() {
    this.players.forEach(p => {
      p.money = Array.from(INITIAL_DEAL)
    })
  }
}

export default Kuhhandel
