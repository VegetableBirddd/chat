import type { ChatRequest, StreamChunk, MessageRole } from '@/types'

export async function sendChatMessage(
  messages: Array<{ role: MessageRole; content: string }>,
  onChunk?: (content: string) => void
): Promise<string> {
  const model = import.meta.env.VITE_DEEPSEEK_MODEL || 'deepseek-chat'
  const baseURL = import.meta.env.VITE_DEEPSEEK_BASE_URL || 'https://api.deepseek.com'
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY

  const request: ChatRequest = {
    model,
    messages,
    stream: !!onChunk,
    temperature: 0.7,
    max_tokens: 4096
  }

  if (onChunk) {
    return streamChat(baseURL, apiKey, request, onChunk)
  }

  const response = await fetch(`${baseURL}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(request)
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`API Error: ${response.status} - ${error}`)
  }

  const data = await response.json() as {
    choices: Array<{ message: { content: string } }>
  }

  return data.choices[0]?.message.content || ''
}

async function streamChat(
  baseURL: string,
  apiKey: string | undefined,
  request: ChatRequest,
  onChunk: (content: string) => void
): Promise<string> {
  const response = await fetch(`${baseURL}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(request)
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`API Error: ${response.status} - ${error}`)
  }

  const reader = response.body?.getReader()
  if (!reader) throw new Error('No response stream')

  const decoder = new TextDecoder()
  let content = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value, { stream: true })
      const lines = chunk.split('\n').filter(line => line.trim().startsWith('data:'))

      for (const line of lines) {
        const data = line.slice(5).trim()
        if (data === '[DONE]') continue

        try {
          const parsed: StreamChunk = JSON.parse(data)
          const delta = parsed.choices[0]?.delta?.content
          if (delta) {
            content += delta
            onChunk(content)
          }
        } catch {
          // Skip invalid JSON
        }
      }
    }
  } finally {
    reader.releaseLock()
  }

  return content
}

export function getApiKey(): string | undefined {
  return import.meta.env.VITE_DEEPSEEK_API_KEY
}

export function isConfigured(): boolean {
  return !!import.meta.env.VITE_DEEPSEEK_API_KEY
}