<script setup lang="ts">
import { ref, computed } from 'vue'
import { useChatStore } from '@/stores/chat'
import { sendChatMessage, isConfigured } from '@/services/api'
import MessageList from './MessageList.vue'
import InputBox from './InputBox.vue'

const chatStore = useChatStore()
const messageListRef = ref<InstanceType<typeof MessageList>>()

const messages = computed(() => chatStore.messages)
const isLoading = computed(() => chatStore.isLoading)
const canSend = computed(() => isConfigured())

async function handleSend(content: string) {
  if (!canSend.value) {
    chatStore.setError('请配置 DeepSeek API Key')
    return
  }

  chatStore.addMessage('user', content)
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
    chatStore.updateLastMessage('[发送失败]')
  } finally {
    chatStore.setLoading(false)
  }
}

function handleClear() {
  chatStore.clearMessages()
}
</script>

<template>
  <div class="flex flex-col h-screen bg-white dark:bg-gray-900">
    <header class="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
      <h1 class="text-lg font-semibold text-gray-900 dark:text-white">AI Chat</h1>
      <button
        v-if="messages.length > 0"
        @click="handleClear"
        class="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
      >
        清除对话
      </button>
    </header>

    <MessageList ref="messageListRef" :messages="messages" :is-loading="isLoading" />

    <div v-if="!canSend" class="px-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 border-t border-yellow-200 dark:border-yellow-800">
      <p class="text-sm text-yellow-800 dark:text-yellow-200">
        请在 .env 中配置 VITE_DEEPSEEK_API_KEY
      </p>
    </div>

    <InputBox :is-loading="isLoading" @send="handleSend" />
  </div>
</template>