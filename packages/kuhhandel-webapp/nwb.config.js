module.exports = {
  type: 'react-app',
  webpack: {
    define: {
      GOOGLE_APIKEY: JSON.stringify(process.env.GOOGLE_APIKEY),
      REMOTE_CONTROL_URL: JSON.stringify(process.env.REMOTE_CONTROL_URL)
    },
    extra: {
      node: {
        console: true,
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
      }
    }
  }
}
