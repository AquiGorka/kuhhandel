import React from 'react'
import './Board.css'

const Animals = ({ animals }) => {
  const uniqueAnimals = animals.reduce((p, c) => {
    if (!p.find(i => i.value === c.value)) {
      p.push(c)
    }
    return p
  }, [])
  return <ul className="animals">
    {uniqueAnimals.map((animal, index) => {
      const count = animals.filter(a => a.value === animal.value).length
      return <li key={`animal-${index}`} className="animals__item">
        <div className="animal__label" title={animal.value}>{animal.animal}</div>
        <div className="animal__count">{count === 1 ? '' : `x${count}`}</div>
      </li>
    })}
  </ul>
}

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
    op !== 'cowTradeStart' && op !== ''
      && <div className="event__draw" key="draw">
        <h4>Draw</h4>
        <div className="draw__animal">{currentDraw.animal}</div>
        <div>Value {currentDraw.value}</div>
      </div>,
    (op === 'auctionStart' || op === 'auctionExchange' || op === 'auctionClose')
      && <Auction key="auction" game={game} />,
  ]
}

const CowTrade = ({ game: { status: { op }, currentCowTrade: { initiator, challenged, animal: { animal }}}}) => op === 'cowTradeStart' 
  && <div key="cowTrade">
    <h4>Cow trade</h4>
    <div><span className="cowTrade__initiator">{initiator.playerId}</span> challenges <span className="cowTrade__challenged">{challenged.playerId}</span> for <span className="cowTrade__animal">{animal}</span> with <span className="cowTrade__money">{initiator.money.length}</span> money cards</div>
  </div>

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
    {game.currentCowTrade && <CowTrade game={game} />}
  </div>
  <Players players={game.players} />
  <button className="board__reset" onClick={() => {
    if (window.confirm('All progress will be lost. Are you sure you want to start a new game?')) {
      game.reset()
    }
  }}>New Game</button>
</div>

export default Board
