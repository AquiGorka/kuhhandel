import React from 'react'

const Control = ({ onDraw, onAuction }) => [
  <button key="draw" onClick={onDraw}>Draw</button>,
  <button key="auction" onClick={onAuction}>Start auction</button>,
]

const Controls = ({ game }) =>
  game.players.map(player => (
    <Control
      key={player.id}
      onDraw={() => game.draw(player.id)}
      onAuction={() => game.auction(player.id)}
      onAuctionOffer={qty => game.auctionOffer(player.id, qty)}
    />
  ))

export default Controls
