import React, { Component } from 'react'

class Setup extends Component {
  render() {
    return <form onSubmit={this.onSubmit} ref={f => this.form = f}>
      <input type="text" name="players" placeholder="How many players" />
    </form>
  }

  onSubmit = e => {
    e.preventDefault()
    const num = parseInt(this.form.players.value, 10)
    const players = new Array(num).fill(0).map((e, i) => i)
    this.props.onSetup({ players })
  }
}

export default Setup
