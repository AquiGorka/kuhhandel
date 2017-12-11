import React, { Component } from 'react'

class CowTrade extends Component {
  render() {
    const { money, cowTradeOtherPlayersXAnimals } = this.props
    return [
      <form key="form" ref={f => (this.form = f)}>
        {cowTradeOtherPlayersXAnimals.map(({ id, animals }) => {
          return [
            <div key="playerId">Player {id}</div>,
            animals.map((a, index) =>
              <label key={`option-${id}-${index}`}>
                {JSON.stringify(a)}
                <input type="radio" name="cowTrade" value={JSON.stringify({ ...a, id })} />
              </label>
            )
          ]
        })}
      </form>,
      <SelectMoney
        key="money"
        onSubmit={this.onSubmit}
        money={money}
        label="Cow Trade"
      />,
    ]
  }

  onSubmit = money => {
    const { id, ...animal } = JSON.parse(this.form.elements.cowTrade.value)
    this.props.onCowTradeStart({ money, challengedId: id, animal })
  }
}

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
    return (
      <form ref={f => (this.form = f)} onSubmit={this.onSubmit}>
        {this.props.money.map((card, index) => (
          <label key={index}>
            {JSON.stringify(card)}
            <input name={index} type="checkbox" value={index} />
          </label>
        ))}
        <button type="submit">{this.props.label}</button>
      </form>
    )
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
  id,
  onDraw,
  onAuctionStart,
  onAuctionClose,
  onAuctionOffer,
  onExchange,
  money,
  onBuyBack,
  onCowTradeStart,
  cowTradeOtherPlayersXAnimals,
  onCowTradeRespond,
}) => [
  <div key={id}>{`Player Id: ${id}`}</div>,
  <button key="draw" onClick={onDraw}>
    Draw
  </button>,
  <button key="auctionStart" onClick={onAuctionStart}>
    Start auction
  </button>,
  <button key="auctionClose" onClick={onAuctionClose}>
    Close auction
  </button>,
  <SelectMoney
    key="exchange"
    onSubmit={onExchange}
    money={money}
    label="Exchange"
  />,
  <SelectMoney
    key="buyback"
    onSubmit={onBuyBack}
    money={money}
    label="Buy back"
  />,
  <AuctionOffer key="auctionOffer" onAuctionOffer={onAuctionOffer} />,
  <CowTrade
    key="cowTrade"
    onCowTradeStart={onCowTradeStart}
    money={money}
    cowTradeOtherPlayersXAnimals={cowTradeOtherPlayersXAnimals}
  />,
  <SelectMoney
    key="cowTradeRespond"
    onSubmit={onCowTradeRespond}
    money={money}
    label="Respond Cow Trade"
  />,
]

const Controls = ({ game }) =>
  game.players.map(player => [
    <Control key={`control-${player.id}`}
      key={player.id}
      id={player.id}
      onDraw={() => game.draw(player.id)}
      onAuctionStart={() => game.auctionStart(player.id)}
      onAuctionClose={game.auctionClose}
      onAuctionOffer={value =>
        game.auctionOffer({ playerId: player.id, value })
      }
      onExchange={game.exchange}
      money={player.money}
      onBuyBack={game.buyBack}
      onCowTradeStart={opts =>
        game.cowTradeStart({ ...opts, initiatorId: player.id })
      }
      cowTradeOtherPlayersXAnimals={game.players
        .filter(p => p.id !== player.id)
        .map(({ id, animals }) =>
          ({ id, animals: animals.filter(a => player.animals.includes(a)) })
        )}
      onCowTradeRespond={game.cowTradeRespond}
    />,
    <hr key="separator" />,
  ])

export default Controls
