export type MessageRole = 'user' | 'assistant' | 'system'

export interface CodeBlock {
  language: string
  code: string
  lineNumbers?: boolean
}

export interface UploadedFile {
  id: string
  name: string
  type: string
  size: number
  content: string
  preview?: string
  uploadedAt: number
}

export interface ExportOptions {
  format: 'markdown' | 'pdf'
  includeMetadata: boolean
  includeSystemMessages: boolean
}

export interface SearchResult {
  sessionId: string
  sessionTitle: string
  messageId: string
  content: string
  relevance: number
  timestamp: number
}

export interface Message {
  id: string
  role: MessageRole
  content: string
  timestamp: number
  error?: string
  files?: UploadedFile[]
  codeBlocks?: CodeBlock[]
}

export interface ChatRequest {
  model: string
  messages: Array<{ role: MessageRole; content: string }>
  stream?: boolean
  temperature?: number
  max_tokens?: number
}

export interface ChatResponse {
  id: string
  object: string
  created: number
  model: string
  choices: Array<{
    index: number
    message: { role: MessageRole; content: string }
    finish_reason: string
  }>
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export interface StreamChunk {
  id: string
  object: string
  created: number
  model: string
  choices: Array<{
    index: number
    delta: { content?: string; role?: MessageRole }
    finish_reason?: string
  }>
}