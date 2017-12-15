import React from 'react'
import './Board.css'

const Animals = ({ animals }) => <ul className="animals">
  {Array.from(new Set(animals)).map((animal, index) => {
    const count = animals.filter(a => a === animal).length
    return <li key={`animal-${index}`} className="animals__item">
      <div className="animal__label" title={animal.value}>{animal.animal}</div>
      <div className="animal__count">{count === 1 ? '' : `x${count}`}</div>
    </li>
  })}
</ul>

const Players = ({ players }) => <ul className="players">
  {players.map((player) =>
    <li key={player.id} className="players__item">
      <Animals animals={player.animals} />
      <div>{player.id}</div>
      <div>{player.score() ? `😎 ${player.score()}` : '🙁'}</div>
    </li>
  )}
</ul>

const Auction = ({
  game: {
    currentAuction,
    highestBid,
    canThePlayerPay,
    cannotPayPlayerMoney,
    status: { op }
  }
}) => [
  <div className="event__auction" key="currentAuctionWrap">
    <h4 key="currentAuction">Auction</h4>
    <div key="highestOffer">
      <div>Highest offer:</div>
      {highestBid && <div>{highestBid.playerId} - {highestBid.value}</div>}
    </div>
  </div>,
  op === 'auctionClose' && !canThePlayerPay
    && <div key="canPayFalse" className="auction__lie">
      <div className="auction__liar">🤥</div>
      <ul className="auction__lieMoney">{cannotPayPlayerMoney.sort((a, b) => b.value - a.value).map(({ value }, index) =>
        <li className="auction__lieMoney_item" key={`card-${index}-${value}`}>{value}</li>
      )}</ul>
    </div>
]

const Draw = ({ game }) => {
  const { status: { op }, currentDraw } = game
  return [
    op !== 'cowTrade' && op !== ''
      && <div className="event__draw" key="draw">
        <h4>Draw</h4>
        <div className="draw__animal">{currentDraw.animal}</div>
        <div>Value {currentDraw.value}</div>
      </div>,
    (op === 'auctionStart' || op === 'auctionExchange' || op === 'auctionClose')
      && <Auction key="auction" game={game} />,
  ]
}

const CowTrade = ({ game }) => game.status.op === 'cowTradeStart' 
  && <div key="cowTrade">Current cow trade: {JSON.stringify(game.currentCowTrade)}</div>

const Board = ({ game }) => <div className="board">
  <h1>Emoji-trade or 🐮 🤝 💸 </h1>
  <header className="board__header">
    <div className="board__stack">
      <h2 className="board__deck board__deck--big">🎴</h2>
      <span className="board__left">x{game.stack.length}</span>
    </div>
    <h3 className="board__turn">👉 {game.turn}</h3>
  </header>
  <div className="board__event">
    <Draw game={game} />
    <CowTrade game={game} />
  </div>
  <Players players={game.players} />
</div>

export default Board
