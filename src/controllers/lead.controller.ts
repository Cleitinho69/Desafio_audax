import type { Context } from 'hono'
import { LeadModule } from '../modules/lead.module'
import { AiService } from '../services/ai.service'
import type { CreateLeadInput } from '../types/lead.types'

export class LeadController {
  private leadModule: LeadModule
  private aiService: AiService

  constructor() {
    this.leadModule = new LeadModule()
    this.aiService = new AiService()
  }

  create = async (c: Context) => {
    const body = await c.req.json<CreateLeadInput>()

    const aiResult = await this.aiService.classifyLead(body.message)

    const createdLead = await this.leadModule.saveLead({
      input: body,
      aiResult
    })

    return c.json(
      {
        success: true,
        data: {
          id: createdLead.id,
          name: createdLead.name,
          email: createdLead.email,
          message: createdLead.message,
          source: createdLead.source,
          classification: {
            intent: createdLead.aiIntent,
            priority: createdLead.aiPriority,
            summary: createdLead.aiSummary,
            status: createdLead.aiStatus
          },
          createdAt: createdLead.createdAt
        }
      },
      201
    )
  }
}