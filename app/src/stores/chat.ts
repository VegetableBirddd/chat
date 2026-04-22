import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Message, MessageRole } from '@/types'

export const useChatStore = defineStore('chat', () => {
  const messages = ref<Message[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const hasMessages = computed(() => messages.value.length > 0)

  function addMessage(role: MessageRole, content: string) {
    const message: Message = {
      id: crypto.randomUUID(),
      role,
      content,
      timestamp: Date.now()
    }
    messages.value.push(message)
    return message
  }

  function updateLastMessage(content: string) {
    const last = messages.value[messages.value.length - 1]
    if (last) {
      last.content = content
    }
  }

  function clearMessages() {
    messages.value = []
    error.value = null
  }

  function setLoading(loading: boolean) {
    isLoading.value = loading
  }

  function setError(err: string | null) {
    error.value = err
  }

  return {
    messages,
    isLoading,
    error,
    hasMessages,
    addMessage,
    updateLastMessage,
    clearMessages,
    setLoading,
    setError
  }
})