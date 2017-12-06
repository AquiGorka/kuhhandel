import Kuhhandel from 'kuhhandel'

class Game {
  constructor() {
    this.kh = null
  }

  setup({ players }) {
    this.kh = new Kuhhandel({ players })
  }
}

export default new Game()
