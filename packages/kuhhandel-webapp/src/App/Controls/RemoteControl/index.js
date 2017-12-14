import React, { Component } from 'react'
import { Control } from 'kuhhandel-components'
import Peer from 'simple-peer'
import GoogleURL from 'google-url'
import promisify from 'es6-promisify'

const googleUrl = new GoogleURL({ key: GOOGLE_APIKEY })
const shorten = promisify(googleUrl.shorten.bind(googleUrl))
const expand = promisify(googleUrl.expand.bind(googleUrl))

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
    peer: new Peer({ initiator: true, trickle: false })
  }

  componentDidMount() {
    const { peer } = this.state
    peer.once('signal', this.onSignal)
    peer.on('connect', () => this.setState({ connected: true }))
    //peer.on('data', data => this.emit('data', JSON.parse(data)))
    peer.on('close', () => this.setState({ connected: false }))
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
