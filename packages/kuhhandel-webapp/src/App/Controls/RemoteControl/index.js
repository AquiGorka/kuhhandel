import React, { Component } from 'react'
import { Control } from 'kuhhandel-components'
import Peer from 'simple-peer'
import GoogleURL from 'google-url'
import promisify from 'es6-promisify'
import './RemoteControl.css'

const googleUrl = new GoogleURL({ key: GOOGLE_APIKEY })
const shorten = promisify(googleUrl.shorten.bind(googleUrl))
const expand = promisify(googleUrl.expand.bind(googleUrl))
const peerConfig = { initiator: true, trickle: false }

class Connect extends Component {
  render() {
    const { link, connected, id } = this.props
    const placeholder = `${id} ${connected ? '✅' : ' - ' + link.substr(15)}`
    return <form ref={f => this.form = f} onSubmit={this.onSubmit}>
      <input className="connect" type="text" name="id" placeholder={placeholder} />
    </form>
  }

  onSubmit = async e => {
    e.preventDefault()
    const id = this.form.id.value
    const longUrl = await expand(`https://goo.gl/${id}`)
    const data = JSON.parse(atob(longUrl.split('?connect=')[1]))
    this.props.onSubmit(data)
    this.form.reset()
  }
}

class Remote extends Component {

  state = {
    connected: false,
    link: '',
    peer: new Peer(peerConfig)
  }

  componentDidMount() {
    this.initPeer()
  }

  componentWillReceiveProps(nextProps) {
    this.onSendProps(nextProps)
  }

  render() {
    const { link, connected } = this.state
    return <Connect
      onSubmit={this.onConnect}
      link={link}
      connected={connected}
      id={this.props.id}
    />
  }

  initPeer = () => {
    const { peer } = this.state
    peer.once('signal', this.onSignal)
    peer.once('connect', () => this.onSendProps(this.props))
    peer.on('connect', () => this.setState({ connected: true }))
    peer.on('data', data => this.onData(JSON.parse(data)))
    peer.on('close', () => this.setState({ link: '', connected: false, peer: new Peer(peerConfig) }, this.initPeer))
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
  <div key="local" className="local">
    <Control {...props} />
  </div>,
]

export default RemoteControl
