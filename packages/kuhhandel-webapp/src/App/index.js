import React, { Component } from 'react'
import Setup from './Setup'
import Board from './Board'
import Controls from './Controls'
import game from '../Game'
import './App.css'

class App extends Component {

  state = { setupDone: false }

  componentDidMount() {
    game.on('setup', this.onSetup)
    game.on('draw', this.rerender)
    game.on('auction', this.rerender)
    game.on('auctionOffer', this.rerender)
  }

  componentWillUnmount() {
    game.off('setup', this.onSetup)
    game.off('draw', this.rerender)
    game.off('auction', this.rerender)
    game.off('auctionOffer', this.rerender)
  }

  render() {
    if (!this.state.setupDone) {
      return <Setup onSetup={game.setup} />
    }

    return [
      <Board key="board" game={game} />,
      <Controls key="controls" game={game} />
    ]
  }

  rerender = () => {
    this.setState({ time: Date.now() })
  }

  onSetup = () => {
    this.setState({ setupDone: true })
  }
}

export default App
