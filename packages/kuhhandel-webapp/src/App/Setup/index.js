import React, { Component } from 'react'

class Setup extends Component {
  render() {
    return <form onSubmit={this.onSubmit} ref={f => this.form = f}>
      <input type="text" name="players" placeholder="How many players" />
    </form>
  }

  onSubmit = e => {
    e.preventDefault()
    this.props.onSetup({ players: this.form.players.value })
  }
}

export default Setup
