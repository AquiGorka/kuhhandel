import React, { Component } from 'react'

class Setup extends Component {

  state = { players: [] }

  render() {
    const { players } = this.state

    return [
      <button key="start" onClick={this.onStart}>Start game</button>,
      <form key="new" onSubmit={this.onAdd} ref={f => this.form = f}>
        <input type="text" name="new" placeholder="Player name" />
      </form>,
      <ul key="list">
        {players.map((name, index) =>
          <li key={index}>
            <div>{name}</div>
            <button onClick={() => this.setState({ players: players.filter((e, i) => i !== index) })}>Remove</button>
          </li>
        )}
      </ul>,
    ]
  }

  onAdd = e => {
    e.preventDefault()
    this.setState({ players: this.state.players.concat(this.form.new.value) })
    this.form.reset()
  }

  onStart = () => {
    this.props.onSetup({ players: this.state.players })
  }
}

export default Setup
