import { z } from 'zod'
import { db } from '../prisma/db' // ajuste o caminho

const { LeadSource, LeadIntent, LeadPriority } = db.enums.public

export const createLeadSchema = z.object({
  name: z.string().trim().min(1, 'Nome é obrigatório'),
  email: z.email('E-mail inválido'),
  message: z.string().trim().min(1, 'Mensagem é obrigatória'),
  source: z.enum(LeadSource.values, { error: 'Source inválida' })
})

export const aiClassificationSchema = z.object({
  intent: z.enum(LeadIntent.values).default('UNKNOWN'),
  priority: z.enum(LeadPriority.values).default('MEDIUM'),
  summary: z.string().trim().min(1)
})

export type CreateLeadInput = z.infer<typeof createLeadSchema>

export type AiClassificationResult = z.infer<typeof aiClassificationSchema> & {
  isFallback: boolean
  errorMessage?: string
}