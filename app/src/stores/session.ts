import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Message } from '@/types'

export interface Session {
  id: string
  title: string
  messages: Message[]
  createdAt: number
  updatedAt: number
}

const STORAGE_KEY = 'ai-chat-sessions'

export const useSessionStore = defineStore('session', () => {
  const sessions = ref<Session[]>([])
  const currentSessionId = ref<string | null>(null)

  const currentSession = computed(() => 
    sessions.value.find(s => s.id === currentSessionId.value)
  )

  function createSession(): string {
    const id = crypto.randomUUID()
    const now = Date.now()
    sessions.value.push({
      id,
      title: '新对话',
      messages: [],
      createdAt: now,
      updatedAt: now
    })
    currentSessionId.value = id
    saveToStorage()
    return id
  }

  function switchSession(id: string) {
    if (sessions.value.some(s => s.id === id)) {
      currentSessionId.value = id
    }
  }

  function deleteSession(id: string) {
    const index = sessions.value.findIndex(s => s.id === id)
    if (index > -1) {
      sessions.value.splice(index, 1)
      if (currentSessionId.value === id) {
        currentSessionId.value = sessions.value[0]?.id ?? null
      }
      saveToStorage()
    }
  }

  function updateSessionTitle(id: string, title: string) {
    const session = sessions.value.find(s => s.id === id)
    if (session) {
      session.title = title.slice(0, 50)
      session.updatedAt = Date.now()
      saveToStorage()
    }
  }

  function updateSessionMessages(id: string, messages: Message[]) {
    const session = sessions.value.find(s => s.id === id)
    if (session) {
      session.messages = messages
      session.updatedAt = Date.now()
      if (session.title === '新对话' && messages.length > 0) {
        const firstUserMsg = messages.find(m => m.role === 'user')
        if (firstUserMsg) {
          session.title = firstUserMsg.content.slice(0, 50)
        }
      }
      saveToStorage()
    }
  }

  function getSessionMessages(id: string): Message[] {
    return sessions.value.find(s => s.id === id)?.messages ?? []
  }

  function loadFromStorage() {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (data) {
        sessions.value = JSON.parse(data)
        currentSessionId.value = sessions.value[sessions.value.length - 1]?.id ?? null
      }
    } catch (e) {
      console.error('Failed to load sessions:', e)
      sessions.value = []
    }
  }

  function saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions.value))
    } catch (e) {
      console.error('Failed to save sessions:', e)
    }
  }

  return {
    sessions,
    currentSessionId,
    currentSession,
    createSession,
    switchSession,
    deleteSession,
    updateSessionTitle,
    updateSessionMessages,
    getSessionMessages,
    loadFromStorage,
    saveToStorage
  }
})