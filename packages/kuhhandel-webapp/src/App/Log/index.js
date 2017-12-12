import React, { Component } from 'react'
import { KH } from '../../Game'
import localForage from 'localforage'

class Log extends Component {

  state = { list: [] }

  componentDidMount() {
    this.props.game.on('update', this.fetch)
  }

  render() {
    const { list } = this.state

    return [
      <div key="title">Log</div>,
      <button key="reset" onClick={this.onReset}>Reset</button>,
      <ul key="list">
        {list.concat().reverse().map((action, index) =>
          <li key={index}>
            <div>{list.length - index}</div>
            <div>{action.method}</div>
            <div>{JSON.stringify(action.payload)}</div>
            {index === 0 && <button onClick={this.onRemove}>x</button>}
          </li>
        )}
      </ul>
    ]
  }

  fetch = () => {
    // updates are sent before writing to log
    // so we need to wait sometime before fetching
    setTimeout(async () => {
      const list = await localForage.getItem(KH) || []
      this.setState({ list })
    }, 500)
  }

  onReload = () => {
    window.location.reload()
  }

  onRemove = async () => {
    const list = this.state.list.slice(0, -1)
    await localForage.setItem(KH, list)
    this.onReload()
  }

  onReset = () => {
    localForage.setItem(KH, [])
    this.onReload()
  }
}

export default Log
