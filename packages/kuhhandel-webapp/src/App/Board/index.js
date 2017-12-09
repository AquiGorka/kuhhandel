import React from 'react'

const Board = ({ game }) => [
  <div key="stack">Stack: {game.stack.length}</div>,
  <div key="currentDraw">{JSON.stringify(game.currentDraw, null, 2)}</div>,
  <div key="currentAuction">{JSON.stringify(game.currentAuction, null, 2)}</div>,
]

export default Board
