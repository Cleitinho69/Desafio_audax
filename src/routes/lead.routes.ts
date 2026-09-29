import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { LeadController } from '../controllers/lead.controller'
import { createLeadSchema } from '../types/lead.types'

const leadRoutes = new Hono()
const leadController = new LeadController()

leadRoutes.post(
  '/',
  zValidator('json', createLeadSchema, (result, c) => {
    if (!result.success) {
      return c.json(
        {
          success: false,
          errors: result.error.issues.map((e) => ({
            field: e.path.join('.'),
            message: e.message
          }))
        },
        400
      )
    }
  }),
  leadController.create
)

export { leadRoutes }