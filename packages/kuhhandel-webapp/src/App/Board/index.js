import React from 'react'

const Board = ({ game }) => [
  <div key="stack">Stack: {game.stack.length}</div>,
  <div key="lastDraw">{JSON.stringify(game.lastDraw, null, 2)}</div>
]

export default Board
