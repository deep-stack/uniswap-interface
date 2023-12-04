/* eslint-env node */

const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')
const cors = require('cors')

const ORIGIN_HEADER = 'https://app.uniswap.org'

const app = express()

// Enable CORS
app.use(cors())

// Define your GraphQL server endpoint
const graphqlEndpoint = process.env.AWS_API_ENDPOINT

// Create a proxy for the GraphQL endpoint
const graphqlProxy = createProxyMiddleware({
  target: graphqlEndpoint,
  changeOrigin: true, // Enable CORS bypass
  pathRewrite: {
    '^/graphql': '', // Rewrite the path as needed
  },
  logLevel: 'debug', // Set log level as needed,
  onProxyReq: (proxyReq) => {
    proxyReq.setHeader('Origin', ORIGIN_HEADER)
  },
})

// Use the proxy middleware for '/graphql' requests
app.use('/graphql', graphqlProxy)

// Start the server
const port = 4000 // Set the desired port

app.listen(port, () => {
  console.log(`Proxy server listening on port ${port}`)
})
