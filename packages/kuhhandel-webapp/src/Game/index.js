import Kuhhandel from 'kuhhandel'
import { EventEmitter } from 'events'

class Game extends EventEmitter {
  constructor() {
    super()
    this.kh = null
  }

  setup({ players }) {
    this.kh = new Kuhhandel({ players })
    this.emit('setup')
  }
}

export default new Game()
