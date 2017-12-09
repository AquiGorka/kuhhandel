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

const Control = ({ onDraw, onAuction, onAuctionOffer }) => [
  <button key="draw" onClick={onDraw}>Draw</button>,
  <button key="auction" onClick={onAuction}>Start auction</button>,
  <AuctionOffer key="auctionOffer" onAuctionOffer={onAuctionOffer} />
]

const Controls = ({ game }) =>
  game.players.map(player => (
    <Control
      key={player.id}
      onDraw={() => game.draw(player.id)}
      onAuction={() => game.auction(player.id)}
      onAuctionOffer={value => game.auctionOffer({ playerId: player.id, value })}
    />
  ))

export default Controls
