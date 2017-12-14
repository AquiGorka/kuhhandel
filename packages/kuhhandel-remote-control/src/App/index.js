import React, { Component } from 'react'
import qmark from 'qmark'
import Peer from 'simple-peer'
import GoogleURL from 'google-url'
import promisify from 'es6-promisify'
import './App.css'

let peer = null
const googleUrl = new GoogleURL({ key: GOOGLE_APIKEY })
const shorten = promisify(googleUrl.shorten.bind(googleUrl))
const expand = promisify(googleUrl.expand.bind(googleUrl))

class App extends Component {

  state = { connected: false, error: false, id: null }

  async componentDidMount() {
    const signalData = atob(qmark('signalData'))
    if (!signalData) {
      this.setState({ error: 'No signal data was provided' })
      return
  }
    peer = new Peer({ trickle: false })
    peer.signal(signalData)
    peer.on('signal', this.onSignal)
  }

  render() {
    const { error, connected, id } = this.state

    if (error) {
      console.log(error);
      return <div>There has been an error, please try again.</div>
    }

    if (!connected && id) {
      return <div>{id}</div>
    }

    if (connected) {
      //
    }

    return <div>
      Remote Control
    </div>
  }

  onSignal = async data => {
    const shortUrl = await shorten(`${HOST_URL}?connect=${btoa(JSON.stringify(data))}`)
    this.setState({ id: shortUrl.substr(15) })
  }
}

export default App
