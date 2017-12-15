import React from 'react'
import RemoteControl from './RemoteControl'

const Controls = ({ game }) => [
  <hr key="topSeparator" />,
  game.players.map(player => [
    <RemoteControl
      key={`control-${player.id}`}
      id={player.id}
      onDraw={() => game.draw(player.id)}
      onAuctionStart={() => game.auctionStart(player.id)}
      onAuctionClose={() => game.auctionClose(player.id)}
      onAuctionOffer={value =>
        game.auctionOffer({ playerId: player.id, value })
      }
      onExchange={money => game.exchange({ money, playerId: player.id })}
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
