import { createServer } from 'node:http'
import { createHTTPHandler } from '@trpc/server/adapters/standalone'
import { createLocalContext } from './trpc/context'
import { appRouter } from './trpc/router'

const port = Number(process.env.PORT ?? 4000)

const handler = createHTTPHandler({
  router: appRouter,
  createContext: () => createLocalContext(null),
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
  // Strip /trpc prefix so Expo can call http://host:4000/trpc/...
  if (req.url?.startsWith('/trpc')) {
    req.url = req.url.slice('/trpc'.length) || '/'
  }
  handler(req, res)
}).listen(port, () => {
  console.log(`Spot API local tRPC server listening on http://localhost:${port}/trpc`)
})
