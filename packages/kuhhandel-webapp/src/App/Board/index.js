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
  op === 'auctionStart' && <div key="currentAuction">Current auction: {JSON.stringify(currentAuction)}</div>,
  <div key="highestOffer">Current auction highest offer: {JSON.stringify(highestBid)}</div>,
  <div key="canPay">Current auction can the player pay: {JSON.stringify(canThePlayerPay)}</div>,
  <div key="canPayFalse">🤥 Player money: {JSON.stringify(cannotPayPlayerMoney)}</div>
]

const Draw = ({ game }) => {
  const { status: { op }} = game
  return [
    op === 'draw' && <div key="currentDraw">Current draw: {JSON.stringify(game.currentDraw)}</div>,
    (op === 'auctionStart' || op === 'auctionExchange' || op === 'auctionClose') && <Auction key="auction" game={game} />,
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
