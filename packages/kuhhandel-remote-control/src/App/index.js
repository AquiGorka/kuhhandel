import React, { Component } from 'react'
import qmark from 'qmark'
import Peer from 'simple-peer'
import GoogleURL from 'google-url'
import promisify from 'es6-promisify'
import { Control } from 'kuhhandel-components'
import AI from './AI'
import './App.css'

let peer = null
const googleUrl = new GoogleURL({ key: GOOGLE_APIKEY })
const shorten = promisify(googleUrl.shorten.bind(googleUrl))

class App extends Component {

  state = { connected: false, error: false, id: null, props: null }

  async componentDidMount() {
    let signalData
    try {
      signalData = atob(qmark('signalData'))
    } catch (err) {
      console.log('Error: ', err)
      this.setState({ error: 'No signal data was provided' })
      return
    }
    peer = new Peer({ trickle: false })
    peer.signal(signalData)
    peer.on('signal', this.onSignal)
    peer.on('data', data => this.onProps(JSON.parse(data)))
    peer.on('connect', () => this.setState({ connected: true }))
    peer.on('close', () => this.setState({ connected: false }))
  }

  render() {
    const { error, connected, id, props } = this.state

    if (props) {
      const { id } = props
      const overloadedProps = {
        ...props,
        onDraw: () => this.onSend({ method: 'onDraw' }),
        onAuctionStart: () => this.onSend({ method: 'onAuctionStart' }),
        onAuctionClose: () => this.onSend({ method: 'onAuctionClose'}),
        onAuctionOffer: payload => this.onSend({ method: 'onAuctionOffer', payload }),
        onExchange: payload => this.onSend({ method: 'onExchange', payload }),
        onExchangeAccept: () => this.onSend({ method: 'onExchangeAccept' }),
        onBuyBack: payload => this.onSend({ method: 'onBuyBack', payload }),
        onCowTradeStart: payload => this.onSend({ method: 'onCowTradeStart', payload }),
        onCowTradeRespond: payload => this.onSend({ method: 'onCowTradeRespond', payload }),
      }
      return <AI><Control {...overloadedProps} /></AI>
    }

    let content = "Remote Control"

    if (error) {
      content = <div className="remote__error">
        Please use the link provided in the game’s main window
      </div>
    }

    if (!connected && id) {
      content = [
        <label key="label">
          Use this Id to connect the game to your controller:
        </label>,
        <div key="id" className="remote__id">{id}</div>
      ]
    }

    return <div className="remote">
      {content}
    </div>
  }

  onProps = props => {
    this.setState({ props })
  }

  onSend = opts => {
    peer.send(JSON.stringify(opts))
  }

  onSignal = async data => {
    const shortUrl = await shorten(`${HOST_URL}?connect=${btoa(JSON.stringify(data))}`)
    this.setState({ id: shortUrl.substr(15) })
  }
}

export default App
