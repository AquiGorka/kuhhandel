import React, { Component } from 'react'
import './App.css'

const Board = props => <div>Board</div>

class App extends Component {
  render() {
    return [
      <Board />,
      <div>Players</div>
    ]
  }
}

export default App
