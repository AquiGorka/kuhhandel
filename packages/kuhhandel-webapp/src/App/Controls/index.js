import React from 'react'

const Control = ({ onDraw }) => [
  <button key="draw" onClick={onDraw}>
    Draw
  </button>,
]

const Controls = ({ game }) =>
  game.players.map(player => <Control key={player.id} onDraw={game.draw} />)

export default Controls
