import type { Context } from 'hono'
import { HTTPException } from 'hono/http-exception'

export function globalErrorHandler(err: Error, c: Context) {
  if (err instanceof HTTPException) {
    return c.json({ success: false, error: err.message }, err.status)
  }

  return c.json(
    {
      success: false,
      error: 'Erro interno no servidor'
    },
    500
  )
}