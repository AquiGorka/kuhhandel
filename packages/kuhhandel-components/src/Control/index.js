import React, { Component } from 'react'
import './Control.css'

const Button = ({ children, ...props}) => <button {...props} className="control__button">{children}</button>

class CowTrade extends Component {
  render() {
    const { money, cowTradeOtherPlayersXAnimals } = this.props
    return [
      <SelectMoney
        key="money"
        className="cowTrade__money"
        itemClassName="cowTrade__money_item"
        onSubmit={this.onSubmit}
        money={money}
        label="Cow Trade"
      />,
      <form key="form" ref={f => (this.form = f)}>
        <ul className="cowTrade__players">
        {cowTradeOtherPlayersXAnimals.map(({ id, animals }) =>
          <li className="cowTrade__players_item" key={`player-${id}-animals`}>
            <h4 key="playerId">{id}</h4>
            <ul className="cowTrade__player">
              {animals.map(({ animal, value }, index) =>
                <li className="cowTrade__player_item" key={`player-${id}-animals-${index}`}>
                  <label>
                    {animal}
                    {value}
                    <input
                      type="radio"
                      name="cowTrade"
                      value={JSON.stringify({ animal: { animal, value }, id })}
                    />
                  </label>
                </li>
              )}
            </ul>
          </li>
        )}
        </ul>
      </form>,
    ]
  }

  onSubmit = money => {
    const { id, animal } = JSON.parse(this.form.cowTrade.value)
    this.props.onCowTradeStart({ money, challengedId: id, animal })
  }
}

class AuctionOffer extends Component {
  render() {
    return (
      <form className="offer" onSubmit={this.onSubmit} ref={f => (this.form = f)}>
        <input
          className="offer__tel"
          name="offer"
          type="tel"
          pattern="\d*"
          defaultValue="10"
        />
        <button type="submit" className="offer__submit">Offer</button>
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
    const { label, className, itemClassName, money } = this.props
    return (
      <form ref={f => (this.form = f)} onSubmit={this.onSubmit} className={className}>
        <Button type="submit">{label}</Button>
        <ul>
        {money.map(({ value }, index) =>
          <li key={index} className={itemClassName}>
            <label>
              {value}
              <input name={`money-${index}`} type="checkbox" value={index} />
            </label>
          </li>
        )}
        </ul>
      </form>
    )
  }

  onSubmit = e => {
    e.preventDefault()
    const money = this.props.money.reduce((p, c, index) => {
      if (this.form[`money-${index}`].checked) {
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
  onExchangeAccept,
  money,
  onBuyBack,
  onCowTradeStart,
  cowTradeOtherPlayersXAnimals,
  onCowTradeRespond,
  turn,
  status: { op, involved },
  canThePlayerPay,
  canDraw,
}) => [
  <h2 className="control__id" key={id}>{id}</h2>,
  <ul key="money" className="control__money">
    {money.map(({ value }, index) => <li className="control__money__item" key={`money-${index}-${value}`}>{value}</li>)}
  </ul>,
  turn === id && op === '' && !!canDraw
    && <Button key="draw" onClick={onDraw}>
        Draw
      </Button>,
  turn === id && (op === 'draw' || (op === 'auctionClose' && !canThePlayerPay))
    && <Button key="auctionStart" onClick={onAuctionStart}>
      Start auction
    </Button>,
  turn === id && op === 'auctionStart'
    && <Button key="auctionClose" onClick={onAuctionClose}>
      Close auction
    </Button>,
  op === 'auctionClose' && involved.includes(id)
    && <SelectMoney
      key="exchange"
      className="exchange__money"
      itemClassName="exchange__money_item"
      onSubmit={onExchange}
      money={money}
      label="Exchange"
    />,
  turn === id && op === 'auctionExchange'
    && <Button key="auctionExchangeAccept" onClick={onExchangeAccept}>
      Accept exchange
    </Button>,
  turn === id && op === 'auctionExchange'
    && <SelectMoney
      key="buyback"
      className="buyback__money"
      itemClassName="buyback__money_item"
      onSubmit={onBuyBack}
      money={money}
      label="Buy back"
    />,
  turn !== id && op === 'auctionStart'
    && <AuctionOffer key="auctionOffer" onAuctionOffer={onAuctionOffer} />,
  turn === id && !!cowTradeOtherPlayersXAnimals.length && op === ''
    && <CowTrade
      key="cowTrade"
      onCowTradeStart={onCowTradeStart}
      money={money}
      cowTradeOtherPlayersXAnimals={cowTradeOtherPlayersXAnimals}
    />,
  op === 'cowTradeStart' && involved.includes(id)
    && <SelectMoney
      key="cowTradeRespond"
      className="cowTradeRespond__money"
      itemClassName="cowTradeRespond__money_item"
      onSubmit={onCowTradeRespond}
      money={money}
      label="Respond Cow Trade"
    />,
]

export default Control
