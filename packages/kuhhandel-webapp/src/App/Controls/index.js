import React, { Component } from 'react'
import { Control } from 'kuhhandel-components'

const Controls = ({ game }) => [
  <hr key="topSeparator" />,
  game.players.map(player => [
    <Control key={`control-${player.id}`}
      key={player.id}
      id={player.id}
      onDraw={() => game.draw(player.id)}
      onAuctionStart={() => game.auctionStart(player.id)}
      onAuctionClose={game.auctionClose}
      onAuctionOffer={value =>
        game.auctionOffer({ playerId: player.id, value })
      }
      onExchange={game.exchange}
      money={player.money}
      onBuyBack={game.buyBack}
      onCowTradeStart={opts =>
        game.cowTradeStart({ ...opts, initiatorId: player.id })
      }
      cowTradeOtherPlayersXAnimals={game.players
        .filter(p => p.id !== player.id)
        .map(({ id, animals }) =>
          ({ id, animals: Array.from(new Set(animals)).filter(a => player.animals.includes(a)) })
        )}
      onCowTradeRespond={game.cowTradeRespond}
    />,
    <hr key="separator" />,
  ]),
]
export default Controls
