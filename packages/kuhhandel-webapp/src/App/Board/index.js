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

const Auction = ({ game }) => [
  <div key="currentAuction">Current auction: {JSON.stringify(game.currentAuction)}</div>,
  <div key="highestOffer">Current auction highest offer: {JSON.stringify(game.highestBid)}</div>,
  <div key="canPay">Current auction can the player pay: {JSON.stringify(game.canThePlayerPay)}</div>,
  <div key="canPayFalse">🤥 Player money: {JSON.stringify(game.cannotPayPlayerMoney)}</div>
]

const Draw = ({ game }) => [
  <div key="currentDraw">Current draw: {JSON.stringify(game.currentDraw)}</div>,
  <Auction key="auction" game={game} />,
]

const CowTrade = ({ game }) => <div key="cowTrade">Current cow trade: {JSON.stringify(game.currentCowTrade)}</div>

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
