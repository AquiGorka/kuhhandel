import React, { Component } from 'react'
import { Control } from 'kuhhandel-components'
import Peer from 'simple-peer'
import GoogleURL from 'google-url'
import promisify from 'es6-promisify'

let peer = null
const googleUrl = new GoogleURL({ key: GOOGLE_APIKEY })
const shorten = promisify(googleUrl.shorten.bind(googleUrl))

class Remote extends Component {

  state = { connected: false, link: '' }

  componentDidMount() {
    peer = new Peer({ initiator: true, trickle: false })
    peer.once('signal', this.onSignal)
    peer.on('connect', () => this.setState({ connected: true }))
    //peer.on('data', data => this.emit('data', JSON.parse(data)))
    peer.on('close', () => this.setState({ connected: false }))
  }

  render() {
    return <div>{JSON.stringify(this.state)}</div>
  }

  onSignal = async signalData => {
    const link = await shorten(`${REMOTE_CONTROL_URL}?signalData=${btoa(JSON.stringify(signalData))}`)
    this.setState({ link })
  }
}

const RemoteControl = props => [
  <Remote key="remote" {...props} />,
  <Control key="local" {...props} />,
]

export default RemoteControl
