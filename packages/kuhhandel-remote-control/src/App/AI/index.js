import React, { Component } from 'react'
import qmark from 'qmark'

class AI extends Component {

  state = { ai: false, interval: null }

  componentDidMount() {
    if(qmark('ai')) {
      const interval = setInterval(this.play, 100)
      this.setState({ ai: true, interval })
    }
  }

  componentDidUnmount() {
    clearInterval(this.state.interval)
  }

  render() {
    console.log(this.state)
    if (this.state.ai) {
      return <div>AI took over</div>
    }

    return this.props.children
  }

  play = () => {
    const { id, turn, money, status } = this.props
    console.log(1, this.props)
    if (id === turn) {
      // this player's turn
      // draw
      // close offer
      // cow trade
      // which player
      // which animal
      // which cards
    } else {
      // not this player's turn
      // draw
      // bid
      // respond cow trade
      // which cards
    }
  }
}

export default AI
