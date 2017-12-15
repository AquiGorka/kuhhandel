import React from 'react'
import './Board.css'

const Score = ({ players }) => players.map(player =>
  <div key={player.id}>{`Player ${player.id} score: ${player.score()}`}</div>)

const Animals = ({ players }) => players.map(({ id, animals}) =>
  <div key={id}>{'Player ' + id + ': ' + JSON.stringify(animals)}</div>)

const Auction = ({ game }) => [
  <div key="currentAuction">Current auction: {JSON.stringify(game.currentAuction)}</div>,
  <div key="highestOffer">Current auction highest offer: {JSON.stringify(game.highestBid)}</div>,
  <div key="canPay">Current auction can the player pay: {JSON.stringify(game.canThePlayerPay)}</div>,
  <div key="canPayFalse">Player money: {JSON.stringify(game.cannotPayPlayerMoney)}</div>
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
      <h2>🎴</h2>
      <span>x{game.stack.length}</span>
    </div>
    <h3 className="board__turn">👉 {game.turn}</h3>
  </header>
  <div className="board__event">
    <Draw game={game} />
    <CowTrade game={game} />
  </div>
  <Animals key="animals" players={game.players} />
  <Score key="score" players={game.players} />
</div>

export default Board
