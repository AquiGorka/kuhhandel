import React, { Component } from 'react'
import Setup from './Setup'
import Board from './Board'
import Controls from './Controls'
import game from '../Game'
import './App.css'

class App extends Component {

  state = { doneSetup: false }

  render() {
    if (!this.state.doneSetup) {
      return <Setup onSetup={this.setup} />
    }

    return [
      <Board key="board" game={game} />,
      <Controls key="controls" game={game} />
    ]
  }

  setup = opts => {
    game.setup(opts)
    this.setState({ doneSetup: true })
  }
}

export default App
