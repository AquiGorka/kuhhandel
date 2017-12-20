import React from 'react'
import RemoteControl from './RemoteControl'
import './Controls.css'

const Controls = ({ game }) => <div className="controls">
  {game.players.map(player =>
    <RemoteControl
      key={`control-${player.id}`}
      id={player.id}
      turn={game.turn}
      status={game.status}
      canDraw={game.stack.length}
      onDraw={() => game.draw(player.id)}
      onAuctionStart={() => game.auctionStart(player.id)}
      onAuctionClose={() => game.auctionClose(player.id)}
      onAuctionOffer={value =>
        game.auctionOffer({ playerId: player.id, value })
      }
      canThePlayerPay={game.canThePlayerPay}
      onExchange={money => game.exchange({ money, playerId: player.id })}
      onExchangeAccept={() => game.exchangeAccept({ playerId: player.id })}
      money={player.money}
      onBuyBack={money => game.buyBack({ money, playerId: player.id })}
      onCowTradeStart={opts =>
        game.cowTradeStart({ ...opts, initiatorId: player.id })
      }
      cowTradeOtherPlayersXAnimals={game.players
        .filter(p => p.id !== player.id)
        .map(({ id, animals }) =>
          ({ id, animals: Array.from(new Set(animals)).filter(a =>
            player.animals.includes(a)) }))
        .reduce((p, c) => {
          if (c.animals.length) {
            p.push(c)
          }
          return p
        }, [])}
      onCowTradeRespond={money => {
        const getTotal = (p, c) => p + c.value
        const moneyTotal = money.reduce(getTotal, 0)
        const cowTradeTotal = game.currentCowTrade.initiator.money.reduce(getTotal, 0)
        if (moneyTotal === cowTradeTotal){
          alert('Tie!')
        }
        game.cowTradeRespond({ money, playerId: player.id })
      }}
    />)}
</div>

export default Controls
