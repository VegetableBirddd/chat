import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Message, MessageRole } from '@/types'
import { sendChatMessage } from '@/services/api'

export const useChatStore = defineStore('chat', () => {
  const messages = ref<Message[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const editingMessageId = ref<string | null>(null)
  const isDeleting = ref(false)
  const selectedMessageIds = ref<string[]>([])

  const hasMessages = computed(() => messages.value.length > 0)
  const selectedCount = computed(() => selectedMessageIds.value.length)

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

  function updateMessageContent(id: string, content: string) {
    const message = messages.value.find(m => m.id === id)
    if (message) {
      message.content = content
    }
  }

  function updateMessageError(id: string, error: string) {
    const message = messages.value.find(m => m.id === id)
    if (message) {
      message.error = error
    }
  }

  function deleteMessages(ids: string[]) {
    messages.value = messages.value.filter(m => !ids.includes(m.id))
    selectedMessageIds.value = []
    isDeleting.value = false
  }

  function enterDeleteMode() {
    isDeleting.value = true
    selectedMessageIds.value = []
  }

  function exitDeleteMode() {
    isDeleting.value = false
    selectedMessageIds.value = []
  }

  function toggleMessageSelection(id: string) {
    const index = selectedMessageIds.value.indexOf(id)
    if (index === -1) {
      selectedMessageIds.value.push(id)
    } else {
      selectedMessageIds.value.splice(index, 1)
    }
  }

  function clearSelection() {
    selectedMessageIds.value = []
  }

  function setEditingMessageId(id: string | null) {
    editingMessageId.value = id
  }

  async function resendMessage(id: string) {
    const message = messages.value.find(m => m.id === id)
    if (!message || message.role !== 'user') return

    isLoading.value = true
    error.value = null

    const userMessages = messages.value.filter(m => m.role === 'user' && m.id !== id)
    const assistantMessages = messages.value.filter(m => m.role === 'assistant' && !m.content.includes('[发送失败]'))

    const chatMessages = [
      ...userMessages.map(m => ({ role: m.role, content: m.content })),
      ...assistantMessages.map(m => ({ role: m.role, content: m.content }))
    ]

    addMessage('assistant', '')
    chatMessages.push({ role: 'assistant', content: '' })

    try {
      await sendChatMessage(chatMessages, (content) => {
        updateLastMessage(content)
      })
      message.error = undefined
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : '发送失败'
      error.value = errMsg
      message.error = errMsg
      updateLastMessage('[发送失败]')
    } finally {
      isLoading.value = false
    }
  }

  return {
    messages,
    isLoading,
    error,
    editingMessageId,
    isDeleting,
    selectedMessageIds,
    hasMessages,
    selectedCount,
    addMessage,
    updateLastMessage,
    clearMessages,
    setLoading,
    setError,
    updateMessageContent,
    updateMessageError,
    deleteMessages,
    enterDeleteMode,
    exitDeleteMode,
    toggleMessageSelection,
    clearSelection,
    setEditingMessageId,
    resendMessage
  }
})
