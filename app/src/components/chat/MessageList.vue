<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import type { Message } from '@/types'
import ChatMessage from './ChatMessage.vue'

const props = defineProps<{
  messages: Message[]
  isLoading?: boolean
}>()

const listRef = ref<HTMLElement>()

function scrollToBottom() {
  nextTick(() => {
    if (listRef.value) {
      listRef.value.scrollTop = listRef.value.scrollHeight
    }
  })
}

watch(() => props.messages.length, scrollToBottom, { immediate: true })

defineExpose({ scrollToBottom })
</script>

<template>
  <div ref="listRef" class="message-list">
    <div v-if="props.messages.length === 0" class="flex-1 flex flex-col items-center justify-center">
      <svg class="w-12 h-12 mb-4" style="color: var(--text-tertiary); opacity: 0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
      <p class="text-sm" style="color: var(--text-tertiary)">开始新的对话</p>
    </div>
    <div v-else class="py-4">
      <ChatMessage v-for="msg in props.messages" :key="msg.id" :message="msg" />
      <div v-if="props.isLoading" class="flex gap-3 py-3">
        <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium" style="background-color: var(--bg-sidebar); color: var(--text-secondary); border: 1px solid var(--border-default)">
          AI
        </div>
        <div class="flex items-center gap-1">
          <span class="w-1.5 h-1.5 rounded-full animate-bounce" style="background-color: var(--text-tertiary); animation-delay: 0ms"></span>
          <span class="w-1.5 h-1.5 rounded-full animate-bounce" style="background-color: var(--text-tertiary); animation-delay: 150ms"></span>
          <span class="w-1.5 h-1.5 rounded-full animate-bounce" style="background-color: var(--text-tertiary); animation-delay: 300ms"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.message-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 0 1.5rem;
}

.message-list::-webkit-scrollbar {
  width: 4px;
}

.message-list::-webkit-scrollbar-thumb {
  background-color: var(--border-hover);
  border-radius: 4px;
}

.message-list::-webkit-scrollbar-track {
  background: transparent;
}
</style>