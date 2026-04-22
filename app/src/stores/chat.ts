import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Message, MessageRole } from '@/types'

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
    deleteMessages,
    enterDeleteMode,
    exitDeleteMode,
    toggleMessageSelection,
    clearSelection,
    setEditingMessageId
  }
})
