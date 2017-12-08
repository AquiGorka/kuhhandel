import React, { Component } from 'react'
import Setup from './Setup'
import Board from './Board'
import Controls from './Controls'
import game from '../Game'
import './App.css'

class App extends Component {

  componentDidMount() {
    game.on('setup', this.rerender)
  }

  componentWillUnmount(){
    game.off('setup', this.rerender)
  }

  render() {
    if (!game.kh) {
      return <Setup onSetup={this.setup} />
    }

    return [
      <Board key="board" game={game} />,
      <Controls key="controls" game={game} />
    ]
  }

  rerender = () => {
    this.setState({ time: Date.now() })
  }

  setup = opts => {
    game.setup(opts)
  }
}

export default App
