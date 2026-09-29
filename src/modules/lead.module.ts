import { db } from '../prisma/db' // ajuste o caminho
import type { Models } from '../prisma/contract.d'
import type { Scalars } from '@prisma/orm-postgres/family-contract/types'
import type { CreateLeadInput, AiClassificationResult } from '../types/lead.types'

type Lead = Scalars<Models.public_Lead>

export interface CreateLeadParams {
  input: CreateLeadInput
  aiResult: AiClassificationResult
}

export class LeadModule {
  async saveLead({ input, aiResult }: CreateLeadParams): Promise<Lead> {
    return await db.orm.public.Lead.create({
      name: input.name,
      email: input.email,
      message: input.message,
      source: input.source,
      aiIntent: aiResult.intent,
      aiPriority: aiResult.priority,
      aiSummary: aiResult.summary,
      aiStatus: aiResult.isFallback ? 'FALLBACK' : 'COMPLETED',
      aiErrorMessage: aiResult.errorMessage ?? null
    })
  }

  async findLeadById(id: string): Promise<Lead | null> {
    return await db.orm.public.Lead.where({ id }).first()
  }
}