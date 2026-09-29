import { GoogleGenAI, Type } from '@google/genai'
import { aiClassificationSchema, type AiClassificationResult } from '../types/lead.types'

export class AiService {
  private ai: GoogleGenAI

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  }

  async classifyLead(message: string): Promise<AiClassificationResult> {
    try {
      const rawAiResponse = await this.callAiProvider(message)
      const parsed = aiClassificationSchema.safeParse(rawAiResponse)

      if (parsed.success) {
        return {
          ...parsed.data,
          isFallback: false
        }
      }

      return this.getFallbackClassification('Resposta da IA fora do schema esperado')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido na IA'
      return this.getFallbackClassification(message)
    }
  }

  private async callAiProvider(message: string): Promise<unknown> {
    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      config: {
        systemInstruction:
          'Você é um assistente de CRM. Classifique a mensagem do lead retornando exatamente estes valores: intent (SALES, UNKNOWN) e priority (LOW, MEDIUM, HIGH), além de um summary curto em formato JSON.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            intent: {
              type: Type.STRING,
              enum: ['SALES', 'UNKNOWN']
            },
            priority: {
              type: Type.STRING,
              enum: ['LOW', 'MEDIUM', 'HIGH']
            },
            summary: {
              type: Type.STRING
            }
          },
          required: ['intent', 'priority', 'summary']
        }
      }
    })

    if (!response.text) {
      throw new Error('Retorno vazio da API do Gemini')
    }

    return JSON.parse(response.text)
  }

  private getFallbackClassification(reason: string): AiClassificationResult {
    return {
      intent: 'UNKNOWN',
      priority: 'MEDIUM',
      summary: 'Lead recebido com sucesso. Classificação automática pendente devido a falha no processamento.',
      isFallback: true,
      errorMessage: reason
    }
  }
}