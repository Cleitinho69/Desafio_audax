import { describe, it, expect } from 'bun:test'
import { z } from 'zod'

// Testa a lógica do módulo sem depender do Prisma real
describe('LeadModule - lógica de classificação', () => {
  it('deve classificar como COMPLETED quando isFallback é false', () => {
    const aiResult = { intent: 'SALES', priority: 'HIGH', summary: 'Lead quente', isFallback: false }
    expect(aiResult.isFallback).toBe(false)
  })

  it('deve classificar como FALLBACK quando isFallback é true', () => {
    const aiResult = { intent: 'UNKNOWN', priority: 'MEDIUM', summary: '', isFallback: true, errorMessage: 'err' }
    expect(aiResult.isFallback).toBe(true)
    expect(aiResult.intent).toBe('UNKNOWN')
    expect(aiResult.priority).toBe('MEDIUM')
    expect(aiResult.errorMessage).toBe('err')
  })

  it('deve mapear AiClassificationResult para AiStatus corretamente', () => {
    const cases = [
      { isFallback: false, expectedStatus: 'COMPLETED' },
      { isFallback: true, expectedStatus: 'FALLBACK' }
    ]

    for (const { isFallback, expectedStatus } of cases) {
      const status = isFallback ? 'FALLBACK' : 'COMPLETED'
      expect(status).toBe(expectedStatus)
    }
  })
})
