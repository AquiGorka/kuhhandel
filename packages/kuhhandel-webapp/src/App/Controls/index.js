import React from 'react'

const Control = ({ game }) => [
  <button key="draw" onClick={() => game.draw()}>Draw</button>
]

const Controls = ({ game }) => game.players.map(player => <Control key={player.id} />)

export default Controls
