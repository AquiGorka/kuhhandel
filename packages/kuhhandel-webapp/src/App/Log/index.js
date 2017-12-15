import React, { Component } from 'react'
import { KH } from '../../Game'
import localForage from 'localforage'
import './Log.css'

class Log extends Component {

  state = { list: [] }

  componentDidMount() {
    this.props.game.on('update', this.fetch)
    window.reset = this.onReset
    window.undo = this.onUndo
  }

  render() {
    const { list } = this.state

    return <div className="log">
      <div key="title">Log</div>
      <button key="reset" onClick={this.onReset}>Reset</button>
      <button key="undo" onClick={this.onUndo}>Undo last action</button>
      <ul key="list">
        {list.concat().reverse().map((action, index) =>
          <li key={index}>
            <div>{list.length - index}</div>
            <div>{action.method}</div>
            <div>{JSON.stringify(action.payload)}</div>
          </li>
        )}
      </ul>
    </div>
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

  onUndo = async () => {
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
