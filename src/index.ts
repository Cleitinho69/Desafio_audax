import { app } from './app'

const PORT = Number(process.env.PORT) || 3000

export default {
  port: PORT,
  fetch: app.fetch
}