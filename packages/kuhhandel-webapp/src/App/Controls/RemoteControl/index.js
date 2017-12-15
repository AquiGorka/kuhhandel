import React, { Component } from 'react'
import { Control } from 'kuhhandel-components'
import Peer from 'simple-peer'
import GoogleURL from 'google-url'
import promisify from 'es6-promisify'

const googleUrl = new GoogleURL({ key: GOOGLE_APIKEY })
const shorten = promisify(googleUrl.shorten.bind(googleUrl))
const expand = promisify(googleUrl.expand.bind(googleUrl))
const peerConfig = { initiator: true, trickle: false }

class Connect extends Component {
  render() {
    return <form ref={f => this.form = f} onSubmit={this.onSubmit}>
      <input type="text" name="id" placeholder="Id" />
    </form>
  }

  onSubmit = async e => {
    e.preventDefault()
    const id = this.form.id.value
    const longUrl = await expand(`https://goo.gl/${id}`)
    const data = JSON.parse(atob(longUrl.split('?connect=')[1]))
    this.props.onSubmit(data)
  }
}

class Remote extends Component {

  state = {
    connected: false,
    link: '',
    peer: new Peer(peerConfig)
  }

  initPeer = () => {
    const { peer } = this.state
    peer.once('signal', this.onSignal)
    peer.once('connect', () => this.onSendProps(this.props))
    peer.on('connect', () => this.setState({ connected: true }))
    peer.on('data', data => this.onData(JSON.parse(data)))
    peer.on('close', () => this.setState({ connected: false, peer: new Peer(peerConfig) }, this.initPeer))
  }

  componentDidMount() {
    this.initPeer()
  }

  componentWillReceiveProps(nextProps) {
    this.onSendProps(nextProps)
  }

  render() {
    const { peer, ...rest } = this.state
    return [
      <div key="data">{JSON.stringify(rest)}</div>,
      <Connect key="connect" onSubmit={this.onConnect} />
    ]
  }

  onConnect = data => {
    this.state.peer.signal(data)
  }

  onData = data => {
    this.props[data.method](data.payload)
  }

  onSendProps = props => {
    if (this.state.peer.connected) {
      this.state.peer.send(JSON.stringify(props))
    }
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
