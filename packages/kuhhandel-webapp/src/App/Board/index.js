import React from 'react'

const Animals = ({ players }) => players.map(({ id, animals}) => 
  <div key={id}>{'Player ' + id + ': ' + JSON.stringify(animals)}</div>)

const Board = ({ game }) => [
  <div key="stack">Stack: {game.stack.length}</div>,
  <div key="currentDraw">Current draw: {JSON.stringify(game.currentDraw)}</div>,
  <div key="currentAuction">Current auction: {JSON.stringify(game.currentAuction)}</div>,
  <div key="highestOffer">Current auction highest offer: {JSON.stringify(game.highestBid)}</div>,
  <div key="canPay">Current auction can the player pay: {JSON.stringify(game.canThePlayerPay)}</div>,
  <div key="canPayFalse">Player money: {JSON.stringify(game.cannotPayPlayerMoney)}</div>,
  <Animals key="animals" players={game.players} />,
  <div key="cowTrade">Current cow trade: {JSON.stringify(game.currentCowTrade)}</div>
]

export default Board
