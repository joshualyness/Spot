import { createServer } from 'node:http'
import { createHTTPHandler } from '@trpc/server/adapters/standalone'
import { createContextFromAuthHeader } from './trpc/context'
import { appRouter } from './trpc/router'

const port = Number(process.env.PORT ?? 4000)

// Enable Bearer local:<userId> for Expo wiring before Cognito is deployed.
process.env.ALLOW_LOCAL_AUTH ??= 'true'

const handler = createHTTPHandler({
  router: appRouter,
  createContext: ({ req }) => {
    const authorization = typeof req.headers.authorization === 'string' ? req.headers.authorization : undefined
    return createContextFromAuthHeader(authorization)
  },
  middleware: (_req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'authorization,content-type')
    if (_req.method === 'OPTIONS') {
      res.writeHead(204)
      res.end()
      return
    }
    next()
  }
})

createServer((req, res) => {
  if (req.url?.startsWith('/trpc')) {
    req.url = req.url.slice('/trpc'.length) || '/'
  }
  handler(req, res)
}).listen(port, () => {
  console.log(`Spot API local tRPC server listening on http://localhost:${port}/trpc`)
  console.log('Local auth: Authorization: Bearer local:<userId>')
})
