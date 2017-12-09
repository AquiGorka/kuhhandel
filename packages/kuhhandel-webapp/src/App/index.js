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
  }

  componentWillUnmount(){
    game.off('setup', this.onSetup)
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

  onSetup = () => {
    this.setState({ setupDone: true })
  }
}

export default App
