import React, { Component } from 'react'
import qmark from 'qmark'
import Peer from 'simple-peer'
import GoogleURL from 'google-url'
import promisify from 'es6-promisify'
import { Control } from 'kuhhandel-components'
import './App.css'

let peer = null
const googleUrl = new GoogleURL({ key: GOOGLE_APIKEY })
const shorten = promisify(googleUrl.shorten.bind(googleUrl))

class App extends Component {

  state = { connected: false, error: false, id: null, props: null }

  async componentDidMount() {
    const signalData = atob(qmark('signalData'))
    if (!signalData) {
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

    if (error) {
      console.log(error);
      return <div>There has been an error, please try again.</div>
    }

    if (!connected && id) {
      return <div>{id}</div>
    }

    if (props) {
      const { id } = props
      const overloadedProps = {
        ...props,
        onDraw: () => this.onSend({ method: 'draw', payload: id}),
        onAuctionStart: () => this.onSend({ method: 'auctionStart', payload: id }),
        onAuctionClose: () => this.onSend({ method: 'auctionClose'}),
        onAuctionOffer: value => this.onSend({ method: 'auctionOffer', payload: { playerId: id, value }}),
        onExchange: payload => this.onSend({ method: 'exchange', payload }),
        onBuyBack: payload => this.onSend({ method: 'buyBack', payload }),
        onCowTradeStart: opts => this.onSend({ method: 'cowTradeStart', payload: { ...opts, initiatorId: id }}),
        onCowTradeRespond: payload => this.onSend({ method: 'cowTradeRespond', payload }),
      }
      return <Control {...overloadedProps} />
    }

    return <div>
      Remote Control
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
