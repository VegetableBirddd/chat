<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useChatStore } from '@/stores/chat'
import { useSessionStore } from '@/stores/session'
import { sendChatMessage, isConfigured } from '@/services/api'
import { useExport } from '@/composables/useExport'
import type { ExportOptions } from '@/types'
import MessageList from './MessageList.vue'
import InputBox from './InputBox.vue'
import ExportDialog from './ExportDialog.vue'

const chatStore = useChatStore()
const sessionStore = useSessionStore()
const { exportChat } = useExport()
const isLoadingSession = ref(false)
const showExportDialog = ref(false)

const messages = computed(() => chatStore.messages)
const isLoading = computed(() => chatStore.isLoading)
const canSend = computed(() => isConfigured())

watch(() => sessionStore.currentSessionId, (newId) => {
  if (newId) {
    isLoadingSession.value = true
    const saved = sessionStore.getSessionMessages(newId)
    chatStore.messages = [...saved]
    isLoadingSession.value = false
  } else {
    chatStore.clearMessages()
  }
}, { immediate: true })

watch(messages, (newMessages) => {
  if (sessionStore.currentSessionId && !isLoadingSession.value) {
    sessionStore.updateSessionMessages(sessionStore.currentSessionId, [...newMessages])
  }
}, { deep: true })

async function handleSend(content: string, files?: any[]) {
  if (!canSend.value) {
    chatStore.setError('请配置 DeepSeek API Key')
    return
  }

  let messageContent = content
  if (files && files.length > 0) {
    const fileContents = files.map(f => `[文件: ${f.name}]\n${f.content}`).join('\n\n')
    messageContent = content ? `${content}\n\n${fileContents}` : fileContents
  }

  const userMsg = chatStore.addMessage('user', messageContent)
  if (files && files.length > 0) {
    userMsg.files = files
  }

  chatStore.setLoading(true)
  chatStore.setError(null)

  chatStore.addMessage('assistant', '')

  try {
    const chatMessages = messages.value.map(msg => ({
      role: msg.role,
      content: msg.content
    }))

    await sendChatMessage(chatMessages, (content) => {
      chatStore.updateLastMessage(content)
    })
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : '发送失败'
    chatStore.setError(errMsg)
    const lastUserMsg = messages.value.filter(m => m.role === 'user').pop()
    if (lastUserMsg) {
      chatStore.updateMessageError(lastUserMsg.id, errMsg)
    }
    chatStore.updateLastMessage('[发送失败]')
  } finally {
    chatStore.setLoading(false)
  }
}

function handleClear() {
  chatStore.clearMessages()
  if (sessionStore.currentSessionId) {
    sessionStore.updateSessionMessages(sessionStore.currentSessionId, [])
  }
}

function handleExport(options: ExportOptions) {
  try {
    const title = sessionStore.currentSession?.title
    exportChat(messages.value, options, title)
    showExportDialog.value = false
  } catch (err) {
    chatStore.setError(err instanceof Error ? err.message : '导出失败')
  }
}
</script>

<template>
  <div class="flex-1 flex flex-col h-screen bg-white dark:bg-gray-900">
    <header class="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
      <h1 class="text-lg font-semibold text-gray-900 dark:text-white">AI Chat</h1>
      <div class="flex items-center gap-2">
        <button
          v-if="messages.length > 0"
          @click="showExportDialog = true"
          class="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          导出
        </button>
        <button
          v-if="messages.length > 0"
          @click="handleClear"
          class="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          清除对话
        </button>
      </div>
    </header>

    <ExportDialog
      v-if="showExportDialog"
      @export="handleExport"
      @close="showExportDialog = false"
    />

    <MessageList :messages="messages" :is-loading="isLoading" />

    <div v-if="!canSend" class="px-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 border-t border-yellow-200 dark:border-yellow-800">
      <p class="text-sm text-yellow-800 dark:text-yellow-200">
        请在 .env 中配置 VITE_DEEPSEEK_API_KEY
      </p>
    </div>

    <InputBox :is-loading="isLoading" @send="handleSend" />
  </div>
</template>