import React, { Component } from 'react'
import Setup from './Setup'
import Board from './Board'
import Controls from './Controls'
import Log from './Log'
import game from '../Game'

class App extends Component {

  state = { setupDone: false }

  componentDidMount() {
    game.on('setup', this.onSetup)
    game.on('update', this.rerender)
  }

  componentWillUnmount() {
    game.off('setup', this.onSetup)
    game.off('update', this.rerender)
  }

  render() {
    if (!this.state.setupDone) {
      return <Setup onSetup={game.setup} />
    }

    const { time } = this.state

    return [
      <Board key="board" game={game} time={time} />,
      <Controls key="controls" game={game} time={time} />,
      <Log key="log" game={game} time={time} />,
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
