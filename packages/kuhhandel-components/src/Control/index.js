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
    const { id, ...animal } = JSON.parse(this.form.cowTrade.value)
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
  turn,
  status,
}) => [
  <div key={id}>{`Player Id: ${id}`}</div>,
  <div key="money">Money: {JSON.stringify(money)}</div>,
  turn === id && status.op === '' && <button key="draw" onClick={onDraw}>
    Draw
  </button>,
  turn === id && status.op === 'draw' && <button key="auctionStart" onClick={onAuctionStart}>
    Start auction
  </button>,
  turn === id && status.op === 'auctionStart' && <button key="auctionClose" onClick={onAuctionClose}>
    Close auction
  </button>,
  status.op === 'auctionClose' && status.involved.includes(id) && <SelectMoney
    key="exchange"
    onSubmit={onExchange}
    money={money}
    label="Exchange"
  />,
  turn === id && status.op === 'auctionClose' && <SelectMoney
    key="buyback"
    onSubmit={onBuyBack}
    money={money}
    label="Buy back"
  />,
  status.op === 'auctionStart' && <AuctionOffer key="auctionOffer" onAuctionOffer={onAuctionOffer} />,
  turn === id && cowTradeOtherPlayersXAnimals.length && status.op === '' && <CowTrade
    key="cowTrade"
    onCowTradeStart={onCowTradeStart}
    money={money}
    cowTradeOtherPlayersXAnimals={cowTradeOtherPlayersXAnimals}
  />,
  status.op === 'cowTradeStart' && status.involved.includes(id) && <SelectMoney
    key="cowTradeRespond"
    onSubmit={onCowTradeRespond}
    money={money}
    label="Respond Cow Trade"
  />,
]

export default Control
