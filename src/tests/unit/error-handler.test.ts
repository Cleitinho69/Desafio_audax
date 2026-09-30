import { describe, it, expect, mock } from 'bun:test'
import { HTTPException } from 'hono/http-exception'
import { globalErrorHandler } from '../../middlewares/error-handler'

describe('globalErrorHandler', () => {
  it('deve retornar status e mensagem para HTTPException', () => {
    const err = new HTTPException(404, { message: 'Não encontrado' })
    const c = { json: mock() } as any

    globalErrorHandler(err, c)

    expect(c.json).toHaveBeenCalledWith({ success: false, error: 'Não encontrado' }, 404)
  })

  it('deve retornar 500 para erro genérico', () => {
    const err = new Error('Algum erro')
    const c = { json: mock() } as any

    globalErrorHandler(err, c)

    expect(c.json).toHaveBeenCalledWith({ success: false, error: 'Erro interno no servidor' }, 500)
  })
})
