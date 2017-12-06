import React, { Component } from 'react'
import Setup from './Setup'
import './App.css'

const Board = props => <div>Board</div>


class App extends Component {
  render() {
    return <Setup />
    return [
      <Board />,
      <div>Players</div>
    ]
  }
}

export default App
