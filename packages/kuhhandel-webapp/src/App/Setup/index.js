import React, { Component } from 'react'
import { ANIMALS } from 'kuhhandel'
import './Setup.css'
import c1 from './connect-1.png'
import c2 from './connect-2.png'
import c3 from './connect-3.png'
import c4 from './connect-4.png'

class Setup extends Component {

  state = { players: [] }

  render() {
    const { players } = this.state

    return <div className="setup">
      <div className="setup__players">
        <button className="setup__start" key="start" onClick={this.onStart}>Start game</button>
        <form key="new" onSubmit={this.onAdd} ref={f => this.form = f}>
          <label>
            Type new player’s name and hit enter:
            <input className="setup__input" type="text" name="new" placeholder="Add player" />
          </label>
        </form>
        <ul className="setup__list" key="list">
          {players.map((name, index) =>
            <li className="setup__item" key={index}>
              <div>{name}</div>
              <button
                className="setup__remove"
                onClick={() =>
                  this.setState({ players: players.filter((e, i) => i !== index) })}
                >
                  x
                </button>
            </li>
          )}
        </ul>
      </div>
      <div key="instructions" className="setup__instructions">
        <h2 className="setup__header">Game Rules</h2>
        <h3>Players</h3>
        <div>Minimum of 2 players and up to 6 can play</div>
        <h3>Controllers</h3>
        <div>
          Use your smartphones as controllers.
          <br />
          Once you start the game use the input boxes at the bottom: <img src={c1} alt="Connection input boxes" style={{ height: 100, position: 'relative', top: 10 }} />
          <br />
          Enter the URL in your smartphone and then copy & paste the Id shown: <img src={c2} alt="Id from smartphone" style={{ height: 100, position: 'relative', top: 40 }} /> <img src={c3} alt="Use in input box" style={{ height: 35, position: 'relative', top: 15 }} />
          <br />
          You will get connected instantly: <img src={c4} alt="Connected" style={{ height: 50, position: 'relative', top: 10 }} />
        </div>
        <h3>Components</h3>
        <ul>
          <li>
            40 emoji cards: 10 x 4 emojis
            <ul>
              {Array.from(ANIMALS).map(([id, { emoji, value }]) => <li key={`emoji-${id}`}>{emoji} value {value}</li>)}
            </ul>
          </li>
          <li>Money cards: 0, 10, 20, 50, 100, 200, 500</li>
        </ul>
        <h3>Goal</h3>
        <div>
          By bidding, the players try to get as many (and preferably as expensive) animal quartets as possible. The winner is the player with the most points.
        </div>
        <h3>Flow of the game</h3>
        <div>
          After the starting player, the game continues to the left. The player whose turn it is has one of the following options:
          <ul>
            <li>Auction</li>
            <li>Cow trade</li>
          </ul>
          After this, the next player has his turn. He must also choose one of these two options. At the start of the game only the <b>Auction</b> is possible as there are no animals to do a <b>Cow Trade</b> with.
        </div>
        <h3>Auction</h3>
        <div>
          <div>
            The player who chooses <b>Auction</b> turns over the first card from the face down pile and auctions this card.
          </div>
          <h4>Animal card</h4>
          <div>
            There are 10 animal quartets in the game that yield points. Only a complete quartet will yield points. The value on each card is the value of the complete quartet. All other players (the auctioneer doesn’t participate!) make bids as they please. There is no turn order in bidding. Each new bid must exceed the preceding bid by at least 10. If the auctioneer can’t entice the players to bid anymore he closes the <b>Auction</b> and calls (for example) "30 going once, 30 going twice, 30 sold!".
            <br />
            If the sale is made, the auctioneer:
            <ul>
              <li>Gives the winning bidder the auctioned animal card. The winning bidder places this card well visible in front of him. He pays the amount he has bid to the auctioneer.</li>
              <li>Or the auctioneer uses his buy back right and keeps the card for himself. In this case he pays the amount of the winning bid to the winning bidder.</li>
              <li>Nobody bids? If there are no bids, the auctioneer must close the <b>Auction</b> by calling "zero going once, zero going twice, no sale". If still nobody bids the auctioneer gets to keep the animal card for free.</li>
            </ul>
          </div>
          <h4>Right to buy back</h4>
          <div>If the auctioneer wants to use his right to buy he can do so.</div>
          <h4>Not the exact amount of money</h4>
          <div>
            Money is never changed. If a player cannot exactly match the amount of his bid with his money cards, he must pay more and doesn’t get any money back. The same goes for the auctioneer if he chooses to execute his buying right.
          </div>
          <h4>Not enough money</h4>
          <div>
            If a player bids more than he can pay, he must prove this is the case by showing his cards. The <b>Auction</b> then starts over again. (With the same animal card)
          </div>
        </div>
        <h3>Donkey money</h3>
        <div>
          If the auctioneer turns over a donkey, the <b>Auction</b> is briefly interrupted. All players, including the auctioneer, receive a money card:
          <ul>
            <li>1st donkey: 50</li>
            <li>2nd donkey: 100</li>
            <li>3rd donkey: 200</li>
            <li>4th donkey: 500</li>
          </ul>
          After payment of these cards the <b>Auction</b> is resumed as normal and the donkey is auctioned off like any other animal card.
        </div>
        <h3>Cow Trade</h3>
        <div>
          If the auctioneer has animals that at least one other player also possesses, he may opt to offer a <b>Cow Trade</b> to one of these other players. This other player cannot refuse the <b>Cow Trade</b>. This <b>Cow Trade</b> is performed instead of the auction and follows these rules:
          <ol>
            <li>
              First, the player challenges an opponent. Then calls the animal to <b>Cow Trade</b> about. After that the player makes a bid by placing one or more cards face down on the table. It is allowed to include cards with value 0, only play cards with value 0 or even to place all your money cards!
            </li>
            <li>
              Counter offer: the challenged player places, also face down, a counter offer on the table. Both bids are exchanged and counted secretly. The player making the highest offer gets the animal from the other player.
            </li>
          </ol>
          <b>Important</b>: Everybody keeps the money received form the other player.
          <div>
            In case of a tie: Both players keep the exchanged money and no animals are exchanged.
            <br />
            In case both players have two animals of the same quartet, the <b>Cow Trade</b> must about both these animals. If a player has two or three animals and the other player has just one animal of this quartet, the trade will always be about one animal.
          </div>
        </div>
      </div>
    </div>
  }

  onAdd = e => {
    e.preventDefault()
    const { players } = this.state
    if (players.length < 5) {
      const newName = this.form.new.value
      if (players.includes(newName)) {
        alert('Please add unique player names')
      } else {
        this.setState({ players: players.concat(newName) })
      }
    }
    this.form.reset()
  }

  onStart = () => {
    this.props.onSetup({ players: this.state.players })
  }
}

export default Setup
