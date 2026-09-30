import { describe, it, expect } from 'bun:test'

describe('LeadController - estrutura', () => {
  it('deve ter método create na instância', () => {
    const { LeadController } = require('../../controllers/lead.controller')
    expect(LeadController).toBeDefined()
    const instance = new LeadController()
    expect(typeof (instance as any).create).toBe('function')
  })
})
