import type { SearchResult } from '@/types'
import type { Session } from '@/stores/session'

export interface SearchIndex {
  buildIndex(sessions: Session[]): void
  search(query: string): SearchResult[]
}

export function createSearchIndex(): SearchIndex {
  let indexedSessions: Session[] = []

  function buildIndex(sessions: Session[]) {
    indexedSessions = sessions
  }

  function search(query: string): SearchResult[] {
    if (!query.trim()) return []

    const lowerQuery = query.toLowerCase()
    const results: SearchResult[] = []

    for (const session of indexedSessions) {
      // Search session title
      if (session.title.toLowerCase().includes(lowerQuery)) {
        results.push({
          sessionId: session.id,
          sessionTitle: session.title,
          messageId: '',
          content: `会话标题: ${session.title}`,
          relevance: 1,
          timestamp: session.updatedAt
        })
      }

      // Search messages
      for (const msg of session.messages) {
        if (msg.content.toLowerCase().includes(lowerQuery)) {
          const relevance = calculateRelevance(msg.content, lowerQuery)
          results.push({
            sessionId: session.id,
            sessionTitle: session.title,
            messageId: msg.id,
            content: msg.content.slice(0, 200),
            relevance,
            timestamp: msg.timestamp
          })
        }
      }
    }

    return results.sort((a, b) => b.relevance - a.relevance)
  }

  function calculateRelevance(content: string, query: string): number {
    const lowerContent = content.toLowerCase()
    let score = 0

    // Exact match gets higher score
    if (lowerContent.includes(query)) {
      score += 1
    }

    // Multiple occurrences increase score
    const occurrences = lowerContent.split(query).length - 1
    score += occurrences * 0.1

    // Shorter content with match gets higher score (more focused)
    if (content.length < 500) {
      score += 0.2
    }

    return Math.min(score, 2)
  }

  return {
    buildIndex,
    search
  }
}
