import { describe, it, expect } from 'bun:test'
import { aiClassificationSchema } from '../../types/lead.types'

describe('AiService - schema de classificação', () => {
  it('deve aceitar classificação válida', () => {
    const result = aiClassificationSchema.safeParse({
      intent: 'SALES',
      priority: 'HIGH',
      summary: 'Lead quente'
    })
    expect(result.success).toBe(true)
    expect(result.data?.intent).toBe('SALES')
    expect(result.data?.priority).toBe('HIGH')
    expect(result.data?.summary).toBe('Lead quente')
  })

  it('deve rejeitar campos inválidos', () => {
    const result = aiClassificationSchema.safeParse({
      intent: 'INVALID',
      priority: 'HIGH',
      summary: 'Lead quente'
    })
    expect(result.success).toBe(false)
  })

  it('deve rejeitar campos obrigatórios faltantes', () => {
    const result = aiClassificationSchema.safeParse({
      intent: 'SALES'
      // priority e summary faltando
    })
    expect(result.success).toBe(false)
  })

  it('deve rejeitar quando summary é null', () => {
    const result = aiClassificationSchema.safeParse({
      intent: 'SALES',
      priority: 'HIGH',
      summary: null
    })
    expect(result.success).toBe(false)
  })
})
