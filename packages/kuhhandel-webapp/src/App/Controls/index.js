import React, { Component } from 'react'

class AuctionOffer extends Component {
  render() {
    return <form onSubmit={this.onSubmit} ref={f => this.form = f}>
      <input name="offer" type="number" defaultValue="10" step="10" />
    </form>
  }

  onSubmit = e => {
    e.preventDefault()
    this.props.onAuctionOffer(this.form.elements.offer.value)
  }
}

const Control = ({ onDraw, onAuctionStart, onAuctionClose, onAuctionOffer }) => [
  <button key="draw" onClick={onDraw}>Draw</button>,
  <button key="auctionStart" onClick={onAuctionStart}>Start auction</button>,
  <button key="auctionClose" onClick={onAuctionClose}>Close auction</button>,
  <AuctionOffer key="auctionOffer" onAuctionOffer={onAuctionOffer} />
]

const Controls = ({ game }) =>
  game.players.map(player => (
    <Control
      key={player.id}
      onDraw={() => game.draw(player.id)}
      onAuctionStart={() => game.auctionStart(player.id)}
      onAuctionClose={game.auctionClose}
      onAuctionOffer={value => game.auctionOffer({ playerId: player.id, value })}
    />
  ))

export default Controls
