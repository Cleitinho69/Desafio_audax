import { Hono } from 'hono'
import { leadRoutes } from './routes/lead.routes'
import { globalErrorHandler } from './middlewares/error-handler'

const app = new Hono()

app.onError(globalErrorHandler)
app.route('/leads', leadRoutes)

export { app }