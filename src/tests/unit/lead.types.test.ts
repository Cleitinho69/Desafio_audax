import { describe, it, expect } from 'bun:test'
import { createLeadSchema, aiClassificationSchema } from '../../types/lead.types'

describe('createLeadSchema', () => {
  it('deve validar dados válidos', () => {
    const result = createLeadSchema.safeParse({
      name: 'João',
      email: 'joao@example.com',
      message: 'Quero comprar',
      source: 'LANDING_PAGE'
    })
    expect(result.success).toBe(true)
  })

  it('deve rejeitar nome vazio', () => {
    const result = createLeadSchema.safeParse({
      name: '', email: 'joao@example.com', message: 'msg', source: 'LANDING_PAGE'
    })
    expect(result.success).toBe(false)
  })

  it('deve rejeitar e-mail inválido', () => {
    const result = createLeadSchema.safeParse({
      name: 'João', email: 'invalid', message: 'msg', source: 'LANDING_PAGE'
    })
    expect(result.success).toBe(false)
  })

  it('deve rejeitar source inválido', () => {
    const result = createLeadSchema.safeParse({
      name: 'João', email: 'joao@example.com', message: 'msg', source: 'INVALID'
    })
    expect(result.success).toBe(false)
  })
})

describe('aiClassificationSchema', () => {
  it('deve validar dados válidos', () => {
    const result = aiClassificationSchema.safeParse({
      intent: 'SALES', priority: 'HIGH', summary: 'Lead quente'
    })
    expect(result.success).toBe(true)
  })

  it('deve usar defaults quando campos omitidos', () => {
    const result = aiClassificationSchema.safeParse({ summary: 'Teste' })
    expect(result.success).toBe(true)
    expect(result.data?.intent).toBe('UNKNOWN')
    expect(result.data?.priority).toBe('MEDIUM')
  })
})
