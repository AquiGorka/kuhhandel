import React, { Component } from 'react'
import { KH } from '../../Game'
import localForage from 'localforage'

class Log extends Component {

  state = { list: [] }

  async componentDidMount() {
    const list = await localForage.getItem(KH) || []
    this.setState({ list })
  }

  render() {
    return [
      <div key="title">Log</div>,
      <button key="reset" onClick={this.onReset}>Reset</button>,
      <ul key="list">
        {this.state.list.map((action, index) => {
          return <li key={index}>Action</li>
        })}
      </ul>
    ]
  }

  onReset = () => {
    localForage.setItem(KH, [])
    this.onReload()
  }

  onReload = () => {
    window.location.reload()
  }
}

export default Log
