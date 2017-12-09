import React, { Component } from 'react'

class AuctionOffer extends Component {
  render() {
    return (
      <form onSubmit={this.onSubmit} ref={f => (this.form = f)}>
        <input name="offer" type="number" defaultValue="10" step="10" />
      </form>
    )
  }

  onSubmit = e => {
    e.preventDefault()
    this.props.onAuctionOffer(this.form.elements.offer.value)
  }
}

class SelectMoney extends Component {
  render() {
    return <form ref={f => this.form = f} onSubmit={this.onSubmit}>
      {this.props.money.map((card, index) =>
        <label key={index}>
          {JSON.stringify(card)}<input name={index} type="checkbox" value={index} />
        </label>
      )}
      <button type="submit">{this.props.label}</button>
    </form>
  }

  onSubmit = e => {
    e.preventDefault()
    const money = this.props.money.reduce((p, c, index) => {
      if (this.form.elements[index].checked) {
        p.push(c)
      }
      return p
    }, [])
    this.props.onSubmit(money)
    this.form.reset()
  }
}

const Control = ({
  onDraw,
  onAuctionStart,
  onAuctionClose,
  onAuctionOffer,
  onExchange,
  money,
  onBuyBack,
}) => [
  <button key="draw" onClick={onDraw}>Draw</button>,
  <button key="auctionStart" onClick={onAuctionStart}>Start auction</button>,
  <button key="auctionClose" onClick={onAuctionClose}>Close auction</button>,
  <SelectMoney key="exchange" onSubmit={onExchange} money={money} label="Exchange" />,
  <SelectMoney key="buyback" onSubmit={onBuyBack} money={money} label="Buy back" />,
  <AuctionOffer key="auctionOffer" onAuctionOffer={onAuctionOffer} />,
]

const Controls = ({ game }) =>
  game.players.map(player =>
    <Control
      key={player.id}
      onDraw={() => game.draw(player.id)}
      onAuctionStart={() => game.auctionStart(player.id)}
      onAuctionClose={game.auctionClose}
      onAuctionOffer={value =>
        game.auctionOffer({ playerId: player.id, value })
      }
      onExchange={game.exchange}
      money={player.money}
      onBuyBack={game.buyBack}
    />
  )

export default Controls
