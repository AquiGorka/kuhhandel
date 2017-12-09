import React from 'react'

const Board = ({ game }) => [
  <div key="stack">Stack: {game.stack.length}</div>,
  <div key="currentDraw">Current draw: {JSON.stringify(game.currentDraw)}</div>,
  <div key="currentAuction">Current auction: {JSON.stringify(game.currentAuction)}</div>,
]

export default Board
